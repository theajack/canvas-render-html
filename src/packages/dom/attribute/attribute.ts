/*
 * @Author: tackchen
 * @Date: 2022-02-22 22:22:04
 * @LastEditors: tackchen
 * @LastEditTime: 2022-02-24 16:49:33
 * @FilePath: /canvas-render-html/src/packages/dom/attribute/attribute.ts
 * @Description: Coding something
 */
import {IAttributeOptions, TAttributeKey} from '@src/types/attribute';
import {IJson} from '@src/types/util';
import {Element} from '../elements/element';

export class Attribute implements IAttributeOptions {
    private _originAttributes: IJson = {};

    get style () {return this._getAttribute('style');}
    set style (v: string) {this._setAttribute('style', v);}

    get id () {return this._getAttribute('id');}
    set id (v: string) {this._setAttribute('id', v);}

    get class () {return this._getAttribute('class');}
    set class (v: string) {this._setAttribute('class', v);}
    
    get onclick () {return this._getAttribute('onclick');}
    set onclick (v: string) {this._setAttribute('onclick', v);}

    _setAttribute (key: TAttributeKey, value: string) {
        // this._store[key] = value;
        // todo 处理设置属性事件
        key; value;
    }
    _getAttribute (key: TAttributeKey) {
        return this._originAttributes[key] || '';
    }

    _element: Element;
    constructor (element: Element) {
        this._element = element;
        // console.log(this._element);
    }

    _addAttributes (attributes: IJson) {
        for (const k in attributes) {
            if (attributes.indexOf('"') !== -1) {
                attributes[k] = attributes[k].replace(/"/g, '\'');
            }
        }
        this._originAttributes = attributes;
    }
    _initAttributes () {
        const attributes = this._originAttributes;
        
        for (const k in attributes) {
            this._setAttribute(k as TAttributeKey, attributes[k]);
        }
    }

    _buildAttributString () {
        const attributes = this._originAttributes;
        let str = '';
        for (const k in attributes) {
            str += ` ${k}="${attributes[k]}"`;
        }
        return str;
    }
}