import PropTypes from 'prop-types';
import { Component } from 'react';

import { defineMessages, injectIntl } from 'react-intl';

import { faAt, faBookmark, faCog, faCogs, faEllipsisH, faGlobe, faHashtag, faHome, faListUl, faSearch, faStar } from '@fortawesome/free-solid-svg-icons';

import { NavigationPortal } from 'flavours/polyam/components/navigation_portal';
import { timelinePreview, trendsEnabled } from 'flavours/polyam/initial_state';
import { transientSingleColumn } from 'flavours/polyam/is_mobile';
import { preferencesLink } from 'flavours/polyam/utils/backend_links';

import ColumnLink from './column_link';
import DisabledAccountBanner from './disabled_account_banner';
import FollowRequestsColumnLink from './follow_requests_column_link';
import ListPanel from './list_panel';
import NotificationsCounterIcon from './notifications_counter_icon';
import SignInBanner from './sign_in_banner';

const messages = defineMessages({
  home: { id: 'tabs_bar.home', defaultMessage: 'Home' },
  notifications: { id: 'tabs_bar.notifications', defaultMessage: 'Notifications' },
  explore: { id: 'explore.title', defaultMessage: 'Explore' },
  firehose: { id: 'column.firehose', defaultMessage: 'Live feeds' },
  direct: { id: 'navigation_bar.direct', defaultMessage: 'Private mentions' },
  favourites: { id: 'navigation_bar.favourites', defaultMessage: 'Favorites' },
  bookmarks: { id: 'navigation_bar.bookmarks', defaultMessage: 'Bookmarks' },
  lists: { id: 'navigation_bar.lists', defaultMessage: 'Lists' },
  preferences: { id: 'navigation_bar.preferences', defaultMessage: 'Preferences' },
  followsAndFollowers: { id: 'navigation_bar.follows_and_followers', defaultMessage: 'Follows and followers' },
  about: { id: 'navigation_bar.about', defaultMessage: 'About' },
  search: { id: 'navigation_bar.search', defaultMessage: 'Search' },
  advancedInterface: { id: 'navigation_bar.advanced_interface', defaultMessage: 'Open in advanced web interface' },
  openedInClassicInterface: { id: 'navigation_bar.opened_in_classic_interface', defaultMessage: 'Posts, accounts, and other specific pages are opened by default in the classic web interface.' },
  app_settings: { id: 'navigation_bar.app_settings', defaultMessage: 'App settings' },
});

class NavigationPanel extends Component {

  static contextTypes = {
    identity: PropTypes.object.isRequired,
  };

  static propTypes = {
    intl: PropTypes.object.isRequired,
    onOpenSettings: PropTypes.func,
  };

  isFirehoseActive = (match, location) => {
    return match || location.pathname.startsWith('/public');
  };

  render() {
    const { intl, onOpenSettings } = this.props;
    const { signedIn, disabledAccountId } = this.context.identity;

    let banner = undefined;

    if(transientSingleColumn)
      banner = (<div className='switch-to-advanced'>
        {intl.formatMessage(messages.openedInClassicInterface)}
        {" "}
        <a href={`/deck${location.pathname}`} className='switch-to-advanced__toggle'>
          {intl.formatMessage(messages.advancedInterface)}
        </a>
      </div>);

    return (
      <div className='navigation-panel'>
        {banner &&
          <div className='navigation-panel__banner'>
            {banner}
          </div>
        }

        {signedIn && (
          <>
            <ColumnLink transparent to='/home' icon='home' iconComponent={faHome} text={intl.formatMessage(messages.home)} />
            <ColumnLink transparent to='/notifications' icon={<NotificationsCounterIcon className='column-link__icon' />} text={intl.formatMessage(messages.notifications)} />
            <FollowRequestsColumnLink />
          </>
        )}

        {trendsEnabled ? (
          <ColumnLink transparent to='/explore' icon='hashtag' iconComponent={faHashtag} text={intl.formatMessage(messages.explore)} />
        ) : (
          <ColumnLink transparent to='/search' icon='search' iconComponent={faSearch} text={intl.formatMessage(messages.search)} />
        )}

        {(signedIn || timelinePreview) && (
          <ColumnLink transparent to='/public/local' isActive={this.isFirehoseActive} icon='globe' iconComponent={faGlobe} text={intl.formatMessage(messages.firehose)} />
        )}

        {!signedIn && (
          <div className='navigation-panel__sign-in-banner'>
            <hr />
            { disabledAccountId ? <DisabledAccountBanner /> : <SignInBanner /> }
          </div>
        )}

        {signedIn && (
          <>
            <ColumnLink transparent to='/conversations' icon='at' iconComponent={faAt} text={intl.formatMessage(messages.direct)} />
            <ColumnLink transparent to='/bookmarks' icon='bookmark' iconComponent={faBookmark} text={intl.formatMessage(messages.bookmarks)} />
            <ColumnLink transparent to='/favourites' icon='star' iconComponent={faStar} text={intl.formatMessage(messages.favourites)} />
            <ColumnLink transparent to='/lists' icon='list-ul' iconComponent={faListUl} text={intl.formatMessage(messages.lists)} />

            <ListPanel />

            <hr />

            {!!preferencesLink && <ColumnLink transparent href={preferencesLink} icon='cog' iconComponent={faCog} text={intl.formatMessage(messages.preferences)} />}
            <ColumnLink transparent onClick={onOpenSettings} icon='cogs' iconComponent={faCogs} text={intl.formatMessage(messages.app_settings)} />
          </>
        )}

        <div className='navigation-panel__legal'>
          <hr />
          <ColumnLink transparent to='/about' icon='ellipsis-h' iconComponent={faEllipsisH} text={intl.formatMessage(messages.about)} />
        </div>

        <NavigationPortal />
      </div>
    );
  }

}

export default injectIntl(NavigationPanel);
