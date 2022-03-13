/*
 * @Author: tackchen
 * @Date: 2022-03-05 00:09:03
 * @LastEditors: tackchen
 * @LastEditTime: 2022-03-13 19:23:45
 * @FilePath: /canvas-render-html/src/packages/render/next-tick.ts
 * @Description: Coding something
 */

const NextTickCalls: Function[] = [];

export function triggerNextTickCalls () {
    if (NextTickCalls.length > 0) {
        NextTickCalls.forEach(fn => fn());
        NextTickCalls.length = 0;
    }
}

export function nextTick (callback: Function) {
    NextTickCalls.push(callback);
}

export function clearNextTickCallbacks () {
    NextTickCalls.length = 0;
}