/*
 * @Author: tackchen
 * @Date: 2022-02-20 16:13:23
 * @LastEditors: tackchen
 * @LastEditTime: 2022-03-13 18:09:31
 * @FilePath: /canvas-render-html/src/types/enum.ts
 * @Description: Coding something
 */

export enum ENodeType {
    Text = 1,
    Element = 3,
}

export enum EElementTagName {
    Div = 'DIV', // p h
    Span = 'SPAN',
    Button = 'BUTTON',
    Input = 'Input',
    Img = 'IMG',
    Script = 'SCRIPT',
    Style = 'STYLE',
    Body = 'BODY',
}

export enum EElementName {
    Div = 'div', // p h
    Span = 'span',
    Button = 'button',
    Input = 'inpute',
    Img = 'img',
    Script = 'script',
    Style = 'style',
    Body = 'body',
}

export enum ECompareResult {
    LESS,
    EVEN,
    MORE,
    UNKNOW,
}