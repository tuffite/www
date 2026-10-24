import { useState, useEffect, useRef } from 'react';
import { Check, Copy } from 'lucide-react';
import { useUiTranslation, type Locale } from '@/i18n';

export function CodeBlock({
  code,
  language = 'shell',
  locale,
}: {
  code: string;
  language?: string;
  locale: Locale;
}) {
  const { t } = useUiTranslation(locale);
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setFailed(false);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1800);
    } catch {
      setFailed(true);
    }
  }
  return (
    <div className="code-block">
      <div className="code-heading">
        <span>{language}</span>
        <button onClick={copy} aria-label={t('common.copy')}>
          {copied ? <Check size={14} /> : <Copy size={14} />}
          <span>
            {failed ? t('common.selectToCopy') : copied ? t('common.copied') : t('common.copy')}
          </span>
        </button>
      </div>
      <pre>
        <code>{code}</code>
      </pre>
      <span className="sr-only" role="status">
        {copied ? t('common.copied') : ''}
      </span>
    </div>
  );
}
