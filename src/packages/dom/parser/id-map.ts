/*
 * @Author: tackchen
 * @Date: 2022-03-13 12:49:51
 * @LastEditors: tackchen
 * @LastEditTime: 2022-03-13 20:14:46
 * @FilePath: /canvas-render-html/src/packages/dom/parser/id-map.ts
 * @Description: Coding something
 */

import {ECompareResult} from '@src/types/enum';
import {IJson} from '@src/types/util';
import {Element} from '../elements/element';
import {Node} from '../elements/node';

// node id 与 node 的map
let elementIdMap: Record<number, Node> = {};

export function onAddIntoIdMap (node: Node) {
    elementIdMap[node.__id] = node;
}
export function onRemoveFromIdMap (node: Node) {
    delete elementIdMap[node.__id];
}

export function getElementByIdFromMap (id: number): Node | null {
    return elementIdMap[id] || null;
}

// attrid 与 nodeid array的集合
let elementAttrIdMap: IJson<number[]> = {};

export function getElementByAttrIdFromMap (id: string) {
    const list = elementAttrIdMap[id];
    if (!list || list.length === 0) {
        return null;
    }
    return getElementByIdFromMap(list[list.length - 1]) as Element;
}

export function onRemoveFromAttrIdMap (element: Element, id: string) {
    const list = elementAttrIdMap[id];
    if (!list || list.length === 0) return;

    const elementId = element.__id;

    const index = list.indexOf(elementId);
    if (index >= 0) {
        list.splice(index, 1);
    }

    if (list.length === 0) {
        delete elementAttrIdMap[id];
    }
}

export function onAddIntoAttrIdMap (element: Element, id: string) {
    if (!id) return;
    const elementId = element.__id;
    const list = elementAttrIdMap[id];
    if (!list || list.length === 0) {
        elementAttrIdMap[id] = [elementId];
    } else {
        for (let i = 0; i < list.length; i++) {
            if (elementId === list[i]) return;
            const value = element._compareOrderInDeepFirst(elementIdMap[list[i]]);

            if (value === ECompareResult.EVEN) return;
            if (value === ECompareResult.LESS) {
                list.splice(i, 0, elementId);
                return;
            }
        }
        list.push(elementId);
    }
}

export function clearAllIdMap () {
    elementIdMap = {};
    elementAttrIdMap = {};
}

(window as any).elementIdMap = elementIdMap;
(window as any).elementAttrIdMap = elementAttrIdMap;
(window as any).getElementByAttrIdFromMap = getElementByAttrIdFromMap;
