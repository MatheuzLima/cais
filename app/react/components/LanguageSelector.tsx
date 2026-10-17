import { useTranslation } from 'react-i18next';

import {
  getCurrentLanguage,
  LANGUAGE_STORAGE_KEY,
  supportedLanguages,
} from '@/i18n';

import {
  SegmentItem,
  SegmentedControl,
} from '@@/form-components/SegmentedControl';

const languageItems: SegmentItem[] = supportedLanguages.map((language) => ({
  id: language.id,
  label: language.shortLabel,
  title: language.label,
}));

export function LanguageSelector({ className }: { className?: string }) {
  const { t, i18n } = useTranslation();

  async function handleLanguageSelect(id: string) {
    if (id === getCurrentLanguage()) {
      return;
    }

    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, id);
    } catch {
      // storage may be unavailable (private mode); changeLanguage still applies for this page
    }
    await i18n.changeLanguage(id);
    // AngularJS templates translate once at render time, so reload to re-render every view
    window.location.reload();
  }

  return (
    <SegmentedControl
      label={t('Language')}
      items={languageItems}
      activeId={getCurrentLanguage()}
      onChange={handleLanguageSelect}
      size="md"
      className={className}
    />
  );
}
