/*
 * @Author: tackchen
 * @Date: 2022-02-22 22:22:04
 * @LastEditors: tackchen
 * @LastEditTime: 2022-03-13 18:58:00
 * @FilePath: /canvas-render-html/src/packages/dom/attribute/attribute.ts
 * @Description: Coding something
 */
import {IAttributeOptions, IAttributePair, TAttributeKey} from '@src/types/attribute';
import {IJson} from '@src/types/util';
import {Element} from '../elements/element';
import {onAddIntoAttrIdMap, onRemoveFromAttrIdMap} from '../parser/id-map';

export class AttributePair implements IAttributePair {
    private _name: TAttributeKey;
    get name () {return this._name;}
    private _value: string;
    get value () {return this._value;}
    set value (v: string) {
        if (this._value === v) return;
        this._value = v;

        if (this.name === 'id') {
            if (this._value) {
                onRemoveFromAttrIdMap(this._element, this._value);
            }
            onAddIntoAttrIdMap(this._element, v);
        }

        if (this.name === 'class') {
            this._element.classList._initClassName();
        } else if (this.name === 'style') {
            this._element.style._setStyleAttribute(v);
        } else {
            this._element._collectSelectorChange();
        }
        // todo
    }
    _element: Element;
    constructor (element: Element, name: TAttributeKey) {
        this._element = element;
        this._name = name;
    }
}

export class Attribute implements IAttributeOptions {
    _nameList: Set<TAttributeKey>;
    style?: IAttributePair;
    id?: IAttributePair;
    class?: IAttributePair;
    onclick?: IAttributePair;
    name?: IAttributePair;

    _setAttribute (key: TAttributeKey, value: string) {
        this._nameList.add(key);
        if (!this[key]) {
            this[key] = new AttributePair(this._element, key);
        }

        (this[key] as AttributePair).value = value; // AttributePair 对象中更新事件
    }
    _getAttribute (key: TAttributeKey) {
        return this[key]?.value || '';
    }
    _hasAttribute (key: TAttributeKey) {
        return this._nameList.has(key);
    }

    _markRemoveIdAttr () {
        const id = this.id?.value;
        if (id) {
            onRemoveFromAttrIdMap(this._element, id);
        }
    }

    _removeAttribute (key: TAttributeKey) {
        if (key === 'id') {
            this._markRemoveIdAttr();
        }
        (this[key] as any) = undefined;
        if (this._nameList.has(key)) {
            this._nameList.delete(key);
            this._element._collectSelectorChange();
            // todo 处理设置属性事件
        }
    }

    _element: Element;
    constructor (element: Element) {
        this._element = element;
        this._nameList = new Set();
        // console.log(this._element);
    }

    _initAttributes (attributes: IJson<string>) {
        if (!attributes.style) attributes.style = ''; // 初始化 style
        if (!attributes.class) attributes.class = ''; // 初始化 classList
        for (const k in attributes) {
            let value = attributes[k];
            if (value.indexOf('"') !== -1) {value = value.replace(/"/g, '\'');}
            this._setAttribute(k as TAttributeKey, value);
        }
    }
    // _initAttributes () {
    //     const attributes = this._originAttributes;
        
    //     for (const k in attributes) {
    //         this._setAttribute(k as TAttributeKey, attributes[k]);
    //     }
    // }

    _buildAttributString () {
        let str = '';
        this._nameList.forEach(name => {
            const value = this[name]?.value;
            if (value) {
                str += ` ${name}="${value}"`;
            }
        });
        return str;
    }
}