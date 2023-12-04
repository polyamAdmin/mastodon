import PropTypes from 'prop-types';
import React from 'react';

import { Check } from 'flavours/polyam/components/check';
import { Icon } from 'flavours/polyam/components/icon';

import ArrowSmallRight from './arrow_small_right';

const Step = ({ label, description, icon, iconComponent, completed, onClick, href }) => {
  const content = (
    <>
      <div className='onboarding__steps__item__icon'>
        <Icon id={icon} icon={iconComponent} />
      </div>

      <div className='onboarding__steps__item__description'>
        <h6>{label}</h6>
        <p>{description}</p>
      </div>

      <div className={completed ? 'onboarding__steps__item__progress' : 'onboarding__steps__item__go'}>
        {completed ? <Check /> : <ArrowSmallRight />}
      </div>
    </>
  );

  if (href) {
    return (
      <a href={href} onClick={onClick} target='_blank' rel='noopener' className='onboarding__steps__item'>
        {content}
      </a>
    );
  }

  return (
    <button onClick={onClick} className='onboarding__steps__item'>
      {content}
    </button>
  );
};

Step.propTypes = {
  label: PropTypes.node,
  description: PropTypes.node,
  icon: PropTypes.string,
  iconComponent: PropTypes.object,
  completed: PropTypes.bool,
  href: PropTypes.string,
  onClick: PropTypes.func,
};

export default Step;
