import { useSelector } from "react-redux";
import { Redirect, Route } from "react-router-dom/cjs/react-router-dom";

function RedirectComponent({ ...props }) {
  const user = useSelector((store) => store.user);

  // We return a Route component that gets added to our list of routes
  return (
    <Route
      // all props like 'exact' and 'path' that were passed in
      // are now passed along to the 'Route' Component
      {...props}
    >
      {user.access_level > 1 ? (
        <Redirect to="/admin" />
        
      ) : user.id ? (
        <Redirect to={`/site/${user.site_id}`} />
      ) : (
        <Redirect to="/login" />
      )}
    </Route>
  );
}

export default RedirectComponent;
