import PropTypes from 'prop-types';
import { useCallback } from 'react';

import { defineMessages, useIntl } from 'react-intl';

import { faAngleDoubleUp } from '@fortawesome/free-solid-svg-icons';

import { IconButton } from './icon_button';

const messages = defineMessages({
  collapse: { id: 'status.collapse', defaultMessage: 'Collapse' },
  uncollapse: { id: 'status.uncollapse', defaultMessage: 'Uncollapse' },
});

export const CollapseButton = ({ collapsed, setCollapsed }) => {
  const intl = useIntl();

  const handleCollapsedClick = useCallback((e) => {
    if (e.button === 0) {
      setCollapsed(!collapsed);
      e.preventDefault();
    }
  }, [collapsed, setCollapsed]);

  return (
    <IconButton
      className='status__collapse-button'
      animate
      active={collapsed}
      title={
        collapsed ?
          intl.formatMessage(messages.uncollapse) :
          intl.formatMessage(messages.collapse)
      }
      icon='angle-double-up'
      iconComponent={faAngleDoubleUp}
      onClick={handleCollapsedClick}
    />
  );
};

CollapseButton.propTypes = {
  collapsed: PropTypes.bool,
  setCollapsed: PropTypes.func.isRequired,
};
