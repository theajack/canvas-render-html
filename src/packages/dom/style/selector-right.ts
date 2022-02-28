/*
 * @Author: tackchen
 * @Date: 2022-02-27 16:52:49
 * @LastEditors: tackchen
 * @LastEditTime: 2022-02-27 17:17:15
 * @FilePath: /canvas-render-html/src/packages/dom/style/selector-right.ts
 * @Description: Coding something
 */

import {TSelectorRights, TSelectorRightsCompareResult} from '@src/types/style';
import {IParselToken} from 'parsel-js';
import {parseSelector} from '../parser/selector-parser';

// 根据选择器 生成 选择器权重
export function countSelectorRights (selector: string): TSelectorRights {
    const rights: TSelectorRights = [0, 0, 0, 0];
    const tokens = parseSelector(selector);

    tokens.forEach(token => {
        addRightsWithToken(rights, token);
    });
    return rights;
}

/*
行内样式 <div style="xxx"></div> ==> 标记a类
ID 选择器 ==> 标记b类
类，属性选择器和伪类选择器 ==> 标记c类
标签选择器、伪元素 ==> 标记d类
*/

// 根据选择器 token 添加 rights的值
function addRightsWithToken (rights: TSelectorRights, token: IParselToken) {
    switch (token.type) {
        case 'id':
            rights[1]++; break;
        case 'class':
        case 'attribute':
        case 'pseudo-class':
            rights[1]++; break;
        case 'pseudo-element':
        case 'type':
            rights[3]++; break;
    }
}

export function compareSelectorRights (a: TSelectorRights, b: TSelectorRights): TSelectorRightsCompareResult {
    for (let i = 0; i < a.length; i++) {
        if (a[i] > b[i]) {
            return 'more';
        } else if (a[i] < b[i]) {
            return 'less';
        }
    }
    return 'even';
}

export function mergeStyles () {

}