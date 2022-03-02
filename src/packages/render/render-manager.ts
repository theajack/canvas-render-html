import {IStyleChangeCollect, IStyleOptions} from '@src/types/style';
import {IJson} from '@src/types/util';
import {Application} from 'pixi.js';
import {Element} from '../dom/elements/element';
import {Node} from '../dom/elements/node';

const StyleCollector: IJson<IStyleChangeCollect> = {};

export function collectStyleChange (node: Element, change: IStyleOptions) {
    if (!StyleCollector[node.__id]) {
        StyleCollector[node.__id] = {node, changes: [change]};
    } else {
        StyleCollector[node.__id].changes.push(change);
    }
}

// 处理选择器变化 attr、tagName 改变

const SelectorCollector: Node[] = [];
export function collectSelectorChange (node: Element) {
    if (!SelectorCollector.includes(node)) {
        SelectorCollector.push(node);
    }
}


const LayoutCollector: Node[] = [];
export function collectLayoutChange (node: Element) {
    if (!LayoutCollector.includes(node)) {
        LayoutCollector.push(node);
    }
}

function triggerStyleChange () {
    // for (const k in StyleCollector) {
    //     const {node, changes} = StyleCollector[k];

    //     changes.forEach(change => {
            
    //     });
    // }
}

function triggerLayoutChange () {

}

export function initRenderManager (app: Application) {
    app.ticker.add(() => {
        // console.log(111);
        triggerStyleChange();
        triggerLayoutChange();
    });
}