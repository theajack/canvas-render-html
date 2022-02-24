import renderHtmlToCanvas from '../src';


const WIN = window as any;

// <div>
//         <span>111</span>
//         <span>222</span>
//         <div>333</div>
//         <span>444</span>
//     </div
//     <span>555</span>
//     <div>666</div>
const body = renderHtmlToCanvas({
    html: /* html*/`<div id='div'>
        <span id=1>111</span>
        <span style='font-size: 40px; color: #f44' id=2>222</span>
        <div id=3>333</div>
        <span id=4>444</span>
    </div>
    <span>555</span>
    <span>666</span>
    <div>777</div>` // <span>s3</span>
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