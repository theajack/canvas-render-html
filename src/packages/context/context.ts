/*
 * @Author: tackchen
 * @Date: 2022-02-20 17:28:52
 * @LastEditors: tackchen
 * @LastEditTime: 2022-02-20 17:31:20
 * @FilePath: /canvas-render-html/src/packages/context/context.ts
 * @Description: Coding something
 */

import {IContext} from '@src/types';

const context: IContext = {
    application: null as any
};

export function getContext () {
    return context;
}

export function getPIXIApplication () {
    return context.application;
}

export function injectContext (key: keyof IContext, value: any) {
    context[key] = value;
}