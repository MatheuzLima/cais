import { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';

export function PageTitle({
  title,
  children,
}: PropsWithChildren<{ title: string }>) {
  const { t } = useTranslation();

  return (
    <div className="mx-4 mb-2 flex items-center gap-2">
      <h1
        className="m-0 text-lg font-medium text-gray-11 th-highcontrast:text-white th-dark:text-white"
        data-cy="page-title"
      >
        {t(title)}
      </h1>
      {children}
    </div>
  );
}
