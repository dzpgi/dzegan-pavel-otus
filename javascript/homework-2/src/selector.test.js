const {getPath} = require('./selector');

const fs = require('fs')

const html = (function() {
        try {
            return fs.readFileSync('./src/page.html', 'utf8');
        } catch(e) {
            console.error(e);
        }
    }());
const page = html? new DOMParser().parseFromString(html, "text/html"): null;

test('Наличие файла страницы', function() {
    expect(html).toBeTruthy();
});

test('Создание селектора для элемента "div.classA .classB .classC9"', function() {
    let selector = getPath(page.querySelector('div.classA .classB .classC9'));
    expect(selector).not.toBeNull();
});

test('Создание селектора для элемента "div.classA .classB .classC9"', function() {
    let selector = getPath(page.querySelector('div.classA .classB .classC9'));
    expect(selector).not.toBeNull();
});

test('Нахождение элемента "div.classA .classB .classC9" по созданному селектору', function() {
    let selector = getPath(page.querySelector('div.classA .classB .classC9'));
    expect(page.querySelector(selector)).not.toBeNull();
});

test('Создание селектора для элемента "div"', function() {
    let selector = getPath(page.querySelector('div'));
    expect(selector).not.toBeNull();
});

test('Нахождение элемента "div" по созданному селектору', function() {
    let selector = getPath(page.querySelector('div'));
    expect(page.querySelector(selector)).not.toBeNull();
});

test('Создание селектора со спецсимволом для элемента "div[id=r♥]"', function() {
    let selector = getPath(page.querySelector('div[id=r\\♥]'));
    expect(selector).not.toBeNull();
});

test('Нахождение элемента "div[id=r♥]" по созданному селектору со спецсимволом', function() {
    let selector = getPath(page.querySelector('div[id=r\\♥]'));
    expect(page.querySelector(selector)).not.toBeNull();
});