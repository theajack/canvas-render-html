/*
 * @Author: tackchen
 * @Date: 2022-02-20 16:13:13
 * @LastEditors: tackchen
 * @LastEditTime: 2022-02-26 10:14:37
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