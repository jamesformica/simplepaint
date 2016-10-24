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
        private drawnShapes: createjs.Shape[];
        private currentShape: createjs.Shape;

        private mouseMoveEvent: (event: any) => void;

        constructor(private canvas: HTMLCanvasElement) {
            this.index = 0;
            this.stroke = 12;
            this.drawnShapes = [];
            this.isFillMode = false;

            //check to see if we are running in a browser with touch support
            this.stage = new createjs.Stage(canvas);
            this.stage.autoClear = false;
            this.stage.enableDOMEvents(true);

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

        public toggleFillMode(): boolean {
            this.isFillMode = !this.isFillMode;
            return this.isFillMode;
        }

        public undo(): void {
            if (this.drawnShapes.length > 0) {
                this.stage.clear();

                this.drawnShapes.pop();
                this.stage.removeAllChildren();

                this.drawnShapes.forEach((shape) => {
                    this.stage.addChild(shape);
                });

                this.stage.update();
            }
        }

        public startAgain(): void {
            this.stage.clear();
            this.stage.removeAllChildren();
            this.drawnShapes = [];
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
                    manager.locateShape();
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

            this.currentShape = new createjs.Shape();
            this.currentShape.graphics.clear()
                .beginStroke(this.color)
                .beginFill(this.color)
                .drawCircle(this.oldPoint.x, this.oldPoint.y, this.stroke / 2);

            this.stage.addChild(this.currentShape);
            this.stage.update();

            this.attachMouseMove(this);
        }

        private handleMouseMove(event) {
            if (!event.primary) { return; }

            let newMidPoint = new createjs.Point(this.oldPoint.x + this.stage.mouseX >> 1, this.oldPoint.y + this.stage.mouseY >> 1);

            this.currentShape.graphics
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

            if (this.currentShape !== undefined) {
                this.drawnShapes.push(this.currentShape);
            }

            this.currentShape = undefined;
            this.removeMouseMove(this);
        }

        private locateShape(): void {
            let potentialShapes: createjs.Shape[] = [];
            let mousePoint = new createjs.Point(this.stage.mouseX, this.stage.mouseY);

            for (let i = 0; i < this.drawnShapes.length; i++) {
                let shape = this.drawnShapes[i];

                if (simplepaint.helper.IsPointWithinShapeSquare(shape, mousePoint)) {
                    potentialShapes.push(shape);
                }
            }

            for (let i = 0; i < potentialShapes.length; i++) {
                let shape = potentialShapes[i];
                let points = simplepaint.helper.getValidInstructions(shape);

                if (simplepaint.helper.polyContains(points, mousePoint)) {
                    this.fillShape(shape, points);
                }
            }
        }

        private fillShape(shape: createjs.Shape, instructions: createjs.Point[]): void {
            let poly = new createjs.Shape();
            poly.x = shape.x;
            poly.y = shape.y;
            poly.graphics.beginFill(this.color);
            poly.graphics.moveTo(instructions[0].x, instructions[0].y);

            for (let i = 0; i < instructions.length; i++) {
                poly.graphics.lineTo(instructions[i].x, instructions[i].y);
            }

            this.drawnShapes.push(poly);
            this.stage.addChild(poly);
            this.stage.update();
        }
    }
}