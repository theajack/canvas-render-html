import renderHtmlToCanvas from '../src';
import {IJson} from '@src/types/util';
import {document} from '@src/packages/dom/document';

const WIN = window as any;
WIN.doc = document;

// <div class='a b'><span class='e 1'>d1 </span></div>
// <div class='a c'><span class=''>d1 <span class='e'>span</span> </span></div>
// <div class='a d 1'><div class='d'>d2</div></div>
// <div class='a b'><span class=' 1'>d1 </span></div>
// <div class='a d 2'><div class='d'>d2</div></div>
const body = renderHtmlToCanvas({
    html: /* html*/`<div class='d00 c1 c2 c3'>
        <div>
        <div id='11' class="d1">11</div><div class='xx' style="color: #4f4">222</div>
        </div>
        <div class='d1' style='color: #0f0'>
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
    `,
    css: /* css*/`
    .d00 .d1{
        color: #f00
    }
    `
});

WIN.body = body;

function thinFace (prototype: IJson, key: string) {
    Object.defineProperty(prototype, key, {
        get () {
            prototype.hello.call(this);
            return this[`_${key}`];
        },
        set (v: string) {
            this[`_${key}`] = v;
        }
    });
};

  
function hackGetter (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    WIN.t = target;
    console.log(target, propertyKey, descriptor);
    descriptor.get = function (this: Girl) {
        console.log(this);
        return '111';
    };
    // descriptor.get = function () {
    //     return this._x;
    // };
};

function helloDec (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log(target, propertyKey, descriptor);
    const value = descriptor.value;
    descriptor.value = function (this: Girl, v: string) {
        value.call(this, v);
        return console.warn(v);
    };
};

class Girl {
    @thinFace
    public age: number;

    @hackGetter
    get x () {return '';};

    @helloDec
    hello (v: string) {
        console.log(v, this.x);
    }
}
  
const g = new Girl();
WIN.g = g;
// console.log(g.age); // 18
WIN.Girl = Girl;
