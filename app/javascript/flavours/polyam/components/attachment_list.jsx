import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';

import classNames from 'classnames';

import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';

import { faLink } from '@fortawesome/free-solid-svg-icons';

import { Icon } from 'flavours/polyam/components/icon';

const filename = url => url.split('/').pop().split('#')[0].split('?')[0];

export default class AttachmentList extends ImmutablePureComponent {

  static propTypes = {
    media: ImmutablePropTypes.list.isRequired,
    compact: PropTypes.bool,
    collapsed: PropTypes.bool,
  };

  render () {
    const { media, compact, collapsed } = this.props;

    return (
      <div className={classNames('attachment-list', { compact })}>
        {!compact && (
          <div className='attachment-list__icon'>
            <Icon id='link' icon={faLink} />
          </div>
        )}

        <ul className='attachment-list__list'>
          {media.map(attachment => {
            const displayUrl = attachment.get('remote_url') || attachment.get('url');

            return (
              <li key={attachment.get('id')}>
                <a tabIndex={collapsed ? -1 : null} href={displayUrl} target='_blank' rel='noopener noreferrer'>
                  {compact && <Icon id='link' icon={faLink} />}
                  {compact && ' ' }
                  {displayUrl ? filename(displayUrl) : <FormattedMessage id='attachments_list.unprocessed' defaultMessage='(unprocessed)' />}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

}
