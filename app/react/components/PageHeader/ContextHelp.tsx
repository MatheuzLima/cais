import { HelpCircle } from 'lucide-react';
import clsx from 'clsx';

import { REPOSITORY_URL } from '@/branding';

import headerStyles from './HeaderTitle.module.css';

export function ContextHelp() {
  const docsUrl = useDocsUrl();

  return (
    <div className={headerStyles.menuButton}>
      <a
        href={docsUrl}
        target="_blank"
        color="none"
        className={clsx(
          headerStyles.menuIcon,
          'icon-badge mr-1 cursor-pointer !p-2 text-lg',
          'text-gray-8',
          'th-dark:text-gray-warm-7'
        )}
        title="Documentation"
        rel="noreferrer"
        data-cy="context-help-button"
      >
        <HelpCircle className="lucide" />
      </a>
    </div>
  );
}

/**
 * Upstream links every page to its own documentation site. Cais points help
 * links to the project repository instead; `doc` is kept so callers that
 * reference a specific upstream page keep compiling.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function useDocsUrl(doc?: string): string {
  return REPOSITORY_URL;
}
