import React, { useState, useEffect } from "react";
import "./App.css";
import { Card, CardContent } from "@material-ui/core";
import InfoBox from "./components/InfoBox";
import numeral from "numeral";
import Map from "./components/Map";
import Table from "./components/Table";
import { sortData } from "./utils";
import LineGraph from "./components/LineGraph";
import "leaflet/dist/leaflet.css";
import TextField from "@material-ui/core/TextField";
import { Autocomplete } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";

function App() {
  //declaring the state
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({
    lat: 41.2284491,
    lng: -80.9448295,
  });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const useStyles = makeStyles({
    option: {
      fontSize: 15,
      "& > span": {
        marginRight: 10,
        fontSize: 20,
      },
    },
  });

  const classes = useStyles();

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  /* fetching data from API,Mapping through the fetched data and picking the particular items needed from the data and setting the items to the state
   */
  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso3,
            flag: country.countryInfo.flag,
          }));
          countries.push({
            name: "worldwide",
            value: "worldwide",
            flag:
              "https://cdn2.iconfinder.com/data/icons/pittogrammi/142/39-512.png",
          });
          //setting the state to the chosen data from the lot
          const sortedData = sortData(data);
          setTableData(sortedData);
          setCountries(countries);
          setMapCountries(data);
        });
    };
    //firing the function
    getCountriesData();
  }, []);

  const onCountryChange = async (event, country) => {
    event.preventDefault();
    if (country === null) return;
    const countryCode = country.value;
    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);
        if (countryCode !== "worldwide") {
          setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
          setMapZoom(2);
        } else {
          setMapCenter({ lat: 41.2284491, lng: -80.9448295 });
          setMapZoom(3);
        }
      });
  };

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>Covid19-Tracker</h1>
          <Autocomplete
            id="country-select"
            className="app__dropdown"
            style={{ width: 250 }}
            options={countries}
            classes={{
              option: classes.option,
            }}
            autoHighlight
            onChange={onCountryChange}
            getOptionLabel={(option) => option.name}
            renderOption={(option) => (
              <React.Fragment>
                <span>
                  <img src={option.flag} alt="" width="20" height="20" />
                </span>
                {option.name}
              </React.Fragment>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="select a country"
                variant="outlined"
                inputProps={{
                  ...params.inputProps,
                  autoComplete: "new-password", // disable autocomplete and autofill
                }}
              />
            )}
          />
        </div>

        <div className="app__stats">
          <InfoBox
            isYellow
            active={casesType === "cases"}
            onClick={(e) => setCasesType("cases")}
            title="Coronavirus cases"
            cases={countryInfo.todayCases}
            total={numeral(countryInfo.cases).format("0.0a")}
          />

          <InfoBox
            isGreen
            active={casesType === "recovered"}
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            cases={countryInfo.todayRecovered}
            total={countryInfo.recovered}
          />

          <InfoBox
            isRed
            active={casesType === "deaths"}
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            cases={countryInfo.todayDeaths}
            total={countryInfo.deaths}
          />
        </div>
        <div className="info__tests">
          <InfoBox
            isRed
            active={casesType === "tests"}
            title="Total Tests"
            cases={countryInfo.tests}
            total={countryInfo.tests}
          />
        </div>
        {/* The Map component */}
        <Map
          casesType={casesType}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>
      {/* right side of the app */}
      <Card className="app__right">
        <CardContent>
          <h2>Live cases</h2>
          <Table countries={tableData} />
          <hr />
          <h2 className="app__graphTitle">Worldwide new {casesType}</h2>
          <LineGraph className="app__graph" casesType={casesType} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
