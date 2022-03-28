/*
 * @Author: tackchen
 * @Date: 2022-02-20 19:40:38
 * @LastEditors: tackchen
 * @LastEditTime: 2022-03-26 17:53:34
 * @FilePath: /canvas-render-html/src/packages/dom/style/default-style.ts
 * @Description: Coding something
 */

// import {IElement} from '@src/types/dom';
import {EElementTagName} from '@src/types/enum';
import {IDefaultStyle, TStyleDisplay, TStyleKey} from '@src/types/style';
import {Element} from '../elements/element';
import {Node} from '../elements/node';


const BlockElementTags = [
    EElementTagName.Div,
    EElementTagName.Body,
];

const DefaultStyle: IDefaultStyle = {
    color: '#000000',
    backgroundColor: '',
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

export function getDefaultStyle (element: Node, name: TStyleKey) {
    const value = DefaultStyle[name];
    return (typeof value === 'function') ? value(element) : value;
}