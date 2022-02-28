import {IStyleChange, IStyleChangeCollect} from '@src/types/style';
import {IJson} from '@src/types/util';
import {Application} from 'pixi.js';
import {Node} from '../dom/elements/node';

const StyleCollector: IJson<IStyleChangeCollect> = {};

const LayoutCollector: Node[] = [];

export function collectStyleChange (node: Node, change: IStyleChange) {
    if (!StyleCollector[node.__id]) {
        StyleCollector[node.__id] = {node, changes: [change]};
    } else {
        StyleCollector[node.__id].changes.push(change);
    }
}

export function collectLayoutChange (node: Node) {
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