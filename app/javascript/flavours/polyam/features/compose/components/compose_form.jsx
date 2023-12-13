import PropTypes from 'prop-types';
import { createRef } from 'react';

import { defineMessages, injectIntl } from 'react-intl';

import classNames from 'classnames';

import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';

import { length } from 'stringz';

import { maxChars } from 'flavours/polyam/initial_state';
import { WithOptionalRouterPropTypes, withOptionalRouter } from 'flavours/polyam/utils/react_router';

import AutosuggestInput from '../../../components/autosuggest_input';
import AutosuggestTextarea from '../../../components/autosuggest_textarea';
import EmojiPickerDropdown from '../containers/emoji_picker_dropdown_container';
import OptionsContainer from '../containers/options_container';
import PollFormContainer from '../containers/poll_form_container';
import ReplyIndicatorContainer from '../containers/reply_indicator_container';
import UploadFormContainer from '../containers/upload_form_container';
import WarningContainer from '../containers/warning_container';
import { countableText } from '../util/counter';

import CharacterCounter from './character_counter';
import Publisher from './publisher';
import TextareaIcons from './textarea_icons';

const messages = defineMessages({
  placeholder: { id: 'compose_form.placeholder', defaultMessage: 'What is on your mind?' },
  missingDescriptionMessage: {
    id: 'confirmations.missing_media_description.message',
    defaultMessage: 'At least one media attachment is lacking a description. Consider describing all media attachments for the visually impaired before sending your toot.',
  },
  missingDescriptionConfirm: {
    id: 'confirmations.missing_media_description.confirm',
    defaultMessage: 'Send anyway',
  },
  spoiler_placeholder: { id: 'compose_form.spoiler_placeholder', defaultMessage: 'Write your warning here' },
});

class ComposeForm extends ImmutablePureComponent {
  static propTypes = {
    intl: PropTypes.object.isRequired,
    text: PropTypes.string.isRequired,
    suggestions: ImmutablePropTypes.list,
    spoiler: PropTypes.bool,
    privacy: PropTypes.string,
    spoilerText: PropTypes.string,
    focusDate: PropTypes.instanceOf(Date),
    caretPosition: PropTypes.number,
    preselectDate: PropTypes.instanceOf(Date),
    isSubmitting: PropTypes.bool,
    isChangingUpload: PropTypes.bool,
    isEditing: PropTypes.bool,
    isUploading: PropTypes.bool,
    onChange: PropTypes.func,
    onSubmit: PropTypes.func,
    onClearSuggestions: PropTypes.func,
    onFetchSuggestions: PropTypes.func,
    onSuggestionSelected: PropTypes.func,
    onChangeSpoilerText: PropTypes.func,
    onPaste: PropTypes.func,
    onPickEmoji: PropTypes.func,
    autoFocus: PropTypes.bool,
    anyMedia: PropTypes.bool,
    isInReply: PropTypes.bool,
    singleColumn: PropTypes.bool,
    lang: PropTypes.string,
    advancedOptions: ImmutablePropTypes.map,
    media: ImmutablePropTypes.list,
    sideArm: PropTypes.string,
    sensitive: PropTypes.bool,
    spoilersAlwaysOn: PropTypes.bool,
    mediaDescriptionConfirmation: PropTypes.bool,
    preselectOnReply: PropTypes.bool,
    onChangeSpoilerness: PropTypes.func,
    onChangeVisibility: PropTypes.func,
    onMediaDescriptionConfirm: PropTypes.func,
    highlighted: PropTypes.bool,
    onRemoveHighlight: PropTypes.func,
    ...WithOptionalRouterPropTypes
  };

  static defaultProps = {
    autoFocus: false,
  };

  constructor(props) {
    super(props);
    this.textareaRef = createRef(null);
  }

  handleChange = (e) => {
    this.props.onChange(e.target.value);
  };

  getFulltextForCharacterCounting = () => {
    return [
      this.props.spoiler? this.props.spoilerText: '',
      countableText(this.props.text),
      this.props.advancedOptions && this.props.advancedOptions.get('do_not_federate') ? ' 👁️' : '',
    ].join('');
  };

  canSubmit = () => {
    const { isSubmitting, isChangingUpload, isUploading, anyMedia } = this.props;
    const fulltext = this.getFulltextForCharacterCounting();

    return !(isSubmitting || isUploading || isChangingUpload || length(fulltext) > maxChars || (!fulltext.trim().length && !anyMedia));
  };

