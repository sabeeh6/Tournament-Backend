import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import path from "path";
import { fileURLToPath } from "url";

// ✅ Custom console format (for terminal with colors)
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(({ timestamp, level, message, caller, ...meta }) => {
    let msg = `${timestamp} [${level}]`;
    
    if (caller) {
      msg += ` [${caller}]`;
    }
    
    msg += `: ${message}`;
    
    // Add metadata if present
    const metaKeys = Object.keys(meta).filter(key => 
      !['timestamp', 'level', 'message', 'caller'].includes(key)
    );
    if (metaKeys.length > 0) {
      msg += ` ${JSON.stringify(meta)}`;
    }
    
    return msg;
  })
)
// ✅ File log format (detailed with full path)
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(({ timestamp, level, message, caller, ...meta }) => {
    let msg = `${timestamp} [${level}]`;
    
    if (caller) {
      msg += ` [${caller}]`;
    }
    
    msg += `: ${message}`;
    
    // Add metadata if present
    const metaKeys = Object.keys(meta).filter(key => 
      !['timestamp', 'level', 'message', 'caller'].includes(key)
    );
    if (metaKeys.length > 0) {
      msg += ` ${JSON.stringify(meta)}`;
    }
    
    return msg;
  })
)
// ✅ Rotating log files
const allLogs = new DailyRotateFile({
  filename: "logs/app-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  maxSize: "20m",
  maxFiles: "14d",
  format: fileFormat,
})
const errorLogs = new DailyRotateFile({
  filename: "logs/error-%DATE%.log",
  level: "error",
  datePattern: "YYYY-MM-DD",
  maxSize: "20m",
  maxFiles: "30d",
  format: fileFormat,
})
// ✅ Base Winston Logger instance
const baseLogger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  transports: [allLogs, errorLogs],
  exceptionHandlers: [
    new DailyRotateFile({
      filename: "logs/exceptions-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      maxSize: "20m",
      maxFiles: "30d",
      format: fileFormat,
    }),
  ],
  rejectionHandlers: [
    new DailyRotateFile({
      filename: "logs/rejections-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      maxSize: "20m",
      maxFiles: "30d",
      format: fileFormat,
    }),
  ],
})
// ✅ Console logs only in development
if (process.env.NODE_ENV !== "production") {
  baseLogger.add(
    new winston.transports.Console({
      format: consoleFormat,
    })
  );
}
// ✅ Function to get caller info BEFORE winston is called
const getCallerInfo = () => {
  try {
    const stack = new Error().stack;
    if (!stack) return 'unknown:0';

    const lines = stack.split('\n');
    
    // Look for the first line that contains actual file (not logger.js, not node_modules)
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Skip internal stuff
      if (line.includes('logger.js') || 
          line.includes('node_modules') ||
          line.includes('node:internal') ||
          line.includes('node:events')) {
        continue;
      }

      // Try to extract file info
      // Pattern for file:/// URLs
      let match = line.match(/file:\/\/\/([^)]+):(\d+):(\d+)/);
      if (match) {
        let filePath = match[1];
        const lineNumber = match[2];
        
        // Decode URL encoding (%20 -> space)
        filePath = decodeURIComponent(filePath);
        
        // Get just filename
        const fileName = path.basename(filePath);
        
        return `${fileName}:${lineNumber}`;
      }
      
      // Pattern for Windows paths (D:\path\file.js:line:col)
      match = line.match(/\(([A-Z]:[^)]+):(\d+):(\d+)\)/);
      if (match) {
        const filePath = match[1];
        const lineNumber = match[2];
        const fileName = path.basename(filePath);
        
        return `${fileName}:${lineNumber}`;
      }
      
      // Pattern for relative paths
      match = line.match(/at .+ \((.+):(\d+):(\d+)\)/);
      if (match) {
        const filePath = match[1];
        const lineNumber = match[2];
        
        if (!filePath.includes('node_modules')) {
          const fileName = path.basename(filePath);
          return `${fileName}:${lineNumber}`;
        }
      }
    }
    
    return 'unknown:0';
  } catch (error) {
    return 'unknown:0';
  }
}
// ✅ Wrapper Logger - Ye caller info capture karega
const logger = {
  info: (message, meta = {}) => {
    const caller = getCallerInfo();
    baseLogger.info(message, { ...meta, caller });
  },
  
  error: (message, meta = {}) => {
    const caller = getCallerInfo();
    baseLogger.error(message, { ...meta, caller });
  },
  
  warn: (message, meta = {}) => {
    const caller = getCallerInfo();
    baseLogger.warn(message, { ...meta, caller });
  },
  
  debug: (message, meta = {}) => {
    const caller = getCallerInfo();
    baseLogger.debug(message, { ...meta, caller });
  },
  
  verbose: (message, meta = {}) => {
    const caller = getCallerInfo();
    baseLogger.verbose(message, { ...meta, caller });
  },
  
  silly: (message, meta = {}) => {
    const caller = getCallerInfo();
    baseLogger.silly(message, { ...meta, caller });
  },
}
export default logger;
