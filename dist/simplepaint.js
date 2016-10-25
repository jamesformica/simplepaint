/// <reference path="../types/jquery.d.ts" />
var simplepaint;
(function (simplepaint) {
    "use strict";
    var CanvasManager = (function () {
        function CanvasManager($container, options) {
            this.$container = $container;
            this.options = options;
            this.buildSimplePaint();
            this.setOptions();
            this.attachEvents();
            this.buildStrokeOptions();
            this.buildColourOptions();
            this.drawingManager = new simplepaint.DrawingManager(this.$canvas.get(0));
            this.setRandomColour();
        }
        CanvasManager.prototype.getImage = function () {
            return this.drawingManager.getImage();
        };
        CanvasManager.prototype.clearCanvas = function () {
            this.drawingManager.startAgain();
        };
        CanvasManager.prototype.attachEvents = function () {
            var _this = this;
            this.$menu.find(".ui-show-stroke").click(function () {
                _this.$colourContainer.removeClass("open");
                _this.$strokeContainer.toggleClass("open");
            });
            this.$menu.find(".ui-show-colour").click(function () {
                _this.$strokeContainer.removeClass("open");
                _this.$colourContainer.toggleClass("open");
            });
            var $fill = this.$menu.find(".ui-fill");
            $fill.click(function () {
                var active = _this.drawingManager.toggleFillMode();
                $fill.toggleClass("active", active);
            });
            this.$menu.find(".ui-clear").click(function () {
                _this.drawingManager.startAgain();
                _this.$strokeContainer.removeClass("open");
                _this.$colourContainer.removeClass("open");
            });
            this.$strokeContainer.on("click", ".ui-stroke-option", function (e) {
                var $stroke = $(e.currentTarget);
                _this.drawingManager.setStroke($stroke.data("stroke"));
                _this.$strokeContainer.removeClass("open");
            });
            this.$colourContainer.on("click", ".ui-colour-option", function (e) {
                var $colour = $(e.currentTarget);
                _this.drawingManager.setColour($colour.data("colour"));
                _this.$colourContainer.removeClass("open");
                _this.$colourContainer.find(".selected").removeClass("selected");
                $colour.addClass("selected");
            });
            this.$canvas.click(function () {
                _this.$strokeContainer.removeClass("open");
                _this.$colourContainer.removeClass("open");
            });
        };
        CanvasManager.prototype.setOptions = function () {
            var optionsSet = this.isNotNullOrUndefined(this.options);
            if (optionsSet && this.isNotNullOrUndefined(this.options.colours)) {
                this.colours = this.options.colours;
            }
            else {
                this.colours = ["#2ecc71", "#1abc9c", "#3498db", "#f1c40f", "#e67e22", "#e74c3c", "#9b59b6", "#bdc3c7", "#7f8c8d", "#34495e", "red", "orange", "blue", "lime", "aqua", "magenta", "#000000", "#ffffff"];
            }
            if (optionsSet && this.isNotNullOrUndefined(this.options.brushSizes)) {
                this.brushSizes = this.options.brushSizes;
            }
            else {
                this.brushSizes = [4, 8, 12, 16, 20, 24, 28, 32];
            }
            if (optionsSet && this.isNotNullOrUndefined(this.options.height)) {
                this.$canvas.attr("height", this.options.height);
            }
            else {
                this.$canvas.attr("height", 400); // chosen randomly by fair dice roll * 100
            }
            var canvasWidth = this.$canvas.width();
            this.$canvas.attr("width", canvasWidth);
        };
        CanvasManager.prototype.setRandomColour = function () {
            var chosenColour;
            do {
                chosenColour = this.colours[Math.floor(Math.random() * this.colours.length)];
            } while (chosenColour.toLowerCase() === "#ffffff" || chosenColour.toLowerCase() === "white");
            this.drawingManager.setColour(chosenColour);
            var $allColours = this.$colourContainer.find(".ui-colour-option");
            var $chosenColour = $allColours.filter(function (index, element) {
                return $(element).data("colour") === chosenColour;
            });
            $chosenColour.addClass("selected");
        };
        CanvasManager.prototype.isNotNullOrUndefined = function (value) {
            return value !== undefined && value !== null;
        };
        CanvasManager.prototype.buildSimplePaint = function () {
            var $b_simplePaint = $("<div class=\"simplepaint\"></div>");
            var $b_menu = $("<div class=\"menu\"></div>");
            var $b_strokeOption = $("<i class=\"fa fa-circle-o ui-show-stroke\" title=\"Stroke\"></i>");
            var $b_colourOption = $("<i class=\"fa fa-paint-brush ui-show-colour\" title=\"Colour\"></i>");
            var $b_fill = $("<i class=\"fa fa-diamond ui-fill\" title=\"Fill\"></i>");
            var $b_startAgainOption = $("<i class=\"fa fa-trash-o bottom ui-clear\" title=\"Start Again\"></i>");
            var $b_strokeContainer = $("<div class=\"slider\"></div>");
            var $b_strokeContainerTitle = $("<p>Select a brush size</p>");
            var $b_colourContainer = $("<div class=\"slider\"></div>");
            var $b_colourContainerTitle = $("<p>Select a colour</p>");
            var $b_canvas = $("<canvas></canvas>");
            $b_strokeContainer.append($b_strokeContainerTitle);
            $b_colourContainer.append($b_colourContainerTitle);
            var $simplePaintContainer = $b_simplePaint.appendTo(this.$container);
            this.$menu = $b_menu.appendTo($simplePaintContainer);
            this.$strokeContainer = $b_strokeContainer.appendTo($simplePaintContainer);
            this.$colourContainer = $b_colourContainer.appendTo($simplePaintContainer);
            this.$canvas = $b_canvas.appendTo($simplePaintContainer);
            var menuItems = [$b_strokeOption, $b_colourOption];
            if (this.canFill()) {
                menuItems.push($b_fill);
            }
            menuItems.push($b_startAgainOption);
            $b_menu.append(menuItems);
        };
        CanvasManager.prototype.buildStrokeOptions = function () {
            for (var i = 0; i < this.brushSizes.length; i++) {
                var $option = $("<i style='font-size: " + this.brushSizes[i] + "px'></i>")
                    .addClass("fa fa-circle")
                    .addClass("option ui-stroke-option")
                    .data("stroke", this.brushSizes[i]);
                this.$strokeContainer.append($option);
            }
        };
        CanvasManager.prototype.buildColourOptions = function () {
            for (var i = 0; i < this.colours.length; i++) {
                var $option = $("<span style='background: " + this.colours[i] + "'></i>")
                    .addClass("option ui-colour-option")
                    .data("colour", this.colours[i]);
                this.$colourContainer.append($option);
            }
        };
        CanvasManager.prototype.canFill = function () {
            var canvas = this.$canvas.get(0);
            var context = canvas.getContext("2d");
            // Test for cross origin security error (SECURITY_ERR: DOM Exception 18)
            try {
                var outlineLayerData = context.getImageData(0, 0, canvas.width, canvas.height);
            }
            catch (ex) {
                return false;
            }
            return true;
        };
        return CanvasManager;
    }());
    simplepaint.CanvasManager = CanvasManager;
})(simplepaint || (simplepaint = {}));
var simplepaint;
(function (simplepaint) {
    var helper;
    (function (helper) {
        "use strict";
        function floodFill(stage, canvas, colour) {
            var pixelStack = [[stage.mouseX, stage.mouseY]];
            var rgbFill = getRgbColour(colour);
            var context = canvas.getContext("2d");
            var colourLayerData = context.getImageData(0, 0, canvas.width, canvas.height);
            var clickPixel = (stage.mouseY * canvas.width + stage.mouseX) * 4;
            var clickR = colourLayerData.data[clickPixel];
            var clickG = colourLayerData.data[clickPixel + 1];
            var clickB = colourLayerData.data[clickPixel + 2];
            while (pixelStack.length) {
                var newPos = void 0;
                var x = void 0;
                var y = void 0;
                var pixelPos = void 0;
                var reachLeft = void 0;
                var reachRight = void 0;
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
        helper.floodFill = floodFill;
        function matchStartColor(pixelPos, colorLayer, origR, origG, origB) {
            var r = colorLayer.data[pixelPos];
            var g = colorLayer.data[pixelPos + 1];
            var b = colorLayer.data[pixelPos + 2];
            return (r == origR && g == origG && b == origB);
        }
        function colorPixel(pixelPos, colorLayer, rgbFill) {
            colorLayer.data[pixelPos] = rgbFill[0];
            colorLayer.data[pixelPos + 1] = rgbFill[1];
            colorLayer.data[pixelPos + 2] = rgbFill[2];
            colorLayer.data[pixelPos + 3] = 255;
        }
        function getRgbColour(colour) {
            var fakeDiv = document.createElement("div");
            fakeDiv.style.display = "none";
            fakeDiv.style.color = colour;
            document.body.appendChild(fakeDiv);
            var rgbString = window.getComputedStyle(fakeDiv).color;
            var rgbStringArray = rgbString.substring(4, rgbString.length - 1)
                .replace(/ /g, '')
                .split(',');
            var rgbNumberArray = rgbStringArray.map(function (a) {
                return Number(a);
            });
            return rgbNumberArray;
        }
    })(helper = simplepaint.helper || (simplepaint.helper = {}));
})(simplepaint || (simplepaint = {}));
/// <reference path="../types/easeljs.d.ts" />
var simplepaint;
(function (simplepaint) {
    var DrawingManager = (function () {
        function DrawingManager(canvas) {
            this.canvas = canvas;
            this.index = 0;
            this.stroke = 12;
            this.isFillMode = false;
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
        DrawingManager.prototype.setStroke = function (stroke) {
            this.stroke = stroke;
        };
        DrawingManager.prototype.setColour = function (colour) {
            this.color = colour;
        };
        DrawingManager.prototype.toggleFillMode = function () {
            this.isFillMode = !this.isFillMode;
            return this.isFillMode;
        };
        DrawingManager.prototype.startAgain = function () {
            this.stage.clear();
        };
        DrawingManager.prototype.getImage = function () {
            var bitmap = new createjs.Bitmap(this.canvas);
            bitmap.cache(0, 0, this.canvas.width, this.canvas.height, 1);
            var base64 = bitmap.getCacheDataURL();
            return base64;
        };
        DrawingManager.prototype.attachMouseDown = function (manager) {
            manager.stage.addEventListener("stagemousedown", function (event) {
                if (manager.isFillMode) {
                    manager.floodFill();
                }
                else {
                    manager.handleMouseDown(event);
                }
            });
        };
        DrawingManager.prototype.attachMouseUp = function (manager) {
            manager.stage.addEventListener("stagemouseup", function (event) {
                manager.handleMouseUp(event);
            });
        };
        DrawingManager.prototype.attachMouseMove = function (manager) {
            manager.mouseMoveEvent = function (event) {
                manager.handleMouseMove(event);
            };
            manager.stage.addEventListener("stagemousemove", manager.mouseMoveEvent);
        };
        DrawingManager.prototype.removeMouseMove = function (manager) {
            manager.stage.removeEventListener("stagemousemove", manager.mouseMoveEvent);
        };
        DrawingManager.prototype.handleMouseDown = function (event) {
            if (!event.primary) {
                return;
            }
            this.oldPoint = new createjs.Point(this.stage.mouseX, this.stage.mouseY);
            this.oldMidPoint = this.oldPoint.clone();
            this.shapeLayer.graphics.clear()
                .beginStroke(this.color)
                .beginFill(this.color)
                .drawCircle(this.oldPoint.x, this.oldPoint.y, this.stroke / 2);
            this.stage.update();
            this.attachMouseMove(this);
        };
        DrawingManager.prototype.handleMouseMove = function (event) {
            if (!event.primary) {
                return;
            }
            var newMidPoint = new createjs.Point(this.oldPoint.x + this.stage.mouseX >> 1, this.oldPoint.y + this.stage.mouseY >> 1);
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
        };
        DrawingManager.prototype.handleMouseUp = function (event) {
            if (!event.primary) {
                return;
            }
            this.removeMouseMove(this);
        };
        DrawingManager.prototype.floodFill = function () {
            simplepaint.helper.floodFill(this.stage, this.canvas, this.color);
        };
        return DrawingManager;
    }());
    simplepaint.DrawingManager = DrawingManager;
})(simplepaint || (simplepaint = {}));
