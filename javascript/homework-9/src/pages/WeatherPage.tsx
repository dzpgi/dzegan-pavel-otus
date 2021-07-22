import React, {useContext, useEffect} from 'react'
import {AppContext} from '../AppContext';
import weathers from '../data/weathers.json'
import cities from '../data/cities.json'

export const WeatherPage: React.FC = ()=>{

    const ctx  = useContext(AppContext)

    const getFilteredValues = function(): Record<string, string> {
        if (!ctx.data || !weathers) return {}
        const weather: Record<string, string>|undefined = weathers.find(function(weather) {return ctx.data.city === weather.city? true: false})
        if (!weather) return {}
        const filters: Record<string, string>|undefined = ctx.data
        if (!filters) return {}
        let result:Record<string, string> = {}
        for (let key in filters) {
            result[key] = weather[key]
        }
        if (result.city) {
            const city: Record<string, string>|undefined = cities.find(city=>result.city === city.code)
            result.city = city? city.name: ''
        }
        return result
    }
    const values: Record<string, string>| undefined = getFilteredValues()

    return (
        <>
            <b style={!values.city? {display: 'none'}: {}}>Город: {values.city}</b>
            <table>
                <tr style={!values.temperature? {display: 'none'}: {}}>
                    <td>Температура: </td>
                    <td>{values.temperature}</td>
                </tr>
                <tr style={!values.windSpeed? {display: 'none'}: {}}>
                    <td>Скорость ветра: </td>
                    <td>{values.windSpeed}</td>
                </tr>
                <tr style={!values.damp? {display: 'none'}: {}}>
                    <td>Власжность: </td>
                    <td>{values.damp}</td>
                </tr>
                <tr style={!values.pression? {display: 'none'}: {}}>
                    <td>Давление: </td>
                    <td>{values.pression}</td>
                </tr>
            </table>
        </>
    )
}