/*
 * @Author: tackchen
 * @Date: 2022-02-20 19:36:59
 * @LastEditors: tackchen
 * @LastEditTime: 2022-02-21 00:35:51
 * @FilePath: /canvas-render-html/src/types/style.d.ts
 * @Description: Coding something
 */

export type IStyleDisplay = 'block' | 'inline' | 'none';

export interface IStyle {
    color: string;
    backgroundColor: string;
    backgroundImage: string;
    fontSize: string;
    width: string;
    height: string;
    border: string;
    opacity: number | string;
    display: IStyleDisplay;
}

export type IStyleOptions = {
    [K in keyof IStyle]?: IStyle[K];
}