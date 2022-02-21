/*
 * @Author: tackchen
 * @Date: 2022-02-20 16:57:44
 * @LastEditors: tackchen
 * @LastEditTime: 2022-02-22 01:17:10
 * @FilePath: /canvas-render-html/src/packages/dom/elements/node.ts
 * @Description: Coding something
 */

import {ENodeType} from '@src/utils/enum';
import {Element} from './element';

export abstract class Node {
    nodeType: ENodeType;
    parentElement: Element | null;

    get parentNode () {
        return this.parentElement;
    }
    abstract get textContent(): string;
    abstract set textContent(v: string);

    // protected abstract draw (): void;

    constructor () {
    }

    abstract _updateStyle(): void;
}