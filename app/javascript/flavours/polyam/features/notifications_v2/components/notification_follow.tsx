import { FormattedMessage } from 'react-intl';

import PersonAddIcon from '@/awesome-icons/solid/user-plus.svg?react';
import { FollowersCounter } from 'flavours/polyam/components/counters';
import { FollowButton } from 'flavours/polyam/components/follow_button';
import { ShortNumber } from 'flavours/polyam/components/short_number';
import type { NotificationGroupFollow } from 'flavours/polyam/models/notification_group';
import { useAppSelector } from 'flavours/polyam/store';

import type { LabelRenderer } from './notification_group_with_status';
import { NotificationGroupWithStatus } from './notification_group_with_status';

const labelRenderer: LabelRenderer = (values) => (
  <FormattedMessage
    id='notification.follow'
    defaultMessage='{name} followed you'
    values={values}
  />
);

const FollowerCount: React.FC<{ accountId: string }> = ({ accountId }) => {
  const account = useAppSelector((s) => s.accounts.get(accountId));

  if (!account) return null;

  return (
    <ShortNumber value={account.followers_count} renderer={FollowersCounter} />
  );
};

export const NotificationFollow: React.FC<{
  notification: NotificationGroupFollow;
  unread: boolean;
}> = ({ notification, unread }) => {
  let actions: JSX.Element | undefined;
  let additionalContent: JSX.Element | undefined;

  if (notification.sampleAccountIds.length === 1) {
    // only display those if the group contains 1 account, otherwise it does not make sense
    const account = notification.sampleAccountIds[0];

    if (account) {
      actions = <FollowButton accountId={notification.sampleAccountIds[0]} />;
      // Polyam: Don't show follower count
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      additionalContent = undefined && <FollowerCount accountId={account} />;
    }
  }

  return (
    <NotificationGroupWithStatus
      type='follow'
      icon={PersonAddIcon}
      iconId='person-add'
      accountIds={notification.sampleAccountIds}
      timestamp={notification.latest_page_notification_at}
      count={notification.notifications_count}
      labelRenderer={labelRenderer}
      unread={unread}
      actions={actions}
      additionalContent={additionalContent}
    />
  );
};
