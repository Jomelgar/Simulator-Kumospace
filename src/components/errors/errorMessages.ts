export interface ErrorConfig {
  title: string;
  message: string;
}

export const ERROR_MESSAGES: Record<number | string, ErrorConfig> = {
  // Client errors (4xx)
  400: {
    title: '400',
    message: "Bad request. The hive couldn't understand what you're asking for."
  },
  401: {
    title: '401',
    message: "Authentication required. Please sign in to access the hive."
  },
  403: {
    title: '403',
    message: "Access denied. Only authorized bees can enter this cell of the hive."
  },
  404: {
    title: '404',
    message: "The page you're looking for has flown away from the hive. Let's get you back to the colony."
  },
  408: {
    title: '408',
    message: "Request timeout. The hive took too long to respond. Please try again."
  },
  429: {
    title: '429',
    message: "Too many requests. The hive is busy. Please wait a moment before trying again."
  },

  // Server errors (5xx)
  500: {
    title: '500',
    message: "Internal server error. The hive is experiencing technical difficulties. Our Queen Bees are working on it!"
  },
  502: {
    title: '502',
    message: "Bad gateway. The hive's connection is having issues. Please try again in a moment."
  },
  503: {
    title: '503',
    message: "Service unavailable. The hive is temporarily down for maintenance. We'll be back soon!"
  },
  504: {
    title: '504',
    message: "Gateway timeout. The hive took too long to respond. Please try again."
  },

  // Generic errors
  network: {
    title: 'Network Error',
    message: "Can't connect to the hive. Check your internet connection and try again."
  },
  unknown: {
    title: 'Error',
    message: "Something unexpected happened in the hive. Please try again or contact support."
  },
  maintenance: {
    title: 'Maintenance',
    message: "The hive is currently under maintenance. Our bees are making improvements. Check back soon!"
  }
};

/**
 * Get error configuration by error code or type
 * @param errorCode - HTTP status code, error type string, or Error object
 * @returns ErrorConfig object with title and message
 */
export function getErrorConfig(errorCode: number | string | Error): ErrorConfig {
  // Handle Error objects
  if (errorCode instanceof Error) {
    return ERROR_MESSAGES.unknown;
  }

  // Handle numeric codes
  if (typeof errorCode === 'number' || !isNaN(Number(errorCode))) {
    const code = Number(errorCode);
    return ERROR_MESSAGES[code] || ERROR_MESSAGES.unknown;
  }

  // Handle string types
  return ERROR_MESSAGES[errorCode] || ERROR_MESSAGES.unknown;
}
