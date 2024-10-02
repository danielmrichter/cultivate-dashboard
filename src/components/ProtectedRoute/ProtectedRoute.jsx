import { useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Redirect,
  Route,
  useLocation,
} from "react-router-dom/cjs/react-router-dom";

function ProtectedRoute({ component, children, ...props }) {
  const user = useSelector((store) => store.user);

  // Component may be passed in as a "component" prop,
  // or as a child component.
  const ProtectedComponent = component || (() => children);

  const { pathname } = useLocation();

  const id = pathname.split('/')[2]

  // We return a Route component that gets added to our list of routes
  return (
    <Route
      // all props like 'exact' and 'path' that were passed in
      // are now passed along to the 'Route' Component
      {...props}
    >
      {user.access_level > 1 ? (
        <ProtectedComponent />
      ) : user.site_id === Number(id) ? (
        <ProtectedComponent />
      ) : user.id ? (
        <Redirect to={`/site/${user.site_id}`} />
      ) : (
        <Redirect to="/login" />
      )}
    </Route>
  );
}

export default ProtectedRoute;
