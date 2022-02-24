/*
 * @Author: tackchen
 * @Date: 2022-02-20 16:55:49
 * @LastEditors: tackchen
 * @LastEditTime: 2022-02-25 00:10:10
 * @FilePath: /canvas-render-html/src/packages/dom/parser/parser.ts
 * @Description: Coding something
 */

import {EElementName} from '@src/types/enum';
import {Parser} from 'htmlparser2';
import {BodyElement} from '../elements/component/body';
import {createElement, createTextNode} from '../elements/create-element';
import {Element} from '../elements/element';

export function parseHtml (
    htmlString: string,
    parentElement: Element = new BodyElement()
): Element {
    let lastParent: Element;
    let parent : Element = parentElement;
    let current: Element = parentElement;
    const parser = new Parser({
        onopentag (name: EElementName, attributes) {
            lastParent = parent;
            parent = current;
            current = createElement(name);
            parent.appendChild(current);
            current.attributes._initAttributes(attributes); // 先初始化style
            current.style._initStyle();
            current.style._renderStyles(); //

            // currentNode = createElement(name);
            // console.log('onopentag', name, attributes);
        },
        ontext (text) {
            const textNode = createTextNode();
            textNode.textContent = text;
            current.appendChild(textNode);
            textNode._onParseComplete();
            textNode.style._renderStyles();
            // debugger;

            current._layout._layoutLastChild();
            // console.log('ontext', text);
        },
        onclosetag () {
            current._onParseComplete();
            parent._layout._layoutLastChild();
            // debugger;
            current = parent;
            parent = lastParent;
            // console.log(tagname);
        },
        onend () {
        }
    });
    parser.write(htmlString);
    parser.end();
    return parentElement;
}
(window as any).parse = Parser;