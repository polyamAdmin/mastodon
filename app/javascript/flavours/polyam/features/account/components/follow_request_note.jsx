import { FormattedMessage } from 'react-intl';

import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';

import CheckIcon from '@/awesome-icons/solid/check.svg?react';
import CloseIcon from '@/awesome-icons/solid/xmark.svg?react';
import { Icon } from 'flavours/polyam/components/icon';

export default class FollowRequestNote extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.record.isRequired,
  };

  render () {
    const { account, onAuthorize, onReject } = this.props;

    return (
      <div className='follow-request-banner'>
        <div className='follow-request-banner__message'>
          <FormattedMessage id='account.requested_follow' defaultMessage='{name} has requested to follow you' values={{ name: <bdi><strong dangerouslySetInnerHTML={{ __html: account.get('display_name_html') }} /></bdi> }} />
        </div>

        <div className='follow-request-banner__action'>
          <button type='button' className='button button-tertiary button--confirmation' onClick={onAuthorize}>
            <Icon id='check' icon={CheckIcon} fixedWidth />
            <FormattedMessage id='follow_request.authorize' defaultMessage='Authorize' />
          </button>

          <button type='button' className='button button-tertiary button--destructive' onClick={onReject}>
            <Icon id='times' icon={CloseIcon} fixedWidth />
            <FormattedMessage id='follow_request.reject' defaultMessage='Reject' />
          </button>
        </div>
      </div>
    );
  }

}
