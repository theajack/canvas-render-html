import {EElementTagName, ENodeType} from '@src/types/enum';
import {IStyleChangeCollect, IStyleOptions, TStyleKey} from '@src/types/style';
import {IJson} from '@src/types/util';
import {Application} from 'pixi.js';
import {Element} from '../dom/elements/element';
import {Node} from '../dom/elements/node';
import {isRelayoutStyle} from '../dom/style/style-util';
import {triggerNextTickCalls} from './next-tick';

export const StyleChangeManager = (() => {

    let StyleCollector: IJson<IStyleChangeCollect> = {};
    let empty = true;

    const clear = () => {
        StyleCollector = {};
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
                LayoutChangeManager.collectElement(node);
            }
        },
        // 通过style = xxx 触发
        // important 已被前置处理
        collectChanges (
            node: Element,
            styles: IStyleOptions,
        ) {
            if (Object.keys(styles).length === 0) return;
            if (empty) empty = false;
            const item = StyleCollector[node.__id];
            if (!item) {
                StyleCollector[node.__id] = {node, styles};
            } else {
                Object.assign(item.styles, styles);
            }
        
            for (const key in styles) { // 提取可能造成重排的样式
                if (isRelayoutStyle(key as TStyleKey)) {
                    LayoutChangeManager.collectElement(node);
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

// 处理选择器变化 attr、tagName 改变
// 选择器变化 只需要收集最大的父元素即可
export const SelectorChangeManager = (() => {
    const rootElement = buildParentChooser();

    function applySelectorChangeToElement (element: Node) {
        element.style._initInheritStyles();
        if (element.nodeType === ENodeType.Element) {
            (element as Element).style._initStyleWithCssOM();
            (element as Element)._traverseChild((child) => {
                applySelectorChangeToElement(child);
            });
        }
    }

    return {
        collectElement (element: Element) {
            rootElement.add(element);
        },
        triggerChange () {
            const root = rootElement.get();
            if (root) {
                console.log('triggerSelectorChange', root);
                root._traverseSiblingFromCurrent((sibling) => {
                    applySelectorChangeToElement(sibling);
                });
                rootElement.clear();
            }
        }
    };
})();


export const LayoutChangeManager = (() => {
    const rootElement = buildParentChooser();
    let collector: Node[] = [];

    return {
        collectElement (node: Node) {
            if (!collector.includes(node)) {
                collector.push(node);
                // textNode的style肯定是来自继承自父元素 所以可以忽略textNode的change
                if (node.nodeType === ENodeType.Element) {
                    rootElement.add(node as Element);
                }
            }
        },
        triggerChange () {
            rootElement.get()?._layout._reLayout(0);
            if (collector.length > 0) {
                // todo
                console.log('triggerSelectorChange', collector);
                collector = [];
                rootElement.clear();
            }
        }
    };
})();

export function initRenderManager (app: Application) {
    app.ticker.add(() => {
        // 三个顺序不能颠倒
        SelectorChangeManager.triggerChange();
        StyleChangeManager.triggerChange();
        LayoutChangeManager.triggerChange();

        triggerNextTickCalls();
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
                    // root 与 element是兄弟 则取共同的父元素
                    rootParent = parent;
                    return;
                }
        
                while (true) {
                    // 从当前root往上找 如果存在element 则将root设置为element
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
