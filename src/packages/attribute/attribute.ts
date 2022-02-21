/*
 * @Author: tackchen
 * @Date: 2022-02-20 20:22:32
 * @LastEditors: tackchen
 * @LastEditTime: 2022-02-20 20:29:50
 * @FilePath: /canvas-render-html/src/packages/attribute/attribute.ts
 * @Description: Coding something
 */
/*
 * @Author: tackchen
 * @Date: 2022-02-20 20:05:51
 * @LastEditors: tackchen
 * @LastEditTime: 2022-02-20 20:15:16
 * @FilePath: /canvas-render-html/src/packages/style/style.ts
 * @Description: Coding something
 */

import {IAttribute} from '@src/types/attribute';

export class Attribute implements IAttribute {
    style: string;
    id: string;
    class: string;
    onclick: string;
    constructor () {
    }
}