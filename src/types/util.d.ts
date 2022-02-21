/*
 * @Author: tackchen
 * @Date: 2022-02-20 16:13:13
 * @LastEditors: tackchen
 * @LastEditTime: 2022-02-21 00:09:07
 * @FilePath: /canvas-render-html/src/types/util.d.ts
 * @Description: Coding something
 */

export interface ISize {
    width: number;
    height: number;
}

export interface IJson<T = any> {
    [prop: string]: T;
}