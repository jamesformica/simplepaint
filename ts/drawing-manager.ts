/// <reference path="../types/easeljs.d.ts" />

module simplepaint {

    export class DrawingManager {

        private stage: createjs.Stage;
        private oldPoint: createjs.Point;
        private oldMidPoint: createjs.Point;
        private color: string;
        private stroke: number;
        private index: number;

        private isFillMode: boolean;
        private isErasing: boolean;
        private shapeLayer: createjs.Shape;

        private mouseMoveEvent: (event: any) => void;

        constructor(private canvas: HTMLCanvasElement) {
            this.index = 0;
            this.stroke = 0;
            this.isFillMode = false;
            this.isErasing = false;

            //check to see if we are running in a browser with touch support
            this.stage = new createjs.Stage(canvas);
            this.stage.autoClear = false;
            this.stage.enableDOMEvents(true);

            this.shapeLayer = new createjs.Shape();
            this.stage.addChild(this.shapeLayer);

            createjs.Touch.enable(this.stage);
            createjs.Ticker.setFPS(24);

            this.attachMouseDown(this);
            this.attachMouseUp(this);

            this.stage.update();
        }

        public setStroke(stroke: number): void {
            this.stroke = stroke;
        }

        public setColour(colour: string): void {
            this.color = colour;
        }

        public toggleFillMode(isFillMode: boolean): void {
            this.isFillMode = isFillMode;
        }

        public toggleEraseMode(isErasing: boolean): void {
            this.isErasing = isErasing;
        }

        public startAgain(): void {
            this.stage.clear();
        }

        public getImage(): string {
            let bitmap = new createjs.Bitmap(this.canvas);
            bitmap.cache(0, 0, this.canvas.width, this.canvas.height, 1);

            let base64 = bitmap.getCacheDataURL();
            return base64;
        }

        private attachMouseDown(manager: DrawingManager): void {
            manager.stage.addEventListener("stagemousedown", (event: any) => {
                if (manager.isFillMode) {
                    manager.floodFill();
                } else {
                    manager.handleMouseDown(event);
                }
            });
        }

        private attachMouseUp(manager: DrawingManager): void {
            manager.stage.addEventListener("stagemouseup", (event: any) => {
                manager.handleMouseUp(event);
            });
        }

        private attachMouseMove(manager: DrawingManager): void {
            manager.mouseMoveEvent = (event: any) => {
                manager.handleMouseMove(event);
            }

            manager.stage.addEventListener("stagemousemove", manager.mouseMoveEvent);
        }

        private removeMouseMove(manager: DrawingManager): void {
            manager.stage.removeEventListener("stagemousemove", manager.mouseMoveEvent);
        }

        private handleMouseDown(event: any): void {
            if (!event.primary) { return; }

            this.oldPoint = new createjs.Point(this.stage.mouseX, this.stage.mouseY);
            this.oldMidPoint = this.oldPoint.clone();

            this.shapeLayer.graphics.clear()
                .beginStroke(this.color)
                .beginFill(this.color)
                .drawCircle(this.oldPoint.x, this.oldPoint.y, this.stroke / 2);

            this.shapeLayer.compositeOperation = this.isErasing ? "destination-out" : "source-over";

            this.stage.update();

            this.attachMouseMove(this);
        }

        private handleMouseMove(event) {
            if (!event.primary) { return; }

            let newMidPoint = new createjs.Point(this.oldPoint.x + this.stage.mouseX >> 1, this.oldPoint.y + this.stage.mouseY >> 1);

            this.shapeLayer.graphics.clear()
                .setStrokeStyle(this.stroke, 'round', 'round')
                .beginStroke(this.color)
                .moveTo(newMidPoint.x, newMidPoint.y)
                .curveTo(this.oldPoint.x, this.oldPoint.y, this.oldMidPoint.x, this.oldMidPoint.y);

            this.oldPoint.x = this.stage.mouseX;
            this.oldPoint.y = this.stage.mouseY;
            this.oldMidPoint.x = newMidPoint.x;
            this.oldMidPoint.y = newMidPoint.y;

            this.stage.update();
        }

        private handleMouseUp(event) {
            if (!event.primary) { return; }

            this.removeMouseMove(this);
        }

        private floodFill(): void {
            simplepaint.helper.floodFill(this.stage, this.canvas, this.color);
        }
    }
}