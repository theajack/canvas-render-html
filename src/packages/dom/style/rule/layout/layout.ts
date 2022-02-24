/*
 * @Author: tackchen
 * @Date: 2022-02-23 17:37:43
 * @LastEditors: tackchen
 * @FilePath: /canvas-render-html/src/packages/dom/style/rule/layout/layout.ts
 * @Description: 处理布局位置计算
 */

import {getScreenSize} from '@src/adapter';
import {TextNode} from '@src/packages/dom/elements/text-node';
import {ILayout} from '@src/types/style';
// import {ENodeType} from '@src/types/enum';
import {Element} from '../../../elements/element';
import {countStyleLength} from '../../style-util';

export class TextLayout implements ILayout {
    private _element: TextNode;
    get width () {
        if (!this._element.textContent)
            return 0;
        return this._element._container.width;
    }
    get height () {
        if (!this._element.textContent)
            return 0;
        return this._element._container.height;
    }
    get x () {return this._element._container.x;}
    get y () {return this._element._container.y;}
    left = 0;
    top = 0;
    constructor (element: TextNode) {
        this._element = element;
    }
}

// element自身的实际layout尺寸
export class Layout implements ILayout {
    
    private _element: Element;

    get width (): number {
        const style = this._element.style;
        const display = style.display;
        if (display === 'none') {
            return 0;
        } else if (display === 'inline') {
            return this._element._container.width;
        }

        const width = style.width;
        if (width) {
            return countStyleLength({
                value: width,
                getReferLength: () => this._countBlockParentWidth(),
                getDefaultLength: () => this._element._container.width
            });
        } else {
            if (display === 'inline-block') {
                return this._element._container.width;
            } else {
                return this._countBlockParentWidth();
            }
        }
    }

    get blockParentWidth () {
        return this._countBlockParentWidth();
    }

    get height () {
        const style = this._element.style;
        const display = style.display;
        if (display === 'none') {
            return 0;
        } else if (display === 'inline') {
            return this._element._container.height;
        }
        const height = style.height;
        if (height) {
            return countStyleLength({
                value: height,
                getReferLength: () => this._countBlockParentHeight(),
                getDefaultLength: () => this._element._container.height
            });
        } else {
            return this._element._container.height;
        }
    }

    get left () {
        if (!this._element.style.position) {
            return 0;
        }
        return countStyleLength({
            value: this._element.style.left,
            getReferLength: () => this._countBlockParentWidth(),
            getDefaultLength: () => this._element._container.width
        });
    }
    get top () {
        if (!this._element.style.position) {
            return 0;
        }
        return countStyleLength({
            value: this._element.style.top,
            getReferLength: () => this._countBlockParentHeight(),
            getDefaultLength: () => this._element._container.height
        });
    }
    
    get x () {
        const x = this._element._container.x;
        return x - this.left;
    }

    get y () {
        const y = this._element._container.y;
        return y - this.top;
    }

    private _countBlockParentWidth () {
        let parent: Element | null = null;
        // debugger;
        do {
            parent = this._element.parentElement;
            if (!parent)
                return getScreenSize().width;
        } while (parent.style.display === 'inline');

        return parent._layout.width;
    }

    private _countBlockParentHeight (): number {
        let parent: Element | null = null;
        // debugger;
        do {
            parent = this._element.parentElement;
            if (!parent) {
                return this._element._container.height;
            }
        } while (parent.style.display === 'inline');

        return parent._layout.height;
    }

    constructor (element: Element) {
        this._element = element;
    }

    _layoutLastChild () {
        this._reLayout(this._element.childNodes.length - 1);
    }

    // 从 index个元素开始往后layout
    _reLayout (index: number) {
        // console.warn('layout', this._element.tagName, this._element.attributes.id, index);
        // debugger;
        const boundary = this._element._boundary;
        const nodes = this._element.childNodes;
        // debugger;
        if (index < nodes.length - 1 && nodes[index].style.position === 'relative') {
            // 最后一个元素 或者 非relative元素不需要重新计算boundary
            boundary.countBoundary(index);
        }
        // if (this._element.tagName === 'BODY' && nodes[index].nodeType === ENodeType.Element) {
        //     debugger;
        // }
        const layout = this._element._layout; // element自身的实际layout尺寸
        for (let i = index; i < this._element.childNodes.length; i++) {
            const node = nodes[index];
            const {display, position} = node.style;
            const nodeLayout = node._layout;
            let x = 0, y = 0;
            if (position === 'fixed') {
                const pos = node._container.getGlobalPosition();
                x = nodeLayout.top - pos.x;
                y = nodeLayout.left - pos.y;
                node._container.x = x;
                node._container.y = y;
            } else if (position === 'absolute') {
                x = nodeLayout.top;
                y = nodeLayout.left;
                node._container.x = x;
                node._container.y = y;
            } else {
                if (i > 0) { // 第一个节点x y 直接为0
                    // debugger;
                    const width = layout.blockParentWidth;
                    // if ((node as any)?.attributes?.id === '3') {
                    //     debugger;
                    // }
                    // debugger;
                    if (display === 'block') {
                        x = boundary.startX;
                        y = boundary.endY;
                    } else if (display === 'inline-block') {
                        if (width - boundary.cornerX >= nodeLayout.width) {
                            x = boundary.cornerX;
                            y = boundary.cornerY;
                        } else {
                            x = boundary.startX;
                            y = boundary.endY;
                        }
                    } else if (display === 'inline') {
                        // todo 暂时和inline-block一样处理
                        if (width - boundary.cornerX >= nodeLayout.width) {
                            x = boundary.cornerX;
                            y = boundary.cornerY;
                        } else {
                            x = boundary.startX;
                            y = boundary.endY;
                        }
                    }
                }
                node._container.x = x;
                node._container.y = y;
                // console.log((node as any)?.attribute?.id);
                // debugger;
                boundary.extendBoundary(node);
            }
            // console.log(boundary);
        }

        // console.log(boundary);
    }
    
}