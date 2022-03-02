/*
 * @Author: tackchen
 * @Date: 2022-02-20 23:57:32
 * @LastEditors: tackchen
 * @LastEditTime: 2022-03-01 23:36:08
 * @FilePath: /canvas-render-html/src/packages/dom/style/style-util.ts
 * @Description: Coding something
 */
// import {IStyle} from '@src/types/style';
// import {IJson} from '@src/types/util';
// import {Text} from 'pixi.js';

import {TStyleKey} from '@src/types/style';
import {isEndWith, parseNumFromStr} from '@src/utils/util';


// export function mergeStyle (target: IStyle, style: IStyle): IStyle {
//     const map: IJson = {};
//     for (const k in target) {

//     }
// }

export function countStyleLength ({
    value,
    getReferLength,
    getDefaultLength
}: {
    value: string;
    getReferLength: ()=>number;
    getDefaultLength: ()=>number;
}) {
    if (!value) return 0;
    if (value.includes('px')) {
        return parseNumFromStr(value, 'px');
    } else if (value.includes('%')) {
        const referLength = getReferLength();
        if (referLength < 0) {
            return getDefaultLength();
        } else {
            const rate = parseNumFromStr(value, '%') / 100;
            return getReferLength() * rate;
        }
    } else {
        // todo 其他width类型
        return getDefaultLength();
    }
}


export const TextStyleNameMap: {
    [prop in TStyleKey]?: string;
} = {
    color: 'fill',
    fontSize: 'fontSize',
};

export const TEXT_STYLES: TStyleKey[] = ['color', 'fontSize'];

export const INHERIT_STYLES: TStyleKey[] = ['color', 'fontSize'];

export function isInheritStyle (name: TStyleKey) {
    return INHERIT_STYLES.includes(name);
}

// 会引起重排的样式
export const RELAYOUT_STYLES: TStyleKey[] = ['fontSize', 'display', 'position'];

export function isRelayoutStyle (name: TStyleKey) {
    return RELAYOUT_STYLES.includes(name);
}


// font-size => fontSize
export function transformCssProperty (property: string) {
    return property.replace(/-[a-z]/g, (str, index) => {
        const letter = str[1];
        return index === 0 ? letter : letter.toUpperCase();
    });
}

const IMPORTANT = '!important';
export function parseCssImportantValue (value?: string) {
    if (!value) return '';
    if (isEndWith(value, IMPORTANT)) {
        return value.replace(IMPORTANT, '');
    }
    return '';
}