import { ErrorView } from './ErrorView';
import { getErrorConfig } from '../errors/errorMessages';

interface ErrorPageProps {
  errorCode?: number | string;
  error?: Error;
  resetError?: () => void;
  showActions?: boolean;
  customTitle?: string;
  customMessage?: string;
}

/**
 * ErrorPage component - Wrapper around ErrorView with preset error messages
 * Use this for standardized error pages (404, 500, etc.)
 */
export function ErrorPage({ 
  errorCode, 
  error, 
  resetError, 
  showActions = true,
  customTitle,
  customMessage 
}: ErrorPageProps) {
  // If custom title/message provided, use those
  if (customTitle || customMessage) {
    return (
      <ErrorView
        error={error}
        resetError={resetError}
        showActions={showActions}
        title={customTitle}
        message={customMessage}
      />
    );
  }

  // Otherwise, get config from error code or error object
  const config = getErrorConfig(errorCode || error || 'unknown');

  return (
    <ErrorView
      error={error}
      resetError={resetError}
      showActions={showActions}
      title={config.title}
      message={config.message}
    />
  );
}
