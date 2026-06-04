import { AlertCircle, AlertTriangle, Info, RefreshCw, X } from 'lucide-react';
import type { ErrorMessageProps, MessageSeverity } from '../../types';

const SEVERITY_ICON: Record<MessageSeverity, typeof AlertCircle> = {
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const SEVERITY_LABEL: Record<MessageSeverity, string> = {
  error: 'Error',
  warning: 'Warning',
  info: 'Information',
};

export default function ErrorMessage({
  children,
  title,
  variant = 'inline',
  severity = 'error',
  onRetry,
  onDismiss,
  className = '',
}: ErrorMessageProps) {
  const Icon = SEVERITY_ICON[severity];
  const isStatus = severity === 'info';
  const classes = ['ui-message', `ui-message--${variant}`, `ui-message--${severity}`, className]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={classes}
      role={isStatus ? 'status' : 'alert'}
      aria-live={isStatus ? 'polite' : 'assertive'}
    >
      <Icon className="ui-message__icon" aria-hidden="true" focusable="false" />

      <div className="ui-message__content">
        {title ? <p className="ui-message__title">{title}</p> : null}
        <div className="ui-message__body">{children}</div>

        {onRetry ? (
          <div className="ui-message__actions">
            <button type="button" className="ui-button ui-button--ghost" onClick={onRetry}>
              <RefreshCw size={16} aria-hidden="true" /> Try again
            </button>
          </div>
        ) : null}
      </div>

      {onDismiss ? (
        <button
          type="button"
          className="ui-message__dismiss"
          onClick={onDismiss}
          aria-label={`Dismiss ${SEVERITY_LABEL[severity].toLowerCase()}`}
        >
          <X size={16} aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
}
