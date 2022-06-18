import { useCallback, useState, useEffect } from "react";




const fetchWeatherForecast = (authorizationKey, cityName) => {
  return fetch(
    `https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${authorizationKey}&locationName=${cityName}`
  )
    .then((response) => response.json())
    .then((data) => {
      // console.log(data);

      // STEP 1：定義 `locationData` 把回傳的資料中會用到的部分取出來
      const forecast = data.records.location[0];
      // STEP 2：將天氣現象（Wx）、降雨機率（PoP）和舒適度(CI)的資料取出
      const forecastElements = forecast.weatherElement.reduce(
        (neededElements, item) => {
          if (["Wx", "PoP", "CI"].includes(item.elementName)) {
            neededElements[item.elementName] = item.time[0].parameter;
          }
          return neededElements;
        },
        {}
      );

      return {
        description: forecastElements.CI.parameterName,
        rainPossibility: forecastElements.PoP.parameterName,
        comfortability: forecastElements.Wx.parameterName,
        weathercode: forecastElements.Wx.parameterValue,
      };
    });
};

const fetchCurrentWeather = (authorizationKey, locationName) => {
  return fetch(
    `https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=${authorizationKey}&locationName=${locationName}`
  )
    .then((response) => response.json())
    .then((data) => {
      // console.log('data',data);
      // STEP 1：定義 `locationData` 把回傳的資料中會用到的部分取出來
      const locationData = data.records.location[0];

      // STEP 2：將風速（WDSD）和氣溫（TEMP）的資料取出
      const weatherElements = locationData.weatherElement.reduce(
        (neededElements, item) => {
          if (["WDSD", "TEMP"].includes(item.elementName)) {
            neededElements[item.elementName] = item.elementValue;
          }
          return neededElements;
        },
        {}
      );

      return {
        observationTime: locationData.time.obsTime,
        locationName: locationData.locationName,
        temperature: weatherElements.TEMP,
        windSpeed: weatherElements.WDSD,
      };
    });
};
const useWeatherAPI = ({ locationName, cityName, authorizationKey }) => {
  const [weatherElement, setWeatherElement] = useState({
    locationName: "",
    description: "",
    windSpeed: 0,
    temperature: 0,
    rainPossibility: 0,
    comfortability: "",
    weathercode: 0,
    observationTime: new Date(),
  });
  const fetchData = useCallback(async () => {
    const [currentWeather, weatherForecast] = await Promise.all([
      fetchCurrentWeather( authorizationKey, locationName ),
      fetchWeatherForecast( authorizationKey, cityName ),
    ]);

    setWeatherElement({
      ...currentWeather,
      ...weatherForecast,
    });
  }, [authorizationKey, cityName, locationName]);
  //fetch相關effect
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return [weatherElement, fetchData];
};

export default useWeatherAPI;
