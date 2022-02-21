/*
 * @Author: tackchen
 * @Date: 2022-02-20 16:57:44
 * @LastEditors: tackchen
 * @LastEditTime: 2022-02-21 00:01:46
 * @FilePath: /canvas-render-html/src/packages/dom/elements/node.ts
 * @Description: Coding something
 */

import {ENodeType} from '@src/utils/enum';
import {Container, Text} from 'pixi.js';
import {Element} from './element';

export abstract class Node {
    _container: Container
    get container () {return this._container;}
    
    _text: Text;
    nodeType: ENodeType;

    parentElement: Element | null;

    get parentNode () {
        return this.parentElement;
    }

    private _textContent: string;
    get textContent () {return this._textContent;}
    set textContent (v: string) {
        v = v.replace(/\n/g, '').trim();
        this._textContent = v;
        this._text.text = v;
    }

    // protected abstract draw (): void;

    constructor () {
        this._container = new Container();
        this._text = new Text('');
    }

    _onAdd (parent: Element) {
        if (this.parentElement) {
            this.parentElement.removeChild(this);
            this.parentElement = null;
        }
        this.parentElement = parent;
    }
}