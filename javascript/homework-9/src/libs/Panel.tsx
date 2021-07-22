import React from 'react'
import {NavLink} from 'react-router-dom'

export const Panel: React.FC = ()=>(
    <nav>
        <NavLink to="/filterPage" >Выбор города</NavLink>
        &nbsp;
        <NavLink to="/weatherPage" >Погода</NavLink>
        &nbsp;
        <NavLink to="/favoritePage" >Избранное</NavLink>
    </nav>
)