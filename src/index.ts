/*
 * @Author: tackchen
 * @Date: 2022-02-20 16:05:23
 * @LastEditors: tackchen
 * @LastEditTime: 2022-03-13 20:01:42
 * @FilePath: /canvas-render-html/src/index.ts
 * @Description: Coding something
 */

import {clearCanvas, getCanvas, getScreenSize} from './adapter';
import {createRenderApplication} from './packages/render/pixi';
import {IRenderHtmlToCanvasOptions} from './types';
import {getContext, injectContext} from './packages/context/context';
import {parseHtml} from './packages/dom/parser/parser';
import {createElement} from './packages/dom/elements/create-element';
import {EElementName} from './types/enum';
import {BodyElement} from './packages/dom/elements/component/body';
import {CssOM} from './packages/dom/style/cssom';
import {clearNodeUniqueId} from './packages/dom/elements/node';
import {clearAllIdMap} from './packages/dom/parser/id-map';
import {clearRenderManager} from './packages/render/render-manager';

export default function renderHtmlToCanvas ({
    html,
    canvas,
    width,
    height,
    css,
}: IRenderHtmlToCanvasOptions): BodyElement {

    clearRenderContext();

    const application = initPIXIApplication(canvas, width, height);
    // console.log(html);

    const body = createElement(EElementName.Body);
    injectContext('body', body);
    application.stage.addChild(body._container);

    injectContext('cssom', new CssOM(css));
    parseHtml(html, body);

    return body;
}

function initPIXIApplication (
    canvas?: HTMLCanvasElement,
    width?: number,
    height?: number,
) {
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

    return application;
}

function clearRenderContext () {
    const application = getContext('application');
    if (application) {
        clearNodeUniqueId();
        clearAllIdMap();
        clearRenderManager();
        getContext('body')?._container.destroy();
        clearCanvas();
        application.destroy();
    }
}
(window as any).clearRenderContext = clearRenderContext;
(window as any).getContext = getContext;
