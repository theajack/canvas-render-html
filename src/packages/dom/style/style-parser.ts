/*
 * @Author: tackchen
 * @Date: 2022-02-22 21:55:03
 * @LastEditors: tackchen
 * @LastEditTime: 2022-02-27 18:27:28
 * @FilePath: /canvas-render-html/src/packages/dom/style/style-parser.ts
 * @Description: Coding something
 */

import {ICssOM, IStyleOptions, TStyleKey} from '@src/types/style';
import {IJson} from '@src/types/util';
import {isEndWith} from '@src/utils/util';
import {Declaration, parse, Rule} from 'css';
import {parseSelector} from '../parser/selector-parser';
import {countSelectorRights} from './selector-right';

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

// font-size => fontSize
function transformCssProperty (property: string) {
    return property.replace(/-[a-z]/g, (str, index) => {
        const letter = str[1];
        return index === 0 ? letter : letter.toUpperCase();
    });
}

// 合并排好序的styles数组
export function mergeSortedStyles (styles: IStyleOptions[]): IStyleOptions | null {
    if (styles.length === 0) {
        return null;
    }
    styles.unshift({});
    processImportantStyles(styles);
    return Object.assign.apply(null, styles) as IStyleOptions;
}

// 传入排好序的styles数组 提取important样式 append到数组最后
export function processImportantStyles (styles: IStyleOptions[]) {
    const important: IStyleOptions = {};

    styles.forEach(style => {
        for (const k in style) {
            const key = k as TStyleKey;
            const value = style[key] as string;
            if (isEndWith(value, '!important')) {
                important[key] = value.replace('!important', '') as any;
            }
        }
    });

    styles.push(important);
    return styles;
}

(window as any).parseCssBase = parseCssBase;