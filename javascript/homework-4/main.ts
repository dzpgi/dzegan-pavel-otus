/**
 * Основной компонент с типом базового элемента
 */
class MyComponent extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        const cmp: MyComponent = this;
        cmp.attachShadow({ mode: 'open'});
    }
    render(data: any) {
        const cmp: MyComponent = this;
        (async function() {
            if (!cmp.shadowRoot) return;
            const html: any = await fetch('tree.html').then(result => result.text()).catch(error=>error);
            if (typeof html !== 'string') return html;

            const templates: any = document.createElement('div');
            const tree: MyTree   = <MyTree>document.createElement('ul', {is : 'my-tree'});

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
    render(data: any) {
        if (!data) return;
        const tree: MyTree = this;
        data = Array.isArray(data)? data: [data];
        data.forEach(function(item: any) {
            const leaf: MyLeaf = <MyLeaf>document.createElement('li', {is : 'my-leaf'});
            tree.appendChild(leaf);
            leaf.render(item);
        });
    }
}
/**
 * <LI> элемент
 */
class MyLeaf extends HTMLLIElement {
    render(data: any) {
        const leaf: MyLeaf = this;
        // Просто промис c результатом выполения
        (async function() {
            // Проверка данных
            if (typeof data !== 'object' || !data) return `MyLeaf: ${data} не является объектом!`;
            const hasName = data.id && (typeof data.id === 'number' || typeof data.id === 'string');
            if (!hasName) return `MyLeaf: не задан "id"!`;

            // Отображение данных
            const template: any = (<Element>leaf.getRootNode()).querySelector('#leaf_template');

            if (!template) return `MyLeaf: #leaf_template не найден`;
            const content  = template.content.cloneNode(true);
            content.querySelector('#name_place').innerHTML = `Элемент ${data.id}`;
            leaf.appendChild(content);

            if (!Array.isArray(data.items) || data.items.length<1) return;

            // Формирование потомков
            const tree = new MyTree();
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
// Установка компонента
import { strictData } from './data.js';
const cmpxy: MyComponent  = <MyComponent>document.createElement('my-component');
document.body.appendChild(cmpxy);
cmpxy.render(strictData);