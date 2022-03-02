# [canvas-render-html](https://www.github.com/theajack/canvas-render-html)

[English](https://github.com/theajack/canvas-render-html)

使用Canvas渲染HTML代码的项目，目前处于开发阶段 0.0.1-alpha

简易版本[体验地址](https://theajack.gitee.io/canvas-render-html)

目标与应用场景：

1. 实现浏览器环境，实现跨端运行HTML与JS代码
2. 小程序、小游戏上运行html代码
3. 基于此实现在小程序上运行vue、react以及第三方UI
4. 支持小游戏及游戏引擎，实现绘制游戏UI

目前正在开发中，如果您有好的想法和建议，欢迎提 Issue 与 MR

## Done list

1. 虚拟DOM的构建
2. PIXI渲染
3. 解析属性
4. 解析部分样式 color，fontSize，width，height，display，left，top
5. 完成基础布局
6. querySelector 等api完成
7. 单元测试

## Todo List

1. 更多样式的完善
2. css支持
3. 事件支持
4. z-index支持
5. flex布局
6. DOM 与 window api的完善
7. 盒模型
8. img、audio、video等标签的支持
9. ...

## 原理

HTML -> vdom + css -> pixi渲染

### 记录

#### layout 布局实现

计算elemnt的layout与boundary实现

inline + block relative布局

#### 执行顺序

对于元素

1. 解析标签开始
2. 创建元素 添加到parent
3. 渲染样式
4. 解析标签完成（子元素添加完成）
5. 由父元素layout自身

对于textNode

1. 创建 textNode 添加到父元素
2. 渲染样式
3. 由父元素layout自身
