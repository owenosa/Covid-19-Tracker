import {Circle, Popup} from 'react-leaflet';
import React from 'react'
import numeral from 'numeral'

const casesTypeColors = {
    cases: {
      color: "#CC1034",
      rgb: "rgb(204, 16, 52)",
      half_op: "rgba(204, 16, 52, 0.5)",
      multiplier: 400,
    },
    recovered: {
      color: "#7dd71d",
      rgb: "rgb(125, 215, 29)",
      half_op: "rgba(125, 215, 29, 0.5)",
      multiplier: 500,
    },
    deaths: {
      color: "black",
      multiplier: 600,
    },
  };

// DRAW circles on map with interactive tooltip
export const showDataOnMap = (data, casesType= "cases") => (
    data.map(country => (
        <Circle
        center={[country.countryInfo.lat, country.countryInfo.long]}
        color={casesTypeColors[casesType].color}
        fillColor={casesTypeColors[casesType].color}
        fillOpacity={0.4}
        radius={
          Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
        }
      >
        <Popup>
          <div className="info-container">
            <div
              className="info-flag"
              style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
            ></div>
            <div className="info-name">{country.country}</div>
            <div className="info-confirmed">
              Cases: {numeral(country.cases).format("0,0")}
            </div>
            <div className="info-recovered">
              Recovered: {numeral(country.recovered).format("0,0")}
            </div>
            <div className="info-deaths">
              Deaths: {numeral(country.deaths).format("0,0")}
            </div>
          </div>
        </Popup>
      </Circle>
    ))  
);

export const sortData = (data) => {
    let sortedData = [...data];

    sortedData.sort((a, b) => {
        if(a.cases > b.cases) {
            return -1;
        } else {
            return 1;
        }
    })
    return sortedData;
}

