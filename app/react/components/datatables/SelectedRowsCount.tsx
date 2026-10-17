import { useTranslation } from 'react-i18next';

interface SelectedRowsCountProps {
  value: number;
  hidden: number;
}

export function SelectedRowsCount({ value, hidden }: SelectedRowsCountProps) {
  const { t } = useTranslation();

  return value !== 0 ? (
    <div className="infoBar">
      {t(value === 1 ? '{{count}} item selected' : '{{count}} items selected', {
        count: value,
      })}
      {hidden !== 0 &&
        ` ${t('({{count}} hidden by filters)', { count: hidden })}`}
    </div>
  ) : null;
}
