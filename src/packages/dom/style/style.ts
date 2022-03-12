/*
 * @Author: tackchen
 * @Date: 2022-02-20 20:05:51
 * @LastEditors: tackchen
 * @LastEditTime: 2022-03-12 15:18:07
 * @FilePath: /canvas-render-html/src/packages/dom/style/style.ts
 * @Description: Coding something
 */

import {TStyleDisplay, IStyleOptions, TStyleKey, TStylePosition, IStyleClass} from '@src/types/style';
import {Element} from '../elements/element';
import {parseStyleAttribute} from './style-parser';
import {INHERIT_STYLES, isImportantValue, isInheritStyle, parseCssImportantValue} from './style-util';
import {getContext} from '@src/packages/context/context';
import {StyleChangeManager} from '@src/packages/render/render-manager';
import {getDefaultStyle} from './default-style';

export class Style implements IStyleClass {
    // 内联样式中的 important
    _inlineImportantKeys: Set<TStyleKey> = new Set();
    
    // css 中的 important
    _importantKeys: Set<TStyleKey> = new Set();

    // 内联样式 含有important
    _inlineStyle: IStyleOptions = {};
    
    // 继承样式 含有important
    _inheritStyle: IStyleOptions = {};

    // 内联样式 + css样式 + 不含有important信息 不包含继承样式 已经处理过了继承样式
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
            return this._inheritStyle[name] || getDefaultStyle(this._element, name);
        } else {
            return this._store[name];
        }
    }

    _getInheritStyle (name: TStyleKey): string { // todo
        if (
            (typeof this._store[name] === 'undefined')
        ) {
            if (!this._element.parentElement) {
                return getDefaultStyle(this._element, name);
            } else {
                return this._element.parentElement.style[name];
            }
        }
        return '';
    }
    _setStyle (name: TStyleKey, value: string) {
        if (value !== this._store[name]) {
            this._inlineStyle[name] = value;
            const importantStyle = parseCssImportantValue(value);

            if (importantStyle) {
                value = importantStyle;
                this._inlineImportantKeys.add(name);
            } else {
                if (this._importantKeys.has(name) || this._inlineImportantKeys.has(name)) {
                    return;
                }
            }

            this._store[name] = value;

            this._collectSingleChange(name, value);
        }
    }

    private _applyStyleIntoPixi (name: TStyleKey) {
        // todo 修改pixi的样式
        name;
        // console.log(name);
    }

    _setStyleAttribute (styleStr: string) {
        const style = parseStyleAttribute(styleStr);
        this._inlineStyle = style;
        this._inlineImportantKeys.clear();

        for (const k in style) {
            const key = k as TStyleKey;
            if (isImportantValue(style[key])) {
                this._inlineImportantKeys.add(key);
            }
        }

        const styles = getContext('cssom').countStyles(this._element);
        this._store = Object.assign({}, styles.styles); // ! important 消除引用关系
        this._importantKeys = new Set(Object.keys(styles.importantStyles) as TStyleKey[]);

        this._collectChange(styles.styles);
    }

    _initInheritStyles () {
        this._inheritStyle = {};
        INHERIT_STYLES.forEach(k => { // 添加继承属性
            if (!this._store[k]) {
                const value = this._getInheritStyle(k);
                if (value) {
                    this._inheritStyle[k] = value as any;
                    StyleChangeManager.collectSingleChange(this._element, k, value);
                }
            }
        });
    }

    _isSelfStyle (name: TStyleKey) {
        return typeof this._store[name] !== 'undefined';
    }

    _renderStyles (styles: IStyleOptions) {
        for (const k in styles) {
            this._applyStyleIntoPixi(k as TStyleKey);
        }
    }

    // 收集样式改变 不包含继承样式
    _collectChange (styles: IStyleOptions) {
        StyleChangeManager.collectChanges(this._element, styles);
        for (const k in styles) {
            const key = k as TStyleKey;
            this._inheritSingleStyleToChild(key, styles[key] as string);
        }
    }

    _collectSingleChange (name: TStyleKey, value: string) {
        const element = this._element;
        StyleChangeManager.collectSingleChange(element, name, value);

        this._inheritSingleStyleToChild(name, value);
    }

    // 收集继承样式改变
    _inheritSingleStyleToChild (name: TStyleKey, value: string) {
        if (isInheritStyle(name)) {
            this._element.childNodes.forEach(node => {
                node.style._collectInheritChange(name, value);
            });
        }
    }

    // 收集继承样式改变
    _collectInheritChange (name: TStyleKey, value: string) {
        if (!this._isSelfStyle(name)) { // 自己没有的样式才需要向下继承
            this._inheritStyle[name] = value;
            StyleChangeManager.collectSingleChange(this._element, name, value);
            this._element.childNodes.forEach(node => {
                node.style._collectInheritChange(name, value);
            });
        }
    }
}

// 装饰器 用来封装样式的 get set
function oprateStyle (target: Style, property: TStyleKey) {
    Object.defineProperty(target, property, {
        get (this: typeof target) { return this._getStyle(property);},
        set (this: typeof target, v: string) {
            this._setStyle(property, v);
        }
    });
}
