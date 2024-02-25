//  Package imports  //
import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { FormattedMessage } from 'react-intl';

import ImmutablePropTypes from 'react-immutable-proptypes';

import { faBell, faFaceGrinWide, faPencil, faStar, faTasksAlt, faThumbTack } from '@fortawesome/free-solid-svg-icons';

import { Icon } from 'flavours/polyam/components/icon';
import { me } from 'flavours/polyam/initial_state';

import { faBoost } from './boost';

export default class StatusPrepend extends PureComponent {

  static propTypes = {
    type: PropTypes.string.isRequired,
    account: ImmutablePropTypes.record.isRequired,
    parseClick: PropTypes.func.isRequired,
    notificationId: PropTypes.number,
    children: PropTypes.node,
  };

  handleClick = (e) => {
    const { account, parseClick } = this.props;
    parseClick(e, `/@${account.get('acct')}`);
  };

  Message = () => {
    const { type, account } = this.props;
    let link = (
      <a
        onClick={this.handleClick}
        href={account.get('url')}
        className='status__display-name'
      >
        <bdi>
          <strong dangerouslySetInnerHTML={{ __html: account.get('display_name_html') || account.get('username')}} />
        </bdi>
      </a>
    );
    switch (type) {
    case 'featured':
      return (
        <FormattedMessage id='status.pinned' defaultMessage='Pinned post' />
      );
    case 'reblogged_by':
      return (
        <FormattedMessage
          id='status.reblogged_by'
          defaultMessage='{name} boosted'
          values={{ name : link }}
        />
      );
    case 'favourite':
      return (
        <FormattedMessage
          id='notification.favourite'
          defaultMessage='{name} favorited your status'
          values={{ name : link }}
        />
      );
    case 'reaction':
      return (
        <FormattedMessage
          id='notification.reaction'
          defaultMessage='{name} reacted to your status'
          values={{ name: link }}
        />
      );
    case 'reblog':
      return (
        <FormattedMessage
          id='notification.reblog'
          defaultMessage='{name} boosted your status'
          values={{ name : link }}
        />
      );
    case 'status':
      return (
        <FormattedMessage
          id='notification.status'
          defaultMessage='{name} just posted'
          values={{ name: link }}
        />
      );
    case 'poll':
      if (me === account.get('id')) {
        return (
          <FormattedMessage
            id='notification.own_poll'
            defaultMessage='Your poll has ended'
          />
        );
      } else {
        return (
          <FormattedMessage
            id='notification.poll'
            defaultMessage='A poll you have voted in has ended'
          />
        );
      }
    case 'update':
      return (
        <FormattedMessage
          id='notification.update'
          defaultMessage='{name} edited a post'
          values={{ name: link }}
        />
      );
    }
    return null;
  };

  render () {
    const { Message } = this;
    const { type, children } = this.props;

    let iconId, iconComponent;

    switch(type) {
    case 'favourite':
      iconId = 'star';
      iconComponent = faStar;
      break;
    case 'reaction':
      iconId = 'face-grin-wide';
      iconComponent = faFaceGrinWide;
      break;
    case 'featured':
      iconId = 'thumb-tack';
      iconComponent = faThumbTack;
      break;
    case 'poll':
      iconId = 'tasks';
      iconComponent = faTasksAlt;
      break;
    case 'reblog':
    case 'reblogged_by':
      iconId = 'retweet';
      iconComponent = faBoost;
      break;
    case 'status':
      iconId = 'bell';
      iconComponent = faBell;
      break;
    case 'update':
      iconId = 'pencil';
      iconComponent = faPencil;
      break;
    }

    return !type ? null : (
      <aside className={type === 'reblogged_by' || type === 'featured' ? 'status__prepend' : 'notification__message'}>
        <Icon
          className={`status__prepend-icon ${type === 'favourite' ? 'star-icon' : ''}`}
          id={iconId}
          icon={iconComponent}
        />
        <Message />
        {children}
      </aside>
    );
  }

}
