/*
 * @Author: tackchen
 * @Date: 2022-02-20 16:55:49
 * @LastEditors: tackchen
 * @LastEditTime: 2022-02-20 21:06:40
 * @FilePath: /canvas-render-html/src/packages/dom/parser/parser.ts
 * @Description: Coding something
 */

import {EElementName} from '@src/utils/enum';
import {Parser} from 'htmlparser2';
import {BodyElement} from '../elements/component/body';
import {createElement, createTextNode} from '../elements/create-element';
import {Element} from '../elements/element';

export async function parseHtml (htmlString: string): Promise<BodyElement> {
    return new Promise(resolve => {
        const body = new BodyElement();

        let parent : Element = body;
        const parser = new Parser({
            onopentag (name: EElementName, attributes) {

                const current = createElement(name);
                parent.appendChild(current);

                parent = current;

                // currentNode = createElement(name);
                console.log('onopentag', name, attributes);
            },
            ontext (text) {
                const textNode = createTextNode();
                textNode.textContent = text;
                parent.appendChild(textNode);
                console.log('ontext', text);
            },
            onclosetag (tagname) {
                if (parent.parentElement)
                    parent = parent.parentElement;
                console.log(tagname);
            },
            onend () {
                resolve(body);
            }
        });
        parser.write(htmlString);
        parser.end();
    });
}