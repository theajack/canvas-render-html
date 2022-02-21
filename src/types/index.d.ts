/*
 * @Author: tackchen
 * @Date: 2022-02-20 16:09:22
 * @LastEditors: tackchen
 * @LastEditTime: 2022-02-20 20:25:00
 * @FilePath: /canvas-render-html/src/types/index.d.ts
 * @Description: Coding something
 */

import {Application} from 'pixi.js';

export interface IRenderApplicationOptions {
    canvas: HTMLCanvasElement;
    width: number;
    height: number;
}

export interface IRenderHtmlToCanvasOptions {
    html: string;
    canvas?: HTMLCanvasElement;
    css?: string;
    width?: number;
    height?: number;
}

export interface IContext {
    application: Application;
}