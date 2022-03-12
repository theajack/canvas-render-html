import {StyleChangeManager} from '@src/packages/render/render-manager';
import {IStyleClass, IStyleOptions, TStyleDisplay, TStyleKey, TStylePosition} from '@src/types/style';
import {TextNode} from '../elements/text-node';
import {getDefaultStyle} from './default-style';
import {INHERIT_STYLES, TextStyleNameMap, TEXT_STYLES} from './style-util';

export class TextNodeStyle implements IStyleClass {
    _element: TextNode;

    display: TStyleDisplay = 'inline';
    position: TStylePosition = 'relative';

    @getStyle color: string;
    @getStyle fontSize: string;
    // todo 其他可继承属性

    _getStyle (name: TStyleKey): string {
        if (!TEXT_STYLES.includes(name)) return '';
        return this._element.parentElement?.style[name] || '';
    }

    constructor (element: TextNode) {
        this._element = element;
    }

    _applyStyleIntoPixi (name: TStyleKey) {
        const key = TextStyleNameMap[name];
        if (key) { // 直接可以将样式映射成pixi text的样式
            const value = this._getStyle(name);
            if (value) {
                this._applySingleStyleToPixi(key, value);
            }
        }

        // todo 其他样式
    }
    _applySingleStyleToPixi (key: string, value: string) {
        (this._element._container.style as any)[key] = value;
        // todo 其他样式
    }
    _renderStyles (styles: IStyleOptions) {
        for (const k in styles) {
            this._applyStyleIntoPixi(k as TStyleKey);
        }
    }

    _collectInheritChange (name: TStyleKey, value: string) {
        StyleChangeManager.collectSingleChange(this._element, name, value);
    }

    _getInheritStyle (name: TStyleKey): string { // todo
        if (!this._element.parentElement) {
            return getDefaultStyle(this._element, name);
        } else {
            return this._element.parentElement.style[name];
        }
    }

    _initInheritStyles () {
        INHERIT_STYLES.forEach(k => { // 添加继承属性
            const value = this._getInheritStyle(k);
            if (value) {
                StyleChangeManager.collectSingleChange(this._element, k, value);
            }
        });
    }
}

function getStyle (target: TextNodeStyle, property: TStyleKey) {
    Object.defineProperty(target, property, {
        get (this: typeof target) { return this._getStyle(property);},
    });
}
