import React, {useState, useEffect,useRef} from 'react'
import cities from '../data/cities.json'
import {ICity} from '../libs/interfaces';


type TCityFieldParams = {
    setCityCallback(city: ICity): void
}

export const CityField: React.FC<TCityFieldParams> = function({setCityCallback}) {

    // Добавить в избранное
    const buttonRef = useRef<HTMLAnchorElement>(null)
    // Имя города
    const inputRef = useRef<HTMLInputElement>(null)

    // Избранные города
    const [favoriteCities, setFavoriteCities] = useState<Array<ICity>>([])

    // Текущий найденный город. Если такой есть, то разрешаем добавить в избраннре
    const [existCity, setExistCity] = useState<ICity>()
    useEffect(function() {
        if (existCity) setCityCallback(existCity)
        if (!buttonRef.current) return
        buttonRef.current.style.display = !existCity? 'none': ''
    }, [existCity])

    // Введенный текст для поиска города
    const [targetCity, setTargetCity] = useState('')
    // Выполним поиск введенного города, когда пользователь успокоится :)
    useEffect(function() { setTimeout(doRequestCity, 1000) }, [targetCity])
    const doRequestCity = function() {
        if (!buttonRef.current || !inputRef.current) return
        if (inputRef.current.value !== targetCity) return

        // запрос списка городов с сервера (в даном случае сразу из файл)
        const result: ICity|undefined = cities.find(function(city) {
            return targetCity && targetCity.toLowerCase() === city.name.toLowerCase()? true: false
        })
        setExistCity(result)
    }


    // Ожидание ввода имени города
    const doSearchText = function (event: React.KeyboardEvent) {
        if (!inputRef.current) return
        setTargetCity(inputRef.current.value)
    }

    // Добавление в избранное
    const doAddFavorite = function(event: React.MouseEvent) {
        event.preventDefault()
        if (!existCity) return

        const duplicate = favoriteCities.find(function(city) {
            return city.code === existCity.code? true: false
        })
        if (!duplicate) setFavoriteCities([existCity, ...favoriteCities])

        if (buttonRef.current) buttonRef.current.style.display = 'none'
        if (inputRef.current) {
            inputRef.current.value = ''
            setTargetCity('')
        }
    }

    // Отобразить информацию о погоде города из избранного
    const doShowWeather = function(event: React.MouseEvent, code: string) {
        event.preventDefault()
        if (!code) return
        const findCity: ICity|undefined = favoriteCities.find(function(city) {
            return city.code === code? true: false
        })
        if (!findCity) return
        setCityCallback(findCity)
    }

    // удаление из избранного
    const doRemoveFavorite = function(event: React.MouseEvent, code: string) {
        event.preventDefault()
        if (!code) return
        const value: Array<ICity> = favoriteCities.filter(function(city) {
            return city.code !== code? true: false
        })
        setFavoriteCities(value)
    }

    return (
        <>
            <input type="text" ref={inputRef} onKeyUp={doSearchText} placeholder="введите название города" size={22} />&nbsp;
            <a href="/" className="add-favorite-button" ref={buttonRef} onClick={doAddFavorite}>Добавить в избранное</a>
            <br />
            <table><tr>
            {
                favoriteCities.map(function(city) {
                    return (
                        <td>
                            <table className="favorite-city">
                                <tr>
                                    <td><a href="/" onClick={event => doShowWeather(event, city.code)}>{city.name}</a></td>
                                    <td><a className="remove-button" href="/" onClick={event => doRemoveFavorite(event, city.code)}>x</a></td>
                                </tr>
                            </table>
                        </td>
                    )
                })
            }
            </tr></table>
        </>
    )
}