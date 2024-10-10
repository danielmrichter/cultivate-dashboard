import { useAppSelector } from "../../hooks/reduxHooks";
import BaseNav from "../Nav/BaseNav";
import SiteManagerNav from "../Nav/SiteManagerNav";
import GenManagerNav from "../Nav/GenManagerNav";


function Header() {
  const user = useAppSelector((store) => store.user);

  return (
    <div>
      {/* If no user is logged in, only show title */}
      {!user.id && <BaseNav />}

      {/* If Site Manger is logged in */}
      {user.id && user.access_level === 1 && <SiteManagerNav />}

      {/* If General Manger is logged in */}
      {user.id && user.access_level === 2 && (
        <div>
          <GenManagerNav />
        </div>
      )}
    </div>
  );
}

export default Header;
