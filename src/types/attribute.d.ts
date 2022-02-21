/*
 * @Author: tackchen
 * @Date: 2022-02-20 20:23:05
 * @LastEditors: tackchen
 * @LastEditTime: 2022-02-20 20:24:09
 * @FilePath: /canvas-render-html/src/types/attribute.d.ts
 * @Description: Coding something
 */

export interface IAttribute {
    style: string;
    id: string;
    class: string;
    onclick: string;
    // todo
}

export type IAttributeOptions = {
    [K in keyof IAttribute]: IAttribute[K];
}