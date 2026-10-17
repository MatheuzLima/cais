import { PropsWithChildren } from 'react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { isBE } from '@/react/portainer/feature-flags/feature-flags.service';
import { APP_NAME, UPSTREAM_NAME, UPSTREAM_URL } from '@/branding';

import { UpdateNotification } from './UpdateNotifications';
import { BuildInfoModalButton } from './BuildInfoModal';
import '@reach/dialog/styles.css';
import styles from './Footer.module.css';

export function Footer() {
  return isBE ? <BEFooter /> : <CEFooter />;
}

function CEFooter() {
  const { t } = useTranslation();

  return (
    <div className={clsx(styles.root, 'text-center')}>
      <UpdateNotification />

      <FooterContent>
        <span>{APP_NAME}</span>

        <BuildInfoModalButton />
      </FooterContent>
      {/* zlib license: altered versions must be plainly marked as such */}
      <FooterContent>
        <span>{t('Based on')}</span>
        <a
          href={UPSTREAM_URL}
          target="_blank"
          rel="noreferrer"
          className="!text-inherit hover:underline"
        >
          {UPSTREAM_NAME}
        </a>
      </FooterContent>
    </div>
  );
}

function BEFooter() {
  return (
    <div className={clsx(styles.root, 'text-center')}>
      <FooterContent>
        <span>&copy;</span>
        <span>Portainer Business Edition</span>

        <BuildInfoModalButton />
      </FooterContent>
    </div>
  );
}

function FooterContent({ children }: PropsWithChildren<unknown>) {
  return (
    <div className="mx-auto flex items-baseline justify-center space-x-1 text-[10px] text-gray-5 be:text-gray-6">
      {children}
    </div>
  );
}
