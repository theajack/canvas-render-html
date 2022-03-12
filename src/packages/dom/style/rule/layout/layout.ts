/*
 * @Author: tackchen
 * @Date: 2022-02-23 17:37:43
 * @LastEditors: tackchen
 * @FilePath: /canvas-render-html/src/packages/dom/style/rule/layout/layout.ts
 * @Description: 处理布局位置计算
 */

import {getScreenSize} from '@src/adapter';
import {Node} from '@src/packages/dom/elements/node';
import {TextNode} from '@src/packages/dom/elements/text-node';
import {LayoutChangeManager} from '@src/packages/render/render-manager';
import {IElementLayout, ILayout} from '@src/types/style';
import {IPosition} from '@src/types/util';
// import {ENodeType} from '@src/types/enum';
import {Element} from '../../../elements/element';
import {countStyleLength} from '../../style-util';

export class LayoutBase {
    protected _element: Node;
    constructor (element: Node) {
        this._element = element;
    }
    _collect () {
        LayoutChangeManager.collectElement(this._element);
    }
    _reLayout () {
        const element = this._element;
        const parentLayout = element.parentElement?._layout;

        if (parentLayout) {
            const pos = parentLayout._countNodeLayout(element);
            if (pos) {
                element._container.x = pos.x;
                element._container.y = pos.y;
            }
        }
    }
}

export class TextLayout extends LayoutBase implements ILayout {
    protected _element: TextNode;
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
}

// element自身的实际layout尺寸
export class Layout extends LayoutBase implements IElementLayout {
    
    protected _element: Element;

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

    get offsetHeight () {
        return 0;
    }
    get offsetWidth () {
        return 0;
    }

    layoutX = 0;
    layoutY = 0;
    layoutHeight = 0;
    
    _countNodeLayout (node: Node) {
        const display = node.style.display;

        // todo 待处理 非relative定位 与 display=none
        if (node.style.position !== 'relative' || display === 'none') return;
        
        const layout = node._layout;
        const pos: IPosition = {
            x: this.layoutX,
            y: this.layoutY,
        };
        if (display === 'block') {
            const height = layout.height;
            pos.x = 0;
            pos.y = this.layoutHeight;
            this.layoutX = 0;
            this.layoutY = this.layoutHeight + height;
            this.layoutHeight += height;
        } else if (display === 'inline' || display === 'inline-block') {
            // 暂时与inline-block一样处理
            const {width, height, y} = layout;

            const x = this.layoutX + width;
            if (x > (this._element.parentElement?._layout._blockParentWidth as number)) {
                pos.x = 0;
                pos.y = this.layoutHeight;
                this.layoutX = width;
                this.layoutY = this.layoutHeight;
                this.layoutHeight += height;
            } else {
                this.layoutX += width;
                const targetHeight = y + height;
                if (targetHeight > this.layoutHeight) {
                    this.layoutHeight = targetHeight;
                }
            }

        }
        return pos;
    }

    private _countBlockParentWidth () {
        let parent: Element | null = this._element;
        do {
            parent = parent.parentElement;
            if (!parent)
                return getScreenSize().width;
        } while (parent.style.display === 'inline');

        return parent._layout.width;
    }

    private _countBlockParentHeight (): number {
        let parent: Element | null = this._element;
        do {
            parent = parent.parentElement;
            if (!parent) {
                return this._element._container.height;
            }
        } while (parent.style.display === 'inline');

        return parent._layout.height;
    }

    _blockParentWidth = 0;

    // 重排子元素
    _reLayout (index = 0) {
        const element = this._element;
        const nodes = element.childNodes;
        this._blockParentWidth = this._countBlockParentWidth();

        for (let i = index; i < nodes.length; i++) {
            nodes[i]._layout._reLayout();
        }

        super._reLayout();
    }

    _reset () {
        this.layoutX = 0;
        this.layoutY = 0;
        this.layoutHeight = 0;
    }

    // 从 index个元素开始往后layout
    // _reLayout (index: number, reLayoutParent = true) {
    //     debugger;
    //     // console.warn('layout', this._element.tagName, this._element.attributes.id, index);
    //     const nodes = this._element.childNodes;
    //     // if (this._element.tagName === 'BODY' && nodes[index].nodeType === ENodeType.Element) {
    //     //     debugger;
    //     // }
    //     const layout = this._element._layout; // element自身的实际layout尺寸
    //     let width, height: number = 0;
    //     if (reLayoutParent) {
    //         width = layout.width;
    //         height = layout.height;
    //     }
    //     for (let i = index; i < this._element.childNodes.length; i++) {
    //         const node = nodes[index];
    //         const {display, position} = node.style;
    //         const nodeLayout = node._layout;
    //         let x = 0, y = 0;
    //         if (position === 'fixed') {
    //             const pos = node._container.getGlobalPosition();
    //             x = nodeLayout.top - pos.x;
    //             y = nodeLayout.left - pos.y;
    //             node._container.x = x;
    //             node._container.y = y;
    //         } else if (position === 'absolute') {
    //             x = nodeLayout.top;
    //             y = nodeLayout.left;
    //             node._container.x = x;
    //             node._container.y = y;
    //         } else {
    //             if (i > 0) { // 第一个节点x y 直接为0
    //                 const parentWidth = layout.blockParentWidth;
    //                 // if ((node as any)?.attributes?.id === '3') {
    //                 //     debugger;
    //                 // }
    //                 if (display === 'block') {
    //                     x = boundary.startX;
    //                     y = boundary.endY;
    //                 } else if (display === 'inline-block') {
    //                     if (parentWidth - boundary.cornerX >= nodeLayout.width) {
    //                         x = boundary.cornerX;
    //                         y = boundary.cornerY;
    //                     } else {
    //                         x = boundary.startX;
    //                         y = boundary.endY;
    //                     }
    //                 } else if (display === 'inline') {
    //                     // todo 暂时和inline-block一样处理
    //                     if (parentWidth - boundary.cornerX >= nodeLayout.width) {
    //                         x = boundary.cornerX;
    //                         y = boundary.cornerY;
    //                     } else {
    //                         x = boundary.startX;
    //                         y = boundary.endY;
    //                     }
    //                 }
    //             }
    //             node._container.x = x;
    //             node._container.y = y;
    //             // console.log((node as any)?.attribute?.id);
    //             boundary.extendBoundary(node);
    //         }
    //         // console.log(boundary);
    //     }
    //     if (reLayoutParent && (layout.width !== width || layout.height !== height)) {
    //         // debugger;
    //         // console.warn('11', this._element.id, this._element.tagName);
    //         // debugger;
    //         // this._reLayoutParent();
    //     }

    //     // console.log(boundary);


    // }
    
    _collect () {
        LayoutChangeManager.collectElement(this._element);
    }
}