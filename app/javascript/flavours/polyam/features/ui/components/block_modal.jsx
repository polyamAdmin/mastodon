import PropTypes from 'prop-types';
import { useCallback } from 'react';

import { FormattedMessage } from 'react-intl';

import { useDispatch } from 'react-redux';

import { faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import { faAt, faBan, faBullhorn, faReply } from '@fortawesome/free-solid-svg-icons';

import { blockAccount } from 'flavours/polyam/actions/accounts';
import { closeModal } from 'flavours/polyam/actions/modal';
import { Button } from 'flavours/polyam/components/button';
import { Icon } from 'flavours/polyam/components/icon';

export const BlockModal = ({ accountId, acct }) => {
  const dispatch = useDispatch();

  const handleClick = useCallback(() => {
    dispatch(closeModal({ modalType: undefined, ignoreFocus: false }));
    dispatch(blockAccount(accountId));
  }, [dispatch, accountId]);

  const handleCancel = useCallback(() => {
    dispatch(closeModal({ modalType: undefined, ignoreFocus: false }));
  }, [dispatch]);

  return (
    <div className='modal-root__modal safety-action-modal'>
      <div className='safety-action-modal__top'>
        <div className='safety-action-modal__header'>
          <div className='safety-action-modal__header__icon'>
            <Icon icon={faBan} />
          </div>

          <div>
            <h1><FormattedMessage id='block_modal.title' defaultMessage='Block user?' /></h1>
            <div>@{acct}</div>
          </div>
        </div>
        <div className='safety-action-modal__bullet-points'>
          <div>
            <div className='safety-action-modal__bullet-points__icon'><Icon icon={faBullhorn} /></div>
            <div><FormattedMessage id='block_modal.they_will_know' defaultMessage="They can see that they're blocked." /></div>
          </div>

          <div>
            <div className='safety-action-modal__bullet-points__icon'><Icon icon={faEyeSlash} /></div>
            <div><FormattedMessage id='block_modal.they_cant_see_posts' defaultMessage="They can't see your posts and you won't see theirs." /></div>
          </div>

          <div>
            <div className='safety-action-modal__bullet-points__icon'><Icon icon={faAt} /></div>
            <div><FormattedMessage id='block_modal.you_wont_see_mentions' defaultMessage="You won't see posts that mentions them." /></div>
          </div>

          <div>
            <div className='safety-action-modal__bullet-points__icon'><Icon icon={faReply} /></div>
            <div><FormattedMessage id='block_modal.they_cant_mention' defaultMessage="They can't mention or follow you." /></div>
          </div>
        </div>
      </div>
      <div className='safety-action-modal__bottom'>
        <div className='safety-action-modal__actions'>
          <button onClick={handleCancel} className='link-button'>
            <FormattedMessage id='confirmation_modal.cancel' defaultMessage='Cancel' />
          </button>

          <Button onClick={handleClick}>
            <FormattedMessage id='confirmations.block.confirm' defaultMessage='Block' />
          </Button>
        </div>
      </div>
    </div>
  );
};

BlockModal.propTypes = {
  accountId: PropTypes.string.isRequired,
  acct: PropTypes.string.isRequired,
};

export default BlockModal;
