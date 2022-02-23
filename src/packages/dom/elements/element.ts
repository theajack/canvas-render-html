/*
 * @Author: tackchen
 * @Date: 2022-02-20 17:20:38
 * @LastEditors: tackchen
 * @LastEditTime: 2022-02-23 17:00:06
 * @FilePath: /canvas-render-html/src/packages/dom/elements/element.ts
 * @Description: Coding something
 */

import {Style} from '@src/packages/dom/style/style';
import {TAttributeKey} from '@src/types/attribute';
import {EElementName, EElementTagName, ENodeType} from '@src/utils/enum';
import {Container, Sprite} from 'pixi.js';
import {Attribute} from '../attribute/attribute';
import {Node} from './node';

export const BlockElementTags = [
    EElementTagName.Div
];

export abstract class Element extends Node {
    _sprite: Sprite;
    nodeType = ENodeType.Element;

    _container: Container;

    attributes: Attribute;

    private _tagName: EElementTagName;
    get tagName () {return this._tagName;}
    private _innerText: string;
    get innerText () {return this._innerText;}
    set innerText (v: string) {
        v = v.replace(/\n/g, '').trim();
        this._innerText = v;
    }
    get textContent () {return this._innerText;}
    set textContent (v: string) {this.innerText = v;}

    private _innerHTML: string;
    get innerHTML () {return this._innerHTML;}
    set innerHTML (v: string) {
        this._innerHTML = v;
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
        this._container.addChild(node._container);
        node._onAdd(this);
        this._childNodes.push(node);
    }

    removeChild (node: Node) {
        const index = this._childNodes.indexOf(node);
        if (index) {
            this._childNodes.splice(index, 1);
            this._container.removeChild(node._container);
        }
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

    _traverseChild (callback: (n: Node)=>void) {
        const nodes = this.childNodes;

        for (let i = 0; i < nodes.length; i ++) {
            callback(nodes[i]);
        }
    }

    getAttribute (key: TAttributeKey) {
        return this.attributes._getAttribute(key);
    }

    setAttribute (key: TAttributeKey, value: string) {
        return this.attributes._setAttribute(key, value);
    }
}
