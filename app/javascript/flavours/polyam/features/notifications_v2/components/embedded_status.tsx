import { useCallback } from 'react';

import { FormattedMessage } from 'react-intl';

import { useHistory } from 'react-router-dom';

import type { List as ImmutableList, RecordOf } from 'immutable';

import PhotoLibraryIcon from '@/awesome-icons/regular/image.svg?react';
import BarChart4BarsIcon from '@/awesome-icons/solid/bars-progress.svg?react';
import { Avatar } from 'flavours/polyam/components/avatar';
import { DisplayName } from 'flavours/polyam/components/display_name';
import { Icon } from 'flavours/polyam/components/icon';
import { StatusReactions } from 'flavours/polyam/components/status_reactions';
import { useIdentity } from 'flavours/polyam/identity_context';
import { visibleReactions } from 'flavours/polyam/initial_state';
import type { Status } from 'flavours/polyam/models/status';
import { useAppSelector } from 'flavours/polyam/store';

import { EmbeddedStatusContent } from './embedded_status_content';

export type Mention = RecordOf<{ url: string; acct: string }>;

export const EmbeddedStatus: React.FC<{ statusId: string }> = ({
  statusId,
}) => {
  const history = useHistory();

  // Polyam: TODO: Remove as notifications already require being signedIn
  // This is currently only here to satisfy required "canReact" prop on StatusReactions.
  const { signedIn } = useIdentity();

  const status = useAppSelector(
    (state) => state.statuses.get(statusId) as Status | undefined,
  );

  const account = useAppSelector((state) =>
    state.accounts.get(status?.get('account') as string),
  );

  const handleClick = useCallback(() => {
    if (!account) return;

    history.push(`/@${account.acct}/${statusId}`);
  }, [statusId, account, history]);

  if (!status) {
    return null;
  }

  // Assign status attributes to variables with a forced type, as status is not yet properly typed
  const contentHtml = status.get('contentHtml') as string;
  const poll = status.get('poll');
  const language = status.get('language') as string;
  const mentions = status.get('mentions') as ImmutableList<Mention>;
  const mediaAttachmentsSize = (
    status.get('media_attachments') as ImmutableList<unknown>
  ).size;

  return (
    <div className='notification-group__embedded-status'>
      <div className='notification-group__embedded-status__account'>
        <Avatar account={account} size={16} />
        <DisplayName account={account} />
      </div>

      <EmbeddedStatusContent
        className='notification-group__embedded-status__content reply-indicator__content translate'
        content={contentHtml}
        language={language}
        mentions={mentions}
        onClick={handleClick}
      />

      {(poll || mediaAttachmentsSize > 0) && (
        <div className='notification-group__embedded-status__attachments reply-indicator__attachments'>
          {!!poll && (
            <>
              <Icon icon={BarChart4BarsIcon} id='bar-chart-4-bars' />
              <FormattedMessage
                id='reply_indicator.poll'
                defaultMessage='Poll'
              />
            </>
          )}
          {mediaAttachmentsSize > 0 && (
            <>
              <Icon icon={PhotoLibraryIcon} id='photo-library' />
              <FormattedMessage
                id='reply_indicator.attachments'
                defaultMessage='{count, plural, one {# attachment} other {# attachments}}'
                values={{ count: mediaAttachmentsSize }}
              />
            </>
          )}
        </div>
      )}

      <StatusReactions
        statusId={status.get('id') as string}
        reactions={status.get('reactions')}
        numVisible={visibleReactions}
        canReact={signedIn}
      />
    </div>
  );
};
