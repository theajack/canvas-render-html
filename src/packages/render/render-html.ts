// /*
//  * @Author: tackchen
//  * @Date: 2022-02-20 16:05:23
//  * @LastEditors: tackchen
//  * @LastEditTime: 2022-03-13 21:53:36
//  * @FilePath: /canvas-render-html/src/packages/render/render-html.ts
//  * @Description: Coding something
//  */

// import {clearCanvas, getCanvas, getScreenSize} from '../../adapter';
// import {createRenderApplication} from './pixi';
// import {IRenderHtmlToCanvasOptions} from '../../types/index';
// import {getContext, injectContext} from '../context/context';
// import {parseHtml} from '../dom/parser/parser';
// import {createElement} from '../dom/elements/create-element';
// import {EElementName} from '../../types/enum';
// import {BodyElement} from '../dom/elements/component/body';
// import {CssOM} from '../dom/style/cssom';
// import {clearNodeUniqueId} from '../dom/elements/node';
// import {clearAllIdMap} from '../dom/parser/id-map';
// import {clearRenderManager} from '../render/render-manager';

// export default function renderHtmlToCanvas ({
//     html,
//     canvas,
//     width,
//     height,
//     css,
// }: IRenderHtmlToCanvasOptions): BodyElement {

//     const application = createPIXIApplication(canvas, width, height);
//     // console.log(html);

//     const body = createElement(EElementName.Body);
//     application.stage.addChild(body._container);
//     const cssom = new CssOM(css);

//     injectContext('cssom', new CssOM(css));
//     parseHtml(html, body);

//     return body;
// }

// function createPIXIApplication (
//     canvas?: HTMLCanvasElement,
//     width?: number,
//     height?: number,
// ) {
//     if (!canvas) {
//         canvas = document.createElement('canvas');
//     }

//     if (!width || !height) {
//         const size = getScreenSize();
//         width = width || size.width;
//         height = height || size.height;
//     }
    
//     const application = createRenderApplication({
//         canvas,
//         width,
//         height
//     });

//     return application;
// }

// function clearRenderContext () {
//     const application = getContext('application');
//     if (application) {
//         clearNodeUniqueId();
//         clearAllIdMap();
//         clearRenderManager();
//         getContext('body')?._container.destroy();
//         clearCanvas();
//         application.destroy();
//     }
// }
// (window as any).clearRenderContext = clearRenderContext;
// (window as any).getContext = getContext;
