import { useDispatch, useSelector } from "react-redux";
import WarningSnackbar from "./WarningSnackbar";
import AlertModal from "./AlertModal";
import { useEffect } from "react";

export default function AlertCaller() {
  const dispatch = useDispatch();
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