  handleSubmit = (overriddenVisibility = null) => {
    const {
      onSubmit,
      media,
      mediaDescriptionConfirmation,
      onMediaDescriptionConfirm,
      onChangeVisibility,
    } = this.props;

    if (this.props.text !== this.textareaRef.current.value) {
      // Something changed the text inside the textarea (e.g. browser extensions like Grammarly)
      // Update the state to match the current text
      this.props.onChange(this.textareaRef.current.value);
    }

    if (!this.canSubmit()) {
      return;
    }

    // Submit unless there are media with missing descriptions
    if (mediaDescriptionConfirmation && onMediaDescriptionConfirm && media && media.some(item => !item.get('description'))) {
      const firstWithoutDescription = media.find(item => !item.get('description'));
      onMediaDescriptionConfirm(this.props.history || null, firstWithoutDescription.get('id'), overriddenVisibility);
    } else if (onSubmit) {
      if (onChangeVisibility && overriddenVisibility) {
        onChangeVisibility(overriddenVisibility);
      }
      onSubmit(this.props.history || null);
    }
  };

  //  Changes the text value of the spoiler.
  handleChangeSpoiler = ({ target: { value } }) => {
    const { onChangeSpoilerText } = this.props;
    if (onChangeSpoilerText) {
      onChangeSpoilerText(value);
    }
  };

  setRef = c => {
    this.composeForm = c;
  };

  //  Inserts an emoji at the caret.
  handleEmojiPick = (data) => {
    const { current: { selectionStart } } = this.textareaRef;
    const { onPickEmoji } = this.props;
    if (onPickEmoji) {
      onPickEmoji(selectionStart, data);
    }
  };

  //  Handles the secondary submit button.
  handleSecondarySubmit = () => {
    const {
      sideArm,
    } = this.props;
    this.handleSubmit(sideArm === 'none' ? null : sideArm);
  };

  //  Selects a suggestion from the autofill.
  handleSuggestionSelected = (tokenStart, token, value) => {
    this.props.onSuggestionSelected(tokenStart, token, value, ['text']);
  };

  handleSpoilerSuggestionSelected = (tokenStart, token, value) => {
    this.props.onSuggestionSelected(tokenStart, token, value, ['spoiler_text']);
  };

  handleKeyDown = (e) => {
    if (e.keyCode === 13 && (e.ctrlKey || e.metaKey)) {
      this.handleSubmit();
    }

    if (e.keyCode === 13 && e.altKey) {
      this.handleSecondarySubmit();
    }
  };

  //  Sets a reference to the CW field.
  handleRefSpoilerText = (spoilerComponent) => {
    if (spoilerComponent) {
      this.spoilerText = spoilerComponent.input;
    }
  };

  handleFocus = () => {
    if (this.composeForm && !this.props.singleColumn) {
      const { left, right } = this.composeForm.getBoundingClientRect();
      if (left < 0 || right > (window.innerWidth || document.documentElement.clientWidth)) {
        this.composeForm.scrollIntoView();
      }
    }
  };

  componentWillUnmount () {
    if (this.timeout) clearTimeout(this.timeout);
  }

  componentDidMount () {
    this._updateFocusAndSelection({ });
  }

  componentDidUpdate (prevProps) {
    this._updateFocusAndSelection(prevProps);
  }

  //  This statement does several things:
  //  - If we're beginning a reply, and,
  //      - Replying to zero or one users, places the cursor at the end
  //        of the textbox.
  //      - Replying to more than one user, selects any usernames past
  //        the first; this provides a convenient shortcut to drop
  //        everyone else from the conversation.
  _updateFocusAndSelection = (prevProps) => {
    const {
      spoilerText,
    } = this;
    const {
      focusDate,
      caretPosition,
      isSubmitting,
      preselectDate,
      text,
      preselectOnReply,
      singleColumn,
      highlighted,
      onRemoveHighlight,
    } = this.props;
    let selectionEnd, selectionStart;

    //  Caret/selection handling.
    if (focusDate && focusDate !== prevProps.focusDate) {
      switch (true) {
      case preselectDate !== prevProps.preselectDate && this.props.isInReply && preselectOnReply:
        selectionStart = text.search(/\s/) + 1;
        selectionEnd = text.length;
        break;
      case !isNaN(caretPosition) && caretPosition !== null:
        selectionStart = selectionEnd = caretPosition;
        break;
      default:
        selectionStart = selectionEnd = text.length;
      }
      if (this.textareaRef.current) {
        // Because of the wicg-inert polyfill, the activeElement may not be
        // immediately selectable, we have to wait for observers to run, as
        // described in https://github.com/WICG/inert#performance-and-gotchas
        Promise.resolve().then(() => {
          this.textareaRef.current.setSelectionRange(selectionStart, selectionEnd);
          this.textareaRef.current.focus();
          if (highlighted) this.timeout = setTimeout(() => onRemoveHighlight(), 700);
          if (!singleColumn) this.textareaRef.current.scrollIntoView();
        }).catch(console.error);
      }

    //  Refocuses the textarea after submitting.
    } else if (this.textareaRef.current && prevProps.isSubmitting && !isSubmitting) {
      this.textareaRef.current.focus();
    } else if (this.props.spoiler !== prevProps.spoiler) {
      if (this.props.spoiler) {
        if (spoilerText) {
          spoilerText.focus();
        }
      } else if (prevProps.spoiler) {
        if (this.textareaRef.current) {
          this.textareaRef.current.focus();
        }
      }
    }
  };


