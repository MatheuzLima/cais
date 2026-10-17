import { useTranslation } from 'react-i18next';

import { APP_NAME } from '@/branding';

import { TextTip } from '@@/Tip/TextTip';

export function SetupTokenTextTip() {
  const { t } = useTranslation();

  return (
    <TextTip color="blue">
      {t(
        'Find this token in the {{name}} server logs (docker logs <container>).',
        {
          name: APP_NAME,
        }
      )}
    </TextTip>
  );
}
