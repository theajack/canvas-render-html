/*
 * @Author: tackchen
 * @Date: 2022-02-20 16:55:49
 * @LastEditors: tackchen
 * @LastEditTime: 2022-02-28 12:00:17
 * @FilePath: /canvas-render-html/src/packages/dom/parser/parser.ts
 * @Description: Coding something
 */

import {EElementName} from '@src/types/enum';
import {ICssOM, IStyleOptions, TSelectorRights} from '@src/types/style';
import {Parser} from 'htmlparser2';
import {onParseStyleTag} from '../css/global-css';
import {BodyElement} from '../elements/component/body';
import {createElement, createTextNode} from '../elements/create-element';
import {Element} from '../elements/element';
import {onParseScriptTag} from '../script/global-script';
import {compareSelectorRights} from '../style/selector-right';
import {mergeSortedStyles, parseCssCode} from '../style/style-parser';
import {isElementMatchSelector} from './query-selector';

export function parseHtml (
    htmlString: string,
    parentElement: Element = new BodyElement(),
    css = ''
): Element {
    const cssom = parseCssCode(css);
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
                current.attributes._initAttributes(attributes); // 先初始化style
                current.style._initStyle();
                
                const style = countStyleFromCssOM(current, cssom);
                // debugger;
                if (style) {

                }
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
                textNode.style._renderStyles();
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
            // debugger;
        }
    });
    parser.write(htmlString);
    parser.end();
    return parentElement;
}
(window as any).parse = Parser;

// 根据元素和cssom 生成 styleJson
function countStyleFromCssOM (element: Element, cssom: ICssOM | null): IStyleOptions | null {
    if (!cssom) return null;
    const styles: IStyleOptions[] = [];
    const rights: TSelectorRights[] = [];
    for (const selector in cssom) {
        const cssomValue = cssom[selector];
        if (isElementMatchSelector(element, cssomValue.tokens)) {
            let index = 0;
            for (let i = 0; i < rights.length; i++) {
                index = i;
                if (compareSelectorRights(rights[i], cssomValue.rights)) {
                    break;
                }
            }
            styles.splice(index, 0, cssomValue.styles);
            rights.splice(index, 0, cssomValue.rights);
        }
    }
    return mergeSortedStyles(styles);
}