import React from 'react';
import { useLocation } from 'react-router-dom';

import analytics from '../../utils/shared/analytics';

export const useGAPageView = () => {
  const location = useLocation();

  React.useEffect(() => {
    const currentPath = location.pathname + location.search;
    analytics.sendPageView(currentPath);
  }, [location]);
};

export const useGAEvent = (category = 'u3') => {
  const eventTracker = (
    action = 'default action',
    label: string | undefined = undefined,
    value: number | undefined = undefined
  ) => {
    analytics.sendEvent({ category, action, label, value });
  };
  return eventTracker;
};
