/*
 * @Author: tackchen
 * @Date: 2022-03-26 22:11:34
 * @LastEditors: tackchen
 * @LastEditTime: 2022-03-31 08:30:51
 * @FilePath: /canvas-render-html/src/packages/dom/style/background.ts
 * @Description: Coding something
 */

import {Graphics} from 'pixi.js';
import {Element} from '../elements/element';
import {cssColorToHexValue} from './style-util';

export class Background {
    _element: Element;

    _grapgics: Graphics;

    constructor (element: Element) {
        this._grapgics = new Graphics();
        this._element = element;
        this._element._container.addChild(this._grapgics);
    }

    setColor (color: string) {
        const value = cssColorToHexValue(color);

        const {width, height} = this._element._layout;
        console.log(value, width, height);

        this._grapgics.beginFill(0xff0000);
        this._grapgics.drawRect(0, 0, width, height);
    }

    // async setImage () {
    //     this._initSize();
    //     this._sprite.texture = await Texture.fromURL('https://gamer.qpic.cn/2022/03/28_1648476410883_15669.jpg?imageMogr2/crop/960x540');
    // }
}