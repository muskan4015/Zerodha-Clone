import React, { useContext, useEffect, useState } from "react";
import axios from "axios";

import { API_URL } from "../api";
import GeneralContext from "./GeneralContext";
import { VerticalGraph } from "./VerticalGraph";
import { useAuth } from "../hooks/useAuth";

const Holdings = () => {
  const [allHoldings, SetAllHoldings] = useState([]);
  const [error, setError] = useState("");
  let { user } = useAuth();
  const { holdingsVersion } = useContext(GeneralContext);

  useEffect(() => {
    axios
      .get(`${API_URL}/holdings/index`, {
        headers: {
          Authorization: user,
        },
      })
      .then((res) => {
        SetAllHoldings(res.data);
        setError("");
      })
      .catch((error) => {
        setError(error.response?.data?.error || "Unable to load holdings");
      });
  }, [user, holdingsVersion]);

  const labels = allHoldings.map((subArray) => subArray["name"]);

  const data = {
    labels,
    datasets: [
      {
        label: "Stock Price",
        data: allHoldings.map((stock) => stock.price),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  return (
    <>
      <h3 className="title">Holdings ({allHoldings.length})</h3>
      {error ? <p className="loss">{error}</p> : null}

      <div className="order-table">
        <table>
          <tr>
            <th>Instrument</th>
            <th>Qty.</th>
            <th>Avg. cost</th>
            <th>LTP</th>
            <th>Cur. val</th>
            <th>P&L</th>
            <th>Net chg.</th>
            <th>Day chg.</th>
          </tr>

          {allHoldings.map((stock, index) => {
            const currValue = stock.price * stock.qty;
            const isProfit = currValue - stock.avg * stock.qty >= 0.0;
            const profClass = isProfit ? "profit" : "loss";
            const dayClass = stock.isLoss ? "loss" : "profit";

            return (
              <tr key={index}>
                <td>{stock.name}</td>
                <td>{stock.qty}</td>
                <td>{stock.avg.toFixed(2)}</td>
                <td>{stock.price.toFixed(2)}</td>
                <td>{currValue}</td>
                <td className={profClass}>{(currValue - stock.avg * stock.qty).toFixed(2)}</td>
                <td className={profClass}>{stock.net}</td>
                <td className={dayClass}>{stock.day}</td>
              </tr>
            );
          })}
        </table>
      </div>

      <div className="row">
        <div className="col">
          <h5>
            29,875.<span>55</span>{" "}
          </h5>
          <p>Total investment</p>
        </div>
        <div className="col">
          <h5>
            31,428.<span>95</span>{" "}
          </h5>
          <p>Current value</p>
        </div>
        <div className="col">
          <h5>1,553.40 (+5.20%)</h5>
          <p>P&L</p>
        </div>
      </div>
      <VerticalGraph data={data} />
    </>
  );
};

export default Holdings;
