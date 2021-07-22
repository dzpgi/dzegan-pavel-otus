import React, {useState} from 'react';

type TAppContextParamsType = {
    data:    any
    setData: any
}
export const AppContext = React.createContext<TAppContextParamsType>({data: {}, setData: function(){}})