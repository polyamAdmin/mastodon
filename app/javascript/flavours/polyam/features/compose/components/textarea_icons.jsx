//  Package imports.
import PropTypes from 'prop-types';

import { defineMessages, injectIntl } from 'react-intl';

import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';

import { faHome, faComments } from '@fortawesome/free-solid-svg-icons';

import { Icon } from 'flavours/polyam/components/icon';
//  Messages.
const messages = defineMessages({
  localOnly: {
    defaultMessage: 'This post is local-only',
    id: 'advanced_options.local-only.tooltip',
  },
  threadedMode: {
    defaultMessage: 'Threaded mode enabled',
    id: 'advanced_options.threaded_mode.tooltip',
  },
});

//  We use an array of tuples here instead of an object because it
//  preserves order.
const iconMap = [
  ['do_not_federate', 'home', faHome, messages.localOnly],
  ['threaded_mode', 'comments', faComments, messages.threadedMode],
];

class TextareaIcons extends ImmutablePureComponent {

  static propTypes = {
    advancedOptions: ImmutablePropTypes.map,
    intl: PropTypes.object.isRequired,
  };

  render () {
    const { advancedOptions, intl } = this.props;
    return (
      <div className='compose-form__textarea-icons'>
        {advancedOptions ? iconMap.map(
          ([key, icon, iconComponent, message]) => advancedOptions.get(key) ? (
            <span
              className='textarea_icon'
              key={key}
              title={intl.formatMessage(message)}
            >
              <Icon
                fixedWidth
                id={icon}
                icon={iconComponent}
              />
            </span>
          ) : null,
        ) : null}
      </div>
    );
  }

}

export default injectIntl(TextareaIcons);