import { useTranslation } from 'react-i18next';
import { LayoutGrid } from 'lucide-react';

export function EnvironmentGroupName({ groupName }: { groupName?: string }) {
  const { t } = useTranslation();

  return (
    <span className="small text-muted vertical-center">
      <LayoutGrid aria-hidden="true" className="icon icon-xs" /> {t('Group:')}{' '}
      {/* group names are user data; only the built-in placeholder has a translation */}
      {t(groupName || 'Unassigned')}
    </span>
  );
}
