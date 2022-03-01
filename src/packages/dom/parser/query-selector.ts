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

// todo 待修改成 map模式 最高效查询
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

export function querySelector (element: Element, selector: string): Element | null{
    // const children = element.children;
    const tokens = parseSelector(selector);
    return queryChildSelector(element, tokens);
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
            backLength = 0; // 进入comb之后重置回溯参数
            const combType = token.content as TParselCombinatorContent;
            if (tokenIndex >= tokens.length) return null;
            switch (combType) {
                case ' ': { // 所有子元素
                    // 无需额外处理
                }; break;
                case '>': { // 仅限下一级子元素
                    backLength = -1; // 不往上一级回溯
                }; break;
                case '~': { // 所有后面的兄弟节点
                    let next = element.nextElementSibling;
                    while (next) {
                        const result = querySelectorBase(next, tokens, tokenIndex, backLength + 1);
                        if (result) return result;
                        next = next.nextElementSibling;
                    }
                    return null;
                }
                case '+': { // 仅限下一个兄弟节点
                    // 创建一个分支去检查
                    const next = element.nextElementSibling;
                    if (next) {
                        const result = querySelectorBase(next, tokens, tokenIndex, backLength + 1);
                        if (result)  return result;
                    }
                    return null;
                }
            }
        }; break;
        default: {
            if (matchSelectorToken(element, token)) { //
                tokenIndex ++;
                if (tokenIndex >= tokens.length)
                    return element;
                return querySelectorBase(element, tokens, tokenIndex, backLength + 1);
            } else {
                if (backLength >= 0) {
                    tokenIndex -= backLength;
                } else { // 不往上一级回溯
                    return null;
                }
            }
        }
    }

    return queryChildSelector(element, tokens, tokenIndex, backLength);
}

function queryChildSelector (
    element: Element,
    tokens: IParselToken[],
    tokenIndex = 0,
    backLength = 0,
) {
    const children = element.children;
    if (children.length > 0) {
        for (const child of children) {
            const result = querySelectorBase(child, tokens, tokenIndex, backLength);
            if (result) {
                return result;
            }
        }
    }
    return null;
}

export function querySelectorAll (element: Element, selector: string): Element[] {
    const tokens = parseSelector(selector);
    // 不是最优方案
    return querySelectorAllBase(element, tokens);
}

function querySelectorAllBase (
    element: Element,
    tokens: IParselToken[],
    result: Element[] = []
) {
    const children = element.children;
    if (children.length > 0) {
        for (const child of children) {
            if (isElementMatchSelector(child, tokens)) {
                result.push(child);
            }
            querySelectorAllBase(child, tokens, result);
        }
    }
    return result;
}

export function isElementMatchSelector (element: Element, tokens: IParselToken[]): boolean {
    let lastCombType: TParselCombinatorContent | null = null;
    let current: Element | null = element;
    for (let i = tokens.length - 1; i >= 0; i--) {
        const token = tokens[i];
        if (!current || !token) return false;
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
                } else {
                    return false;
                }
            }
        }
    }
    return true;
}
