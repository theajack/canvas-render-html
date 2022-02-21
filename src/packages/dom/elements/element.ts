/*
 * @Author: tackchen
 * @Date: 2022-02-20 17:20:38
 * @LastEditors: tackchen
 * @LastEditTime: 2022-02-21 00:29:03
 * @FilePath: /canvas-render-html/src/packages/dom/elements/element.ts
 * @Description: Coding something
 */

import {Style} from '@src/packages/style/style';
import {applyStyleToText} from '@src/packages/style/style-util';
import {EElementName, ENodeType} from '@src/utils/enum';
import {Sprite} from 'pixi.js';
import {Node} from './node';

export abstract class Element extends Node {
    _sprite: Sprite;
    nodeType = ENodeType.Element;

    private _tagName: string;
    get tagName () {return this._tagName;}
    private _innerText: string;
    get innerText () {return this._innerText;}
    set innerText (v: string) {
        v = v.replace(/\n/g, '').trim();
        this._innerText = v;
        this._text.text = v;
    }

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

    draw () {
        
    }

    // addEventListener(type: string, callback: EventListenerOrEventListenerObject | null, options?: boolean | AddEventListenerOptions): void {
        
    // }
    constructor (name: EElementName) {
        super();
        this._tagName = name;
        this.style = new Style(this);
        this._sprite = new Sprite();
        this._container.addChild(this._sprite, this._text);
    }
    
    _onAdd (parent: Element): void {
        super._onAdd(parent);

        applyStyleToText(this.style, this._text);

        this.style._applyParentStyle();
    }
}
