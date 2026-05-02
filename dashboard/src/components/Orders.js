import React, { useContext, useEffect, useState } from "react";
import axios from "axios";

import { API_URL } from "../api";
import GeneralContext from "./GeneralContext";
import { useAuth } from "../hooks/useAuth";

const Orders = () => {
  const [allOrders, SetAllOrders] = useState([]);
  const [error, setError] = useState("");
  let { user } = useAuth();
  const { ordersVersion } = useContext(GeneralContext);

  useEffect(() => {
    axios
      .get(`${API_URL}/orders/index`, {
        headers: {
          Authorization: user,
        },
      })
      .then((res) => {
        SetAllOrders(res.data);
        setError("");
      })
      .catch((error) => {
        setError(error.response?.data?.error || "Unable to load orders");
      });
  }, [user, ordersVersion]);

  return (
    <>
      <h3 className="title">Orders ({allOrders.length})</h3>
      {error ? <p className="loss">{error}</p> : null}

      <div className="order-table">
        <table>
          <tr>
            <th>Name</th>
            <th>Qty.</th>
            <th>Price</th>
            <th>Mode</th>
          </tr>

          {allOrders.map((stock, index) => {
            return (
              <tr key={index}>
                <td>{stock.name}</td>
                <td>{stock.qty}</td>
                <td>{stock.price.toFixed(2)}</td>
                <td>{stock.mode}</td>
              </tr>
            );
          })}
        </table>
      </div>
    </>
  );
};

export default Orders;
