/*
 * @Author: tackchen
 * @Date: 2022-02-20 19:36:59
 * @LastEditors: tackchen
 * @LastEditTime: 2022-02-21 23:38:36
 * @FilePath: /canvas-render-html/src/types/style.d.ts
 * @Description: Coding something
 */

export type TStyleDisplay = 'block' | 'inline' | 'none';

export interface IStyle {
    color: string;
    backgroundColor: string;
    backgroundImage: string;
    fontSize: string;
    width: string;
    height: string;
    border: string;
    opacity: string;
    display: TStyleDisplay;
}

export type TStyleKey = keyof IStyle

export type IStyleOptions = {
    [K in TStyleKey]?: IStyle[K];
}