/*
 * @Author: tackchen
 * @Date: 2022-02-26 09:41:19
 * @LastEditors: tackchen
 * @LastEditTime: 2022-03-12 16:55:31
 * @FilePath: /canvas-render-html/src/packages/dom/attribute/class-list.ts
 * @Description: Coding something
 */

import {Element} from '../elements/element';

export class ClassList {

    _inited = false;
    
    get value () {return this._element.attributes.class?.value.trim() || '';};
    set value (v: string) {
        if (this._element.attributes.class) {
            this._element.attributes.class.value = v;
        }
    }
    _initClassName () {
        const classArray = this.value.split(' ');
        let length = 0;
        for (const item of classArray) {
            if (item) {
                this[length] = item;
                length ++;
            }
        }
        if (this.length > length) {
            for (let i = length; i < this.length; i++) {
                delete this[i];
            }
        }
        this.length = length;

        if (this._inited) {
            this._element._collectSelectorChange();
        } else {
            this._inited = true;
        }

    }
    /** Returns the number of strings in strings. */
    length: number = 0;
    add (value: string) {
        if (!this.contains(value)) {
            this.value = `${this.value} ${value}`;
            this._element._collectSelectorChange();
        }
    };
    entries () {
        const arr: (string | number)[][] = [];
        for (let i = 0; i < this.length; i++) {
            arr.push([i, this[i]]);
        }
        return arr;
    };
    forEach (call: (value: string, index: number)=>void) {
        this.entries().forEach(item => {call(item[1] as string, item[0] as number);});
    };
    keys () {
        return this.entries().map(item => item[0] as number);
    };
    remove (value: string) {
        if (this.contains(value)) {
            this.value = this.value.replace(new RegExp(`(^| )${value.trim()}( |$)`, 'g'), ' ').trim();
            this._element._collectSelectorChange();
        }
    };
    replace (value: string, replace: string) {
        if (this.contains(value)) {
            this.value = this.value.replace(new RegExp(`(^| )${value.trim()}( |$)`, 'g'), ` ${replace} `).trim();
            this._element._collectSelectorChange();
        }
    };
    toString () {
        return this.value.trim();
    };
    toggle (value: string) {
        if (this.contains(value)) {
            this.remove(value);
        } else {
            this.add(value);
        }
    };
    values () {
        return this.entries().map(item => item[1] as string);
    };
    contains (value: string) {
        value = value.trim();
        if (!value) return false;
        return new RegExp(`(^| )${value}( |$)`).test(this.value);
    }
    item (index: number) {
        return this[index];
    }
    _matchClassName (className: string) {
        className = className.trim();
        if (!className) return false;
        const array = className.split(' ');
        for (const name of array) {
            if (name && !this.contains(name)) return false;
        }
        return true;
    }
    [index: number]: string;

    _element: Element;

    constructor (element: Element) {
        this._element = element;
    }
}