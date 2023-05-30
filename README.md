# [canvas-render-html](https://www.github.com/theajack/canvas-render-html)

[中文](https://github.com/theajack/canvas-render-html/blob/master/README.cn.md)

A project that uses Canvas to render HTML code, currently in development 0.0.1-alpha

Simple version [experience address](https://theajack.github.io/canvas-render-html)

Goals and application scenarios:

1. Realize the browser environment, realize the cross-end running of HTML and JS code
2. Run html code on small programs and small games
3. Based on this implementation, run vue, react and third-party UI on the applet
4. Support small games and game engines to draw game UI

Currently under development, if you have good ideas and suggestions, please submit Issue and MR


## Done list

1. Construction of virtual DOM
2. PIXI rendering
3. Parse properties
4. Parse some styles color, fontSize, width, height, display, left, top
5. Complete the basic layout

## Todo List

1. More style improvements
2. css support
3. Event Support
4. z-index support
5. flex layout
6. Improvement of DOM and window api
7. Box Model
8. Support for img, video, audio and other tags
9. ...

## Principle

HTML -> vdom + css -> pixi rendering

### Record

#### layout layout implementation

Calculate the layout and boundary implementation of elemnt

inline + block relative layout

#### Execution order

for elements

1. Start parsing tags
2. Create element and add it to parent
3. Rendering styles
4. The parsing tag is completed (sub-elements are added)
5. Layout itself from the parent element

for textNode

1. Create a textNode and add it to the parent element
2. Rendering style
3. Layout itself from the parent element