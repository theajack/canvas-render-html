/*
 * @Author: tackchen
 * @Date: 2022-02-23 23:15:13
 * @LastEditors: tackchen
 * @LastEditTime: 2022-02-24 21:27:20
 * @FilePath: /canvas-render-html/src/packages/dom/style/rule/layout/boundary.ts
 * @Description: Coding something
 */

import {Element} from '@src/packages/dom/elements/element';
import {Node} from '@src/packages/dom/elements/node';
import {TextNode} from '@src/packages/dom/elements/text-node';
import {IBoundary} from '@src/types/style';

export class TextNodeBoundary implements IBoundary {
    get startX () {return this._element._layout.x;}
    get startY () {return this._element._layout.y;}
    get cornerX () {return this.endX;}
    get cornerY () {return this.startY;}
    get endX () {return this.startX + this._element._layout.width;}
    get endY () {return this.startY + this._element._layout.height;}

    private _element: TextNode;

    constructor (element: TextNode) {
        this._element = element;
    }
}

// 内部元素占有的边界
export class Boundary implements IBoundary {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    cornerX: number;
    cornerY: number;

    private _element: Element;

    constructor (element: Element) {
        this._element = element;
        this._resetCoordinate();
    }

    _resetCoordinate () {
        this.startX = this.endX = this.cornerX = this._element._container.x;
        this.startY = this.endY = this.cornerY = this._element._container.y;
    }

    countBoundary (index?: number) {
        this._resetCoordinate();
        const nodes = this._element.childNodes;
        if (typeof index !== 'number') index = nodes.length;
        for (let i = 0; i < index; i++) {
            const node = nodes[i];
            if (node.style.position !== 'relative') return;
            this.extendBoundary(node);
        }
    }

    reinitBoundary () {
        this.countBoundary();
    }

    extendBoundary (node: Node) {
        if (node.style.position !== 'relative') return;
        // debugger;
        const {x, y, width, height} = node._layout;
        
        if (x < this.startX) { this.startX = x; } // todo 存疑
        if (y < this.startY) { this.startY = y; }

        this.cornerX = x + width;
        this.cornerY = x;

        this.endX = this.cornerX;
        this.endY = y + height;
    }
}