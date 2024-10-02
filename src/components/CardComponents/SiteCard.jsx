import { Paper } from "@mui/material";
import { useSelector } from "react-redux";

export default function SiteCard (props) {
  const siteInfo = useSelector(store => store.site)
  console.log('site info is:', siteInfo)
  
  const avgTempOfSite = () => {
    const totalTemp = siteInfo.pilers.reduce((sum, piler) => {
      const lastAvgTemp = piler.monthAvgDaily.at(-1).avgTempOfEachDay;
      return sum + lastAvgTemp;
    }, 0);
  
    return Math.round(totalTemp / siteInfo.pilers.length);
  };
  

return (
    <Paper
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "300px",
        padding: "16px",
        gap: "16px"
      }}
    >
        <h2>Average Temp at Site</h2>
        <img src="/radial-image.png" ></img>
        <h3>{avgTempOfSite()}&deg;F</h3>
        <h3>Active Site Alerts</h3>
    </Paper>
)
}