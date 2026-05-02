import React from "react";
import { DASHBOARD_URL } from "../dashboardUrl";

function Signup() {
  React.useEffect(() => {
    window.location.replace(`${DASHBOARD_URL}/login`);
  }, []);

  return <h1>Redirecting to login...</h1>;
}

export default Signup;
