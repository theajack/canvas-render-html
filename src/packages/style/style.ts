/*
 * @Author: tackchen
 * @Date: 2022-02-20 20:05:51
 * @LastEditors: tackchen
 * @LastEditTime: 2022-02-22 01:54:04
 * @FilePath: /canvas-render-html/src/packages/style/style.ts
 * @Description: Coding something
 */

import {IStyle, TStyleDisplay, IStyleOptions, TStyleKey} from '@src/types/style';
import {EElementTagName} from '@src/utils/enum';
import {Element} from '../dom/elements/element';
import {TextNode} from '../dom/elements/text-node';

const DefaultStyle: IStyle = {
    color: '#000000',
    backgroundColor: '#ffffff',
    backgroundImage: '',
    fontSize: '14px',
    width: '',
    height: '',
    border: '',
    opacity: '1',
    display: 'block',
};

const INHERIT_STYLES: TStyleKey[] = ['color', 'fontSize'];

function isInheritStyle (name: TStyleKey) {
    return INHERIT_STYLES.includes(name);
}

export class Style implements IStyle {

    private _store: IStyleOptions = {};

    private _getStyle (name: TStyleKey): any {
        if (
            (typeof this._store[name] === 'undefined')
        ) {
            if (!isInheritStyle(name) || this._element.tagName === EElementTagName.Body) {
                return DefaultStyle[name];
            } else {
                return this._element.parentElement?.style[name];
            }
        } else {
            return this._store[name];
        }
    }

    private _setStyle (name: TStyleKey, value: string, fromInherit = false) {
        if (value !== this._store[name]) {
            if (!fromInherit)
                this._store[name] = value as any;
            if (isInheritStyle(name)) {
                this._element._traverseChild(node => {
                    node._updateStyle();
                });
            }
        }
    }
    
    get color () { return this._getStyle('color'); }
    set color (v: string) { this._setStyle('color', v); }

    get backgroundColor () { return this._getStyle('backgroundColor'); }
    set backgroundColor (v: string) { this._setStyle('backgroundColor', v); }
    
    get backgroundImage () { return this._getStyle('backgroundImage'); }
    set backgroundImage (v: string) { this._setStyle('backgroundImage', v); }

    get fontSize () { return this._getStyle('fontSize'); }
    set fontSize (v: string) { this._setStyle('fontSize', v); }

    get width () { return this._getStyle('width'); }
    set width (v: string) { this._setStyle('width', v); }

    get height () { return this._getStyle('height'); }
    set height (v: string) { this._setStyle('height', v); }

    get border () { return this._getStyle('border'); }
    set border (v: string) { this._setStyle('border', v); }

    get opacity () { return this._getStyle('opacity'); }
    set opacity (v: string) { this._setStyle('opacity', v); }

    get display () { return this._getStyle('display'); }
    set display (v: TStyleDisplay) { this._setStyle('display', v); }

    _element: Element;

    constructor (parent: Element) {
        this._element = parent;
    }

    _applyToTextNode (node: TextNode) {
        INHERIT_STYLES.forEach((key) => {
            const value = this._getStyle(key);
            node._setStyle(key, value);
        });
    }
    _applyToElement (node: Element) {
        INHERIT_STYLES.forEach((key) => {
            if (typeof this._store[key] === 'undefined') { // 继承不覆盖element本身的样式
                const value = this._getStyle(key);
                node.style._setStyle(key, value, true);
            }
        });
    }
}