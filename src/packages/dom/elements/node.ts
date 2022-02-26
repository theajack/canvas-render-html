/*
 * @Author: tackchen
 * @Date: 2022-02-20 16:57:44
 * @LastEditors: tackchen
 * @LastEditTime: 2022-02-26 18:02:26
 * @FilePath: /canvas-render-html/src/packages/dom/elements/node.ts
 * @Description: Coding something
 */

import {IBoundary, ILayout, IStyleOptions} from '@src/types/style';
import {ENodeType} from '@src/types/enum';
import {Container, Text} from 'pixi.js';
import {Element} from './element';
import {INode} from '@src/types/dom';

export abstract class Node implements INode {
    nodeType: ENodeType;
    parentElement: Element | null;
    _container: Text | Container;

    _layout: ILayout;

    style: IStyleOptions;

    _boundary: IBoundary;

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
    }

    _clear () {
        this.parentElement?.removeChild(this);
        const _this = this as any;
        _this._layout = null;
        _this._boundary = null;
        _this.parentElement = null;
        _this.style = null;
    }

    get nextElementSibling (): Element | null {
        let result = this.nextSibling;
        while (result?.nodeType === ENodeType.Text) {
            result = result.nextSibling;
        }
        if (result) {return result as Element;}
        return result;
    }
    get previousElementSibling (): Element | null {
        let result = this.previousSibling;
        while (result?.nodeType === ENodeType.Text) {
            result = result.previousSibling;
        }
        if (result) {return result as Element;}
        return result;
    }

    get nextSibling (): Node | null {
        if (!this.parentElement) return null;
        const children = this.parentElement.childNodes;
        return children[children.indexOf(this) + 1] || null;
    }
    get previousSibling (): Node | null {
        if (!this.parentElement) return null;
        const children = this.parentElement.childNodes;
        return children[children.indexOf(this) - 1] || null;
    }
}