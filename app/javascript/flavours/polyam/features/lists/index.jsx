import PropTypes from 'prop-types';

import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';

import { Helmet } from 'react-helmet';

import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { faBars, faListUl } from '@fortawesome/free-solid-svg-icons';

import { fetchLists } from 'flavours/polyam/actions/lists';
import { LoadingIndicator } from 'flavours/polyam/components/loading_indicator';
import ScrollableList from 'flavours/polyam/components/scrollable_list';
import Column from 'flavours/polyam/features/ui/components/column';
import ColumnLink from 'flavours/polyam/features/ui/components/column_link';
import ColumnSubheading from 'flavours/polyam/features/ui/components/column_subheading';

import NewListForm from './components/new_list_form';

const messages = defineMessages({
  heading: { id: 'column.lists', defaultMessage: 'Lists' },
  subheading: { id: 'lists.subheading', defaultMessage: 'Your lists' },
});

const getOrderedLists = createSelector([state => state.get('lists')], lists => {
  if (!lists) {
    return lists;
  }

  return lists.toList().filter(item => !!item).sort((a, b) => a.get('title').localeCompare(b.get('title')));
});

const mapStateToProps = state => ({
  lists: getOrderedLists(state),
});

class Lists extends ImmutablePureComponent {

  static propTypes = {
    params: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    lists: ImmutablePropTypes.list,
    intl: PropTypes.object.isRequired,
    multiColumn: PropTypes.bool,
  };

  UNSAFE_componentWillMount () {
    this.props.dispatch(fetchLists());
  }

  render () {
    const { intl, lists, multiColumn } = this.props;

    if (!lists) {
      return (
        <Column>
          <LoadingIndicator />
        </Column>
      );
    }

    const emptyMessage = <FormattedMessage id='empty_column.lists' defaultMessage="You don't have any lists yet. When you create one, it will show up here." />;

    return (
      <Column bindToDocument={!multiColumn} icon='bars' iconComponent={faBars} heading={intl.formatMessage(messages.heading)} alwaysShowBackButton>
        <NewListForm />

        <ColumnSubheading text={intl.formatMessage(messages.subheading)} />
        <ScrollableList
          scrollKey='lists'
          emptyMessage={emptyMessage}
          bindToDocument={!multiColumn}
        >
          {lists.map(list =>
            <ColumnLink key={list.get('id')} to={`/lists/${list.get('id')}`} icon='list-ul' iconComponent={faListUl} text={list.get('title')} />,
          )}
        </ScrollableList>

        <Helmet>
          <title>{intl.formatMessage(messages.heading)}</title>
          <meta name='robots' content='noindex' />
        </Helmet>
      </Column>
    );
  }

}

export default connect(mapStateToProps)(injectIntl(Lists));
