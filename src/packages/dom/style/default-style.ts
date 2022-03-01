/*
 * @Author: tackchen
 * @Date: 2022-02-20 19:40:38
 * @LastEditors: tackchen
 * @LastEditTime: 2022-03-01 22:55:08
 * @FilePath: /canvas-render-html/src/packages/dom/style/default-style.ts
 * @Description: Coding something
 */

import {IElement} from '@src/types/dom';
import {EElementTagName} from '@src/types/enum';
import {IDefaultStyle, TStyleDisplay} from '@src/types/style';


const BlockElementTags = [
    EElementTagName.Div,
    EElementTagName.Body,
];

export const DefaultStyle: IDefaultStyle = {
    color: '#000000',
    backgroundColor: '#ffffff',
    backgroundImage: '',
    fontSize: '14px',
    width: '',
    height: '',
    border: '',
    opacity: '1',
    display (element: IElement): TStyleDisplay {
        return (BlockElementTags.includes(element.tagName)) ? 'block' : 'inline';
    },
    position: 'relative',
    left: '',
    top: '',
};