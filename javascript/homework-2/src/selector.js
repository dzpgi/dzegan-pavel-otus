
/**
 * Поиск элемента по id, class'ам и другим атрибутам не дает гарантии, что будет найден только 1 элемент,
 * всегда есть вероятность найти несколько копий.
 * Селектор, который с 100%-й вероятностью найдет только 1 элемент
 * это селектор, состоящий из позиций first-child, nth-child и last-child
 * по всей иерархии от корня до переданного элемента.
 * Поэтому при создании селектора собираем сначала часть атрибутов и проверяем получается ли найти уникалаьный элемент,
 * если нет, то добавляем его позицию и проверяем еще раз, если этого недостаточно,
 * то переходим к родительскому элементу и повторяем те же шаги.
 * Если получится найти уникальный элемент по селектору, не пройдя по всей иерархии,
 * то считаем, что цель достигнута. Если же пришлось пройти всю иерархию, то
 * в селекторе будут указаны позиции, дающие гарантию получить только 1 элемент.
 */

function getPath(element) {
    if (!element || typeof element !== 'object' || Array.isArray(element)) return '';

    // Экранирование спецсимволов в значениях атрибутов
    // Преобразование возможно для строки или массива строк
    //
    // Если вывести селектор в консоль, то Chrome отобразит 1, а не 2 слеша,
    // но во время проверки этого селектора нужный элемент будет найден.
    let convert = function(value) {
        if (!value || value.length === 0) return '';

        if (Array.isArray(value)) {
            value.forEach(function(item, i, array) {
                array[i] = convert(item);
            })
            return value;
        }

        let badIndex = value.search(/\W/);
        if (badIndex < 0) return value;
        let normalPart    = value.substring(0, badIndex) + '\\' + value.substring(badIndex, badIndex+1);
        let uncheckedPart = value.substring(badIndex+1, value.length);
        return normalPart + convert(uncheckedPart);
    };

    // Несколько популярных критериев для селектора
    let currentSelector = [
            element.tagName,
            element.id? `[id=${convert(element.id)}]`: '',
            element.name? `[name=${convert(element.name)}]`: '',
            element.classList.length > 0? '.' + convert([...element.classList]).join('.'): '',
        ].join('');

    let isSingleElement = document.querySelectorAll(currentSelector).length ===1;
    if (isSingleElement) return currentSelector;

    let parent = element.parentElement;
    if (!parent) return currentSelector;

    let children = parent.children;
    for (let i=0; children.length; i++) {
        if (element === children[i]) {
            let position = children.length > 1? (i === 0? ':first-child': (i === children.length-1? ':last-child': `:nth-child(${i+1})`)): '';
            currentSelector = `${currentSelector}${position}`;
            break;
        }
    }

    isSingleElement = document.querySelectorAll(currentSelector).length ===1;
    if (isSingleElement) return currentSelector;

    let result = getPath(parent) + ' ' + currentSelector;
    return result;
}

module.exports = {getPath};