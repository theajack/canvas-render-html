/*
 * @Author: tackchen
 * @Date: 2022-02-20 16:57:51
 * @LastEditors: tackchen
 * @LastEditTime: 2022-02-21 00:04:43
 * @FilePath: /canvas-render-html/src/packages/dom/elements/textNode.ts
 * @Description: Coding something
 */

import {applyStyleToText} from '@src/packages/style/style-util';
import {ENodeType} from '@src/utils/enum';
import {Element} from './element';
import {Node} from './node';

export class TextNode extends Node {
    nodeType = ENodeType.Text;
    constructor () {
        super();
        this._container.addChild(this._text);
    }

    _onAdd (parent: Element): void {
        super._onAdd(parent);

        applyStyleToText(parent.style, this._text);
    }
}