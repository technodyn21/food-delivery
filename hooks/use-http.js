import { useState, useCallback } from "react";

const useHttp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [hasMessage, setHasMessage] = useState(false);
  console.log('check');


  const sendRequest = useCallback(async (requestConfig, applyData) => {
    let okmessage;
    setIsLoading(true);
    setHasError(null);
    setHasMessage(requestConfig.loading);
    try {
      const response = await fetch(requestConfig.url, {
        method: requestConfig.method ? requestConfig.method : "GET",
        headers: requestConfig.headers ? requestConfig.headers : {},
        body: requestConfig.body ? JSON.stringify(requestConfig.body) : null,
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(
          (requestConfig.error !== undefined
            ? requestConfig.error
            : "Anmeldung fehlgeschlagen: (") +
            data.error.code +
            ") " +
            data.error.message
        );
      }
      const data = await response.json();
      okmessage = applyData(data);
      if (okmessage !== undefined) {
        setHasMessage(okmessage);
        requestConfig.delayMsg &&
          setTimeout(() => {
            setHasMessage("");
          }, requestConfig.delayMsg);
      }
    } catch (err) {
      // alert(err.message);
      setHasMessage(err.message);
      requestConfig.delayMsg &&
        setTimeout(() => {
          setHasMessage("");
        }, requestConfig.delayMsg);
    }
    setIsLoading(false);
  }, []);

  return {
    isLoading,
    hasError,
    sendRequest,
    setHasError,
    setIsLoading,
    hasMessage,
    setHasMessage,
  };
};

export default useHttp;
