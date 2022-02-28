/*
 * @Author: tackchen
 * @Date: 2022-02-25 23:37:50
 * @LastEditors: tackchen
 * @LastEditTime: 2022-02-27 22:42:52
 * @FilePath: /canvas-render-html/src/packages/dom/parser/selector-parser.ts
 * @Description: Coding something
 *
 */

import {TAttributeKey} from '@src/types/attribute';
import {isContain, isEndWith, isStartWith} from '@src/utils/util';
import {IParselToken, tokenize} from 'parsel-js';
import {Element} from '../elements/element';
// https://www.npmjs.com/package/parsel-js

export function parseSelector (selector: string): IParselToken[] {
    const tokens = tokenize(selector);
    for (let i = tokens.length - 1; i >= 0; i--) {
        if (typeof tokens[i] === 'string') {
            console.error('被忽略的选择器token', tokens[i]);
            tokens.splice(i, 1);
        }
    }
    return tokens as IParselToken[];
}

// element 对 type id class attribute 四种选择器 是否匹配
export function matchSelectorToken (element: Element, token: IParselToken) {
    // if (typeof token === 'string') {
    //     console.error('被忽略的选择器token', token);
    //     return false;
    // }

    switch (token.type) {
        case 'type': return element.tagName.toLowerCase() === token.name;
        case 'id': return element.id === token.name;
        case 'class': return element.classList.contains(token.name);
        case 'attribute': return matchAttribute(element, token);
    }
    return false;
}

function matchAttribute (element: Element, token: IParselToken) {
    const name = token.name as TAttributeKey;
    const {value, operator} = token;
    if (!value) {
        return element.hasAttribute(name);
    }

    const tvalue = element.getAttribute(name);

    switch (operator) {
        case '=': return tvalue === value;
        case '|=': return tvalue === value || isStartWith(tvalue, `${value}-`);
        case '^=': return isStartWith(tvalue, value);
        case '$=': return isEndWith(tvalue, value);
        case '*=': return isContain(tvalue, value);
        case '~=': return isContain(` ${tvalue} `, ` ${value} `); // return new RegExp(`(^| +)${'value'}( +|$)`).tvalue;
    }

    return false;
}