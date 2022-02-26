import {IStyleOptions, TStyleDisplay, TStyleKey, TStylePosition} from '@src/types/style';
import {TextNode} from '../elements/text-node';
import {INHERIT_STYLES, isRelayoutStyle, TextStyleNameMap, TEXT_STYLES} from './style-util';

export class TextNodeStyle implements IStyleOptions {
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

    _setStyle (name: TStyleKey) {
        if (!TEXT_STYLES.includes(name)) return;
        this._applyStyleIntoPixi(name);

        if (isRelayoutStyle(name)) {
            this._element.parentElement?._layout._reLayoutChild(this._element);
        }
    }

    _applyStyleIntoPixi (name: TStyleKey) {
        const key = TextStyleNameMap[name];
        if (key) { // 直接可以将样式映射成pixi text的样式
            const value = this._getStyle(name);
            if (value) {
                (this._element._container.style as any)[key] = value;
            }
        }

        // todo 其他样式
    }
    _renderStyles () {
        INHERIT_STYLES.forEach(key => {
            this._setStyle(key);
        });
    }
}

function getStyle (target: TextNodeStyle, property: TStyleKey) {
    Object.defineProperty(target, property, {
        get (this: typeof target) { return this._getStyle(property);},
    });
}
