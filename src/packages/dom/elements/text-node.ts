/*
 * @Author: tackchen
 * @Date: 2022-02-20 16:57:51
 * @LastEditors: tackchen
 * @LastEditTime: 2022-02-22 01:48:32
 * @FilePath: /canvas-render-html/src/packages/dom/elements/text-node.ts
 * @Description: Coding something
 */

import {IStyleOptions, TStyleKey} from '@src/types/style';
import {IJson} from '@src/types/util';
import {ENodeType} from '@src/utils/enum';
import {Text} from 'pixi.js';
import {Node} from './node';

export const TextStyleNameMap: {
    [prop in TStyleKey]?: string;
} = {
    color: 'fill',
};

const TEXT_STYLES: TStyleKey[] = ['color', 'fontSize'];

export class TextNode extends Node {
    nodeType = ENodeType.Text;

    _style: IStyleOptions = {};
    
    _text: Text;
    
    constructor () {
        super();
        this._text = new Text('');
    }
    private _textContent: string;
    get textContent () {return this._textContent;}
    set textContent (v: string) {
        v = v.replace(/\n/g, '').trim();
        this._textContent = v;
        this._text.text = v;
    }

    _setStyle (name: TStyleKey, value: string) {
        if (!TEXT_STYLES.includes(name)) return;
        if (this._style[name] !== value) {
            this._style[name] = value as any;
            const key = TextStyleNameMap[name] || name;
            (this._text.style as IJson)[key] = value;
        }
    }

    _updateStyle () {
        this.parentElement?.style._applyToTextNode(this);
    }
}