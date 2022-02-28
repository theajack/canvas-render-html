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
    html: /* html*/`
    <span id=0>
        <span id='1'>11</span><span id='2'>22</span>
    </span>
    <span id='3'>33</span>
    <div id='4'>44</div>

    `,
    css: `#1{color: #fff}` // <span>s3</span>
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