  render () {
    const {
      handleEmojiPick,
      handleSecondarySubmit,
      handleSubmit,
    } = this;
    const {
      advancedOptions,
      intl,
      isSubmitting,
      onChangeSpoilerness,
      onClearSuggestions,
      onFetchSuggestions,
      onPaste,
      privacy,
      sensitive,
      autoFocus,
      sideArm,
      spoiler,
      spoilerText,
      suggestions,
      spoilersAlwaysOn,
      isEditing,
      highlighted
    } = this.props;

    const countText = this.getFulltextForCharacterCounting();

    return (
      <div className='compose-form'>
        <WarningContainer />

        <ReplyIndicatorContainer />

        <div className={`spoiler-input ${spoiler ? 'spoiler-input--visible' : ''}`} ref={this.setRef} aria-hidden={!this.props.spoiler}>
          <AutosuggestInput
            placeholder={intl.formatMessage(messages.spoiler_placeholder)}
            value={spoilerText}
            onChange={this.handleChangeSpoiler}
            onKeyDown={this.handleKeyDown}
            disabled={!spoiler}
            ref={this.handleRefSpoilerText}
            suggestions={suggestions}
            onSuggestionsFetchRequested={onFetchSuggestions}
            onSuggestionsClearRequested={onClearSuggestions}
            onSuggestionSelected={this.handleSpoilerSuggestionSelected}
            searchTokens={[':']}
            id='glitch.composer.spoiler.input'
            className='spoiler-input__input'
            lang={this.props.lang}
            autoFocus={false}
            spellCheck
          />
        </div>

        <div className={classNames('compose-form__highlightable', { active: highlighted })}>
          <AutosuggestTextarea
            ref={this.textareaRef}
            placeholder={intl.formatMessage(messages.placeholder)}
            disabled={isSubmitting}
            value={this.props.text}
            onChange={this.handleChange}
            onKeyDown={this.handleKeyDown}
            suggestions={suggestions}
            onFocus={this.handleFocus}
            onSuggestionsFetchRequested={onFetchSuggestions}
            onSuggestionsClearRequested={onClearSuggestions}
            onSuggestionSelected={this.handleSuggestionSelected}
            onPaste={onPaste}
            autoFocus={autoFocus}
            lang={this.props.lang}
          >
            <TextareaIcons advancedOptions={advancedOptions} />
            <div className='compose-form__modifiers'>
              <UploadFormContainer />
              <PollFormContainer />
            </div>
          </AutosuggestTextarea>
          <EmojiPickerDropdown onPickEmoji={handleEmojiPick} />

          <div className='compose-form__buttons-wrapper'>
            <OptionsContainer
              advancedOptions={advancedOptions}
              disabled={isSubmitting}
              onToggleSpoiler={spoilersAlwaysOn ? null : onChangeSpoilerness}
              onUpload={onPaste}
              isEditing={isEditing}
              sensitive={sensitive || (spoilersAlwaysOn && spoilerText && spoilerText.length > 0)}
              spoiler={spoilersAlwaysOn ? (spoilerText && spoilerText.length > 0) : spoiler}
            />
            <div className='character-counter__wrapper'>
              <CharacterCounter text={countText} max={maxChars} />
            </div>
          </div>
        </div>

        <Publisher
          countText={countText}
          disabled={!this.canSubmit()}
          isEditing={isEditing}
          onSecondarySubmit={handleSecondarySubmit}
          onSubmit={handleSubmit}
          privacy={privacy}
          sideArm={sideArm}
        />
      </div>
    );
  }

}

export default withOptionalRouter(injectIntl(ComposeForm));