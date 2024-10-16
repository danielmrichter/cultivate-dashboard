import { useEffect } from "react";
// This is kind of a cool little trick you can do with a useEffect.
// This will set an interval on a delay (default 5 minutes), and then
// run that callback and clear its own interval. Since it's in a useEffect
// The return will run the cleanup and then it'll run itself again!
// This is what allows us to occasionally force a data fetch mostly, but
// can be used with any callback function you want to run on a delay.

const useInterval = (callback: Function, delay=300000) => {
    useEffect(() => {
      const intervalId = setInterval(callback, delay);
  return () => {
        clearInterval(intervalId);
      };
    }, [callback, delay]);
  };

export default useInterval