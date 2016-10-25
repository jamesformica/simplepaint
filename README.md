# SimplePaint
imagine a very cut down version of ms paint on a html canvas

#### Dependencies
- EaselJS
- JQuery (cause im lazy)

#### Usage

- add reference to **simplepaint.css** and include the fonts folder with icons
- add link to **simplepaint.js**

```
let $canvasContainer = $(".ui-simplepaint");
let canvasManager = new simplepaint.CanvasManager($canvasContainer);
```

#### Current Options
```
export interface ICanvasManagerOptions {
    height?: number,
    colours?: string[],
    brushSizes?: number[]
}
```
