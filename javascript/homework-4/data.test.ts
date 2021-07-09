 // если в src будет создан data.js, то загрузка data.ts завершится ошибкой
 const {anyDataTest} = require('./data');

 //import anyData from '../src/data';

/*test('basic', () => {
  expect(sum()).toBe(0);
});

test('basic again', () => {
  expect(sum(1, 2)).toBe(3);
});*/




test('Все элементы содержат числовой ID', ()=>{
    function checkData  (items: Array<object>) {
        if (!Array.isArray(items)) return;
        items.forEach((item: any)=>{
            expect(typeof item.id === 'number' ).toBe(true);
            checkData(item.items);
        });
    }
    checkData([anyDataTest]);
    expect(1).toBe(1);
})