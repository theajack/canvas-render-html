/*
 * @Author: tackchen
 * @Date: 2022-02-25 15:17:08
 * @LastEditors: tackchen
 * @FilePath: /canvas-render-html/src/packages/dom/parser/query-selector.ts
 * @Description: Coding something
 */

import {IParselToken, TParselCombinatorContent} from 'parsel-js';
import {Element} from '../elements/element';
import {matchSelectorToken, parseSelector} from './selector-parser';

export function getElementById (element: Element, id: string): Element | null {
    const children = element.children;
    const length = children.length;
    if (length > 0) {
        for (let i = 0; i < length; i++) {
            const child = children[i];
            if (child.id === id) {
                return child;
            } else {
                const result = getElementById(child, id);
                if (result) {
                    return result;
                }
            }
        }
    }
    return null;
}

export function querySelector (elements: Element[], selector: string): Element | null{
    // const children = element.children;
    const tokens = parseSelector(selector);
    for (const element of elements) {
        const result = querySelectorBase(element, tokens, 0);
        if (result) { return result;}
    }
    return null;
}

// current 表示只对当前元素进行query 不遍历其孩子
function querySelectorBase (
    element: Element,
    tokens: IParselToken[],
    tokenIndex: number,
    backLength = 0,
): Element | null {
    const token: IParselToken | undefined = tokens[tokenIndex];
    // debugger;
    if (!token) { return null; }

    switch (token.type) {
        case 'comma':
        case 'pseudo-class':
        case 'pseudo-element':
            tokenIndex++; break;
        case 'combinator': {
            tokenIndex++;
            const combType = token.content as TParselCombinatorContent;
            if (tokenIndex >= tokens.length) return null;
            switch (combType) {
                case ' ': {
                } break;
                case '+': {
                    // 创建一个分支去检查
                    const next = element.nextElementSibling;
                    if (next) {
                        const result = querySelectorBase(next, tokens, tokenIndex, backLength + 1);
                        if (result) {
                            return result;
                        }
                    }
                    return null;
                }
                case '>': {
                    
                } break;
                case '~': {
                    
                } break;
            }
        }; break;
        default: {
            if (matchSelectorToken(element, token)) { //
                tokenIndex ++;
                if (tokenIndex >= tokens.length)
                    return element;
                return querySelectorBase(element, tokens, tokenIndex, backLength + 1);
            } else {
                tokenIndex -= backLength;
            }
        }
    }

    const children = element.children;
    if (children.length > 0) {
        for (const child of children) {
            const result = querySelectorBase(child, tokens, tokenIndex);
            if (result) {
                return result;
            }
        }
    }
    return null;
}

export function querySelectorAll (element: Element, selector: string): Element[] {
    console.log(element, selector);
    return [];
}


export function isElementMatchSelector (element: Element, tokens: IParselToken[]): boolean {
    // todo
    // debugger;
    let lastCombType: TParselCombinatorContent | null = null;
    let current: Element | null = element;
    for (let i = tokens.length - 1; i >= 0; i--) {
        if (!current) return false;
        const token = tokens[i];
        if (token.type === 'combinator') {
            const combType = token.content as TParselCombinatorContent;
            lastCombType = combType;
            if (combType === ' ' || combType === '>') {
                current = current.parentElement;
            } else if (combType === '~' || combType === '+') {
                current = current.previousElementSibling;
            }
        } else {
            if (matchSelectorToken(current, token)) {
                lastCombType = null;
            } else {
                if (lastCombType === ' ') {
                    i++;
                    current = current.parentElement;
                } else if (lastCombType === '~') {
                    i++;
                    current = current.previousElementSibling;
                }
            }
        }
    }
    return true;
}
