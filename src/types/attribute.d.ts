/*
 * @Author: tackchen
 * @Date: 2022-02-20 20:23:05
 * @LastEditors: tackchen
 * @LastEditTime: 2022-03-01 22:09:56
 * @FilePath: /canvas-render-html/src/types/attribute.d.ts
 * @Description: Coding something
 */

export interface IAttribute {
    style: IAttributePair;
    id: IAttributePair;
    class: IAttributePair;
    onclick: IAttributePair;
    name: IAttributePair;
    // todo
}

export type TAttributeKey = keyof IAttribute;

export type IAttributeOptions = {
    [K in TAttributeKey]?: IAttribute[K];
}

export interface IAttributePair {
    name: string;
    value: string;
}