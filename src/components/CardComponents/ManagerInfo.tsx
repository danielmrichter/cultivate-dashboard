import { useEffect, useState } from "react";
import axios from "axios";

export default function ManagerInfo({ siteId }) {
  const [siteManager, setSiteManager] = useState([]);

  useEffect(() => {
    fetchSiteManager();
  }, [siteId]);

  const fetchSiteManager = () => {
    axios
      .get(`/api/siteList/siteManager/${siteId}`)
      .then((response) => {
        setSiteManager(response.data);
      })
      .catch((error) => {
        console.log("error getting site manager details", error);
      });
  };
  const phoneFormat = (phoneString) => {
    const newPhoneFormat = phoneString.replace(
      /(\d{3})(\d{3})(\d{4})/,
      "($1)-$2-$3"
    );

    return newPhoneFormat;
  };

  return (
    <div>
      {siteManager.length > 0
        ? siteManager.map((manager) => {
            return (
              <h3 key={manager.id}>
                {" "}
                <span>{manager.fullname}</span>
                <span style={{ marginLeft: "15px" }}>
                  {phoneFormat(manager.phone)}
                </span>
              </h3>
            );
          })
        : "no manager"}
    </div>
  );
}
