import { useAppDispatch } from "../../../hooks/reduxHooks";
import { useNavigate } from "react-router-dom";

function LogOutButton(props) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  return (
    <button
      // This button shows up in multiple locations and is styled differently
      // because it's styled differently depending on where it is used, the className
      // is passed to it from it's parents through React props
      className={props.className}
      onClick={() => {
        dispatch({ type: "LOGOUT" });
        navigate("/login", { replace: true, state: {} });
      }}
    >
      Log Out
    </button>
  );
}

export default LogOutButton;
