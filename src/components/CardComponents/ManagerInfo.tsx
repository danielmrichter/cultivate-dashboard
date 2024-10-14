import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../hooks/reduxHooks";
import { useEffect, useState } from "react";


export default function ManagerInfo({ siteId }) {
  const dispatch = useDispatch();
  const siteManager = useAppSelector(store => store.siteManager)
  const [managerPhone, setManagerPhone] = useState();

  useEffect(() => {
        dispatch({ type: "SITE_MANAGER_INFO", payload: siteId})
      },[]);

const phoneFormat = (phoneString) => {
      const newPhoneFormat = phoneString.replace(
        /(\d{3})(\d{3})(\d{4})/,
        "($1)-$2-$3"
      )
      
    return newPhoneFormat
    }

  


  return (
    <div>
      {siteManager.length > 0 ? 
        siteManager.map((manager) => {
        return(
           <h3 key={manager.id}> {manager.fullname} {'   '} {phoneFormat(manager.phone)} </h3>
        )})
        :('no manager')
    }
    </div>
  );
}
  
