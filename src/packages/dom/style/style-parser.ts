/*
 * @Author: tackchen
 * @Date: 2022-02-22 21:55:03
 * @LastEditors: tackchen
 * @LastEditTime: 2022-02-23 17:14:57
 * @FilePath: /canvas-render-html/src/packages/dom/style/style-parser.ts
 * @Description: Coding something
 */

import {IStyleOptions} from '@src/types/style';
import {IJson} from '@src/types/util';
import {Declaration, parse, Rule} from 'css';

(window as any).parse = parse;

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


export function parseStyleCssCode (styleStr: string): IStyleOptions {
    console.log(styleStr);
    return {};
}

function parseCss (styleStr: string): Rule[] {
    try {
        return (parse(styleStr).stylesheet?.rules || []);
    } catch (e) {
        console.error('style 解析错误', e, styleStr);
        return [];
    }
}

function transformCssProperty (property: string) {
    return property.replace(/-[a-z]/g, (str, index) => {
        const letter = str[1];
        return index === 0 ? letter : letter.toUpperCase();
    });
}