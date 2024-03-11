import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';

import ImmutablePropTypes from 'react-immutable-proptypes';

import SettingText from '../../../components/setting_text';
import { showReblogsPublicTimelines, showRepliesPublicTimelines } from '../../../initial_state';
import SettingToggle from '../../notifications/components/setting_toggle';

const messages = defineMessages({
  filter_regex: { id: 'home.column_settings.filter_regex', defaultMessage: 'Filter out by regular expressions' },
});

class ColumnSettings extends PureComponent {

  static propTypes = {
    settings: ImmutablePropTypes.map.isRequired,
    onChange: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    columnId: PropTypes.string,
  };

  render () {
    const { settings, onChange, intl } = this.props;

    return (
      <div className='column-settings'>
        <section>
          <div className='column-settings__row'>
            {showReblogsPublicTimelines && <SettingToggle prefix='public_timeline' settings={settings} settingPath={['shows', 'reblog']} onChange={onChange} label={<FormattedMessage id='home.column_settings.show_reblogs' defaultMessage='Show boosts' />} />}
            {showRepliesPublicTimelines && <SettingToggle prefix='public_timeline' settings={settings} settingPath={['shows', 'reply']} onChange={onChange} label={<FormattedMessage id='home.column_settings.show_replies' defaultMessage='Show replies' />} />}
            <SettingToggle settings={settings} settingPath={['other', 'onlyMedia']} onChange={onChange} label={<FormattedMessage id='community.column_settings.media_only' defaultMessage='Media only' />} />
            <SettingToggle settings={settings} settingPath={['other', 'onlyRemote']} onChange={onChange} label={<FormattedMessage id='community.column_settings.remote_only' defaultMessage='Remote only' />} />
            {!settings.getIn(['other', 'onlyRemote']) && <SettingToggle settings={settings} settingPath={['other', 'allowLocalOnly']} onChange={onChange} label={<FormattedMessage id='community.column_settings.allow_local_only' defaultMessage='Show local-only toots' />} />}
          </div>
        </section>

        <section>
          <h3><FormattedMessage id='home.column_settings.advanced' defaultMessage='Advanced' /></h3>

          <div className='column-settings__row'>
            <SettingText settings={settings} settingPath={['regex', 'body']} onChange={onChange} label={intl.formatMessage(messages.filter_regex)} />
          </div>
        </section>
      </div>
    );
  }

}

export default injectIntl(ColumnSettings);
