import {EElementTagName, ENodeType} from '@src/types/enum';
import {IStyleChangeCollect, IStyleOptions, TStyleKey} from '@src/types/style';
import {IJson} from '@src/types/util';
import {Application} from 'pixi.js';
import {Element} from '../dom/elements/element';
import {Node} from '../dom/elements/node';
import {isRelayoutStyle} from '../dom/style/style-util';
import {triggerNextTickCalls} from './next-tick';

export const StyleChangeManager = (() => {

    const StyleChangeRoot = buildParentChooser();
    let StyleCollector: IJson<IStyleChangeCollect> = {};
    let empty = true;

    const clear = () => {
        StyleCollector = {};
        StyleChangeRoot.clear();
        empty = true;
    };
    return {
        // 通过style.xx = xx 触发
        // important 已被前置处理
        collectSingleChange (
            node: Node,
            name: TStyleKey,
            value: string
        ) {
            if (empty) empty = false;

            if (node.nodeType === ENodeType.Element) {
                StyleChangeRoot.add(node as Element);
            }
            const item = StyleCollector[node.__id];
            if (!item) {
                StyleCollector[node.__id] = {
                    node,
                    styles: {[name]: value},
                };
            } else {
                item.styles[name] = value as any;
            }
            if (isRelayoutStyle(name as TStyleKey)) {
                collectLayoutChange(node);
            }
        },
        // 通过style = xxx 触发
        // important 已被前置处理
        collectChanges (
            node: Element,
            styles: IStyleOptions,
        ) {
            if (empty) empty = false;
            StyleChangeRoot.add(node);
            const item = StyleCollector[node.__id];
            if (!item) {
                StyleCollector[node.__id] = {node, styles};
            } else {
                Object.assign(item.styles, styles);
            }
        
            for (const key in styles) { // 提取可能造成重排的样式
                if (isRelayoutStyle(key as TStyleKey)) {
                    collectLayoutChange(node);
                }
            }
        },
        triggerChange () {
            if (Object.keys(StyleCollector).length > 0) {
                console.log(StyleCollector);
            }
            for (const k in StyleCollector) {
                const {node, styles} = StyleCollector[k];
        
                node.style._renderStyles(styles);
            }
            clear();
        }
    };
})();

// let InheritStyleCollector: IJson<IStyleChangeCollect> = {};

// export function collectInheritStyleChange (
//     node: Node,
//     name: TStyleKey,
//     value: string,
// ) {
//     const item = InheritStyleCollector[node.__id];
//     if (!item) {
//         InheritStyleCollector[node.__id] = {
//             node,
//             styles: {[name]: value},
//         };
//     } else {
//         item.styles[name] = value as any;
//     }
//     if (isRelayoutStyle(name as TStyleKey)) {
//         collectLayoutChange(node);
//     }
// }

// 处理选择器变化 attr、tagName 改变
// 选择器变化 只需要收集最大的父元素即可
const SelectorChangeRoot = buildParentChooser();
export function collectSelectorChange (element: Element) {
    SelectorChangeRoot.add(element);
}

const LayoutCollector: Node[] = [];
export function collectLayoutChange (node: Node) {
    if (!LayoutCollector.includes(node)) {
        LayoutCollector.push(node);
    }
}
function triggerSelectorChange () {
    // if (SelectorCollectorParent) {
    //     // todo
    //     SelectorCollectorParent = null;
    // }
}


function triggerLayoutChange () {

}

export function initRenderManager (app: Application) {
    app.ticker.add(() => {
        triggerNextTickCalls();

        triggerSelectorChange();
        StyleChangeManager.triggerChange();
        triggerLayoutChange();
    });
}

function buildParentChooser () {
    let rootParent: Element | null = null;
    return {
        get () {return rootParent;},
        clear () {return rootParent = null;},
        add (element: Element) {
            if (!rootParent) {
                rootParent = element;
            } else {
                if (
                    rootParent.tagName === EElementTagName.Body ||
                    rootParent.__id === element.__id
                ) {
                    return;
                }
        
                let parent = rootParent.parentElement;
        
                if (parent?.__id === element.parentElement?.__id) {
                    rootParent = parent;
                    return;
                }
        
                while (true) {
                    if (!parent || parent.tagName === EElementTagName.Body) return;
                    if (parent.__id === element.__id) {
                        rootParent = element;
                        return;
                    }
                    parent = parent.parentElement;
                }
            }
        }
    };
}
