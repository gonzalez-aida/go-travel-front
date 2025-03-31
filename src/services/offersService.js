export const fetchOffers = (callback) => {
    const eventSource = new EventSource("https://go-travel-back.onrender.com/sse/offerts");
  
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (Array.isArray(data)) {
        callback(data);
      }
    };
  
    eventSource.onerror = (error) => {
      console.error("Error en SSE:", error);
      eventSource.close();
    };
  
    return eventSource;
  };
  