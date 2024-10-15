import { CircularProgress, Container, Grid2 } from "@mui/material";
import { useAppSelector } from "../../hooks/reduxHooks";
import SiteCard from "../CardComponents/SiteCard";
import { useEffect, useState } from "react";
import axios from "axios";
import useInterval from "../../hooks/useInterval";
import { useLocation } from "react-router-dom";

export default function AdminView() {
  const siteList = useAppSelector((store) => store.siteList);
  const location = useLocation();
  const [listOfSiteData, setListOfSiteData] = useState([]);

  const fetchSiteData = async () => {
    // Get the data for each site. This is overkill and a lot of
    // data, but this is how we're doing it right now.
    const allOfTheDataAboutEachSite = await Promise.all(
      siteList.map((site) => {
        return axios.get(`/api/beet_data/${site.id}`);
      })
    );
    // Now get the alerts for each site.
    const allOfTheAlertsForEachSite = await Promise.all(
      siteList.map((site) => {
        return axios.get(`/api/alerts/mini/${site.id}`);
      })
    );
    // Now, combine them together.
    // They use the same array to grab the data, so they should be
    // in the same order.
    const siteData = allOfTheDataAboutEachSite.map((site, i) => {
      return { site: site.data, alerts: allOfTheAlertsForEachSite[i].data };
    });
    setListOfSiteData(siteData);
  };
  // Look, this is gross. I know. This hits already existing routes,
  // but because of the rigid data structure, this is the only
  // way to break the data into manageable chunks for each SiteCard.
  // Without having to redo our entire data structure.
  // It's broken into a function like this because useEffect doesn't
  // like having promises to resolve in it's callback.
  // This should probably done in suspense, but I don't know enough
  // about it to do it in this project.

  // More info: https://stackoverflow.com/questions/53332321/react-hook-warnings-for-async-function-in-useeffect-useeffect-function-must-ret
  useEffect(() => {
    fetchSiteData();
  }, [siteList]);

  useInterval(fetchSiteData, 300000);

  return (
    <>
      {listOfSiteData[0] ? (
        <Grid2 container margin={2} spacing={8}>
          {listOfSiteData.map((site, i) => {
            return (
              <SiteCard
                key={i}
                siteInfo={site.site}
                miniAlertData={site.alerts}
              />
            );
          })}
        </Grid2>
      ) : (
        <Container>
          <CircularProgress />
        </Container>
      )}
    </>
  );
}
