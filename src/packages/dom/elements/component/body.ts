/*
 * @Author: tackchen
 * @Date: 2022-02-20 20:37:28
 * @LastEditors: tackchen
 * @LastEditTime: 2022-02-22 01:33:59
 * @FilePath: /canvas-render-html/src/packages/dom/elements/component/body.ts
 * @Description: Coding something
 */


// import {EElementName} from '@src/utils/enum';
import {EElementName} from '@src/utils/enum';
import {Element} from '../element';

let _body: BodyElement;

export class BodyElement extends Element {
    constructor () {
        if (_body) {
            return _body;
        }
        super(EElementName.Body);
        _body = this;
    }
}