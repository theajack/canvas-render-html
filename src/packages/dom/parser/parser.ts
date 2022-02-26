/*
 * @Author: tackchen
 * @Date: 2022-02-20 16:55:49
 * @LastEditors: tackchen
 * @LastEditTime: 2022-02-26 15:53:31
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
    parentElement: Element = new BodyElement()
): Element {
    const elementStack: Element[] = [parentElement];
    const getLast  = () => elementStack[elementStack.length - 1];
    let currentTag: EElementName;
    const parser = new Parser({
        onopentag (name: EElementName, attributes) {
            currentTag = name;
            if (currentTag !== EElementName.Script && currentTag !== EElementName.Style) {
                const current = createElement(name);
                getLast().appendChild(current);
                elementStack.push(current);
                current.attributes._initAttributes(attributes); // 先初始化style
                current.style._initStyle();
                current.style._renderStyles(true); //
            }

            // currentNode = createElement(name);
            // console.log('onopentag', name, attributes);
        },
        ontext (text) {
            if (currentTag === EElementName.Style) {
                onParseStyleTag(text);
            } else if (currentTag === EElementName.Script) {
                onParseScriptTag(text);
            } else {
                const textNode = createTextNode();
                textNode.textContent = text;
                const parent = getLast();
                parent.appendChild(textNode);
                textNode._onParseComplete();
                textNode.style._renderStyles(true);
                // debugger;

                parent._layout._layoutLastChild();
            // console.log('ontext', text);
            }
        },
        onclosetag () {
            if (currentTag !== EElementName.Script && currentTag !== EElementName.Style) {
                const current = elementStack.pop() as Element;
                current._onParseComplete();
                getLast()._layout._layoutLastChild();
                // debugger;
                // console.log(tagname);
            }
        },
        onend () {
        }
    });
    parser.write(htmlString);
    parser.end();
    return parentElement;
}
(window as any).parse = Parser;