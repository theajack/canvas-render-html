/*
 * @Author: tackchen
 * @Date: 2022-02-20 16:05:23
 * @LastEditors: tackchen
 * @LastEditTime: 2022-02-23 17:06:28
 * @FilePath: /canvas-render-html/src/index.ts
 * @Description: Coding something
 */

import {getCanvas, getScreenSize} from './adapter';
import {createRenderApplication} from './packages/render/pixi';
import {IRenderHtmlToCanvasOptions} from './types';
import {injectContext} from './packages/context/context';
import {parseHtml} from './packages/dom/parser/parser';

// const obj = css.parse(`body { font-size: 12px; }`);

// WIN.obj = obj;
// WIN.css = css;

const WIN = window as any;


export async function renderHtmlToCanvas ({
    html,
    canvas,
    width,
    height,
}: IRenderHtmlToCanvasOptions) {

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

    WIN.app = application;
    injectContext('application', application);
    console.log(html);

    const body = await parseHtml(html);
    WIN.body = body;

    console.log(body);

    application.stage.addChild(body._container);
}

renderHtmlToCanvas({
    html: /* html*/`
    <div style='color: #f00;font-size: 18px' id='2' class=3>
       111
    </div>
`
// div
    // 222
    // <span>333</span>
});
