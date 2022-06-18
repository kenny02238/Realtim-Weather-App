import React,{ useEffect, useMemo, useState } from "react";
import { getMoment, findLocation} from "./utils/getMoment";
import WeatherCard from "./views/WeatherCard";
import WeatherSetting from "./views/WeatherSetting";
import styled from "@emotion/styled";
import {ThemeProvider} from '@emotion/react'
import useWeatherAPI from "./hooks/useWeatherAPI";

const AUTHORIZATION_KEY ='CWB-8F85630C-8811-425F-B403-266D9F7076A1'
// const LOCATION_NAME= '臺北'
// const LOCATION_NAME_FORECAST = '臺北市'

const theme = {
  light: {
    backgroundColor: '#ededed',
    foregroundColor: '#f9f9f9',
    boxShadow: '0 1px 3px 0 #999999',
    titleColor: '#212121',
    temperatureColor: '#757575',
    textColor: '#828282',
  },
  dark: {
    backgroundColor: '#1F2022',
    foregroundColor: '#121416',
    boxShadow:
      '0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)',
    titleColor: '#f9f9fa',
    temperatureColor: '#dddddd',
    textColor: '#cccccc',
  },
};

const Container = styled.div`
  background-color: ${({ theme }) => theme.backgroundColor};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;



function App() {
  const storageCity = localStorage.getItem('cityName')||'臺北市';
  const [currentCity,setCurrentCity]= useState(storageCity);
  const currentLocation = useMemo(()=>findLocation(currentCity),[currentCity]);
  const{cityName,locationName,sunriseCityName} = currentLocation;
  const [weatherElement, fetchData] = useWeatherAPI({
    locationName,
    cityName,
    authorizationKey: AUTHORIZATION_KEY,
  });
  const [currentTheme, setCurrentTheme] = useState('light') 

  const moment = useMemo(()=>getMoment(sunriseCityName),[sunriseCityName]);

  // 亮色or暗色主題相關effect
  useEffect(()=>{setCurrentTheme(moment === 'day' ? 'light':'dark')},[moment]);

  const [currentPage, setCurrentPage] = useState('WeatherCard')

  const handleCurrentPageChange =(currentPage) =>{
    setCurrentPage(currentPage);
  };
  const handleCurrentCityChange = (currentCity) => {
    setCurrentCity(currentCity);
   };

  
  return (
    <ThemeProvider theme={theme[currentTheme]}>  
      <Container>
        {currentPage === 'WeatherCard' &&(
          <WeatherCard
          cityName={cityName}
          weatherElement={weatherElement}
          moment={moment}
          fetchData={fetchData}
          handleCurrentPageChange={handleCurrentPageChange}
        />
        )}
        {currentPage === 'WeatherSetting' && (<WeatherSetting 
        cityName={cityName}
        handleCurrentPageChange={handleCurrentPageChange}
        handleCurrentCityChange={handleCurrentCityChange}
        />)}
      </Container>
    </ThemeProvider>
  );
}

export default App;
