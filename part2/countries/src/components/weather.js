import axios from "axios";
import { useState, useEffect } from "react";

const api_key = process.env.REACT_APP_API_KEY
const baseUrl = `http://api.weatherapi.com/v1/current.json?key=${api_key}&q=`
const airQualData = '&aqi=no'

const Wind = ( {data} ) => {
    return(
        <li>
            <b>wind speed: </b> {data.wind_kph} km/h ({data.wind_dir})
        </li>
    )
}

const WeatherDescription = ( {data} ) => {  
    return (
        <li>
            <b>Description: </b> {data.condition.text} <br/>
            <img src={data.condition.icon} alt='' />
        </li>
    )
}

const FeelsLike = ( {data} ) => {
    return (
        <li>
            <b>feels like: </b>{data.feelslike_c} &deg;C
        </li>
    )
}

const Temperature = ( {data} ) => {
    return (
        <li>
            <b>temperature: </b>{data.temp_c} &deg;C
        </li>
    )
}

const LastUpdated = ( {data} ) => {
    const date = new Date(data.last_updated_epoch*1000).toUTCString()
    return (
            <p>(Last updated: {date})</p>
    )
}

const Weather = ( {city} ) => {

    const [ weatherData, setWeatherData ] = useState([])
    
    useEffect(() => {
        axios
            .get(`${baseUrl}${city}${airQualData}`)
            .then(response => {
                setWeatherData(response.data.current)
            })   
        return () => {
            setWeatherData([])
        }
      }, [city])

    return (
        (!Object.keys(weatherData).length)
        ? null
        :
        <div className='Weather'>
            <h4>Weather in {city}</h4>
            <LastUpdated data={weatherData} />
            <ul>
                <Temperature data={weatherData} />
                <FeelsLike data={weatherData} />
                <WeatherDescription data={weatherData} /> 
                <Wind data={weatherData} />
            </ul>
        </div>
    )
}

export default Weather

