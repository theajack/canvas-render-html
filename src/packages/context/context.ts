/*
 * @Author: tackchen
 * @Date: 2022-02-20 17:28:52
 * @LastEditors: tackchen
 * @LastEditTime: 2022-03-06 20:08:34
 * @FilePath: /canvas-render-html/src/packages/context/context.ts
 * @Description: Coding something
 */

import {IContext, TContextKey, TContextValue} from '@src/types';
import {ICssOM} from '@src/types/style';
import {Application} from 'pixi.js';
import {Element} from '../dom/elements/element';

const context: IContext = {
    application: null as any,
    body: null as any,
    cssom: null,
};

export function getContext(attr: 'application'): Application;
export function getContext(attr: 'body'): Element;
export function getContext(attr: 'cssom'): ICssOM;
export function getContext(): IContext;
export function getContext (attr?: TContextKey): TContextValue | IContext {
    if (!attr) {
        return context;
    }
    return context[attr] as TContextValue;
}

export function getPIXIApplication () {
    return context.application;
}

export function injectContext (key: TContextKey, value: any) {
    context[key] = value;
}