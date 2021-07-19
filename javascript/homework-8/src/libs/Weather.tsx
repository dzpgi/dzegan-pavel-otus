import React, {useState, useEffect } from 'react'
import weathers from '../data/weathers.json'
import {ICity, IWeather} from '../libs/interfaces';

type TWeatherParams = {
    city?: ICity
}

export const Weather: React.FC<TWeatherParams> = function({city}) {

    const [weather, setWeather] = useState<IWeather>({})
    useEffect(function() {

        if (!city || !city!.code) return

        const currentWeather: IWeather|undefined = weathers.find(function(weather) {
            return city.code === weather.city? true: false
        })
        if (currentWeather) setWeather(currentWeather)
    }, [city])
    const getCityName = function() {
        if  (city) return city.name
    }

    return (
        <>
            <b>Город: {getCityName()}</b>
            <table>
                <tr>
                    <td>Температура: </td>
                    <td>{weather!.temperature}</td>
                </tr>
                <tr>
                    <td>Скорость ветра: </td>
                    <td>{weather!.windSpeed}</td>
                </tr>
                <tr>
                    <td>Власжность: </td>
                    <td>{weather!.damp}</td>
                </tr>
                <tr>
                    <td>Давление: </td>
                    <td>{weather!.pression}</td>
                </tr>
            </table>
        </>
    )
}