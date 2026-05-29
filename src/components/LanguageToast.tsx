import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import { useNotification } from './NotificationProvider';
import { languages } from './LanguageSelector';

export default function LanguageToast() {
  const { t } = useTranslation();
  const { notify } = useNotification();

  useEffect(() => {
    const handleLanguageChanged = (lng: string) => {
      const label = languages.find((lang) => lang.code === lng)?.label ?? lng;
      notify(t('settings.languageChanged', { language: label }), 3500);
    };

    i18n.on('languageChanged', handleLanguageChanged);
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [notify, t]);

  return null;
}
