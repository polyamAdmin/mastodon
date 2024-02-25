import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';

import classNames from 'classnames';
import { Helmet } from 'react-helmet';

import { connect } from 'react-redux';

import { faBullhorn, faHome } from '@fortawesome/free-solid-svg-icons';

import { fetchAnnouncements, toggleShowAnnouncements } from 'flavours/polyam/actions/announcements';
import { IconWithBadge } from 'flavours/polyam/components/icon_with_badge';
import { NotSignedInIndicator } from 'flavours/polyam/components/not_signed_in_indicator';
import AnnouncementsContainer from 'flavours/polyam/features/getting_started/containers/announcements_container';
import { criticalUpdatesPending } from 'flavours/polyam/initial_state';

import { addColumn, removeColumn, moveColumn } from '../../actions/columns';
import { expandHomeTimeline } from '../../actions/timelines';
import Column from '../../components/column';
import ColumnHeader from '../../components/column_header';
import StatusListContainer from '../ui/containers/status_list_container';

import { ColumnSettings } from './components/column_settings';
import { CriticalUpdateBanner } from './components/critical_update_banner';

const messages = defineMessages({
  title: { id: 'column.home', defaultMessage: 'Home' },
  show_announcements: { id: 'home.show_announcements', defaultMessage: 'Show announcements' },
  hide_announcements: { id: 'home.hide_announcements', defaultMessage: 'Hide announcements' },
});

const mapStateToProps = state => ({
  hasUnread: state.getIn(['timelines', 'home', 'unread']) > 0,
  isPartial: state.getIn(['timelines', 'home', 'isPartial']),
  hasAnnouncements: !state.getIn(['announcements', 'items']).isEmpty(),
  unreadAnnouncements: state.getIn(['announcements', 'items']).count(item => !item.get('read')),
  showAnnouncements: state.getIn(['announcements', 'show']),
  regex: state.getIn(['settings', 'home', 'regex', 'body']),
});

class HomeTimeline extends PureComponent {

  static contextTypes = {
    identity: PropTypes.object,
  };

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    hasUnread: PropTypes.bool,
    isPartial: PropTypes.bool,
    columnId: PropTypes.string,
    multiColumn: PropTypes.bool,
    hasAnnouncements: PropTypes.bool,
    unreadAnnouncements: PropTypes.number,
    showAnnouncements: PropTypes.bool,
    regex: PropTypes.string,
  };

  handlePin = () => {
    const { columnId, dispatch } = this.props;

    if (columnId) {
      dispatch(removeColumn(columnId));
    } else {
      dispatch(addColumn('HOME', {}));
    }
  };

  handleMove = (dir) => {
    const { columnId, dispatch } = this.props;
    dispatch(moveColumn(columnId, dir));
  };

  handleHeaderClick = () => {
    this.column.scrollTop();
  };

  setRef = c => {
    this.column = c;
  };

  handleLoadMore = maxId => {
    this.props.dispatch(expandHomeTimeline({ maxId }));
  };

  componentDidMount () {
    setTimeout(() => this.props.dispatch(fetchAnnouncements()), 700);
    this._checkIfReloadNeeded(false, this.props.isPartial);
  }

  componentDidUpdate (prevProps) {
    this._checkIfReloadNeeded(prevProps.isPartial, this.props.isPartial);
  }

  componentWillUnmount () {
    this._stopPolling();
  }

  _checkIfReloadNeeded (wasPartial, isPartial) {
    const { dispatch } = this.props;

    if (wasPartial === isPartial) {
      return;
    } else if (!wasPartial && isPartial) {
      this.polling = setInterval(() => {
        dispatch(expandHomeTimeline());
      }, 3000);
    } else if (wasPartial && !isPartial) {
      this._stopPolling();
    }
  }

  _stopPolling () {
    if (this.polling) {
      clearInterval(this.polling);
      this.polling = null;
    }
  }

  handleToggleAnnouncementsClick = (e) => {
    e.stopPropagation();
    this.props.dispatch(toggleShowAnnouncements());
  };

  render () {
    const { intl, hasUnread, columnId, multiColumn, hasAnnouncements, unreadAnnouncements, showAnnouncements } = this.props;
    const pinned = !!columnId;
    const { signedIn } = this.context.identity;
    const banners = [];

    let announcementsButton;

    if (hasAnnouncements) {
      announcementsButton = (
        <button
          className={classNames('column-header__button', { 'active': showAnnouncements })}
          title={intl.formatMessage(showAnnouncements ? messages.hide_announcements : messages.show_announcements)}
          aria-label={intl.formatMessage(showAnnouncements ? messages.hide_announcements : messages.show_announcements)}
          onClick={this.handleToggleAnnouncementsClick}
        >
          <IconWithBadge id='bullhorn' icon={faBullhorn} count={unreadAnnouncements} />
        </button>
      );
    }

    if (criticalUpdatesPending) {
      banners.push(<CriticalUpdateBanner key='critical-update-banner' />);
    }

    return (
      <Column bindToDocument={!multiColumn} ref={this.setRef} name='home' label={intl.formatMessage(messages.title)}>
        <ColumnHeader
          icon='home'
          iconComponent={faHome}
          active={hasUnread}
          title={intl.formatMessage(messages.title)}
          onPin={this.handlePin}
          onMove={this.handleMove}
          onClick={this.handleHeaderClick}
          pinned={pinned}
          multiColumn={multiColumn}
          extraButton={announcementsButton}
          appendContent={hasAnnouncements && showAnnouncements && <AnnouncementsContainer />}
        >
          <ColumnSettings />
        </ColumnHeader>

        {signedIn ? (
          <StatusListContainer
            prepend={banners}
            alwaysPrepend
            trackScroll={!pinned}
            scrollKey={`home_timeline-${columnId}`}
            onLoadMore={this.handleLoadMore}
            timelineId='home'
            emptyMessage={<FormattedMessage id='empty_column.home' defaultMessage='Your home timeline is empty! Follow more people to fill it up.' />}
            bindToDocument={!multiColumn}
            regex={this.props.regex}
          />
        ) : <NotSignedInIndicator />}

        <Helmet>
          <title>{intl.formatMessage(messages.title)}</title>
          <meta name='robots' content='noindex' />
        </Helmet>
      </Column>
    );
  }

}

export default connect(mapStateToProps)(injectIntl(HomeTimeline));
