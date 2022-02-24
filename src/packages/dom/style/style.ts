/*
 * @Author: tackchen
 * @Date: 2022-02-20 20:05:51
 * @LastEditors: tackchen
 * @LastEditTime: 2022-02-24 22:03:18
 * @FilePath: /canvas-render-html/src/packages/dom/style/style.ts
 * @Description: Coding something
 */

import {IStyle, TStyleDisplay, IStyleOptions, TStyleKey, TStylePosition} from '@src/types/style';
import {IJson} from '@src/types/util';
import {EElementTagName, ENodeType} from '@src/types/enum';
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
    position: 'relative',
    left: '',
    top: '',
};

export const TextStyleNameMap: {
    [prop in TStyleKey]?: string;
} = {
    color: 'fill',
    fontSize: 'fontSize',
};

const TEXT_STYLES: TStyleKey[] = ['color', 'fontSize'];

export const INHERIT_STYLES: TStyleKey[] = ['color', 'fontSize'];

function isInheritStyle (name: TStyleKey) {
    return INHERIT_STYLES.includes(name);
}


export class TextNodeStyle implements IStyleOptions {
    
    
    display?: TStyleDisplay;
    position?: TStylePosition;

    get color () { return this._getStyle('color'); }
    get fontSize () { return this._getStyle('fontSize'); }
    // todo 其他可继承属性

    private _getStyle (name: TStyleKey): string {
        if (!TEXT_STYLES.includes(name)) return '';
        return this._element.parentElement?.style[name] || '';
    }

    _element: TextNode;

    constructor (element: TextNode) {
        this._element = element;

        this.display = 'inline';
        this.position = 'relative';

    }

    _setStyle (name: TStyleKey) {
        if (!TEXT_STYLES.includes(name)) return;
        this._applyStyleIntoPixi(name);
    }

    _applyStyleIntoPixi (name: TStyleKey) {
        const key = TextStyleNameMap[name];
        if (key) { // 直接可以将样式映射成pixi text的样式
            const value = this._getStyle(name);
            if (value) {
                (this._element._container.style as IJson)[key] = value;
            }
        }

        // todo 其他样式
    }
    _renderStyles () {
        INHERIT_STYLES.forEach(key => {
            this._setStyle(key);
        });
    }
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

    get position () { return this._getStyle('position'); }
    set position (v: TStylePosition) { this._setStyle('position', v); }

    get left () { return this._getStyle('left'); }
    set left (v: string) { this._setStyle('left', v); }

    get top () { return this._getStyle('top'); }
    set top (v: string) { this._setStyle('top', v); }

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

        INHERIT_STYLES.forEach(k => { // 添加继承属性
            if (!style[k])
                style[k] = this._getStyle(k);
        });

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
                    (child as TextNode).style._setStyle(name);
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

    _initStyle () {
        const str = this._element.attributes.style;
        this._setStyleAttribute(str, true);
    }
}