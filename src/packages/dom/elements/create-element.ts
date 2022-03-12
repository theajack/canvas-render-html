/*
 * @Author: tackchen
 * @Date: 2022-02-20 20:17:28
 * @LastEditors: tackchen
 * @LastEditTime: 2022-03-12 23:53:33
 * @FilePath: /canvas-render-html/src/packages/dom/elements/create-element.ts
 * @Description: Coding something
 */

import {EElementName} from '@src/types/enum';
import {BodyElement} from './component/body';
import {DivElement} from './component/div';
import {SpanElement} from './component/span';
import {Element} from './element';
import {TextNode} from './text-node';

export function createElement (name: EElementName) {
    switch (name) {
        case EElementName.Div: return new DivElement();
        case EElementName.Span: return new SpanElement();
        case EElementName.Body: return new BodyElement();
        // todo
        default: return new DivElement();
    }
}

export function createTextNode () {
    return new TextNode();
}

export function createTextNodeWithParent (parent: Element, text = '') {
    const textNode = createTextNode();
    textNode.textContent = text;
    parent.appendChild(textNode);
    textNode._onParseStart();
    textNode._onParseEnd();
    return textNode;
}