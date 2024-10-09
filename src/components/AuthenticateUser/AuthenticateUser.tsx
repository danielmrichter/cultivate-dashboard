import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

export default function AuthenticateUser({ component }) {
  // First, check if we've fetched the user
  const isFetchingUser = useSelector((store) => store.isFetchingUser);
  // If we have, it'll be in the store...
  const user = useSelector((store) => store.user);
  // The component to render if the user is logged in.
  const ProtectedComponent = component;
  // grab the current location, and stick it into state.
  const location = useLocation()
  return (
    <>
      {!isFetchingUser && user.id ? (
        <ProtectedComponent />
      ) : (
        <Navigate to="/login" replace state={{from: location}}/>
      )}
    </>
  );
}
