import { ReactNode } from 'react';

import './BEFeatureIndicator.css';

import { FeatureId } from '@/react/portainer/feature-flags/enums';

import { getFeatureDetails } from './utils';

export interface Props {
  featureId: FeatureId;
  children?: (isLimited: boolean) => ReactNode;
}

export function BEFeatureIndicator({
  featureId,
  children = () => null,
}: Props) {
  // Cais has no paid edition: never advertise one, only report whether the
  // feature is unavailable so callers can hide it.
  const { limitedToBE = false } = getFeatureDetails(featureId);

  return <>{children(limitedToBE)}</>;
}
