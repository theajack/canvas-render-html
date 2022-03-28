import renderHtmlToCanvas from '../src';
import {document} from '@src/packages/dom/document';

(window as any).doc = document;
/*
<div class='d00 c1 c2 c3'>
    <div class='d3'>d3</div>
    <div class='d4'>
        <div class='d41' style='background-color: #f44' id='id_d11'>
            <div class='d42' id='d42'>d42</div>
        </div>
        <div style='background-color: #ff4' class='d42'>>d42</div>
    </div>
    <div style='background-color: #bbb' class='d42'>+d42</div>
    <div class='c1 c2 c3 c4' id='empty'></div>
    <span style='background-color: #4f4' name='aa'>1</span>
    <span style='background-color: #44f' name='aa'>2</span>
    <span name='bb'>3</span>
</div>
*/

const html = /* html*/`
<div style='background-color: #ff4' id='d42'>d42</div>
`;


const css = /* css*/`
.d00 .d1{
    color: #f00
}
`;

renderHtmlToCanvas({
    html,
    css,
});


// function thinFace (prototype: IJson, key: string) {
//     Object.defineProperty(prototype, key, {
//         get () {
//             prototype.hello.call(this);
//             return this[`_${key}`];
//         },
//         set (v: string) {
//             this[`_${key}`] = v;
//         }
//     });
// };

  
// function hackGetter (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
//     WIN.t = target;
//     console.log(target, propertyKey, descriptor);
//     descriptor.get = function (this: Girl) {
//         console.log(this);
//         return '111';
//     };
//     // descriptor.get = function () {
//     //     return this._x;
//     // };
// };

// function helloDec (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
//     console.log(target, propertyKey, descriptor);
//     const value = descriptor.value;
//     descriptor.value = function (this: Girl, v: string) {
//         value.call(this, v);
//         return console.warn(v);
//     };
// };

// class Girl {
//     @thinFace
//     public age: number;

//     @hackGetter
//     get x () {return '';};

//     @helloDec
//     hello (v: string) {
//         console.log(v, this.x);
//     }
// }
  
// const g = new Girl();
// WIN.g = g;
// // console.log(g.age); // 18
// WIN.Girl = Girl;
