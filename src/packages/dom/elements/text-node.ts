/*
 * @Author: tackchen
 * @Date: 2022-02-20 16:57:51
 * @LastEditors: tackchen
 * @LastEditTime: 2022-02-23 17:16:20
 * @FilePath: /canvas-render-html/src/packages/dom/elements/text-node.ts
 * @Description: Coding something
 */

import {IStyleOptions, TStyleKey} from '@src/types/style';
import {IJson} from '@src/types/util';
import {ENodeType} from '@src/utils/enum';
import {Text} from 'pixi.js';
import {INHERIT_STYLES} from '../style/style';
import {Element} from './element';
import {Node} from './node';

export const TextStyleNameMap: {
    [prop in TStyleKey]?: string;
} = {
    color: 'fill',
    fontSize: 'fontSize',
};

const TEXT_STYLES: TStyleKey[] = ['color', 'fontSize'];

export class TextNode extends Node {
    nodeType = ENodeType.Text;

    _style: IStyleOptions = {};
    
    _container: Text;
    
    constructor () {
        super();
        this._container = new Text('');
    }
    private _textContent: string;
    get textContent () {return this._textContent;}
    set textContent (v: string) {
        v = v.replace(/\n/g, '').trim();
        this._textContent = v;
        this._container.text = v;
    }

    _setStyle (name: TStyleKey, value: string) {
        if (!TEXT_STYLES.includes(name)) return;
        
        if (this._style[name] !== value) {
            this._style[name] = value as any;
            this._applyStyleIntoPixi(name);
        }
    }

    _renderStyles () {
        INHERIT_STYLES.forEach(key => {
            const value = this.parentElement?.style[key];
            if (value) {
                this._setStyle(key, value);
            }
        });
    }

    _onParseComplete () {
        
    }

    _applyStyleIntoPixi (name: TStyleKey) {
        const key = TextStyleNameMap[name];
        if (key) { // 直接可以将样式映射成pixi text的样式
            (this._container.style as IJson)[key] = this._style[name];
        }

        // todo 其他样式
    }

    _onAdd (parent: Element): void {
        super._onAdd(parent);
    }
}