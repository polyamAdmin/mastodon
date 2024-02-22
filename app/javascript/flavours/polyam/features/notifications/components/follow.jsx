import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';

import classNames from 'classnames';
import { withRouter } from 'react-router-dom';

import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';

import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { HotKeys } from 'react-hotkeys';

import { Icon } from 'flavours/polyam/components/icon';
import { Permalink } from 'flavours/polyam/components/permalink';
import AccountContainer from 'flavours/polyam/containers/account_container';
import { WithRouterPropTypes } from 'flavours/polyam/utils/react_router';

import NotificationOverlayContainer from '../containers/overlay_container';

class NotificationFollow extends ImmutablePureComponent {

  static propTypes = {
    hidden: PropTypes.bool,
    id: PropTypes.string.isRequired,
    account: ImmutablePropTypes.record.isRequired,
    notification: ImmutablePropTypes.map.isRequired,
    unread: PropTypes.bool,
    ...WithRouterPropTypes,
  };

  handleMoveUp = () => {
    const { notification, onMoveUp } = this.props;
    onMoveUp(notification.get('id'));
  };

  handleMoveDown = () => {
    const { notification, onMoveDown } = this.props;
    onMoveDown(notification.get('id'));
  };

  handleOpen = () => {
    this.handleOpenProfile();
  };

  handleOpenProfile = () => {
    const { history, notification } = this.props;
    history.push(`/@${notification.getIn(['account', 'acct'])}`);
  };

  handleMention = e => {
    e.preventDefault();

    const { history, notification, onMention } = this.props;
    onMention(notification.get('account'), history);
  };

  getHandlers () {
    return {
      moveUp: this.handleMoveUp,
      moveDown: this.handleMoveDown,
      open: this.handleOpen,
      openProfile: this.handleOpenProfile,
      mention: this.handleMention,
      reply: this.handleMention,
    };
  }

  render () {
    const { account, notification, hidden, unread } = this.props;

    //  Links to the display name.
    const displayName = account.get('display_name_html') || account.get('username');
    const link = (
      <bdi><Permalink
        className='notification__display-name'
        href={account.get('url')}
        title={account.get('acct')}
        to={`/@${account.get('acct')}`}
        dangerouslySetInnerHTML={{ __html: displayName }}
      /></bdi>
    );

    //  Renders.
    return (
      <HotKeys handlers={this.getHandlers()}>
        <div className={classNames('notification notification-follow focusable', { unread })} tabIndex={0}>
          <div className='notification__message'>
            <Icon fixedWidth id='user-plus' icon={faUserPlus} />

            <FormattedMessage
              id='notification.follow'
              defaultMessage='{name} followed you'
              values={{ name: link }}
            />
          </div>

          <AccountContainer hidden={hidden} id={account.get('id')} withNote={false} />
          <NotificationOverlayContainer notification={notification} />
        </div>
      </HotKeys>
    );
  }

}

export default withRouter(NotificationFollow);
