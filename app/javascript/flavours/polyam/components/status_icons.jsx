//  Package imports.
import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { defineMessages, injectIntl } from 'react-intl';

import ImmutablePropTypes from 'react-immutable-proptypes';

import { faImage } from '@fortawesome/free-regular-svg-icons';
import { faCommenting, faComment, faHome, faLink, faVideoCamera, faMusic, faTasksAlt } from '@fortawesome/free-solid-svg-icons';

import { Icon } from 'flavours/polyam/components/icon';
import { languages } from 'flavours/polyam/initial_state';

import { CollapseButton } from './collapse_button';
import { VisibilityIcon } from './visibility_icon';

//  Messages for use with internationalization stuff.
const messages = defineMessages({
  collapse: { id: 'status.collapse', defaultMessage: 'Collapse' },
  uncollapse: { id: 'status.uncollapse', defaultMessage: 'Uncollapse' },
  inReplyTo: { id: 'status.in_reply_to', defaultMessage: 'This toot is a reply' },
  previewCard: { id: 'status.has_preview_card', defaultMessage: 'Features an attached preview card' },
  pictures: { id: 'status.has_pictures', defaultMessage: 'Features attached pictures' },
  poll: { id: 'status.is_poll', defaultMessage: 'This toot is a poll' },
  thread: { id: 'status.is_thread', defaultMessage: 'This toot is part of a thread' },
  video: { id: 'status.has_video', defaultMessage: 'Features attached videos' },
  audio: { id: 'status.has_audio', defaultMessage: 'Features attached audio files' },
  localOnly: { id: 'status.local_only', defaultMessage: 'Only visible from your instance' },
});

const LanguageIcon = ({ language }) => {
  if (!languages) return null;

  const lang = languages.find((lang) => lang[0] === language);
  if (!lang) return null;

  return (
    <span className='text-icon' title={`${lang[2]} (${lang[1]})`} aria-hidden='true'>
      {lang[0].toUpperCase()}
    </span>
  );
};

LanguageIcon.propTypes = {
  language: PropTypes.string.isRequired,
};

class StatusIcons extends PureComponent {

  static propTypes = {
    status: ImmutablePropTypes.map.isRequired,
    mediaIcons: PropTypes.arrayOf(PropTypes.string),
    collapsible: PropTypes.bool,
    collapsed: PropTypes.bool,
    setCollapsed: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    settings: ImmutablePropTypes.map.isRequired,
  };

  //  Handles clicks on collapsed button
  handleCollapsedClick = (e) => {
    const { collapsed, setCollapsed } = this.props;
    if (e.button === 0) {
      setCollapsed(!collapsed);
      e.preventDefault();
    }
  };

  // TODO: Move media icons to own component?
  mediaIconComponent (mediaIcon) {
    const icon = {
      'link': faLink,
      'picture-o': faImage,
      'tasks': faTasksAlt,
      'video-camera': faVideoCamera,
      'music': faMusic,
    }[mediaIcon];

    return icon;
  }

  mediaIconTitleText (mediaIcon) {
    const { intl } = this.props;

    const message = {
      'link': messages.previewCard,
      'picture-o': messages.pictures,
      'tasks': messages.poll,
      'video-camera': messages.video,
      'music': messages.audio,
    }[mediaIcon];

    return message && intl.formatMessage(message);
  }

  renderIcon (mediaIcon) {
    return (
      <Icon
        fixedWidth
        className='status__media-icon'
        key={`media-icon--${mediaIcon}`}
        id={mediaIcon}
        icon={this.mediaIconComponent(mediaIcon)}
        aria-hidden='true'
        title={this.mediaIconTitleText(mediaIcon)}
      />
    );
  }

  //  Rendering.
  render () {
    const {
      status,
      mediaIcons,
      collapsible,
      collapsed,
      setCollapsed,
      settings,
      intl,
    } = this.props;

    return (
      <div className='status__info__icons'>
        {settings.get('language') && status.get('language') && <LanguageIcon language={status.get('language')} />}
        {settings.get('reply') && status.get('in_reply_to_id', null) !== null ?
          status.get('in_reply_to_account_id') === status.getIn(['account', 'id']) ? (
            <Icon
              className='status__reply-icon'
              fixedWidth
              id='commenting'
              icon={faCommenting}
              aria-hidden='true'
              title={intl.formatMessage(messages.thread)}
            />
          ) : (
            <Icon
              className='status__reply-icon'
              fixedWidth
              id='comment'
              icon={faComment}
              aria-hidden='true'
              title={intl.formatMessage(messages.inReplyTo)}
            />
          ) : null}
        {settings.get('local_only') && status.get('local_only') &&
          <Icon
            fixedWidth
            id='home'
            icon={faHome}
            aria-hidden='true'
            title={intl.formatMessage(messages.localOnly)}
          />}
        {settings.get('media') && !!mediaIcons && mediaIcons.map(icon => this.renderIcon(icon))}
        {settings.get('visibility') && <VisibilityIcon visibility={status.get('visibility')} />}
        {collapsible && <CollapseButton collapsed={collapsed} setCollapsed={setCollapsed} />}
      </div>
    );
  }

}

export default injectIntl(StatusIcons);
