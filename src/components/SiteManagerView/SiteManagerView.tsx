import { Box, Paper } from "@mui/material";
import SiteCard from "../CardComponents/SiteCard";
import PilerCard from "../CardComponents/PilerCard";
import { useAppSelector, useAppDispatch } from "../../hooks/reduxHooks";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import useInterval from "../../hooks/useInterval";

export default function SiteManagerView() {
  const dispatch = useAppDispatch();

  const { id } = useParams();

  const dataFetches = () => {
    dispatch({ type: "FETCH_SITE", payload: id });
    dispatch({ type: "FETCH_MINI_ALERTS", payload: id });
  }

  useEffect(() => {
    dataFetches()
  }, []);
  useInterval(dataFetches, 300000)
  const siteData = useAppSelector((store) => store.site);
  const alerts = useAppSelector((store) => store.alerts.miniAlerts);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        padding: 2,
      }}
    >
      <Box
  sx={{
    display: "flex",
    flexWrap: "wrap",
    gap: 3,
      justifyContent: "center",
      alignItems: "flex-start",
      flex: "0 1 auto",
      alignSelf: "flex-start",
  }}
>
  {siteData.pilers ? (
    siteData.pilers.map((piler) => (
      <PilerCard key={piler.piler_id} data={piler} />
    ))
  ) : (
    <div></div>
  )}
</Box>
      <Box sx={{ flex: "0 1 250px", marginLeft: 2 }}>
        {siteData.pilers ? (
          <SiteCard siteInfo={siteData} miniAlertData={alerts} />
        ) : (
          <div>No site Data</div>
        )}
      </Box>
    </Box>
  );
}
