/*
 * @Author: tackchen
 * @Date: 2022-02-25 00:41:37
 * @LastEditors: tackchen
 * @LastEditTime: 2022-02-25 15:24:24
 * @FilePath: /canvas-render-html/src/types/npm.d.ts
 * @Description: Coding something
 */

import {IRenderHtmlToCanvasOptions} from '.';
import {IElement} from './dom';

export function renderHtmlToCanvas({
    html, canvas, width, height
}: IRenderHtmlToCanvasOptions): IElement;
