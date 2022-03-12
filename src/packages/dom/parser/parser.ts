/*
 * @Author: tackchen
 * @Date: 2022-02-20 16:55:49
 * @LastEditors: tackchen
 * @LastEditTime: 2022-03-12 23:19:46
 * @FilePath: /canvas-render-html/src/packages/dom/parser/parser.ts
 * @Description: Coding something
 */

import {EElementName} from '@src/types/enum';
import {Parser} from 'htmlparser2';
import {onParseStyleTag} from '../css/global-css';
import {BodyElement} from '../elements/component/body';
import {createElement, createTextNode} from '../elements/create-element';
import {Element} from '../elements/element';
import {onParseScriptTag} from '../script/global-script';

export function parseHtml (
    htmlString: string,
    parentElement: Element = new BodyElement(),
): Element {
    const elementStack: Element[] = [parentElement];
    const getLast  = () => elementStack[elementStack.length - 1];
    let currentTag: EElementName;
    // debugger;
    const parser = new Parser({
        onopentag (name: EElementName, attributes) {
            currentTag = name;
            if (currentTag !== EElementName.Script && currentTag !== EElementName.Style) {
                const current = createElement(name);
                getLast().appendChild(current);
                elementStack.push(current);

                current._onParseStart(attributes);
                
            }

            // currentNode = createElement(name);
            // console.log('onopentag', name, attributes);
        },
        ontext (text) {
            text = text.replace(/\n/g, '').trim();
            if (!text) return;
            if (currentTag === EElementName.Style) {
                onParseStyleTag(text);
            } else if (currentTag === EElementName.Script) {
                onParseScriptTag(text);
            } else {
                const textNode = createTextNode();
                textNode.textContent = text;
                const parent = getLast();
                parent.appendChild(textNode);
                textNode._onParseStart();
                textNode._onParseEnd();
                // textNode.style._renderStyles();
                // debugger;

                // parent._layout._layoutLastChild();
            // console.log('ontext', text);
            }
        },
        onclosetag () {
            if (currentTag !== EElementName.Script && currentTag !== EElementName.Style) {
                const current = elementStack.pop() as Element;
                current._onParseEnd();
                // getLast()._layout._layoutLastChild();
                // debugger;
                // console.log(tagname);
            }
        },
        onend () {
            // debugger;
        }
    });
    parser.write(htmlString);
    parser.end();
    return parentElement;
}
(window as any).parse = Parser;
