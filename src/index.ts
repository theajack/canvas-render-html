/*
 * @Author: tackchen
 * @Date: 2022-02-20 16:05:23
 * @LastEditors: tackchen
 * @LastEditTime: 2022-02-24 21:15:52
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


export function renderHtmlToCanvas ({
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

    const body = parseHtml(html);
    WIN.body = body;

    console.log(body);

    application.stage.addChild(body._container);
}

renderHtmlToCanvas({
    html: /* html*/`<span>s1</span><span>s2</span>` // <span>s3</span>
    // <span>s2</span>
    // <div style='color: #f00;font-size: 18px' id='1' class=3>11111</div>
    // <div style='color: #00f;font-size: 28px' id='2' class=3>2222</div>
    // <div style='color: #00f;font-size: 28px' id='3' class=3>3333</div>
/*
    <div style='color: #00f;font-size: 28px' id='2' class=3>
       2222
    </div>
    <div style='color: #00f;font-size: 28px' id='3' class=3>
       3333
    </div>
    <div id='4'>
       4444
    </div>

*/
// div
    // 222
    // <span>333</span>
});
