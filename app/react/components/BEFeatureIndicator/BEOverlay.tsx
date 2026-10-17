import { FeatureId } from '@/react/portainer/feature-flags/enums';
import { isLimitedToBE } from '@/react/portainer/feature-flags/feature-flags.service';

/**
 * Renders its children only when the feature is available in this edition.
 * Cais hides unavailable features instead of showing an upsell overlay.
 */
export function BEOverlay({
  featureId,
  children,
}: {
  featureId: FeatureId;
  children: React.ReactNode;
}) {
  if (isLimitedToBE(featureId)) {
    return null;
  }

  return <>{children}</>;
}
