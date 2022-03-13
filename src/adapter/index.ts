/*
 * @Author: tackchen
 * @Date: 2022-02-20 16:07:14
 * @LastEditors: tackchen
 * @LastEditTime: 2022-03-13 21:51:22
 * @FilePath: /canvas-render-html/src/adapter/index.ts
 * @Description: Coding something
 */

import {ISize} from '@src/types/util';

// todo this is only for web now

let lastCanvas: HTMLCanvasElement | null = null;

export function clearCanvas () {
    if (lastCanvas) {
        lastCanvas.parentElement?.removeChild(lastCanvas);
    }
}

export function getScreenSize (): ISize {
    return {
        width: window.innerWidth,
        height: window.innerHeight
    };
}

export function getCanvas (canvas?: HTMLCanvasElement): HTMLCanvasElement {
    if (!canvas) {
        canvas = document.createElement('canvas');
        document.body.appendChild(canvas);

        lastCanvas = canvas;
    }
    return canvas;
}