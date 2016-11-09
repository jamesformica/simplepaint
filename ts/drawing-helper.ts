module simplepaint.helper {
    "use strict";

    export interface RGBA {
        r: number;
        g: number;
        b: number;
        a: number;
    }

    export function floodFill(stage: createjs.Stage, canvas: HTMLCanvasElement, colour: string): void {
        let pixelStack = [[stage.mouseX, stage.mouseY]];
        let context = canvas.getContext("2d");
        let colourLayerData = context.getImageData(0, 0, canvas.width, canvas.height);

        let clickPixel = (stage.mouseY * canvas.width + stage.mouseX) * 4;

        let rgbaClickColour = getClickRgbaColour(colourLayerData, clickPixel);
        let rgbaFillColour = getFillRgbaColour(colour);

        if (areColoursTheSame(rgbaClickColour, rgbaFillColour)) {
            return;
        }

        while (pixelStack.length) {
            let x: number;
            let y: number;
            let newPos: number[];
            let pixelPos: number;
            let reachLeft: boolean;
            let reachRight: boolean;

            newPos = pixelStack.pop();
            x = Math.floor(newPos[0]);
            y = Math.floor(newPos[1]);

            pixelPos = (y * Math.floor(canvas.width) + x) * 4;

            while (y-- >= 0 && doesPixelMatchClickColour(pixelPos, colourLayerData, rgbaClickColour, rgbaFillColour)) {
                pixelPos -= canvas.width * 4;
            }

            pixelPos += canvas.width * 4;
            ++y;
            reachLeft = false;
            reachRight = false;

            while (y++ < canvas.height - 1 && doesPixelMatchClickColour(pixelPos, colourLayerData, rgbaClickColour, rgbaFillColour)) {
                colorPixel(pixelPos, colourLayerData, rgbaFillColour);

                if (x > 0) {
                    if (doesPixelMatchClickColour(pixelPos - 4, colourLayerData, rgbaClickColour, rgbaFillColour)) {
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
                    if (doesPixelMatchClickColour(pixelPos + 4, colourLayerData, rgbaClickColour, rgbaFillColour)) {
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

    function getClickRgbaColour(colourLayerData: ImageData, clickPixel: number): RGBA {
        return {
            r: colourLayerData.data[clickPixel],
            g: colourLayerData.data[clickPixel + 1],
            b: colourLayerData.data[clickPixel + 2],
            a: colourLayerData.data[clickPixel + 3]
        }
    }

    function areColoursTheSame(colour1: RGBA, colour2: RGBA): boolean {
        return colour1.r === colour2.r && colour1.g === colour2.g && colour1.b === colour2.b && colour1.a === colour2.a;
    }

    function doesPixelMatchClickColour(pixelPos: number, colorLayer: ImageData, clickColour: RGBA, fillColour: RGBA): boolean {
        let currentRgba: RGBA = {
            r: colorLayer.data[pixelPos],
            g: colorLayer.data[pixelPos + 1],
            b: colorLayer.data[pixelPos + 2],
            a: colorLayer.data[pixelPos + 3]
        };

        let clickMatches = areColoursTheSame(currentRgba, clickColour);

        if (!clickMatches && !areColoursTheSame(currentRgba, fillColour)) {
            let isRClose = fillColour.r - 16 <= currentRgba.r;
            let isGClose = fillColour.g - 16 <= currentRgba.g;
            let isBClose = fillColour.b - 16 <= currentRgba.b;

            if (isRClose && isGClose && isBClose) {
                return true;
            }
        }

        return clickMatches;
    }

    function colorPixel(pixelPos: number, colorLayer: ImageData, fillColour: RGBA): void {
        colorLayer.data[pixelPos] = fillColour.r;
        colorLayer.data[pixelPos + 1] = fillColour.g;
        colorLayer.data[pixelPos + 2] = fillColour.b;
        colorLayer.data[pixelPos + 3] = fillColour.a;
    }

    function getFillRgbaColour(colour: string): RGBA {
        let fakeDiv = document.createElement("div");
        fakeDiv.style.display = "none";
        fakeDiv.style.color = colour;
        
        let newChild = document.body.appendChild(fakeDiv);
        let rgbString = window.getComputedStyle(fakeDiv).color;

        document.body.removeChild(newChild);

        let rgbStringArray = rgbString.substring(4, rgbString.length - 1)
            .replace(/ /g, '')
            .split(',');

        let rgbNumberArray = rgbStringArray.map((a) => {
            return Number(a);
        });

        let fillRgba: RGBA = {
            r: 0,
            g: 0,
            b: 0,
            a: 255
        };

        if (rgbNumberArray.length >= 3) {
            fillRgba.r = rgbNumberArray[0];
            fillRgba.g = rgbNumberArray[1];
            fillRgba.b = rgbNumberArray[2];
        }

        if (rgbNumberArray.length === 4) {
            fillRgba.a = rgbNumberArray[3];
        }

        return fillRgba;
    }
}