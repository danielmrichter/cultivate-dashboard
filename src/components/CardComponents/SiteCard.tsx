import { Paper, Button, Box } from "@mui/material";
import MiniAlert from "../AlertComponents/MiniAlert";
import Dial from "./Dial";
import { useNavigate, useLocation } from "react-router-dom";
import ManagerInfo from "./ManagerInfo";

export default function SiteCard({ siteInfo, miniAlertData }) {
  const navigate = useNavigate();
  const location = useLocation();

  const avgTempOfSite = () => {
    const totalTemp = siteInfo.pilers.reduce((sum, piler) => {
      const lastAvgTemp = piler.monthAvgDaily[0]
        ? piler.monthAvgDaily[piler.monthAvgDaily.length - 1].avgTempOfEachDay
        : 0;
      return sum + lastAvgTemp;
    }, 0);

    return Math.round(totalTemp / siteInfo.pilers.length);
  };

  const handleButtonClick = () => {
    navigate(`/alert-history/${siteInfo.site_id}`);
  };
  return (
    <Paper
      key={siteInfo.site_id}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "300px",
        padding: "16px",
        position: "relative",
      }}
    >
      {location.pathname === "/admin" && (
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              mb: 0,
              alignItems: "center",
            }}
          >
            <h2>{siteInfo.site_name}</h2>
            <Button
              variant="contained"
              size="small"
              sx={{ height: 25, minWidth: 40 }}
              onClick={() => navigate(`/site/${siteInfo.site_id}`)}
            >
              Site Details
            </Button>
          </Box>
        </>
      )}
      <h3>Average Temp at Site</h3>
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
        sx={{ borderRadius: "30px", mb: 3, mt: 2 }}
        onClick={() => handleButtonClick()}
      >
        Alert History
      </Button>
      {location.pathname === "/admin" && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          Site Manager Info:
          <ManagerInfo siteId={siteInfo.site_id} />
        </Box>
      )}
    </Paper>
  );
}
