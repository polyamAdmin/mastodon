import { createSelector } from '@reduxjs/toolkit';
import { Map as ImmutableMap, List as ImmutableList } from 'immutable';
import { connect } from 'react-redux';

import { debounce } from 'lodash';

import { scrollTopTimeline, loadPending, TIMELINE_SUGGESTIONS, TIMELINE_GAP } from '../../../actions/timelines';
import StatusList from '../../../components/status_list';
import { me } from '../../../initial_state';

const getRegex = createSelector([
  (state, { regex }) => regex,
], (rawRegex) => {
  let regex = null;

  try {
    regex = rawRegex && new RegExp(rawRegex.trim(), 'i');
  } catch (e) {
    // Bad regex, don't affect filters
  }
  return regex;
});

const makeGetStatusIds = (pending = false) => createSelector([
  (state, { type }) => state.getIn(['settings', type], ImmutableMap()),
  (state, { type }) => state.getIn(['timelines', type, pending ? 'pendingItems' : 'items'], ImmutableList()),
  (state)           => state.get('statuses'),
  getRegex,
], (columnSettings, statusIds, statuses, regex) => {
  return statusIds.filter(id => {
    if (id === TIMELINE_GAP || id === TIMELINE_SUGGESTIONS) return true;

    const statusForId = statuses.get(id);
    let showStatus    = true;

    if (statusForId.get('account') === me) return true;

    if (columnSettings.getIn(['shows', 'reblog']) === false) {
      showStatus = showStatus && statusForId.get('reblog') === null;
    }

    if (columnSettings.getIn(['shows', 'reply']) === false) {
      showStatus = showStatus && (statusForId.get('in_reply_to_id') === null || statusForId.get('in_reply_to_account_id') === me || statusForId.get('in_reply_to_account_id') === statusForId.get('account'));
    }

    if (columnSettings.getIn(['shows', 'thread']) === false) {
      showStatus = showStatus && statusForId.get('in_reply_to_account_id') !== statusForId.get('account');
    }

    if (columnSettings.getIn(['shows', 'direct']) === false) {
      showStatus = showStatus && statusForId.get('visibility') !== 'direct';
    }

    if (showStatus && regex) {
      const searchIndex = statusForId.get('reblog') ? statuses.getIn([statusForId.get('reblog'), 'search_index']) : statusForId.get('search_index');
      showStatus = !regex.test(searchIndex);
    }

    return showStatus;
  });
});

const makeMapStateToProps = () => {
  const getStatusIds = makeGetStatusIds();
  const getPendingStatusIds = makeGetStatusIds(true);

  const mapStateToProps = (state, { timelineId, regex }) => ({
    statusIds: getStatusIds(state, { type: timelineId, regex }),
    lastId:    state.getIn(['timelines', timelineId, 'items'])?.last(),
    isLoading: state.getIn(['timelines', timelineId, 'isLoading'], true),
    isPartial: state.getIn(['timelines', timelineId, 'isPartial'], false),
    hasMore:   state.getIn(['timelines', timelineId, 'hasMore']),
    numPending: getPendingStatusIds(state, { type: timelineId }).size,
  });

  return mapStateToProps;
};

const mapDispatchToProps = (dispatch, { timelineId }) => ({

  onScrollToTop: debounce(() => {
    dispatch(scrollTopTimeline(timelineId, true));
  }, 100),

  onScroll: debounce(() => {
    dispatch(scrollTopTimeline(timelineId, false));
  }, 100),

  onLoadPending: () => dispatch(loadPending(timelineId)),

});

export default connect(makeMapStateToProps, mapDispatchToProps)(StatusList);
