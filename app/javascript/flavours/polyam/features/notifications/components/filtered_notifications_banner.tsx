import { useEffect } from 'react';

import { FormattedMessage } from 'react-intl';

import { Link } from 'react-router-dom';

import InventoryIcon from '@/awesome-icons/solid/box-archive.svg?react';
import { fetchNotificationPolicy } from 'flavours/polyam/actions/notification_policies';
import { Icon } from 'flavours/polyam/components/icon';
import { useAppSelector, useAppDispatch } from 'flavours/polyam/store';
import { toCappedNumber } from 'flavours/polyam/utils/numbers';

export const FilteredNotificationsBanner: React.FC = () => {
  const dispatch = useAppDispatch();
  const policy = useAppSelector((state) => state.notificationPolicy);

  useEffect(() => {
    void dispatch(fetchNotificationPolicy());

    const interval = setInterval(() => {
      void dispatch(fetchNotificationPolicy());
    }, 120000);

    return () => {
      clearInterval(interval);
    };
  }, [dispatch]);

  if (policy === null || policy.summary.pending_notifications_count === 0) {
    return null;
  }

  return (
    <Link
      className='filtered-notifications-banner'
      to='/notifications/requests'
    >
      <div className='notification-group__icon'>
        <Icon icon={InventoryIcon} id='filtered-notifications' />
      </div>

      <div className='filtered-notifications-banner__text'>
        <strong>
          <FormattedMessage
            id='filtered_notifications_banner.title'
            defaultMessage='Filtered notifications'
          />
        </strong>
        <span>
          <FormattedMessage
            id='filtered_notifications_banner.pending_requests'
            defaultMessage='Notifications from {count, plural, =0 {no one} one {one person} other {# people}} you may know'
            values={{ count: policy.summary.pending_requests_count }}
          />
        </span>
      </div>

      <div className='filtered-notifications-banner__badge'>
        <div className='filtered-notifications-banner__badge__badge'>
          {toCappedNumber(policy.summary.pending_notifications_count)}
        </div>
        <FormattedMessage
          id='filtered_notifications_banner.mentions'
          defaultMessage='{count, plural, one {mention} other {mentions}}'
          values={{ count: policy.summary.pending_notifications_count }}
        />
      </div>
    </Link>
  );
};
