/*
 * @Author: tackchen
 * @Date: 2022-02-26 09:41:19
 * @LastEditors: tackchen
 * @LastEditTime: 2022-02-26 14:19:09
 * @FilePath: /canvas-render-html/src/packages/dom/attribute/class-list.ts
 * @Description: Coding something
 */

import {Element} from '../elements/element';

export class ClassList {
    
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
    }
    /** Returns the number of strings in strings. */
    length: number = 0;
    add (value: string) {
        if (!this.contains(value)) {
            this.value = `${this.value} ${value}`;
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
        }
    };
    replace (value: string, replace: string) {
        if (this.contains(value)) {
            this.value = this.value.replace(new RegExp(`(^| )${value.trim()}( |$)`, 'g'), ` ${replace} `).trim();
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
        return new RegExp(`(^| )${value.trim()}( |$)`).test(this.value);
    }
    item (index: number) {
        return this[index];
    }
    [index: number]: string;

    _element: Element;

    constructor (element: Element) {
        this._element = element;
    }
}