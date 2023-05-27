import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { FormattedMessage, FormattedDate, injectIntl, defineMessages } from 'react-intl';
import Column from 'mastodon/components/column';
import ColumnHeader from 'mastodon/components/column_header';
import api from 'mastodon/api';
import { Skeleton } from 'mastodon/components/skeleton';

const messages = defineMessages({
  title: { id: 'privacy_policy.title', defaultMessage: 'Privacy Policy' },
});

class PrivacyPolicy extends React.PureComponent {

  static propTypes = {
    intl: PropTypes.object,
    multiColumn: PropTypes.bool,
  };

  state = {
    content: null,
    lastUpdated: null,
    isLoading: true,
  };

  componentDidMount () {
    api().get('/api/v1/instance/privacy_policy').then(({ data }) => {
      this.setState({ content: data.content, lastUpdated: data.updated_at, isLoading: false });
    }).catch(() => {
      this.setState({ isLoading: false });
    });
  }

  handleHeaderClick = () => {
    this.column.scrollTop();
  };

  setRef = c => {
    this.column = c;
  };

  render () {
    const { intl, multiColumn } = this.props;
    const { isLoading, content, lastUpdated } = this.state;

    return (
      <Column bindToDocument={!multiColumn} ref={this.setRef} label={intl.formatMessage(messages.title)}>
        <ColumnHeader
          icon='user-secret'
          title={intl.formatMessage(messages.title)}
          onClick={this.handleHeaderClick}
          multiColumn={multiColumn}
        />
        <div className='scrollable privacy-policy'>
          <div className='column-title'>
            <h3><FormattedMessage id='privacy_policy.title' defaultMessage='Privacy Policy' /></h3>
            <p><FormattedMessage id='privacy_policy.last_updated' defaultMessage='Last updated {date}' values={{ date: isLoading ? <Skeleton width='10ch' /> : <FormattedDate value={lastUpdated} year='numeric' month='short' day='2-digit' /> }} /></p>
          </div>

          <div
            className='privacy-policy__body prose'
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>

        <Helmet>
          <title>{intl.formatMessage(messages.title)}</title>
          <meta name='robots' content='all' />
        </Helmet>
      </Column>
    );
  }

}

export default injectIntl(PrivacyPolicy);
