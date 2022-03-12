/*
 * @Author: tackchen
 * @Date: 2022-02-20 20:37:28
 * @LastEditors: tackchen
 * @LastEditTime: 2022-03-12 17:41:44
 * @FilePath: /canvas-render-html/src/packages/dom/elements/component/body.ts
 * @Description: Coding something
 */


// import {EElementName} from '@src/types/enum';
import {EElementName} from '@src/types/enum';
import {Element} from '../element';

export class BodyElement extends Element {
    constructor () {
        super(EElementName.Body);
    }

    _traverseSiblingFromCurrent (callback: (element: Element)=>void) {
        callback(this);
    }
}