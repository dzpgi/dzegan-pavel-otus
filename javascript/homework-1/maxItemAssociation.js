/*

Общее описание действий:
    1. создать 2 линейных массива
    1.1. в 1м содержатся имена продуктов
    1.2. во 2м под тем же индексом их количество приобретения
    2. получить товары, которые чаще всего приобретались
    3. получить группы с этими товарами
    4. получить товары из этих групп
    5. сортировка групп

*/

// Поиск товаров, которые чаще всего встречались в группах
function maxItemAssociation(groups=[]) {

    // Избавляемся от ошибок в списках групп и продуктов
    modifiedGroups = [];
    groups.forEach(function(group) {
        if (!Array.isArray(group) || group.length<1) return;
        var group = group.filter(function(item, index, array) {
            return typeof item === 'string' && item.length>0;
        });
        if (group.length>1) modifiedGroups.push(group);
    });
    groups = modifiedGroups;

    // Создаем линейный массив всех продуктов
    let flatItems = groups.flat();

    // flatScoresByGroup - количество групп с максимальным кол-вом продуктов, [['a', 'a']] продукт "a" считается купленным 1 раз
    // flatScoresByItem - простое количество продуктов, [['a', 'a']] продукт "a" считается купленным 2 раза
    // Не совсем понятные условия задачи, поэтому 2 варианта подсчета или по группам, или по товару вообще

    // Создаем линейный массив количества покупок каждого продукта
    let flatScoresByGroup = [];
    flatItems.forEach(function(item){
        flatScoresByGroup.push(
            groups.filter(function(group, index, array){
                if (group.indexOf(item) > -1) return true;
            }).length
        );
    });
    let flatScoresByItem = flatItems.map(function(item, index, array) {
                        return array.filter(function(value, index, array){
                            return value === item? true: false;
                        }).length;
                     });

    // Здесь выбрать вариант или flatScoresByGroup, или flatScoresByItem
    flatScores = flatScoresByGroup;

    // Получаем максимум из всех количеств
    let maxCount = Math.max.apply(null, flatScores);

    // Получаем все имена продуктов, которые чаще всего приобретались
    let maxItems = flatItems.filter(function(value, index, array) {
                       return flatScores[index] === maxCount;
                   }).filter(function(value, index, array){
                       return array.indexOf(value) === index;
                   });

    // Получаем те группы, в которых чаще всего были куплены продукты
    let maxGroups = [];
    maxItems.forEach(function(item) {
        maxGroups.push(groups.filter(function(group, index, array) {
            return group.includes(item);
        }));
    });

    // Получаем группы с уникальными товарами
    let flatMaxGroups = [];
    maxGroups.forEach(function(groups) {
        flatMaxGroups.push(groups.flat().filter(function(item, index, array){
            return array.indexOf(item) === index;
        }).sort());
    });

    // Сортировка
    // Получаем в каждой группе текущий продукт и сравниваем их(продукты) между собой
    // т.е. сравнить allArrays[0,0] с allArrays[1,0] ... и allArrays[N,0], потом allArrays[0,1] с allArrays[1,1] ... и allArrays[N,1] и т.д.
    // Исключаем из исходного списка групп те группы, которые не являются первыми по алфавиту, пока не останется только одна
    // Примеры сортировки:
    // из ['a', 'aa, 'aab'] и ['a', 'aa'] первой должна быть ['a', 'aa']
    // из ['a','aa', 'aaa'] и ['a', 'aaac'] первой должна быть ['a', 'aa, 'aaa']
    // из ['a','ab'] и ['A', 'ac'] первой должна быть ['A', 'ac]
    function getFirstInSort(allArrays, itemIndex=0) {

        if (!allArrays || allArrays.length < 2) return  allArrays;

        // Список текущих продуктов из каждой группы
        let currentItems = [];
        allArrays.forEach(function(array) {
            currentItems.push(array[itemIndex]);
        });

        // Отсортированный список имен товаров
        let sortedCurrentItems = currentItems.slice().sort();

        // Исключить из исходного массива (списка групп) те группы, в которых имя товара не начинается с начальных символов по алфавиту
        // т.е. из [['b', 'c'], ['x','z'], ['b', 'd']] исключить ['x','z']
        allArrays = allArrays.filter(function(groups, index, array) {
            return  groups[itemIndex] === sortedCurrentItems[0];
        });

        // Если среди схожих по сортировке групп есть группа, которая пройдена до последнего товара, то это первая группа в сортировке
        for (var i=0; i<allArrays.length; i++) {
            var group = allArrays[i];
            if (itemIndex+1 === group.length) return group;
        }

        // Переход к следующему товар в группах
        return getFirstInSort(allArrays, itemIndex+1);
    }
    let result = getFirstInSort(flatMaxGroups);

    // Поэтапный вывод
    console.log('groups = ', groups);
    console.log('flatItems = ', flatItems);
    console.log('flatScoresByGroup = ', flatScoresByGroup);
    console.log('flatScoresByItem = ', flatScoresByItem);
    console.log('flatScores = ', flatScores);
    console.log('maxCount = ', maxCount);
    console.log('maxItems = ', maxItems);
    console.log('maxGroups = ', maxGroups);
    console.log('flatMaxGroups = ', flatMaxGroups);
    console.log('result = ', result);

    return result;
}

let groups = [
    null, undefined, '', 555, [1,2], {b:123,}, function() {return 0;},
    ['', 'a', 'c', {a:111}], ['a', 'b', null, 1, 2 ],
    ['A', 'a'], ['A', 'x'], ['A', 'y'],
];
let result = maxItemAssociation(groups);