/*
 * @Author: tackchen
 * @Date: 2022-02-20 17:28:52
 * @LastEditors: tackchen
 * @LastEditTime: 2022-02-26 17:48:44
 * @FilePath: /canvas-render-html/src/packages/context/context.ts
 * @Description: Coding something
 */

import {IContext, TContextKey, TContextValue} from '@src/types';
import {Element} from '../dom/elements/element';

const context: IContext = {
    application: null as any,
    body: null as any,
};

export function getContext(attr: 'body'): Element;
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