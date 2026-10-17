import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { ReactNode } from 'react';
import { slugify } from 'markdown-to-jsx';

interface Props {
  children: ReactNode;
  label: ReactNode;
  colClassName?: string;
  className?: string;
  columns?: Array<ReactNode>;
  ariaLabel?: string;
}

export function DetailsRow({
  label,
  children,
  colClassName,
  className,
  columns,
  ariaLabel,
}: Props) {
  const { t } = useTranslation();
  // aria-label and data-cy keep the English label as a stable selector
  const labelString = typeof label === 'string' ? label : ariaLabel;
  return (
    <tr className={className} aria-label={labelString}>
      <td className={clsx(colClassName, '!break-normal')}>
        {typeof label === 'string' ? t(label) : label}
      </td>
      <td
        className={colClassName}
        data-cy={`detailsTable-${slugify(labelString || 'unlabelled')}Value`}
      >
        {children}
      </td>
      {columns?.map((column, index) => (
        <td key={index} className={colClassName}>
          {column}
        </td>
      ))}
    </tr>
  );
}
