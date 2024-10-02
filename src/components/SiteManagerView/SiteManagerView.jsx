import { Box, Paper } from "@mui/material";
import SiteCard from "../CardComponents/SiteCard";
import PilerCard from "../CardComponents/PilerCard";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";

export default function SiteManagerView () {
  const dispatch = useDispatch();
  const user = useSelector(store => store.user)
  useEffect(() => {
    console.log('user site id is:', user.site_id)
    dispatch({type: 'FETCH_SITE', payload: 1 })
  }, [])
  const siteData = useSelector(store => store.site)
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 2
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          justifyContent: 'center',
          flex: 1,
        }}
      >
        {siteData && siteData.pilers && siteData.pilers.length > 0 ? (
  siteData.pilers.map((piler) => (
    <PilerCard key={piler.piler_id} data={piler} />
  ))
) : (
  <div></div>
)}

      </Box>
      <Box sx={{ flex: '0 1 250px', marginLeft: 2 }}>
        <SiteCard />
      </Box>
    </Box>
  );
}
