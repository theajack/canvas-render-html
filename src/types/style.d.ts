/*
 * @Author: tackchen
 * @Date: 2022-02-20 19:36:59
 * @LastEditors: tackchen
 * @LastEditTime: 2022-03-19 19:53:33
 * @FilePath: /canvas-render-html/src/types/style.d.ts
 * @Description: Coding something
 */

import {IParselToken} from 'parsel-js';
import {IElement, INode} from './dom';
import {ISize} from './util';

export type TStyleCommon = 'inherit' | 'initial' | 'unset' | string;

export type TStyleValue = string | TStyleCommon;

export type TStylePosition = 'fixed' | 'absolute' | 'relative' | TStyleCommon;

export type TStyleDisplay = 'block' | 'inline' | 'inline-block' | 'none' | TStyleCommon;

export interface ILayout {
    x: number; // 定位
    y: number;
    height: number; // 实际边界尺寸
    width: number;
    left: number; // 偏移量
    top: number;
    _layoutChange: boolean;
    _inReLayouting: boolean;
    // _inReLayouting: boolean;
    _collect(call?: Function): void;
    _reLayout(index?: number): void;
    _reLayoutSelf(): void;
}

export interface IElementLayout extends ILayout {
    layoutX: number; // 下一个元素放置的位置
    layoutY: number;
    readonly offsetHeight: number;
    readonly offsetWidth: number;
}

export interface IBoundary extends ISize {
    _element: INode;
    _extend(block: ISize): void;
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
    display(element: INode): TStyleDisplay;
}
export type TStyleKey = keyof IStyle

export type IStyleOptions = {
    [K in TStyleKey]?: IStyle[K];
}

export interface IStyleClass extends IStyleOptions {
    _renderStyles(styles?: IStyleOptions): void;
    _collectInheritChange(name: TStyleKey, value: string): void;
    _initInheritStyles(): void;
}

export interface IStyleAndImportantStyles {
    styles: IStyleOptions;
    importantStyles: IStyleOptions;
}
export interface IStyleChangeCollect {
    styles: IStyleOptions;
    node: INode;
}

export type TSelectorRights = number[];

export type TSelectorRightsCompareResult = 'more' | 'even' | 'less';

export interface ICssOMMap {
    [selector: string]: {
        rights: TSelectorRights;
        styles: IStyleOptions;
        tokens: IParselToken[];
    }
}
export interface ICssOM {
    map: ICssOMMap;
    isEmpty: boolean;
    appendCss(style: string): void;
    countStyles(element: IElement): IStyleAndImportantStyles;
}