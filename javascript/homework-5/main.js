/*
 * Обход каталогов файловой системы.
 * Сортировка от начального каталога (не по имени пути).
 */

const fs = require('fs');
const EventEmitter = require('events');
const rootEmitter = new EventEmitter();

function createTree(current) {
    if (!current) return;
    // Если это первый запуск, то на вход получим строку заданного пути,
    // на ее основе создаем корневой элемент, если это повторный вызов для потомков,
    // то на вход получим объект с информацией нем.
    current = typeof current === 'string'? {
        path: current,
        type: 'folder',
        doComplete: doFinish,
    }: current;

    // Получаем файлы и каталоги текущего элемента
    fs.readdir(current.path, function(e, names){
        if (e) { console.error('Ошибка: ', e.message); return; };

        const childs = names.map(function(name) {
            return {
                path:       `${current.path}/${name}`,
                name:       name,
                parent:     current,
                complete:   false,
                doComplete: doCheckBros,
            };
        });
        current.childs = childs;

        if (childs.length === 0) current.doComplete();

        childs.forEach(function(child) {
            fs.lstat(child.path, function(error, stats) {
                if (e) { console.error('Ошибка: ', e.message); return; };
                if (stats && stats.isDirectory()) {
                    child.type = 'folder';
                    createTree(child);
                } else {
                    child.type = 'file';
                    child.doComplete();
                }
            });
        });
    });
}

// Если один из каталогов пройден, то проверяем его братьев,
// если братья тоже пройдены, то отмечаем и их родителя полностью готовым
// и переходим на уровень вверх
function doCheckBros() {
    const child = this;
    const bros  = child.parent.childs;

    child.complete = true;

    let allComplete = true;
    for (var i=0; i<bros.length; i++)
        allComplete = !bros[i].complete? false: allComplete;

    if (!allComplete) return;

    if (child.parent) child.parent.doComplete();

}

// Сортировка результата
function doFinish() {

    const root = this;

    if (!root.childs) return;

    function fullPath(item)   { return item.path; }
    function isFile(item)   { return item.type === 'file'; }
    function isFolder(item) { return item.type === 'folder'; }
    function byName(a, b) {
        if (a.name > b.name) return +1;
        if (a.name < b.name) return -1;
        if (a.name === b.name) return 0;
    }

    function createLists(item, result) {
        if (!item.childs) return;

        const filesPath = item.childs.filter(isFile).sort(byName).map(fullPath);
        result.files = [...result.files, ...filesPath];

        const folders = item.childs.filter(isFolder).sort(byName);
        for (var i=0; i<folders.length; i++) {
            var folder = folders[i];
            result.folders.push(folder.path);
            result = createLists(folder, result);
        }
        return result;
    }

    rootEmitter.emit('complete', createLists({childs: [root]}, {files:[], folders:[]}));
}

rootEmitter.on('complete', function(result) {
    console.log(result);
});

createTree(process.argv[2]);
//createTree('/git/foo');
//createTree('D:/git/ts3');


