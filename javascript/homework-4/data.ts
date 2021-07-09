 // Данные в свободной форме
export const anyData: object  = {
    id: 1,
    items: [
        'sssss',
        {
            id: 2,
            items: [
                {id: 3 ,items: [{id: 'Текст'}]},
                {id: 4, items:[]}
            ]
        },
        {
            id: 5,
            items: 'error',
        },
        {
            id: true,
        },
    ]
};

// Данные для удачного завершения теста (все id являются чилами)
export const anyDataTest: object  = {
    id: 1,
    items: [
        {
            id: 2,
            items: [
                {id: 3},
                {id: 4}
            ]
        },
        {
            id: 5,
        },
    ]
};

// Данные в строгом формате
interface IItemData {
    id: number;
    items?: Array<IItemData>;
}

export const strictData: IItemData = {
    id: 1,
    items: [
        {
            id: 2,
            items: [
                {id: 3 ,items: [{id: 1111}]},
                {id: 4, items:[]}
            ]
        },
        {
            id: 5,
            items: [],
        },
        {
            id: 4444,
        },
    ]
}