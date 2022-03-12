/*
 * @Author: tackchen
 * @Date: 2022-02-25 00:43:23
 * @LastEditors: tackchen
 * @LastEditTime: 2022-03-10 09:16:33
 * @FilePath: /canvas-render-html/src/types/dom.d.ts
 * @Description: Coding something
 */

import {IAttributeOptions, TAttributeKey} from './attribute';
import {EElementTagName, ENodeType} from './enum';
import {IStyleClass} from './style';

export interface IElement extends INode {
    attributes: IAttributeOptions;
    tagName: EElementTagName;
    innerText: string;
    outerHTML: string;
    innerHTML: string;
    children: IElement[];
    appendChild(node: INode): void;
    removeChild(node: INode): void;
    insertBefore(node: INode, refer: INode): void;
    getAttribute(key: TAttributeKey): string;
    setAttribute(key: TAttributeKey, value: string): void;
    getElementById(id: string): IElement | null;
    querySelector(selector: string): IElement | null;
    querySelectorAll(selector: string): IElement[];
}
export interface INode {
    nodeType: ENodeType;
    parentElement: IElement | null;
    parentNode: IElement | null;
    textContent: string;
    style: IStyleClass;
}