import React from "react";
import "./componentsCss/Table.css";
import CountUp from "react-countup";

function Table({ countries }) {
  return (
    <div className="table">
      <tr>
        <td width="10%" className="td5">
          Country
        </td>
        <td width="10%" className="td6">
          Cases
        </td>
        <td width="10%" className="td7">
          Recovered
        </td>
        <td width="10%" className="td8">
          Deaths
        </td>
        <td width="10%" className="td9">
          Tests
        </td>
      </tr>
      {countries.map(({ country, cases, recovered, deaths, tests }) => (
        <tr>
          <td width="15%" className="td">
            {country}
          </td>

          <td width="10%" className="td1">
            <strong>
              <CountUp start={0} end={cases} duration={6} separator="," />
            </strong>
          </td>
          <td width="10%" className="td2">
            <strong>
              <CountUp start={0} end={recovered} duration={6} separator="," />
            </strong>
          </td>
          <td width="10%" className="td3">
            <strong>
              <CountUp start={0} end={deaths} duration={6} separator="," />
            </strong>
          </td>
          <td width="10%" className="td4">
            <strong>
              <CountUp start={0} end={tests} duration={6} separator="," />
            </strong>
          </td>
        </tr>
      ))}
    </div>
  );
}

export default Table;
