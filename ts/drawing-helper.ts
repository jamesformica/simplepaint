module simplepaint.helper {
    "use strict";

    export function floodFill(stage: createjs.Stage, canvas: HTMLCanvasElement, colour: string): void {
        let pixelStack = [[stage.mouseX, stage.mouseY]];

        let rgbFill = getRgbColour(colour);

        let context = canvas.getContext("2d");
        let colourLayerData = context.getImageData(0, 0, canvas.width, canvas.height);

        let clickPixel = (stage.mouseY * canvas.width + stage.mouseX) * 4;
        let clickR = colourLayerData.data[clickPixel];
        let clickG = colourLayerData.data[clickPixel + 1];
        let clickB = colourLayerData.data[clickPixel + 2];

        while (pixelStack.length) {
            let newPos: number[];
            let x: number;
            let y: number;
            let pixelPos: number;
            let reachLeft: boolean;
            let reachRight: boolean;

            newPos = pixelStack.pop();
            x = newPos[0];
            y = newPos[1];

            pixelPos = (y * canvas.width + x) * 4;

            while (y-- >= 0 && matchStartColor(pixelPos, colourLayerData, clickR, clickG, clickB)) {
                pixelPos -= canvas.width * 4;
            }

            pixelPos += canvas.width * 4;
            ++y;
            reachLeft = false;
            reachRight = false;

            while (y++ < canvas.height - 1 && matchStartColor(pixelPos, colourLayerData, clickR, clickG, clickB)) {
                colorPixel(pixelPos, colourLayerData, rgbFill);

                if (x > 0) {
                    if (matchStartColor(pixelPos - 4, colourLayerData, clickR, clickG, clickB)) {
                        if (!reachLeft) {
                            pixelStack.push([x - 1, y]);
                            reachLeft = true;
                        }
                    }
                    else if (reachLeft) {
                        reachLeft = false;
                    }
                }

                if (x < canvas.width - 1) {
                    if (matchStartColor(pixelPos + 4, colourLayerData, clickR, clickG, clickB)) {
                        if (!reachRight) {
                            pixelStack.push([x + 1, y]);
                            reachRight = true;
                        }
                    }
                    else if (reachRight) {
                        reachRight = false;
                    }
                }

                pixelPos += canvas.width * 4;
            }
        }

        context.putImageData(colourLayerData, 0, 0);
    }

    function matchStartColor(pixelPos, colorLayer: ImageData, origR: number, origG: number, origB: number) {
        var r = colorLayer.data[pixelPos];
        var g = colorLayer.data[pixelPos + 1];
        var b = colorLayer.data[pixelPos + 2];

        return (r == origR && g == origG && b == origB);
    }

    function colorPixel(pixelPos, colorLayer: ImageData, rgbFill: number[]) {
        colorLayer.data[pixelPos] = rgbFill[0];
        colorLayer.data[pixelPos + 1] = rgbFill[1];
        colorLayer.data[pixelPos + 2] = rgbFill[2];
        colorLayer.data[pixelPos + 3] = 255;
    }

    function getRgbColour(colour: string): number[] {
        let fakeDiv = document.createElement("div");
        fakeDiv.style.display = "none";
        fakeDiv.style.color = colour;
        document.body.appendChild(fakeDiv);

        let rgbString = window.getComputedStyle(fakeDiv).color;

        let rgbStringArray = rgbString.substring(4, rgbString.length - 1)
            .replace(/ /g, '')
            .split(',');

        let rgbNumberArray = rgbStringArray.map((a) => {
            return Number(a);
        })

        return rgbNumberArray;
    }
}