/*
 * @Author: tackchen
 * @Date: 2022-01-08 15:32:27
 * @LastEditors: tackchen
 * @LastEditTime: 2022-03-13 21:23:44
 * @FilePath: /canvas-render-html/test/cases/id-map.ts
 * @Description: Coding something
 */

import renderHtmlToCanvas from '@src/index';
import {document} from '@src/packages/dom/document';

(window as any).renderHtmlToCanvas = renderHtmlToCanvas;

renderHtmlToCanvas({
    html: /* html*/`
    <div>
        <div>111
            <div id='a'>111</div>
        </div>
        <div id='a'>222</div>
    </div>
    `,
});

export default [
    {
        name: '测试 getElementById 测试先后顺序',
        test () {
            const result: string[] = [];
            const ele = document.getElementById('a');
            result.push(ele?.innerText || '');
            ele?.removeAttribute('id');
            result.push(document.getElementById('a')?.innerText || '');
            return result;
        },
        expect: ['111', '222'],
    },
];

