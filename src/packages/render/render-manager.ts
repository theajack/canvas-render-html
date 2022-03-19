import {ECompareResult, ENodeType} from '@src/types/enum';
import {IStyleChangeCollect, IStyleOptions, TStyleKey} from '@src/types/style';
import {IJson} from '@src/types/util';
import {Application} from 'pixi.js';
import {getContext} from '../context/context';
// import {document} from '../dom/document';
import {Element} from '../dom/elements/element';
import {Node} from '../dom/elements/node';
// import {isRelayoutStyle, isTextRelayoutStyle} from '../dom/style/style-util';
import {clearNextTickCallbacks, triggerNextTickCalls} from './next-tick';

export const StyleChangeManager = (() => {

    let StyleCollector: IJson<IStyleChangeCollect> = {};
    let empty = true;
    
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
            // // ! 对于文本layout样式 非textNode不需要进行
            // const isTextLayout = isTextRelayoutStyle(name);
            // if (
            //     (isTextLayout && node.nodeType === ENodeType.Text)
            //     || (!isTextLayout && isRelayoutStyle(name))
            // ) {
            //     LayoutChangeManager.collectElement(node);
            // }
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
        
            // for (const key in styles) { // 提取可能造成重排的样式
            //     if (isRelayoutStyle(key as TStyleKey)) {
            //         LayoutChangeManager.collectElement(node);
            //     }
            // }
        },
        triggerChange () {
            // if (Object.keys(StyleCollector).length > 0) {
            //     console.log(StyleCollector);
            // }
            for (const k in StyleCollector) {
                const {node, styles} = StyleCollector[k];
        
                node.style._renderStyles(styles);
            }
            this.clear();
        },
        clear () {
            StyleCollector = {};
            empty = true;
        }
    };
})();

// 处理选择器变化 attr、tagName 改变
// 选择器变化 只需要收集最大的父元素即可
export const SelectorChangeManager = (() => {
    const rootElement = buildParentChooser<Element>();

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
                // console.log('triggerSelectorChange', root);
                // todo 待优化性能 比对过滤不需要遍历的节点
                root._traverseSiblingFromCurrent((sibling) => {
                    applySelectorChangeToElement(sibling);
                });
                this.clear();
            }
        },
        clear () {
            rootElement.clear();
        }
    };
})();


function buildElementDeepOrderCollector () {
    let collector: Element[] = [];

    return {
        collect (element: Element) {
            if (!collector.includes(element)) {
                const parent = element.parentElement;
                const deep = element.__deep;
                if (parent && deep > 0) {
                    for (let i = 0; i < collector.length; i++) {
                        const current = collector[i];
    
                        if (deep < current.__deep) continue;
    
                        if (deep > current.__deep) {
                            collector.splice(i, 0, element);
                            return;
                        }
    
                        if (parent !== current.parentElement) {
                            continue;
                        }
    
                        const compareResult = parent._compareChildrenOrder(element.__id, current.__id);
                        if (compareResult === ECompareResult.LESS) {
                            continue;
                        } else if (compareResult === ECompareResult.MORE) {
                            collector.splice(i, 0, element);
                            return;
                        } else {
                            throw new Error('_compareChildrenOrder error');
                        }
    
                    }
                }
                collector.push(element);
            }
        },
        clear () {
            collector = [];
        },
        get () {
            return collector;
        }
    };
}

export const LayoutChangeManager = (() => {
    const collector = buildElementDeepOrderCollector();

    return {
        collectElement (node: Element) {
            collector.collect(node);
        },
        triggerChange () {
            const list = collector.get();
            if (list.length > 0) {
                console.log('triggerLayoutChange', list);

                for (let i = 0, length = list.length; i < length; i++) {
                    const element = list[i];
                    console.log('traverse', element.__id);
                    // todo 增加index优化性能
                    element._layout._reLayoutChildren();
                }
                this.clear();
                
                console.log((window as any).elementIdMap);
            }
        },
        clear () {
            collector.clear();
        }
    };
})();

function renderLoop () {
    
    SelectorChangeManager.triggerChange();
    StyleChangeManager.triggerChange();
    LayoutChangeManager.triggerChange();

    triggerNextTickCalls();
}

export function initRenderManager (app: Application) {
    app.ticker.add(renderLoop);
}

export function clearRenderManager () {
    getContext('application').ticker.remove(renderLoop);
    SelectorChangeManager.clear();
    StyleChangeManager.clear();
    LayoutChangeManager.clear();

    clearNextTickCallbacks();
}

function buildParentChooser<T extends Node = Node> () {
    let rootParent: T | null = null;
    return {
        get () {return rootParent;},
        clear () {return rootParent = null;},
        add (node: T) {
            if (!rootParent) {
                rootParent = node;
            } else {
                // 使用 path 判断 提升效率
                rootParent = rootParent._findCommonParent(node) as T;
                // if (
                //     rootParent.__deep === 0 ||
                //     rootParent.__id === element.__id
                // ) {
                //     return;
                // }
        
                // let parent = rootParent.parentElement;
        
                // if (parent?.__id === element.parentElement?.__id) {
                //     // root 与 element是兄弟 则取共同的父元素
                //     rootParent = parent;
                //     return;
                // }
        
                // while (true) {
                //     // 从当前root往上找 如果存在element 则将root设置为element
                //     if (!parent || parent.tagName === EElementTagName.Body) return;
                //     if (parent.__id === element.__id) {
                //         rootParent = element;
                //         return;
                //     }
                //     parent = parent.parentElement;
                // }
            }
        }
    };
}
