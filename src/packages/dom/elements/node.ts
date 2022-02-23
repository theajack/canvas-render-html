/*
 * @Author: tackchen
 * @Date: 2022-02-20 16:57:44
 * @LastEditors: tackchen
 * @LastEditTime: 2022-02-23 17:02:41
 * @FilePath: /canvas-render-html/src/packages/dom/elements/node.ts
 * @Description: Coding something
 */

import {ENodeType} from '@src/utils/enum';
import {Container, Text} from 'pixi.js';
import {Element} from './element';

export abstract class Node {
    nodeType: ENodeType;
    parentElement: Element | null;
    _container: Text | Container;

    get parentNode () {
        return this.parentElement;
    }
    abstract get textContent(): string;
    abstract set textContent(v: string);

    // protected abstract draw (): void;

    constructor () {
    }

    abstract _onParseComplete(): void;

    // 添加到父元素之后会渲染样式
    _onAdd (parent: Element) {
        if (this.parentElement) {
            this.parentElement.removeChild(this);
            this.parentElement = null;
        }
        this.parentElement = parent;
        this._renderStyles();
    }

    abstract _renderStyles(): void;
}