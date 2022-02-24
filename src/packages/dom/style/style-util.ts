/*
 * @Author: tackchen
 * @Date: 2022-02-20 23:57:32
 * @LastEditors: tackchen
 * @LastEditTime: 2022-02-23 23:57:25
 * @FilePath: /canvas-render-html/src/packages/dom/style/style-util.ts
 * @Description: Coding something
 */
// import {IStyle} from '@src/types/style';
// import {IJson} from '@src/types/util';
// import {Text} from 'pixi.js';

import {parseNumFromStr} from '@src/utils/util';


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