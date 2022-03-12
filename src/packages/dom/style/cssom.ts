/*
 * @Author: tackchen
 * @Date: 2022-03-06 14:26:43
 * @LastEditors: tackchen
 * @LastEditTime: 2022-03-12 14:39:26
 * @FilePath: /canvas-render-html/src/packages/dom/style/cssom.ts
 * @Description: Coding something
 */

import {ICssOM, ICssOMMap, IStyleOptions, TSelectorRights, TStyleKey} from '@src/types/style';
import {Declaration} from 'css';
import {Element} from '../elements/element';
import {isElementMatchSelector} from '../parser/query-selector';
import {parseSelector} from '../parser/selector-parser';
import {countSelectorRights, compareSelectorRights} from './selector-right';
import {mergeSortedStyles, parseCss} from './style-parser';
import {transformCssProperty} from './style-util';

export class CssOM implements ICssOM {
    map: ICssOMMap = {};

    isEmpty = true;

    constructor (styleStr?: string) {
        this.appendCss(styleStr);
    }

    appendCss (styleStr?: string) {
        if (!styleStr) return null;
        if (this.isEmpty) this.isEmpty = false;
        const rules = parseCss(styleStr);
        rules.forEach(rule => {
            const declarations = rule.declarations as Declaration[];
            rule.selectors?.forEach((selector: string) => {
                selector = selector.replace(/;/g, '').trim();

                const styles: IStyleOptions = {};

                declarations.forEach(decla => {
                    styles[
                        transformCssProperty(decla.property as string) as TStyleKey
                    ] = (decla.value || '') as any;
                });


                const item = this.map[selector];

                if (!item) {
                    this.map[selector] = {
                        styles,
                        tokens: parseSelector(selector),
                        rights: countSelectorRights(selector)
                    };
                } else {
                    mergeSortedStyles([
                        item.styles,
                        styles
                    ], false);
                }
            });
        });
    }

    // 计算元素的样式 不包含继承样式
    countStyles (element: Element) {
        const styles: IStyleOptions[] = [];
        // debugger;
        const rights: TSelectorRights[] = [];
        
        if (!this.isEmpty) {
            for (const selector in this.map) {
                const cssomValue = this.map[selector];
                if (isElementMatchSelector(element, cssomValue.tokens)) {
                    let index = 0;
                    for (let i = 0; i < rights.length; i++) {
                        index = i;
                        if (compareSelectorRights(rights[i], cssomValue.rights) === 'more') {
                            break;
                        }
                    }
                    styles.splice(index, 0, cssomValue.styles);
                    rights.splice(index, 0, cssomValue.rights);
                }
            }
        }

        const inlineStyle = element.style._inlineStyle;
        if (Object.keys(inlineStyle).length > 0) {
            styles.push(inlineStyle); // ! 内联样式优先级最高
        }
        if (element.classList.contains('d00')) {
            // debugger;
        }
        return mergeSortedStyles(styles);
    }

}