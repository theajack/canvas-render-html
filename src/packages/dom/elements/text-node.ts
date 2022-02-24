/*
 * @Author: tackchen
 * @Date: 2022-02-20 16:57:51
 * @LastEditors: tackchen
 * @LastEditTime: 2022-02-24 17:54:56
 * @FilePath: /canvas-render-html/src/packages/dom/elements/text-node.ts
 * @Description: Coding something
 */

import {ENodeType} from '@src/types/enum';
import {Text} from 'pixi.js';
import {TextNodeBoundary} from '../style/rule/layout/boundary';
import {TextLayout} from '../style/rule/layout/layout';
import {TextNodeStyle} from '../style/style';
import {Element} from './element';
import {Node} from './node';


export class TextNode extends Node {
    nodeType = ENodeType.Text;

    _layout: TextLayout;
    
    _container: Text;

    style: TextNodeStyle;

    _boundary: TextNodeBoundary;
    
    constructor () {
        super();
        this._container = new Text('');
        this._boundary = new TextNodeBoundary(this);
        this._layout = new TextLayout(this);
        this.style = new TextNodeStyle(this);
    }

    private _textContent: string;
    get textContent () {return this._textContent;}
    set textContent (v: string) {
        v = v.replace(/\n/g, '').trim();
        this._textContent = v;
        this._container.text = v;
        this.style.display = 'inline';
    }

    _onParseComplete () {
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