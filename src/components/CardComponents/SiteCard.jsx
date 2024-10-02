import { Paper, Box } from "@mui/material";
import { useSelector } from "react-redux";
import MiniAlert from "../AlertComponents/MiniAlert";

export default function SiteCard (props) {
  const siteInfo = useSelector(store => store.site);
  const alertData = useSelector(store => store.alerts);

  const avgTempOfSite = () => {
    const totalTemp = siteInfo.pilers.reduce((sum, piler) => {
      const lastAvgTemp = piler.monthAvgDaily.at(-1).avgTempOfEachDay;
      return sum + lastAvgTemp;
    }, 0);

    return Math.round(totalTemp / siteInfo.pilers.length);
  };

  const xTranslate = () => {
    let translateAngle = 0;
    const avgTemp = avgTempOfSite();

    if (avgTemp < 39 && avgTemp >= 34) {
      translateAngle = -11
    } else if (avgTemp >= 39 && avgTemp < 42) {
      translateAngle = -25
    } else if (avgTemp > 42) {
      translateAngle = -27
    } else {
       translateAngle = 0
    }
    return translateAngle;
  }

  const yTranslate = () => {
    let translateAngle = 0;
    const avgTemp = avgTempOfSite();

    if (avgTemp < 39 && avgTemp >= 34) {
      translateAngle = 25
    } else if (avgTemp >= 39 && avgTemp < 42) {
      translateAngle = 15
    } else if (avgTemp > 42) {
      translateAngle = -23
    } else {
       translateAngle = 0
    }
    return translateAngle;
  }


  const rotationAngle = () => {
    let rotAngle = 0;
    const avgTemp = avgTempOfSite();

    if (avgTemp < 39 && avgTemp >= 34) {
      rotAngle = 60
    } else if (avgTemp >= 39 && avgTemp < 42) {
      rotAngle = 120
    } else if (avgTemp > 42) {
      rotAngle = 180
    } else {
       rotAngle = 0
    }
    return rotAngle;
  }

  return (
    <Paper
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
      <img src="/radial-image.png" alt="Radial background" style={{ position: 'relative' }} />
      
      <Box
        sx={{
          position: "absolute",
          top: "13%",
          left: "33%",
          transform: `translate(${xTranslate()}%, ${yTranslate()}%) rotate(${rotationAngle()}deg)`,
          transformOrigin: "right center",
        }}
      >
        <img src="/Arrow.png" alt="Temperature arrow" />
      </Box>

      <h3>{avgTempOfSite()}&deg;F</h3>
      <h3>Active Site Alerts</h3>
      {alertData.length > 0 ? (
        alertData.map((alert) => <MiniAlert key={alert.id} alert={alert} />)
      ) : (
        <div>No active alerts</div>
      )}
    </Paper>
  );
}
