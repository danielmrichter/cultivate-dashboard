import { useEffect } from "react";

const useInterval = (callback: Function, delay=300000) => {
    useEffect(() => {
      const intervalId = setInterval(callback, delay);
  return () => {
        clearInterval(intervalId);
      };
    }, [callback, delay]);
  };

export default useInterval