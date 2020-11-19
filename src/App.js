import React, {useState, useEffect} from 'react';
import {MenuItem, FormControl, Select, Card, CardContent} from '@material-ui/core'
import InfoBox from './Infobox';
import Map from './Map';
import Table from './Table'
import { sortData } from './util';
import LineGraph from './LineGraph'
import './App.css';
import 'leaflet/dist/leaflet.css'

function App() {
  const [countries, setCountries] = useState(['USA', 'UK', 'INDIA']);
  const [country, setCountry] = useState('worldwide')
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([])

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response => response.json())
    .then(data => {
      setCountryInfo(data);
    })
  }, [])

  useEffect(() => {
    // pulling from disease.sh API
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country, // United States, United Kingdom
            value: country.countryInfo.iso2 // UK, USA, FR
          }));
          
          const sortedData = sortData(data);
          setTableData(sortedData);
          setCountries(countries);
          setMapCountries(data);
        });
    };

    getCountriesData();
  }, []);

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);

        console.log(mapCenter);
        if (countryCode !== "worldwide"){
          setMapCenter({lat: data.countryInfo.lat, lng: data.countryInfo.long});
        }
        
        setMapZoom(4);
      });
  };

  return (
    <div className="app">
      <div className="app__left">
        {/* Header */}
        <div className="app__header">
          {/* Title + Select Input dropdown field  */}
        <h1>COVID-19 TRACKER</h1>
        <FormControl className="app__dropdown">
          <Select variant="outlined" value={country} onChange={onCountryChange}>
            {/*Loop Through all the countries and show a drop down list of the options */}
            <MenuItem value="worldwide"> Worldwide </MenuItem>
            {
              countries.map((country) => (
                <MenuItem value = {country.value}> {country.name} </MenuItem>
              ))
            }
          </Select>
        </FormControl>
        </div>

      
      <div className = "app__stats">
        <InfoBox 
        isRed
        active={casesType === 'cases'} 
        onClick ={e => setCasesType('cases')} 
        title="Total Cases" 
        cases={countryInfo.todayCases} 
        total={countryInfo.cases}
        />  
        <InfoBox 
        active={casesType === 'recovered'} 
        onClick ={e => setCasesType('recovered')} 
        title="Total Recoveries" 
        cases={countryInfo.todayRecovered} 
        total={countryInfo.recovered}
        />
        <InfoBox 
        isBlack
        active={casesType === 'deaths'} 
        onClick ={e => setCasesType('deaths')} 
        title="Total Deaths" 
        cases={countryInfo.todayDeaths} 
        total={countryInfo.deaths}
        />
      </div>

      {/* Map */}
      <Map casesType = {casesType} countries= {mapCountries} center = {mapCenter} zoom = {mapZoom}/>
      </div>
      
      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
            <Table countries={tableData}/>
            <LineGraph casesType = {casesType}/>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
