import React, {useRef, useContext, useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import cities from '../data/cities.json'
import {AppContext} from '../AppContext';

export const FilterPage: React.FC = ()=>{

    const ctx     = useContext(AppContext);
    const history = useHistory()
    const formRef = useRef<HTMLFormElement>(null)
    const cityRef = useRef<HTMLSelectElement>(null)

    const addFavorite = function(event: React.MouseEvent) {
        if (!cityRef.current) return
        event.preventDefault()
        ctx.data.favorites = ctx.data.favorites? ctx.data.favorites: []
        if (ctx.data.favorites.indexOf(cityRef.current.value) === -1) ctx.data.favorites.push(cityRef.current.value)
        ctx.setData(ctx.data)
    }

    const toWeather = function(event: React.MouseEvent) {
        if (!formRef.current) return
        event.preventDefault()
        const fd = new FormData(formRef.current)
        const values: {[key: string]: string} = {}
        fd.forEach(function(value: FormDataEntryValue, key: string, parent: FormData){
            values[key] = value.toString()
        })
        values.favorites = ctx.data.favorites
        ctx.setData(values)
        history.push('/weatherPage')
    }

    const getCheckedFileds = function() {
        let old = ctx.data
        let result = {
            temperature : old.temperature? old.temperature: 'off',
            windSpeed   : old.windSpeed?   old.windSpeed:   'off',
            damp        : old.damp?        old.damp:        'off',
            pression    : old.pression?    old.pression:    'off'
        };
        return result
    }
    const fields = getCheckedFileds()

    return (
        <form ref={formRef}>
            <h1>Детализация погоды</h1>
            <select name="city" ref={cityRef}>
            {
                cities.map(function(city) {
                    return (<option value={city.code}>{city.name}</option>)
                })
            }
            </select>
            <button onClick={addFavorite}>Добавить в избранное</button>
            <br />
            <input type="checkbox" name="temperature" checked={fields.temperature==='on'? true: undefined} /> Температура
            <br />
            <input type="checkbox" name="windSpeed" checked={fields.windSpeed==='on'? true: undefined} /> Скорость ветра
            <br />
            <input type="checkbox" name="damp" checked={fields.damp==='on'? true: undefined} /> Влажность
            <br />
            <input type="checkbox" name="pression" checked={fields.pression==='on'? true: undefined} /> Давление
            <br />
            <br />
            <button className="btn" onClick={event => toWeather(event)}>Просмотр погоды</button>
            <h5 style={{color: 'gray'}}>
                Значения чекбосков будут применены только по кнопке "Просмотр погоды",<br/ >
                если этого не выполнить, то при переходе из избранного считаем, что фильтр не был установлен.
            </h5>
        </form>
    )
}