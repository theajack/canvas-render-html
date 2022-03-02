/*
 * @Author: tackchen
 * @Date: 2022-02-20 20:05:51
 * @LastEditors: tackchen
 * @LastEditTime: 2022-03-02 20:52:00
 * @FilePath: /canvas-render-html/src/packages/dom/style/style.ts
 * @Description: Coding something
 */

import {IStyle, TStyleDisplay, IStyleOptions, TStyleKey, TStylePosition} from '@src/types/style';
import {EElementTagName, ENodeType} from '@src/types/enum';
import {Element} from '../elements/element';
import {TextNode} from '../elements/text-node';
import {parseStyleAttribute} from './style-parser';
import {DefaultStyle} from './default-style';
import {INHERIT_STYLES, isInheritStyle, isRelayoutStyle} from './style-util';

export class Style implements IStyle {
    _inlineStyle: IStyleOptions = {}; // 内联样式 含有important
    // 内联样式 + css样式 不含有important信息 不包含继承样式 已经处理过了继承样式
    _store: IStyleOptions = {};
    @oprateStyle color: string;
    @oprateStyle fontSize: string;
    @oprateStyle backgroundColor: string;
    @oprateStyle backgroundImage: string;
    @oprateStyle width: string;
    @oprateStyle height: string;
    @oprateStyle border: string;
    @oprateStyle opacity: string;
    @oprateStyle display: TStyleDisplay;
    @oprateStyle position: TStylePosition;
    @oprateStyle left: string;
    @oprateStyle top: string;

    _element: Element;
    constructor (element: Element) {
        this._element = element;
    }

    _getStyle (name: TStyleKey): any {
        if (
            (typeof this._store[name] === 'undefined')
        ) {
            if (!isInheritStyle(name) || this._element.tagName === EElementTagName.Body) {
                const value = DefaultStyle[name];
                return (typeof value === 'function') ? value(this._element) : value;
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

            if (isRelayoutStyle(name)) {
                this._element.parentElement?._layout._reLayoutChild(this._element);
            }
        }
    }

    private _applyStyleIntoPixi (name: TStyleKey) {
        // todo 修改pixi的样式
        name;
        // console.log(name);
    }

    _setStyleAttribute (styleStr: string, fromInit = false) {
        const style = parseStyleAttribute(styleStr);
        this._inlineStyle = style;

        for (const k in style) {
            const key = k as TStyleKey;
            this._setStyle(key, style[key] as string);
        }

        INHERIT_STYLES.forEach(k => { // 添加继承属性
            if (!style[k])
                this._setStyle(k, this._getStyle(k), true);
        });

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
}

function oprateStyle (target: Style, property: TStyleKey) {
    Object.defineProperty(target, property, {
        get (this: typeof target) { return this._getStyle(property);},
        set (this: typeof target, v: string) {
            this._setStyle(property, v);
        }
    });
}
