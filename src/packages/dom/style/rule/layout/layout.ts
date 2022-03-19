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
import {Text} from 'pixi.js';
// import {ENodeType} from '@src/types/enum';
import {Element} from '../../../elements/element';
import {countStyleLength} from '../../style-util';
// const i = 0;
export abstract class LayoutBase {
    protected _element: Node;
    _inReLayouting = false;
    get width () {
        const container = this._element._container as Text;
        return (container.text) ? container.width : 0;
    }
    get height () {
        const container = this._element._container as Text;
        return (container.text) ? container.height : 0;
    }

    _lastWidth = 0;
    _lastHeight = 0;
    _initLastSize () {
        this._lastWidth = this.width;
        this._lastHeight = this.height;
    }
    
    _layoutChange = false;
    _layoutChangesFuncs: Function[] = [];
    constructor (element: Node) {
        this._element = element;
    }
    _triggerLayoutChangeFuncs () {
        if (this._layoutChangesFuncs.length === 0) {
            return;
        }
        this._layoutChangesFuncs.forEach(fn => {fn();});
        this._layoutChangesFuncs = [];
    }
    _collect (call?: Function) {
        // todo 待优化 合并同样的样式
        if (call) this._layoutChangesFuncs.push(call);
        if (!this._layoutChange) {this._layoutChange = true;}
        LayoutChangeManager.collectElement(this._element);
    }

    _countSizeChange () {
        return (this._lastWidth !== this.width || this._lastHeight !== this.height);
    }

    _reLayout () {
        this._markLayouted();
        this._initLastSize();
        const change = this._reLayoutSelf();

        this.log('reLayout', change.posChange || change.sizeChange, change);
        return change;
    }
    _markLayouted () {
        LayoutChangeManager.markLayout(this._element.__id);
    }
    _reLayoutSelf () {
        this.log('_reLayoutSelf');
        this._triggerLayoutChangeFuncs();
        const sizeChange = this._countSizeChange();
        const element = this._element;
        const parentLayout = element.parentElement?._layout;
        let posChange = false;
        if (parentLayout) {
            const pos = parentLayout._countNodeLayout(element);
            if (pos) {
                if (element._container.x !== pos.x) {
                    element._container.x = pos.x;
                    posChange = true;
                }
                if (element._container.y !== pos.y) {
                    element._container.y = pos.y;
                    posChange = true;
                }
            }
        }
        return {sizeChange, posChange};
    }

    log (...data: any[]) {
        console.info('[layout]', this._element.__id, ...data);
    }
}

export class TextLayout extends LayoutBase implements ILayout {
    protected _element: TextNode;
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
            if (x > (this._element.parentElement?._layout._blockWidth as number)) {
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
            if (!parent) return getScreenSize().width;
        } while (parent.style.display === 'inline');

        return parent._layout.width;
    }

    private _countBlockWidth () {
        if (this._element.style.display === 'block') {
            return this._element._layout.width;
        }
        return this._countBlockParentWidth();
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

    _blockWidth = 0;


    _reLayout () {
        this.log('reLayout');
        if (this._inReLayouting) {
            this.log('---------', false);
            return {sizeChange: false, posChange: false};
        }
        this._inReLayouting = true;
        this._markLayouted();
        this._initLastSize();
        LayoutChangeManager.collectNeedReLoyoutChildrenElement(this._element);
        // this._reLayoutChildren();
        const change = this._reLayoutSelf();
        this.log('---------', change.sizeChange || change.posChange, change);
        if (change.posChange || change.sizeChange) {
            this._element.parentElement?._layout._reLayout();
        }
        this._inReLayouting = false;
        return change;
    }

    // 重排子元素
    _reLayoutChildren (index = 0) {
        // todo 待优化 _reset 支持index 优化性能
        this._reset();
        const element = this._element;
        const nodes = element.childNodes;
        this._blockWidth = this._countBlockWidth();

        for (let i = index; i < nodes.length; i++) {
            const layout = nodes[i]._layout;
            // layout._reLayout();
            if (!layout._inReLayouting) {
                layout._reLayout();
            } else {
                layout._reLayoutSelf();
            }
        }
    }
    _reLayoutChildren2 (index = 0) {
        this._reset();
        const element = this._element;
        const nodes = element.childNodes;
        this._blockWidth = this._countBlockWidth();

        for (let i = index; i < nodes.length; i++) {
            const layout = nodes[i]._layout;
            layout._reLayoutSelf();
        }
    }

    _reset () {
        this.layoutX = 0;
        this.layoutY = 0;
        this.layoutHeight = 0;
    }
}