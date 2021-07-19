import React, { useState } from 'react';
import './App.css';
import {CityField} from './libs/CityField'
import {Weather} from './libs/Weather'
import {ICity} from './libs/interfaces';

function App() {

    const [selectedCity, setSelectedCity] = useState<ICity|undefined>()

    const setCityCallback = function(city: ICity) {
        setSelectedCity(city)
    }

    return (
      <>
        <div className="help-panel">Для отображения погоды введите название одного из городов: Париж, Берлин, Москва, Токио, Пекин, Сидней</div>
        <div className="help-panel">Проверка имени города произойдет автоматически после прекращения ввода</div>
        <div className="main-panel">
            <div className="favorite-panel">
                <CityField setCityCallback={setCityCallback} />
            </div>
            <br/>
            <div className="weather-panel">
                <Weather city={selectedCity}/>
            </div>
        </div>
      </>
    );
}

export default App;
