/*
 * @Author: tackchen
 * @Date: 2022-02-20 16:57:44
 * @LastEditors: tackchen
 * @LastEditTime: 2022-03-13 19:18:05
 * @FilePath: /canvas-render-html/src/packages/dom/elements/node.ts
 * @Description: Coding something
 */

import {IBoundary, ILayout, IStyleClass} from '@src/types/style';
import {ECompareResult, ENodeType} from '@src/types/enum';
import {Container, Text} from 'pixi.js';
import {Element} from './element';
import {INode} from '@src/types/dom';
import {IJson} from '@src/types/util';
import {getElementByIdFromMap, onAddIntoIdMap, onRemoveFromIdMap} from '../parser/id-map';

let nodeUniqueId = 0;

export function clearNodeUniqueId () {
    nodeUniqueId = 0;
}

export abstract class Node implements INode {
    nodeType: ENodeType;
    parentElement: Element | null;
    _container: Text | Container;

    _layout: ILayout;

    style: IStyleClass;

    _boundary: IBoundary;

    __id: number;
    __deep: number = 0;
    __path: string = '';
    __pathArray: number[];

    get parentNode () {
        return this.parentElement;
    }
    abstract get textContent(): string;
    abstract set textContent(v: string);

    // protected abstract draw (): void;

    constructor () {
        this.__id = nodeUniqueId ++;
    }
    abstract _onParseStart (attributes?: IJson<string>): void;

    _onParseEnd () {
    };

    // 添加到父元素之后会渲染样式
    _onAdd (parent: Element) {
        if (this.parentElement) {
            this.parentElement.removeChild(this);
            this.parentElement = null;
        }
        this.parentElement = parent;
        this.__deep = parent.__deep + 1;
        this.__path = `${parent.__path}/${this.__id}`;
        onAddIntoIdMap(this);
    }

    _clear () {
        this.parentElement?.removeChild(this);
        const _this = this as any;
        _this._layout = null;
        _this._boundary = null;
        _this.parentElement = null;
        _this.style = null;
        onRemoveFromIdMap(this);
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

    _initPathArray () {
        if (!this.__pathArray) this.__pathArray = this.__path.split('/').map(item => parseInt(item));
    }

    // ! 算法： 深度优先中比较顺序
    _compareOrderInDeepFirst (node: Node): ECompareResult {
        if (node.__id === this.__id) {return ECompareResult.EVEN;};

        this._initPathArray();
        node._initPathArray();

        const n = Math.max(this.__pathArray.length, node.__pathArray.length);

        let lastPVId: number = 0;

        for (let deep = 0; deep < n; deep++) {
            const thisPVId = this.__pathArray[deep]; // thisPathValue
            const nodePVId = node.__pathArray[deep]; //
            
            if (thisPVId === nodePVId) {
                lastPVId = thisPVId;
                continue;
            }

            // 当前元素是传入元素的父元素
            if (typeof thisPVId === 'undefined') return ECompareResult.MORE;
            
            // 传入元素是当前元素的父元素
            if (typeof nodePVId === 'undefined') return ECompareResult.LESS;

            const parent = getElementByIdFromMap(lastPVId);

            if (!parent) return ECompareResult.UNKNOW;

            return (parent as Element)._compareChildrenOrder(thisPVId, nodePVId);
        }

        return ECompareResult.EVEN;
    }
}