import PropTypes from 'prop-types';

import classNames from 'classnames';

import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';

import AudiotrackIcon from '@/material-icons/400-24px/music_note.svg?react';
import PlayArrowIcon from '@/material-icons/400-24px/play_arrow.svg?react';
import VisibilityOffIcon from '@/material-icons/400-24px/visibility_off.svg?react';
import { Blurhash } from 'flavours/glitch/components/blurhash';
import { Icon }  from 'flavours/glitch/components/icon';
import { autoPlayGif, displayMedia, useBlurhash } from 'flavours/glitch/initial_state';

export default class MediaItem extends ImmutablePureComponent {

  static propTypes = {
    attachment: ImmutablePropTypes.map.isRequired,
    displayWidth: PropTypes.number.isRequired,
    onOpenMedia: PropTypes.func.isRequired,
    onOpenAltText: PropTypes.func.isRequired,
  };

  state = {
    visible: displayMedia !== 'hide_all' && !this.props.attachment.getIn(['status', 'sensitive']) || displayMedia === 'show_all',
    loaded: false,
  };

  handleImageLoad = () => {
    this.setState({ loaded: true });
  };

  handleMouseEnter = e => {
    if (this.hoverToPlay()) {
      e.target.play();
    }
  };

  handleMouseLeave = e => {
    if (this.hoverToPlay()) {
      e.target.pause();
      e.target.currentTime = 0;
    }
  };

  hoverToPlay () {
    return !autoPlayGif && ['gifv', 'video'].indexOf(this.props.attachment.get('type')) !== -1;
  }

  handleClick = e => {
    if (e.button === 0 && !(e.ctrlKey || e.metaKey)) {
      e.preventDefault();

      if (this.state.visible) {
        this.props.onOpenMedia(this.props.attachment);
      } else {
        this.setState({ visible: true });
      }
    }
  };

  handleAltClick = e => {
    // Prevent media from opening in new tab
    e.preventDefault();

    if (this.state.visible) {
      this.props.onOpenAltText(this.props.attachment);
    }

    // Prevent media modal from opening
    e.stopPropagation();
  };

  render () {
    const { attachment, displayWidth } = this.props;
    const { visible, loaded } = this.state;

    const width  = `${Math.floor((displayWidth - 4) / 3) - 4}px`;
    const height = width;
    const status = attachment.get('status');
    const title  = status.get('spoiler_text') || attachment.get('description');

    let thumbnail, label, icon, content;
    let altButton = (<button type='button' className='media-gallery__alt__label' onClick={this.handleAltClick}><span>ALT</span></button>);

    if (!visible) {
      icon = (
        <span className='account-gallery__item__icons'>
          <Icon id='eye-slash' icon={VisibilityOffIcon} />
        </span>
      );
    } else {
      if (['audio', 'video'].includes(attachment.get('type'))) {
        content = (
          <img
            src={attachment.get('preview_url') || status.getIn(['account', 'avatar_static'])}
            alt={attachment.get('description')}
            lang={status.get('language')}
            onLoad={this.handleImageLoad}
          />
        );

        if (attachment.get('type') === 'audio') {
          label = <Icon id='music' icon={AudiotrackIcon} />;
        } else {
          label = <Icon id='play' icon={PlayArrowIcon} />;
        }
      } else if (attachment.get('type') === 'image') {
        const focusX = attachment.getIn(['meta', 'focus', 'x']) || 0;
        const focusY = attachment.getIn(['meta', 'focus', 'y']) || 0;
        const x      = ((focusX /  2) + .5) * 100;
        const y      = ((focusY / -2) + .5) * 100;

        content = (
          <img
            src={attachment.get('preview_url')}
            alt={attachment.get('description')}
            lang={status.get('language')}
            style={{ objectPosition: `${x}% ${y}%` }}
            onLoad={this.handleImageLoad}
          />
        );
      } else if (attachment.get('type') === 'gifv') {
        content = (
          <video
            className='media-gallery__item-gifv-thumbnail'
            aria-label={attachment.get('description')}
            title={attachment.get('description')}
            lang={status.get('language')}
            role='application'
            src={attachment.get('url')}
            onMouseEnter={this.handleMouseEnter}
            onMouseLeave={this.handleMouseLeave}
            autoPlay={autoPlayGif}
            playsInline
            loop
            muted
          />
        );

        label = 'GIF';
      }

      thumbnail = (
        <div className='media-gallery__gifv'>
          {content}

          <div className='media-gallery__item__badges'>
            {label && (<span className='media-gallery__gifv__label'>{label}</span>)}
            {attachment.get('description') ? altButton : null}
          </div>
        </div>
      );
    }

    return (
      <div className='account-gallery__item' style={{ width, height }}>
        <a className='media-gallery__item-thumbnail' href={status.get('url')} onClick={this.handleClick} title={title} target='_blank' rel='noopener noreferrer'>
          <Blurhash
            hash={attachment.get('blurhash')}
            className={classNames('media-gallery__preview', { 'media-gallery__preview--hidden': visible && loaded })}
            dummy={!useBlurhash}
          />

          {visible ? thumbnail : icon}
        </a>
      </div>
    );
  }

}
