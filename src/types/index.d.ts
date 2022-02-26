/*
 * @Author: tackchen
 * @Date: 2022-02-20 16:09:22
 * @LastEditors: tackchen
 * @LastEditTime: 2022-02-25 17:40:42
 * @FilePath: /canvas-render-html/src/types/index.d.ts
 * @Description: Coding something
 */

import {Application} from 'pixi.js';
import {IElement} from './dom';

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
    body: IElement;
}

export type TContextKey = keyof IContext;
export type TContextValue = IContext[TContextKey];