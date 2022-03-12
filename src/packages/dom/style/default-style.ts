/*
 * @Author: tackchen
 * @Date: 2022-02-20 19:40:38
 * @LastEditors: tackchen
 * @LastEditTime: 2022-03-10 09:17:41
 * @FilePath: /canvas-render-html/src/packages/dom/style/default-style.ts
 * @Description: Coding something
 */

// import {IElement} from '@src/types/dom';
import {EElementTagName} from '@src/types/enum';
import {IDefaultStyle, TStyleDisplay} from '@src/types/style';
import {Element} from '../elements/element';
import {Node} from '../elements/node';


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
    display (element: Node): TStyleDisplay {
        return (BlockElementTags.includes((element as Element).tagName)) ? 'block' : 'inline';
    },
    position: 'relative',
    left: '',
    top: '',
};