/*
 * @Author: tackchen
 * @Date: 2022-02-22 21:55:03
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-05-30 08:36:06
 * @FilePath: /canvas-render-html/src/packages/dom/style/style-parser.ts
 * @Description: Coding something
 */

import {IStyleAndImportantStyles, IStyleOptions, TStyleKey} from '@src/types/style';
import {IJson} from '@src/types/util';
import {Declaration, parse, Rule} from 'css';
import {parseCssImportantValue, transformCssProperty} from './style-util';

// (window as any).parse = parse;

// parse 单个style样式
export function parseStyleAttribute (styleStr: string): IStyleOptions {
    const map: IJson = {};
    if (!styleStr) return map;
    const rule = parseCss(`.__init{${styleStr}}`)[0];
    if (!rule) return map;

    rule.declarations?.forEach((item: Declaration) => {
        if (item.type === 'declaration' && item.property) {
            map[transformCssProperty(item.property)] = item.value;
        }
    });
    
    return map as IStyleOptions;
}

// css => Rule[]
export function parseCss (styleStr: string): Rule[] {
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

// 合并排好序的styles数组 处理important
export function mergeSortedStyles (styles: IStyleOptions[], newStyle = true): IStyleAndImportantStyles {
    if (newStyle) {
        styles.unshift({});
    }
    const importantStyles = processImportantStyles(styles);
    styles.push(importantStyles);
    return {
        styles: Object.assign.apply(null, styles) as IStyleOptions,
        importantStyles
    };
}

// 传入排好序的styles数组 提取important样式 append到数组最后
function processImportantStyles (styles: IStyleOptions[]): IStyleOptions {
    const important: IStyleOptions = {};

    styles.forEach(style => {
        for (const k in style) {
            const key = k as TStyleKey;
            const value = parseCssImportantValue(style[key]);
            if (value) {
                important[key] = value as any;
            }
        }
    });
    return important;
}


// (window as any).parseCssBase = parseCss;