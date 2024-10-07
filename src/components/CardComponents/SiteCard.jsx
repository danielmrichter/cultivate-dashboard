import { Paper, Button } from "@mui/material";
import { useSelector } from "react-redux";
import MiniAlert from "../AlertComponents/MiniAlert";
import Dial from "./Dial";
import { useHistory } from "react-router-dom/cjs/react-router-dom";

export default function SiteCard (props) {
  const siteInfo = useSelector(store => store.site);
  const miniAlertData = useSelector(store => store.alerts.miniAlerts);
const history = useHistory();

  const avgTempOfSite = () => {
    const totalTemp = siteInfo.pilers.reduce((sum, piler) => {
      const lastAvgTemp = piler.monthAvgDaily.at(-1).avgTempOfEachDay;
      return sum + lastAvgTemp;
    }, 0);

    return Math.round(totalTemp / siteInfo.pilers.length);
  };

  const handleButtonClick = () => {
    history.push(`/alert-history/${siteInfo.site_id}`)
  }

  return (
    <Paper
    key={siteInfo.id}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "300px",
        padding: "16px",
        gap: "16px",
        position: "relative"
      }}
    >
      <h2>Average Temp at Site</h2>
      <Dial avgTempOfSite={avgTempOfSite} />
      <h3>{avgTempOfSite()}&deg;F</h3>
      <h3>Active Site Alerts</h3>
      {miniAlertData.length > 0 ? (
        miniAlertData.map((alert) => <MiniAlert key={alert.id} alert={alert} />)
      ) : (
        <div>No active alerts</div>
      )}
      <Button 
      variant="contained" 
      sx={{ borderRadius: "30px" }}
      onClick={()=> handleButtonClick()}
      >
        Alert History
      </Button>
    </Paper>
  );
}
