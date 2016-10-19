# SimplePaint
imagine a very cut down version of ms paint on a html canvas

#### Dependencies
- FontAwesome
- EaselJS
- JQuery (cause im lazy)

#### Usage
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
