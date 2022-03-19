/*
 * @Author: tackchen
 * @Date: 2022-01-08 15:32:27
 * @LastEditors: tackchen
 * @LastEditTime: 2022-03-14 22:16:23
 * @FilePath: /canvas-render-html/test/cases/query-selector.ts
 * @Description: Coding something
 */

import renderHtmlToCanvas from '@src/index';
import {document} from '@src/packages/dom/document';
import {Element} from '@src/packages/dom/elements/element';
import {isElementMatchSelector} from '@src/packages/dom/parser/query-selector';
import {matchSelectorToken, parseSelector} from '@src/packages/dom/parser/selector-parser';

renderHtmlToCanvas({
    html: /* html*/`
    <div class='d00 c1 c2 c3'>
        <div class='d1'>
            <div class='d10'>d10</div>
            <div class=''></div>
            <div class='d11' id='id_d11'>d11</div>
            <div class='d12'>d12</div>
        </div>
        <div class='d2'>d2</div>
        <div class='d3'>d3</div>
        <div class='d4'>
            <div class='d41' id='id_d11'>
                <div class='d42'>d42</div>
            </div>
            <div class='d42'>>d42</div>
        </div>
        <div class='d42'>+d42</div>
        <div class='c1 c2 c3 c4'></div>
        <span name='aa'></span>
        <span name='aa'></span>
        <span name='bb'></span>
    </div>
    `
});

export default [
    {
        name: '测试 getElementById',
        test () {
            const element = document.getElementById('id_d11');
            return element?.innerText;
        },
        expect: 'd11',
    }, {
        name: '测试 querySelector',
        test () {
            return [
            document.querySelector('.d1')?.innerText,
            document.querySelector('.d1 .d12')?.innerText,
            document.querySelector('div .d11')?.innerText,
            document.querySelector('.d2 .d12')?.innerText,
            ];
        },
        expect: ['d10d11d12', 'd12', 'd11', undefined],
    }, {
        name: '测试 querySelector combinator',
        test () {
            return [
            document.querySelector('.d4 .d42')?.innerText,
            document.querySelector('.d4 + .d42')?.innerText,
            document.querySelector('.d4 > .d42')?.innerText,
            ];
        },
        expect: ['d42', '+d42', '>d42'],
    }, {
        name: '测试 isElementMatchSelector',
        test () {
            const element = document.getElementById('id_d11') as Element;
            return [
                isElementMatchSelector(element, parseSelector('.d1 .d11')),
                isElementMatchSelector(element, parseSelector('div .d11')),
                isElementMatchSelector(element, parseSelector('.d2 .d11')),
                isElementMatchSelector(element, parseSelector('.d42')),
                isElementMatchSelector(element, parseSelector('.d10 + .d11')),
                isElementMatchSelector(element, parseSelector('.d10 ~ .d11')),
                isElementMatchSelector(element, parseSelector('.d1 > .d11')),
                isElementMatchSelector(element, parseSelector('.d00 > .d11')),
            ];
        },
        expect: [true, true, false, false, false, true, true, false ],
    }, {
        name: '测试 matchSelectorToken',
        test () {
            const element = document.getElementById('id_d11') as Element;
            return [
                matchSelectorToken(element, parseSelector('[id=id_d11]')[0]),
                matchSelectorToken(element, parseSelector('[id^=id_]')[0]),
                matchSelectorToken(element, parseSelector('#id_d11')[0]),
                matchSelectorToken(element, parseSelector('.d11')[0]),
                matchSelectorToken(element, parseSelector('div')[0]),
                matchSelectorToken(element, parseSelector('[id=id_d12]')[0]),
            ];
        },
        expect: [true, true, true, true, true, false],
    }, {
        name: '测试 other',
        test () {
            return [
                document.getElementsByClassName('c3  c1 ').length,
                document.getElementsByName('aa').length,
                document.getElementsByTagName('span').length
            ];
        },
        expect: [2, 2, 3],
    }
];

