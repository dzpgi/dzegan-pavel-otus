import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter, Switch, Route} from 'react-router-dom'
import './App.css';
import {Panel} from './libs/Panel'
import {FilterPage} from './pages/FilterPage'
import {WeatherPage} from './pages/WeatherPage'
import {FavoritePage} from './pages/FavoritePage'
import {AppContext} from './AppContext';

function App() {

    const [contextData , setContextData] = useState<Record<string, string>>({});
    const ctx = { data: contextData, setData: setContextData };

    return (
        <AppContext.Provider value={ctx}>
        <BrowserRouter>
            <Panel/>
            <div className="container">
                <Switch>
                    <Route component={FilterPage} path="/filterPage" exact/>
                    <Route component={WeatherPage} path="/weatherPage"/>
                    <Route component={FavoritePage} path="/favoritePage"/>
                </Switch>
            </div>
        </BrowserRouter>
        </AppContext.Provider>
    )
}

export default App;
