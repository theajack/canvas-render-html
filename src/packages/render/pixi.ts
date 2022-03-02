/*
 * @Author: tackchen
 * @Date: 2022-02-20 16:18:44
 * @LastEditors: tackchen
 * @LastEditTime: 2022-03-02 21:10:11
 * @FilePath: /canvas-render-html/src/packages/render/pixi.ts
 * @Description: Coding something
 */

import {IRenderApplicationOptions} from '@src/types';
import * as PIXI from 'pixi.js';
import {initRenderManager} from './render-manager';

(window as any).PIXI = PIXI;

export function createRenderApplication ({
    width,
    height,
    canvas,
}: IRenderApplicationOptions) {
    const resolution = 2;
    const app = new PIXI.Application({
        width,
        height,
        view: canvas,
        antialias: true,    // default: false 反锯齿
        transparent: false, // default: false 透明度
        resolution,       // default: 1 分辨率
        backgroundColor: 0xffffff,
        autoDensity: true // 模糊的处理
    });

    initRenderManager(app);
    return app;
}