import { useDispatch, useSelector } from "react-redux";
import WarningSnackbar from "./WarningSnackbar";
import AlertModal from "./AlertModal";
import { useEffect } from "react";
import useInterval from "../../hooks/useInterval";

export default function AlertCaller() {
  const dispatch = useDispatch();
  useInterval(() => dispatch({ type: "GET_UNSEEN_ALERTS" }), 300000);
  useEffect(() => {
    dispatch({ type: "GET_UNSEEN_ALERTS" });
  }, []);

  const unseenAlerts = useSelector((store) => store.alerts.unseenAlerts);
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
