import { performance } from 'perf_hooks';

export const performanceMiddleware = (req, res, next) => {
  const start = performance.now();
  
  // Add response time to headers
  res.on('finish', () => {
    const duration = performance.now() - start;
    
    // Log slow requests (> 1000ms)
    if (duration > 1000) {
      console.warn(`🐌 Slow API call: ${req.method} ${req.path} - ${duration.toFixed(2)}ms`);
    }
  });
  
  next();
};

export const requestLogger = (req, res, next) => {
  const start = performance.now();
  
  res.on('finish', () => {
    const duration = performance.now() - start;
    const status = res.statusCode;
    const method = req.method;
    const path = req.path;
    
    const color = status >= 400 ? '\x1b[31m' : status >= 300 ? '\x1b[33m' : '\x1b[32m';
    const reset = '\x1b[0m';
    
    console.log(`${color}${method}${reset} ${path} - ${status} (${duration.toFixed(2)}ms)`);
  });
  
  next();
}; 