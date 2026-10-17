import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { DownloadCloud } from 'lucide-react';

import { useUIState } from '@/react/hooks/useUIState';
import { useSystemVersion } from '@/react/portainer/system/useSystemVersion';
import { UPSTREAM_NAME, UPSTREAM_URL } from '@/branding';

import { Icon } from '@@/Icon';

import styles from './UpdateNotifications.module.css';

export function UpdateNotification() {
  const uiStateStore = useUIState();
  const query = useSystemVersion();
  const { t } = useTranslation();

  if (!query.data || !query.data.UpdateAvailable) {
    return null;
  }

  const { LatestVersion } = query.data;

  if (
    !!uiStateStore.dismissedUpdateVersion &&
    LatestVersion?.length > 0 &&
    uiStateStore.dismissedUpdateVersion === LatestVersion
  ) {
    return null;
  }

  return (
    <div
      className={clsx(
        styles.root,
        'rounded border py-2',
        'bg-blue-11 th-dark:bg-gray-warm-11',
        'border-blue-9 th-dark:border-gray-warm-9'
      )}
    >
      <div className={clsx(styles.dismissTitle, 'vertical-center')}>
        <Icon icon={DownloadCloud} mode="primary" size="md" />
        <span className="space-left">
          {/* the version check tracks upstream releases, which this fork can merge */}
          {t('New {{upstream}} release available: {{version}}', {
            upstream: UPSTREAM_NAME,
            version: LatestVersion,
          })}
        </span>
      </div>

      <div className={clsx(styles.actions)}>
        <button
          type="button"
          className={clsx(styles.dismissBtn, 'space-right')}
          onClick={() => onDismiss(LatestVersion)}
        >
          {t('Dismiss')}
        </button>
        <a
          className="hyperlink space-left"
          target="_blank"
          href={`${UPSTREAM_URL}/releases/tag/${LatestVersion}`}
          rel="noreferrer"
        >
          {t("See what's new")}
        </a>
      </div>
    </div>
  );

  function onDismiss(version: string) {
    uiStateStore.dismissUpdateVersion(version);
  }
}
