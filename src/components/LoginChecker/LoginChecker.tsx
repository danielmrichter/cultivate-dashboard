import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

export default function LoginChecker({ children }) {
  // Check if user is logged in
  // If they are, send them where they came from.
  // If they aren't, then we gotta do some shit.
  const navigate = useNavigate();
  const location = useLocation();
  const origin = location.state?.from?.pathname;
  const user = useSelector((store) => store.user);
  if (user.id) {
    origin
      ? navigate(origin)
      : navigate('/user');
  }
  return children;
}
