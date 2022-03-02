/*
 * @Author: tackchen
 * @Date: 2022-02-22 21:55:03
 * @LastEditors: tackchen
 * @LastEditTime: 2022-03-02 20:58:41
 * @FilePath: /canvas-render-html/src/packages/dom/style/style-parser.ts
 * @Description: Coding something
 */

import {ICssOM, IStyleAndImportantKeys, IStyleOptions, TSelectorRights, TStyleKey} from '@src/types/style';
import {IJson} from '@src/types/util';
import {Declaration, parse, Rule} from 'css';
import {Element} from '../elements/element';
import {isElementMatchSelector} from '../parser/query-selector';
import {parseSelector} from '../parser/selector-parser';
import {compareSelectorRights, countSelectorRights} from './selector-right';
import {parseCssImportantValue, transformCssProperty} from './style-util';

(window as any).parse = parse;

// parse 单个style样式
export function parseStyleAttribute (styleStr: string): IStyleOptions {
    const map: IJson = {};
    if (!styleStr) return map;
    const rule = parseCssBase(`.__init{${styleStr}}`)[0];
    if (!rule) return map;

    rule.declarations?.forEach((item: Declaration) => {
        if (item.type === 'declaration' && item.property) {
            map[transformCssProperty(item.property)] = item.value;
        }
    });
    
    return map as IStyleOptions;
}

// 根据css生成 {selector: {key: value}} map
export function parseCssCode (styleStr: string): ICssOM | null {
    if (!styleStr) return null;
    const rules = parseCssBase(styleStr);
    const map: ICssOM = {};
    rules.forEach(rule => {
        const declarations = rule.declarations as Declaration[];
        rule.selectors?.forEach((selector) => {
            selector = selector.replace(/;/g, '').trim();
            const styles: IJson = map[selector] || {};

            declarations.forEach(decla => {
                styles[
                    transformCssProperty(decla.property as string) as TStyleKey
                ] = (decla.value || '');
            });

            map[selector] = {
                styles,
                tokens: parseSelector(selector),
                rights: countSelectorRights(selector)
            };
        });
    });
    if (Object.keys(map).length === 0) {
        return null;
    }
    return map;
}

// 解析css代码 去除注释和无效的token 返回 Rule[]
function parseCssBase (styleStr: string): Rule[] {
    try {
        const rules: Rule[] = [];
        (parse(styleStr).stylesheet?.rules || []).forEach((item: Rule) => {
            if (item.type === 'rule' && item.selectors) {
                if (item.declarations) {
                    item.declarations = item.declarations.filter(dec => dec.type === 'declaration');
                    if (item.declarations.length > 0) {
                        rules.push(item);
                    }
                }
            }
        });
        return rules;
    } catch (e) {
        console.error('style 解析错误', e, styleStr);
        return [];
    }
}

// 合并排好序的styles数组
function mergeSortedStyles (styles: IStyleOptions[]): IStyleAndImportantKeys | null {
    if (styles.length === 0) {
        return null;
    }
    styles.unshift({});
    const importantKeys = processImportantStyles(styles);
    return {
        styles: Object.assign.apply(null, styles) as IStyleOptions,
        importantKeys
    };
}

// 传入排好序的styles数组 提取important样式 append到数组最后
function processImportantStyles (styles: IStyleOptions[]): TStyleKey[] {
    const important: IStyleOptions = {};
    const importantKeys: TStyleKey[] = [];

    styles.forEach(style => {
        for (const k in style) {
            const key = k as TStyleKey;
            const value = parseCssImportantValue(style[key]);
            if (value) {
                important[key] = value as any;
                if (!importantKeys.includes(key))
                    importantKeys.push(key);
            }
        }
    });

    styles.push(important);
    return importantKeys;
}

// 根据元素和cssom 生成 styleJson
export function countStyleFromCssOM (element: Element, cssom: ICssOM | null): IStyleAndImportantKeys | null {
    if (!cssom) return null;
    const styles: IStyleOptions[] = [];
    const rights: TSelectorRights[] = [];
    for (const selector in cssom) {
        const cssomValue = cssom[selector];
        if (isElementMatchSelector(element, cssomValue.tokens)) {
            let index = 0;
            for (let i = 0; i < rights.length; i++) {
                index = i;
                if (compareSelectorRights(rights[i], cssomValue.rights) === 'more') {
                    break;
                }
            }
            styles.splice(index, 0, cssomValue.styles);
            rights.splice(index, 0, cssomValue.rights);
        }
    }
    const inlineStyle = element.style._inlineStyle; // 内联样式
    if (Object.keys(inlineStyle).length > 0) {
        styles.push(inlineStyle); // ! 内联样式优先级最高
    }
    return mergeSortedStyles(styles);
}

(window as any).parseCssBase = parseCssBase;