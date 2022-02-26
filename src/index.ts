/*
 * @Author: tackchen
 * @Date: 2022-02-20 16:05:23
 * @LastEditors: tackchen
 * @LastEditTime: 2022-02-25 17:48:25
 * @FilePath: /canvas-render-html/src/index.ts
 * @Description: Coding something
 */

import {getCanvas, getScreenSize} from './adapter';
import {createRenderApplication} from './packages/render/pixi';
import {IRenderHtmlToCanvasOptions} from './types';
import {injectContext} from './packages/context/context';
import {parseHtml} from './packages/dom/parser/parser';
import {createElement} from './packages/dom/elements/create-element';
import {EElementName} from './types/enum';
import {BodyElement} from './packages/dom/elements/component/body';

export default function renderHtmlToCanvas ({
    html,
    canvas,
    width,
    height,
}: IRenderHtmlToCanvasOptions): BodyElement {
    canvas = getCanvas(canvas);
    if (!width || !height) {
        const size = getScreenSize();
        width = width || size.width;
        height = height || size.height;
    }

    const application = createRenderApplication({
        canvas,
        width,
        height
    });
    injectContext('application', application);
    // console.log(html);

    const body = createElement(EElementName.Body);
    injectContext('body', body);
    application.stage.addChild(body._container);

    parseHtml(html, body);

    return body;
}