/*
 * @Author: tackchen
 * @Date: 2022-02-20 19:36:59
 * @LastEditors: tackchen
 * @LastEditTime: 2022-02-25 17:07:48
 * @FilePath: /canvas-render-html/src/types/style.d.ts
 * @Description: Coding something
 */

export type TStyleCommon = 'inherit' | 'initial' | 'unset';

export type TStyleValue = string | TStyleCommon;

export type TStylePosition = 'fixed' | 'absolute' | 'relative' | TStyleCommon;

export type TStyleDisplay = 'block' | 'inline' | 'inline-block' | 'none' | TStyleCommon;

export interface ILayout {
    x: number;
    y: number;
    height: number;
    width: number;
    left: number;
    top: number;
}

export interface IBoundary {
    startX: number; // 起始点
    startY: number;
    endX: number; // 最后一个元素右下角
    endY: number;
    cornerX: number; // 最后一个元素右上角
    cornerY: number;
}

export interface IStyle {
    color: TStyleValue;
    backgroundColor: TStyleValue;
    backgroundImage: TStyleValue;
    fontSize: TStyleValue;
    width: TStyleValue;
    height: TStyleValue;
    border: TStyleValue;
    opacity: TStyleValue;
    display: TStyleDisplay;
    position: TStylePosition;
    left: TStyleValue;
    top: TStyleValue;
}

export type TStyleKey = keyof IStyle

export type IStyleOptions = {
    [K in TStyleKey]?: IStyle[K];
}