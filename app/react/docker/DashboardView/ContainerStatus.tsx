import { Heart, Power } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Icon } from '@/react/components/Icon';

interface Props {
  stats: {
    running: number;
    stopped: number;
    healthy: number;
    unhealthy: number;
  };
}

export function ContainerStatus({ stats }: Props) {
  const { t } = useTranslation();

  return (
    <div className="pull-right">
      <div>
        <div className="vertical-center space-right pr-5">
          <Icon icon={Power} mode="success" size="sm" />
          {t('{{count}} running', { count: stats.running })}
        </div>
        <div className="vertical-center space-right">
          <Icon icon={Power} mode="danger" size="sm" />
          {t('{{count}} stopped', { count: stats.stopped })}
        </div>
      </div>
      <div>
        <div className="vertical-center space-right pr-5">
          <Icon icon={Heart} mode="success" size="sm" />
          {t('{{count}} healthy', { count: stats.healthy })}
        </div>
        <div className="vertical-center space-right">
          <Icon icon={Heart} mode="danger" size="sm" />
          {t('{{count}} unhealthy', { count: stats.unhealthy })}
        </div>
      </div>
    </div>
  );
}
