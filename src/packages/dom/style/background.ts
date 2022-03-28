/*
 * @Author: tackchen
 * @Date: 2022-03-26 22:11:34
 * @LastEditors: tackchen
 * @LastEditTime: 2022-03-28 22:34:00
 * @FilePath: /canvas-render-html/src/packages/dom/style/background.ts
 * @Description: Coding something
 */

import {Sprite, Texture} from 'pixi.js';
import {Element} from '../elements/element';
import {cssColorToHexValue} from './style-util';

export class Background {
    _element: Element;
    _sprite: Sprite;

    constructor (element: Element) {
        this._sprite = new Sprite();
        this._element = element;
        this._element._container.addChild(this._sprite);
        this._clearSize();
    }

    _clearSize () {
        this._sprite.height = 0;
        this._sprite.width = 0;
    }

    _initSize () {
        this._clearSize();
        setTimeout(() => {
            this._sprite.height = this._element._layout.height;
            this._sprite.width = this._element._layout.width;
        }, 0);
    }

    setColor (color: string) {
        this._initSize();
        this._sprite.texture = Texture.WHITE;
        const value = cssColorToHexValue(color);
        this._sprite.tint = value;
    }

    // async setImage () {
    //     this._initSize();
    //     this._sprite.texture = await Texture.fromURL('https://gamer.qpic.cn/2022/03/28_1648476410883_15669.jpg?imageMogr2/crop/960x540');
    // }
}