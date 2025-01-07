export function logInfo(message, ...optionalParams) {
    console.log(`[INFO] ${new Date().toISOString()}: ${message}`, ...optionalParams);
  }
  
  export function logError(message, ...optionalParams) {
    console.error(`[ERROR] ${new Date().toISOString()}: ${message}`, ...optionalParams);
  }
  
  export function logWarn(message, ...optionalParams) {
    console.warn(`[WARN] ${new Date().toISOString()}: ${message}`, ...optionalParams);
  }
  