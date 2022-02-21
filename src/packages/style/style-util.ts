/*
 * @Author: tackchen
 * @Date: 2022-02-20 23:57:32
 * @LastEditors: tackchen
 * @LastEditTime: 2022-02-21 00:13:11
 * @FilePath: /canvas-render-html/src/packages/style/style-util.ts
 * @Description: Coding something
 */
import {IStyle} from '@src/types/style';
// import {IJson} from '@src/types/util';
import {Text} from 'pixi.js';

export function applyStyleToText (style: IStyle, text: Text) {
    text.style.fill = style.color;
    text.style.fontSize = '14'; // style.fontSize;
}

// export function mergeStyle (target: IStyle, style: IStyle): IStyle {
//     const map: IJson = {};
//     for (const k in target) {

//     }
// }