/*
 * @Author: tackchen
 * @Date: 2022-02-20 20:05:51
 * @LastEditors: tackchen
 * @LastEditTime: 2022-02-23 17:21:21
 * @FilePath: /canvas-render-html/src/packages/dom/style/style.ts
 * @Description: Coding something
 */

import {IStyle, TStyleDisplay, IStyleOptions, TStyleKey} from '@src/types/style';
import {EElementTagName, ENodeType} from '@src/utils/enum';
import {BlockElementTags, Element} from '../elements/element';
import {TextNode} from '../elements/text-node';
import {parseStyleAttribute} from './style-parser';

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

export const INHERIT_STYLES: TStyleKey[] = ['color', 'fontSize'];

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

    _setStyle (name: TStyleKey, value: string, fromInherit = false) {
        if (value !== this._store[name]) {
            if (!fromInherit) { // 对于继承来的样式不更新_store
                this._store[name] = value as any;
            }
            this._applyStyleIntoPixi(name);
            
            // 修改style时如果是可继承样式 则更改子元素样式
            this._inheritToChildren(name);
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

    constructor (element: Element) {
        this._element = element;
        if (BlockElementTags.includes(element.tagName)) {
            this._store.display = 'block';
        } else {
            this._store.display = 'inline';
        }
    }

    private _applyStyleIntoPixi (name: TStyleKey) {
        // todo 修改pixi的样式
        name;
        // console.log(name);
    }

    _setStyleAttribute (styleStr: string, fromInit = false) {
        const style = parseStyleAttribute(styleStr);

        for (const k in style) {
            const key = k as TStyleKey;
            this._setStyle(key, style[key] as string);
        }

        if (!fromInit) {
            this._renderStyles();
        }
    }

    // 将当前样式继承给子节点
    _inheritToChildren (name: TStyleKey) {
        if (isInheritStyle(name)) {
            const value = this._getStyle(name);
            this._element._traverseChild(child => {
                if (child.nodeType === ENodeType.Text) {
                    (child as TextNode)._setStyle(name, value);
                } else if (child.nodeType === ENodeType.Element) {
                    const style = (child as Element).style;
                    if (typeof style._store[name] === 'undefined') { // 继承不覆盖child本身的样式
                        style._setStyle(name, value, true);
                    }
                }
            });
        }
    }

    _renderStyles () {
        for (const k in DefaultStyle) {
            this._applyStyleIntoPixi(k as TStyleKey);
        }
    }
}