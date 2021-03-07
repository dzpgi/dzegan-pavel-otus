/**
 * Основной компонент с типом базового элемента
 */
export class MyComponent extends HTMLElement {
    connectedCallback() {
        this.attachShadow({ mode: 'open'});
    }
    render(data) {
        const cmp  = this;
        (async function() {
            const html = await fetch('tree.html').then(result => result.text()).catch(error=>error);
            if (typeof html !== 'string') return html;

            const templates = document.createElement('div');
            const tree      = document.createElement('ul', {is : 'my-tree'});

            templates.innerHTML = html;
            cmp.shadowRoot.appendChild(templates);
            cmp.shadowRoot.appendChild(tree);
            tree.classList.add('empty-root');
            tree.render(data);
        })().then(function(message) {
            if(message) console.error(`MyComponent: ${message}`);
        });
    }
}
/**
 * <UL> элемент
 */
class MyTree extends HTMLUListElement {
    render(data) {
        if (!data) return;
        const tree = this;
        data = Array.isArray(data)? data: [data];
        data.forEach(function(item) {
            const leaf = document.createElement('li', {is : 'my-leaf'});
            tree.appendChild(leaf);
            leaf.render(item);
        });
    }
}
/**
 * <LI> элемент
 */
class MyLeaf extends HTMLLIElement {
    render(data) {
        const leaf = this;
        // Просто промис c результатом выполения
        (async function() {
            // Проверка данных
            if (typeof data !== 'object' || !data) return `MyLeaf: ${data} не является объектом!`;
            const hasName = data.id && (typeof data.id === 'number' || typeof data.id === 'string');
            if (!hasName) return`MyLeaf: не задан "id"!`;

            // Отображение данных
            const template = leaf.getRootNode().querySelector('#leaf_template');
            if (!template) return `MyLeaf: #leaf_template не найден`;
            const content  = template.content.cloneNode(true);
            content.querySelector('#name_place').innerHTML = `Элемент ${data.id}`;
            leaf.appendChild(content);

            if (!Array.isArray(data.items) || data.items.length<1) return;

            // Формирование потомков
            const tree = document.createElement('ul', {is : 'my-tree'});
            leaf.appendChild(tree);
            tree.render(data.items);
        })().then(function(message) {
            if(message) console.error(message);
        });
    }
}

// Объявление новых типов элементов
customElements.define('my-component', MyComponent);
customElements.define('my-tree', MyTree, {extends: 'ul'});
customElements.define('my-leaf', MyLeaf, {extends: 'li'});

// Установка компонеета
import { data } from './data.js';
const cmp = document.createElement('my-component');
document.body.appendChild(cmp);
cmp.render(data);