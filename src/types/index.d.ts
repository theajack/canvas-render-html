/*
 * @Author: tackchen
 * @Date: 2022-02-20 16:09:22
 * @LastEditors: tackchen
 * @LastEditTime: 2022-03-06 19:00:36
 * @FilePath: /canvas-render-html/src/types/index.d.ts
 * @Description: Coding something
 */

import {Application} from 'pixi.js';
import {IElement} from './dom';
import {ICssOM} from './style';

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
    cssom: ICssOM | null;
}

export type TContextKey = keyof IContext;
export type TContextValue = IContext[TContextKey];