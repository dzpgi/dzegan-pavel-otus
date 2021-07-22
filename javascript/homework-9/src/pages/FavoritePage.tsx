import React, {useContext} from 'react'
import {useHistory} from 'react-router-dom'
import {AppContext} from '../AppContext';
import cities from '../data/cities.json'

export const FavoritePage: React.FC = ()=>{

    const ctx     = useContext(AppContext);
    const history = useHistory()

    const getFavoriteValues = function() {
        if (!ctx || !ctx.data || !ctx.data.favorites) return []
        const result = ctx.data.favorites.map(function(code: string) {
            return cities.find(city=>city.code === code)
        })
        return result
    }
    const values = getFavoriteValues()

    const toWeather = function(event: React.MouseEvent, code: string) {
        event.preventDefault()
        let value = ctx.data? ctx.data: {}
        value.city = code
        ctx.setData(value)
        history.push('/weatherPage')
    }

    return (
        <>
        <br />
        {
            values.map(function(value: Record<string, string>) {
                return (<><a href="/" onClick={event => toWeather(event, value.code)}>{value.name}</a>&nbsp;</>)
            })
        }
        </>
    )
}