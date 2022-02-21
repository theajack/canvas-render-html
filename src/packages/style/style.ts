/*
 * @Author: tackchen
 * @Date: 2022-02-20 20:05:51
 * @LastEditors: tackchen
 * @LastEditTime: 2022-02-21 00:39:06
 * @FilePath: /canvas-render-html/src/packages/style/style.ts
 * @Description: Coding something
 */

import {IStyle, IStyleDisplay, IStyleOptions} from '@src/types/style';
import {IJson} from '@src/types/util';
import {Element} from '../dom/elements/element';

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

export class Style implements IStyle {

    private _store: IStyle = Object.assign({}, DefaultStyle);
    private _currentStore: IStyleOptions = {};
    
    get color () {return this._store.color;}
    set color (v: string) {
        if (v === this._store.color) return;
        this._store.color = v;
    }
    get backgroundColor () {return this._store.backgroundColor;}
    set backgroundColor (v: string) {
        if (v === this._store.backgroundColor) return;
        this._store.backgroundColor = v;
    }

    get backgroundImage () {return this._store.backgroundImage;}
    set backgroundImage (v: string) {
        if (v === this._store.backgroundImage) return;
        this._store.backgroundImage = v;
    }

    get fontSize () {return this._store.fontSize;}
    set fontSize (v: string) {
        if (v === this._store.fontSize) return;
        this._store.fontSize = v;
    }

    get width () {return this._store.width;}
    set width (v: string) {
        if (v === this._store.width) return;
        this._store.width = v;
    }

    get height () {return this._store.height;}
    set height (v: string) {
        if (v === this._store.height) return;
        this._store.height = v;
    }

    get border () {return this._store.border;}
    set border (v: string) {
        if (v === this._store.border) return;
        this._store.border = v;
    }

    get opacity () {return this._store.opacity;}
    set opacity (v: string | number) {
        if (v === this._store.opacity) return;
        this._store.opacity = v;
    }

    get display () {return this._store.display;}
    set display (v: IStyleDisplay) {
        if (v === this._store.display) return;
        this._store.display = v;
    }

    _parent: Element;

    constructor (parent: Element, style: IStyleOptions = {}) {
        this._parent = parent;
        this._currentStore = style;
    }

    _applyParentStyle () {
        const store = this._parent.parentElement?.style._store;
        if (store) {
            for (const k in store) {
                // this[k as keyof IStyle] = '';
                const currntValue: any = (this._currentStore as IJson)[k];
                (this as IJson)[k] = typeof currntValue === 'undefined' ? (store as IJson)[k] : currntValue;
            }
        }
    }
}