/*
 * @Author: tackchen
 * @Date: 2022-02-20 17:20:38
 * @LastEditors: tackchen
 * @LastEditTime: 2022-02-26 18:02:41
 * @FilePath: /canvas-render-html/src/packages/dom/elements/element.ts
 * @Description: Coding something
 */

import {Style} from '@src/packages/dom/style/style';
import {TAttributeKey} from '@src/types/attribute';
import {IElement} from '@src/types/dom';
import {EElementName, EElementTagName, ENodeType} from '@src/types/enum';
import {Container, Sprite} from 'pixi.js';
import {Attribute} from '../attribute/attribute';
import {ClassList} from '../attribute/class-list';
import {parseHtml} from '../parser/parser';
import {getElementById, querySelector, querySelectorAll} from '../parser/query-selector';
// import {parseHtml} from '../parser/parser';
import {Boundary} from '../style/rule/layout/boundary';
import {Layout} from '../style/rule/layout/layout';
import {Node} from './node';
import {TextNode} from './text-node';

export const BlockElementTags = [
    EElementTagName.Div,
    EElementTagName.Body,
];

export abstract class Element extends Node implements IElement {
    _sprite: Sprite;
    nodeType = ENodeType.Element;

    _container: Container;

    attributes: Attribute;

    _layout: Layout;

    _boundary: Boundary;

    @oprateAttribute id: string;

    classList: ClassList;
    get className () {return this.classList.value;};
    set className (v: string) {this.classList.value = v;}

    private _tagName: EElementTagName;
    get tagName () {return this._tagName;}
    get innerText () {
        return this.childNodes.map(node => {
            if (node instanceof TextNode) {
                return node.textContent;
            } else if (node instanceof Element) {
                return node.innerText;
            }
            return '';
        }).join('');
    }
    set innerText (v: string) {
        this._clearChild();
        const textNode = new TextNode();
        textNode.textContent = v;
        this.appendChild(textNode);
    }
    get textContent () {return this.innerText;}
    set textContent (v: string) {this.innerText = v;}

    get outerHTML () {
        const tag = this.tagName.toLowerCase();
        return `<${tag}${this.attributes._buildAttributString()}>${this.innerHTML}</${tag}>`;
    }
    set outerHTML (v: string) {
        const body = parseHtml(v);
        body._traverseChild(node => {
            this.parentElement?.insertBefore(node, this);
        });
        this._clear();
    }

    // _innerHTML: string;
    get innerHTML () {
        return this.childNodes.map(node => {
            if (node instanceof TextNode) {
                return node.textContent;
            } else if (node instanceof Element) {
                return node.outerHTML;
            }
            return '';
        }).join('');
    }
    set innerHTML (v: string) {
        this._clearChild();
        parseHtml(v, this);
    }

    // child
    private _childNodes: Node[] = [];
    get childNodes () {
        return this._childNodes;
    }
    get children (): Element[] {
        return (this._childNodes.filter(item => item.nodeType === ENodeType.Element)) as Element[];
    }
    
    appendChild (node: Node) {
        // console.log(this.tagName, (node as any).tagName);
        this._container.addChild(node._container);
        this._childNodes.push(node);

        node._onAdd(this);

        // this._layout._reLayout(this._childNodes.length - 1);
    }

    removeChild (node: Node) {
        const index = this._childNodes.indexOf(node);
        if (index >= 0) {
            this._childNodes.splice(index, 1);
            this._container.removeChild(node._container);
            // this._layout._reLayout(index);
        }
        // const index = this._pureRemoveChild(node);
        // if (index >= 0) {
        //     this._layout._reLayout(index);
        // }
    }

    // _pureRemoveChild (node: Node) {
    //     const index = this._childNodes.indexOf(node);
    //     if (index >= 0) {
    //         this._childNodes.splice(index, 1);
    //         this._container.removeChild(node._container);
    //     }
    //     return index;
    // }

    insertBefore (node: Node, refer: Node) {
        const index = this.childNodes.indexOf(refer);

        if (index === -1) {
            throw new Error('insertBefore: 参考节点不存在');
        }
        this._container.addChildAt(node._container, index);
        node._onAdd(this);
        this.childNodes.splice(index, 0, node);
        // this._layout._reLayout(index);
    }

    // style

    style: Style;

    // addEventListener(type: string, callback: EventListenerOrEventListenerObject | null, options?: boolean | AddEventListenerOptions): void {
        
    // }
    constructor (name: EElementName) {
        super();
        this._container = new Container();
        this._tagName = name.toUpperCase() as EElementTagName;
        this._sprite = new Sprite();
        this._container.addChild(this._sprite);
        this.style = new Style(this);
        this._boundary = new Boundary(this);
        this._layout = new Layout(this);
        this.classList = new ClassList(this);
        this.attributes = new Attribute(this);
    }

    _renderStyles () {
        this.style._renderStyles();
    }

    _onAdd (parent: Element): void {
        super._onAdd(parent);
    }

    _onParseComplete () {
        // if (this.parentElement?.tagName === EElementTagName.Body) {
        // }
    }

    _traverseChild (callback: (n: Node)=>void, reverse = false) {
        const nodes = this.childNodes;

        if (reverse) {
            for (let i = nodes.length - 1; i >= 0; i --)
                callback(nodes[i]);
        } else {
            for (let i = 0; i < nodes.length; i ++)
                callback(nodes[i]);
        }
    }

    getAttribute (key: TAttributeKey) {
        return this.attributes._getAttribute(key);
    }

    setAttribute (key: TAttributeKey, value: string) {
        this.attributes._setAttribute(key, value);
    }

    removeAttribute (key: TAttributeKey) {
        return this.attributes._removeAttribute(key);
    }
    hasAttribute (key: TAttributeKey) {
        return this.attributes._hasAttribute(key);
    }

    _clearChild () {
        if (this._boundary) {
            this._boundary._resetCoordinate();
        }
        this._traverseChild(node => {
            node._clear();
        }, true);
    }

    _clear () {
        super._clear();
        this._clearChild();
        const _this = this as any;
        _this.attributes = null;
        _this.sprite = null;
        _this._container = null;
        // 重排计算
    }

    getElementById (id: string) {return getElementById(this, id);}
    querySelector (selector: string) {return querySelector(this.children, selector);}
    querySelectorAll (selector: string) {return querySelectorAll(this, selector);}


    get nextSibling (): Node | null {
        if (!this.parentElement) return null;
        const children = this.parentElement.children;
        return children[children.indexOf(this) + 1] || null;
    }
    get previousSibling (): Node | null {
        if (!this.parentElement) return null;
        const children = this.parentElement.children;
        return children[children.indexOf(this) - 1] || null;
    }
}

function oprateAttribute (target: Element, property: TAttributeKey) {
    Object.defineProperty(target, property, {
        get (this: typeof target) { return this.getAttribute(property);},
        set (this: typeof target, v: string) {
            this.setAttribute(property, v);
        }
    });
}