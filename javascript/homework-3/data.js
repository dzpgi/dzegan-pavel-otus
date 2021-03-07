/**
 * Данные для заполнения дерева
 */
export const data = {
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