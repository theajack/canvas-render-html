/*
 * @Author: tackchen
 * @Date: 2022-02-22 22:22:04
 * @LastEditors: tackchen
 * @LastEditTime: 2022-03-01 22:21:07
 * @FilePath: /canvas-render-html/src/packages/dom/attribute/attribute.ts
 * @Description: Coding something
 */
import {IAttributeOptions, IAttributePair, TAttributeKey} from '@src/types/attribute';
import {IJson} from '@src/types/util';
import {Element} from '../elements/element';

export class AttributePair implements IAttributePair {
    private _name: TAttributeKey;
    get name () {return this._name;}
    private _value: string;
    get value () {return this._value;}
    set value (v: string) {
        this._value = v;
        if (this.name === 'class') {
            this._element.classList._initClassName();
        } else if (this.name === 'style') {
            this._element.style._setStyleAttribute(v);
        }
        
        // todo
    }
    _element: Element;
    constructor (element: Element, name: TAttributeKey, value = '') {
        this._element = element;
        this._name = name;
        this._value = value;
    }
}

export class Attribute implements IAttributeOptions {
    _nameList: TAttributeKey[] = [];
    style?: IAttributePair;
    id?: IAttributePair;
    class?: IAttributePair;
    onclick?: IAttributePair;
    name?: IAttributePair;

    _setAttribute (key: TAttributeKey, value: string) {
        if (!this._nameList.includes(key)) {
            this._nameList.push(key);
        }
        if (!this[key]) {
            this[key] = new AttributePair(this._element, key);
        }
        (this[key] as AttributePair).value = value; // AttributePair 对象中更新事件
        
    }
    _getAttribute (key: TAttributeKey) {
        return this[key]?.value || '';
    }
    _hasAttribute (key: TAttributeKey) {
        return this._nameList.includes(key);
    }

    _removeAttribute (key: TAttributeKey) {
        (this[key] as any) = undefined;
        const index = this._nameList.indexOf(key);
        if (index >= 0) this._nameList.splice(index, 1);
        // todo 处理设置属性事件
    }

    _element: Element;
    constructor (element: Element) {
        this._element = element;
        // console.log(this._element);
    }

    _initAttributes (attributes: IJson<string>) {
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