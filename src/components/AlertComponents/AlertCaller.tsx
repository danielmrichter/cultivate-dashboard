import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import WarningSnackbar from "./WarningSnackbar";
import AlertModal from "./AlertModal";
import { useEffect } from "react";
import useInterval from "../../hooks/useInterval";

export default function AlertCaller() {
  const dispatch = useAppDispatch();
  useInterval(() => dispatch({ type: "GET_UNSEEN_ALERTS" }));
  useEffect(() => {
    dispatch({ type: "GET_UNSEEN_ALERTS" });
  }, []);

  const unseenAlerts = useAppSelector((store) => store.alerts.unseenAlerts);
  return (
    <>
      {unseenAlerts[0] &&
        unseenAlerts.map((alert) => {
          if (alert.temperature >= 43) {
            return <AlertModal alert={alert} />;
          } else if (alert.temperature >= 40) {
            return <WarningSnackbar alert={alert} />;
          }
        })}
    </>
  );
}
