// Performance monitoring utility
class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.startTimes = new Map();
  }

  startTimer(name) {
    this.startTimes.set(name, performance.now());
  }

  endTimer(name) {
    const startTime = this.startTimes.get(name);
    if (startTime) {
      const duration = performance.now() - startTime;
      this.metrics.set(name, duration);
      this.startTimes.delete(name);
      console.log(`⏱️ ${name}: ${duration.toFixed(2)}ms`);
      return duration;
    }
    return 0;
  }

  getMetrics() {
    return Object.fromEntries(this.metrics);
  }

  clearMetrics() {
    this.metrics.clear();
    this.startTimes.clear();
  }

  // Monitor API calls
  async monitorApiCall(name, apiCall) {
    this.startTimer(name);
    try {
      const result = await apiCall();
      this.endTimer(name);
      return result;
    } catch (error) {
      this.endTimer(name);
      throw error;
    }
  }

  // Monitor component render time
  monitorComponentRender(componentName, renderFunction) {
    this.startTimer(`${componentName}_render`);
    const result = renderFunction();
    this.endTimer(`${componentName}_render`);
    return result;
  }
}

export const performanceMonitor = new PerformanceMonitor();

// Hook for monitoring component performance
export const usePerformanceMonitor = (componentName) => {
  const startRender = () => {
    performanceMonitor.startTimer(`${componentName}_render`);
  };

  const endRender = () => {
    performanceMonitor.endTimer(`${componentName}_render`);
  };

  return { startRender, endRender };
}; 