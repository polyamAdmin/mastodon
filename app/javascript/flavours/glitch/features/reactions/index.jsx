import PropTypes from 'prop-types';

import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';

import { Helmet } from 'react-helmet';

import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { connect } from 'react-redux';

import { debounce } from 'lodash';

import { fetchReactions, expandReactions } from 'flavours/glitch/actions/interactions';
import ColumnHeader from 'flavours/glitch/components/column_header';
import { Icon } from 'flavours/glitch/components/icon';
import { LoadingIndicator } from 'flavours/glitch/components/loading_indicator';
import ScrollableList from 'flavours/glitch/components/scrollable_list';
import AccountContainer from 'flavours/glitch/containers/account_container';
import Column from 'flavours/glitch/features/ui/components/column';

const messages = defineMessages({
  heading: { id: 'column.reacted_by', defaultMessage: 'Reacted by' },
  refresh: { id: 'refresh', defaultMessage: 'Refresh' },
});

const mapStateToProps = (state, props) => ({
  accountIds: state.getIn(['user_lists', 'reacted_by', props.params.statusId, 'items']),
  hasMore: !!state.getIn(['user_lists', 'reacted_by', props.params.statusId, 'next']),
  isLoading: state.getIn(['user_lists', 'reacted_by', props.params.statusId, 'isLoading'], true),
});

class Reactions extends ImmutablePureComponent {

  static propTypes = {
    params: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    accountIds: ImmutablePropTypes.list,
    hasMore: PropTypes.bool,
    isLoading: PropTypes.bool,
    multiColumn: PropTypes.bool,
    intl: PropTypes.object.isRequired,
  };

  componentWillMount () {
    if (!this.props.accountIds) {
      this.props.dispatch(fetchReactions(this.props.params.statusId));
    }
  }

  handleHeaderClick = () => {
    this.column.scrollTop();
  };

  handleLoadMore = debounce(() => {
    this.props.dispatch(expandReactions(this.props.params.statusId));
  }, 300, { leading: true});

  setRef = c => {
    this.column = c;
  };

  handleRefresh = () => {
    this.props.dispatch(fetchReactions(this.props.params.statusId));
  };

  render () {
    const { intl, accountIds, hasMore, isLoading, multiColumn } = this.props;

    if (!accountIds) {
      return (
        <Column>
          <LoadingIndicator />
        </Column>
      );
    }

    const emptyMessage = <FormattedMessage id='status.reactions.empty' defaultMessage='No one has reacted to this toot yet. When someone does, they will show up here.' />;

    return (
      <Column ref={this.setRef}>
        <ColumnHeader
          icon='plus'
          title={intl.formatMessage(messages.heading)}
          onClick={this.handleHeaderClick}
          showBackButton
          multiColumn={multiColumn}
          extraButton={(
            <button className='column-header__button' title={intl.formatMessage(messages.refresh)} aria-label={intl.formatMessage(messages.refresh)} onClick={this.handleRefresh}><Icon id='refresh' /></button>
          )}
        />

        <ScrollableList
          scrollKey='reactions'
          onLoadMore={this.handleLoadMore}
          hasMore={hasMore}
          isLoading={isLoading}
          emptyMessage={emptyMessage}
          bindToDocument={!multiColumn}
        >
          {accountIds.map(id =>
            <AccountContainer key={id} id={id} withNote={false} />,
          )}
        </ScrollableList>

        <Helmet>
          <meta name='robots' content='noindex' />
        </Helmet>
      </Column>
    );
  }

}

export default connect(mapStateToProps)(injectIntl(Reactions));
