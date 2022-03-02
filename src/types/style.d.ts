/*
 * @Author: tackchen
 * @Date: 2022-02-20 19:36:59
 * @LastEditors: tackchen
 * @LastEditTime: 2022-03-01 23:17:30
 * @FilePath: /canvas-render-html/src/types/style.d.ts
 * @Description: Coding something
 */

import {IParselToken} from 'parsel-js';
import {IElement, INode} from './dom';

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

export interface IStyleBase {
    color: TStyleValue;
    backgroundColor: TStyleValue;
    backgroundImage: TStyleValue;
    fontSize: TStyleValue;
    width: TStyleValue;
    height: TStyleValue;
    border: TStyleValue;
    opacity: TStyleValue;
    position: TStylePosition;
    left: TStyleValue;
    top: TStyleValue;
}

export interface IStyle extends IStyleBase {
    display: TStyleDisplay;
}

export interface IDefaultStyle extends IStyleBase {
    display(element: IElement): TStyleDisplay;
}
export type TStyleKey = keyof IStyle

export type IStyleOptions = {
    [K in TStyleKey]?: IStyle[K];
}


export interface IStyleChangeCollect {
    node: INode;
    changes: IStyleOptions[];
}

export type TSelectorRights = number[];

export type TSelectorRightsCompareResult = 'more' | 'even' | 'less';

export interface ICssOM {
    [selector: string]: {
        rights: TSelectorRights;
        styles: IStyleOptions;
        tokens: IParselToken[];
    }
}

export interface IStyleAndImportantKeys {
    styles: IStyleOptions;
    importantKeys: TStyleKey[]
}