/*
 * @Author: tackchen
 * @Date: 2022-02-20 16:18:44
 * @LastEditors: tackchen
 * @LastEditTime: 2022-02-27 00:24:43
 * @FilePath: /canvas-render-html/src/packages/render/pixi.ts
 * @Description: Coding something
 */

import {IRenderApplicationOptions} from '@src/types';
import * as PIXI from 'pixi.js';
import {initRenderManager} from './render-manager';

export function createRenderApplication ({
    width,
    height,
    canvas,
}: IRenderApplicationOptions) {
    
    const app = new PIXI.Application({
        width,
        height,
        view: canvas,
        antialias: true,    // default: false 反锯齿
        transparent: false, // default: false 透明度
        resolution: 1,       // default: 1 分辨率
        backgroundColor: 0xffffff,
    });

    initRenderManager(app);
    return app;
}