/*
 * @Author: tackchen
 * @Date: 2022-02-20 16:55:49
 * @LastEditors: tackchen
 * @LastEditTime: 2022-02-24 17:32:17
 * @FilePath: /canvas-render-html/src/packages/dom/parser/parser.ts
 * @Description: Coding something
 */

import {EElementName} from '@src/utils/enum';
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
            current.attributes._addAttributes(attributes);

            // currentNode = createElement(name);
            // console.log('onopentag', name, attributes);
        },
        ontext (text) {
            const textNode = createTextNode();
            textNode.textContent = text;
            current.appendChild(textNode);
            textNode._onParseComplete();
            // console.log('ontext', text);
        },
        onclosetag () {
            parent.appendChild(current);
            current._onParseComplete();
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