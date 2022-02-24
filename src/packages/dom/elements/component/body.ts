/*
 * @Author: tackchen
 * @Date: 2022-02-20 20:37:28
 * @LastEditors: tackchen
 * @LastEditTime: 2022-02-24 21:10:42
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
}