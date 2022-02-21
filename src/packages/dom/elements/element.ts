/*
 * @Author: tackchen
 * @Date: 2022-02-20 17:20:38
 * @LastEditors: tackchen
 * @LastEditTime: 2022-02-22 01:47:57
 * @FilePath: /canvas-render-html/src/packages/dom/elements/element.ts
 * @Description: Coding something
 */

import {Style} from '@src/packages/style/style';
import {EElementName, EElementTagName, ENodeType} from '@src/utils/enum';
import {Container, Sprite} from 'pixi.js';
import {Node} from './node';
import {TextNode} from './text-node';

export abstract class Element extends Node {
    _sprite: Sprite;
    nodeType = ENodeType.Element;

    _container: Container;

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
    
    appendChild (node: Element) {
        this._container.addChild(node._container);
        node._onAdd(this);
        this._childNodes.push(node);
    }

    _appendText (node: TextNode) {
        this._container.addChild(node._text);
        node.parentElement = this;
        this._childNodes.push(node);
    }

    removeChild (node: Element) {
        const index = this._childNodes.indexOf(node);
        if (index) {
            this._childNodes.splice(index, 1);
            this._container.removeChild(node._container);
        }
    }

    // style

    style: Style;

    draw () {
        
    }

    // addEventListener(type: string, callback: EventListenerOrEventListenerObject | null, options?: boolean | AddEventListenerOptions): void {
        
    // }
    constructor (name: EElementName) {
        super();
        this._container = new Container();
        this._tagName = name.toUpperCase() as EElementTagName;
        this.style = new Style(this);
        this._sprite = new Sprite();
        this._container.addChild(this._sprite);
    }

    _onAdd (parent: Element): void {
        if (this.parentElement) {
            this.parentElement.removeChild(this);
            this.parentElement = null;
        }
        this.parentElement = parent;
    }

    _onParseComplete () {
        if (this.parentElement?.tagName === EElementTagName.Body) {
            this._updateStyle();
        }
    }

    _traverseChild (callback: (n: Node)=>void) {
        const nodes = this.childNodes;

        for (let i = 0; i < nodes.length; i ++) {
            callback(nodes[i]);
        }
    }
    _updateStyle () {
        this.parentElement?.style._inheritToChildElement(this);
    }
}
