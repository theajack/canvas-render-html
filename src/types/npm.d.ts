/*
 * @Author: tackchen
 * @Date: 2022-02-25 00:41:37
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-05-30 09:13:06
 * @FilePath: /canvas-render-html/src/types/npm.d.ts
 * @Description: Coding something
 */

import {IRenderHtmlToCanvasOptions} from '.';
import {IElement} from './dom';

export default function renderHtmlToCanvas({
    html, canvas, width, height
}: IRenderHtmlToCanvasOptions): IElement;
