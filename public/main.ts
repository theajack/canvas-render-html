// import test from '../src';
// import './index.less';

// function main () {
//     initHtml();
//     commonInit();

//     ebuildInit();
// }

// main();

// function ebuildInit () {
//     const id = 'ebuild';
//     getEleById(id).onclick = () => {
//         const value = getValue(id);
//         console.log(value);
//         test.alert(value);
//     };
// }

// function commonInit () {
//     const findDisplayEle = (el: HTMLElement) => {
//         const pp = el.parentNode?.parentNode as HTMLElement;
//         if (!pp) return document.createElement('div');
//         return pp.querySelector('.display') as HTMLElement;
//     };
//     eachClass('copy-result', (el) => {
//         el.onclick = () => {
//             copy(findDisplayEle(el).innerText);
//             toast(el, '复制成功');
//         };
//     });
//     eachClass('clear-result', (el) => {
//         el.onclick = () => {
//             findDisplayEle(el).innerText = '';
//             toast(el, '清除成功');
//         };
//     });
// }

// // utils
// function toast (el: HTMLElement, text: string) {
//     const result = el.parentNode?.querySelector('.tip');
//     if (!result) return;
//     const tip = result as HTMLElement & {__timer: number};

//     clearTimeout(tip.__timer);
//     tip.innerText = text;
//     tip.__timer = window.setTimeout(() => {
//         tip.innerText = '';
//     }, 2000);
// }
// function getEleById<T extends HTMLElement = HTMLElement> (id: string) {
//     return document.getElementById(id) as T;
// }

// function getValue (id: string) {
//     return getEleById<HTMLInputElement>(`${id}Input`).value;
// }

// // function getValue2 (id: string) {
// //     return getEleById<HTMLInputElement>(`${id}Input2`).value;
// // }

// // function getDisplayEle (id: string) {
// //     return getEleById(`${id}Display`);
// // }


// function copy (str: string) {
//     let input = document.getElementById('_copy_input_') as HTMLInputElement;
//     if (!input) {
//         input = document.createElement('input');
//         input.setAttribute('type', 'text');
//         input.setAttribute(
//             'style',
//             'height:10px;position:fixed;top:-100px;opacity:0;'
//         );
//         input.setAttribute('id', '_copy_input_');
//         document.body.appendChild(input);
//     }
//     input.value = str;
//     input.select();

//     try {
//         if (document.execCommand('Copy')) {
//             return true;
//         } else {
//             return false;
//         }
//     } catch (err) {
//         return false;
//     }
// };

// function eachClass (className: string, callback: (el: HTMLElement)=>void) {
//     const cols = document.querySelectorAll(`.${className}`);
//     for (let i = 0; i < cols.length; i++) {
//         callback(cols[i] as HTMLElement);
//     }
// }
// function initHtml () {
//     document.body.innerHTML = /* html*/`
//     <div class='block'>
//         <div class='title'>
//             🚀 Build webpack, babel, eslint, less, commitlint, typescript, vue, react and other development environments [ebuild-cli]
//             <a href="https://github.com/theajack/ebuild-cli" class="link" target="_blank">Github</a>
//         </div>
//     </div>
//     <div class='block'>
//         <div class='title'>
//             Ebuild-cli title: <br>
//             <span>
//                 <span class='text-btn' id='pageNameCopy'>text-button</span> <span class='tip'></span>
//             </span>
//         </div>
//     </div>
//     <div class='block'>
//         <div class='title'>
//             Display block:
//             <a class='link' href="https://github.com/theajack/ebuild-cli" target="_blank">文档</a>
//         </div>
//         <div class='code'>code area</div>
//         <div class='input-group'>
//             <button class='copy-result'>button1</button>
//             <button class='clear-result'>button2</button>
//             <span class='tip'></span>
//         </div>
//         <div id='onMessageDisplay' class='display flat max-scroll'></div>
//     </div>
//     <div class='block'>
//         <div class='title'>
//             Display input:
//             <a class='link' href="https://github.com/theajack/ebuild-cli" target="_blank">文档</a>
//         </div>
//         <div class='code'>code area</div>
//         <div class='input-group'>
//             <input type="text" id='ebuildInput' placeholder="input">
//             <button id='ebuild'>button</button>
//         </div>
//     </div>`;
// }

import '../src/index';