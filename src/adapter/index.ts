/*
 * @Author: tackchen
 * @Date: 2022-02-20 16:07:14
 * @LastEditors: tackchen
 * @LastEditTime: 2022-02-20 16:17:07
 * @FilePath: /canvas-render-html/src/adapter/index.ts
 * @Description: Coding something
 */

import {ISize} from '@src/types/util';

// todo this is only for web now

export function getScreenSize (): ISize {
    return {
        width: window.innerWidth,
        height: window.innerHeight
    };
}

export function getCanvas (canvas?: HTMLCanvasElement): HTMLCanvasElement {
    if (canvas) return canvas;

    canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    
    return canvas;
}