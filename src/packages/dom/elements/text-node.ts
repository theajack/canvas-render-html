/*
 * @Author: tackchen
 * @Date: 2022-02-20 16:57:51
 * @LastEditors: tackchen
 * @LastEditTime: 2022-03-13 11:33:38
 * @FilePath: /canvas-render-html/src/packages/dom/elements/text-node.ts
 * @Description: Coding something
 */

import {ENodeType} from '@src/types/enum';
import {Text} from 'pixi.js';
import {TextLayout} from '../style/rule/layout/layout';
import {TextNodeStyle} from '../style/text-style';
import {Element} from './element';
import {Node} from './node';


export class TextNode extends Node {
    nodeType = ENodeType.Text;

    _layout: TextLayout;
    
    _container: Text;

    style: TextNodeStyle;
    
    constructor () {
        super();
        this._container = new Text('');
        this._layout = new TextLayout(this);
        this.style = new TextNodeStyle(this);
        this.style.display = 'inline';
    }

    private _textContent: string;
    get textContent () {return this._textContent;}
    set textContent (v: string) {
        // v = v.replace(/\n/g, '').trim();
        if (v === this._textContent) return;
        this._textContent = v;
        this._container.text = v;
        this._layout._collect();
    }

    _onParseStart () {
        this.style._initInheritStyles();
    }

    _onParseEnd () {
    }

    _onAdd (parent: Element): void {
        super._onAdd(parent);
    }
    _clear () {
        super._clear();
        const _this = this as any;
        _this._container = null;
    }
}