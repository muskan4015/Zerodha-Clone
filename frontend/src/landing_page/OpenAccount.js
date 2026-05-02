import React from "react";
import { DASHBOARD_URL } from "./dashboardUrl";

function OpenAccount() {
  return (
    <div className="container p-5 mb-5">
      <div className="row text-center">
        <h1 className="mt-5 mb-4">Open a Zerodha account</h1>
        <p className="mb-4">Modern platforms and apps, ₹0 investments, and flat ₹20 intraday and F&O trades.</p>
        <a href={`${DASHBOARD_URL}/login`} style={{ width: "20%", margin: "0 auto" }} className="p-2 btn btn-primary fs-5">
          Sign up now
        </a>
      </div>
    </div>
  );
}

export default OpenAccount;
