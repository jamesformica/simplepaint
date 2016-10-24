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
            this.$menu.find(".ui-undo").click(function () {
                _this.drawingManager.undo();
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
            var $b_undo = $("<i class=\"fa fa-undo bottom ui-undo\" title=\"Undo\"></i>");
            var $b_startAgainOption = $("<i class=\"fa fa-trash-o ui-clear\" title=\"Start Again\"></i>");
            var $b_strokeContainer = $("<div class=\"slider\"></div>");
            var $b_strokeContainerTitle = $("<p>Select a brush size</p>");
            var $b_colourContainer = $("<div class=\"slider\"></div>");
            var $b_colourContainerTitle = $("<p>Select a colour</p>");
            var $b_canvas = $("<canvas></canvas>");
            $b_menu.append($b_strokeOption, $b_colourOption, $b_fill, $b_undo, $b_startAgainOption);
            $b_strokeContainer.append($b_strokeContainerTitle);
            $b_colourContainer.append($b_colourContainerTitle);
            var $simplePaintContainer = $b_simplePaint.appendTo(this.$container);
            this.$menu = $b_menu.appendTo($simplePaintContainer);
            this.$strokeContainer = $b_strokeContainer.appendTo($simplePaintContainer);
            this.$colourContainer = $b_colourContainer.appendTo($simplePaintContainer);
            this.$canvas = $b_canvas.appendTo($simplePaintContainer);
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
        return CanvasManager;
    }());
    simplepaint.CanvasManager = CanvasManager;
})(simplepaint || (simplepaint = {}));
var simplepaint;
(function (simplepaint) {
    var helper;
    (function (helper) {
        "use strict";
        function getValidInstructions(shape) {
            return shape.graphics.getInstructions().filter(function (instruction) {
                var x = instruction.x;
                var y = instruction.y;
                return x !== 0 && x !== undefined && y !== 0 && y !== undefined;
            });
        }
        helper.getValidInstructions = getValidInstructions;
        function IsPointWithinShapeSquare(shape, p) {
            var mostNorth = 0;
            var mostEast = 0;
            var mostSouth = 0;
            var mostWest = 0;
            simplepaint.helper.getValidInstructions(shape).forEach(function (instruction) {
                var x = instruction.x;
                var y = instruction.y;
                if (mostWest === 0 || x < mostWest)
                    mostWest = x;
                if (mostEast === 0 || x > mostEast)
                    mostEast = x;
                if (mostNorth === 0 || y < mostNorth)
                    mostNorth = y;
                if (mostSouth === 0 || y > mostSouth)
                    mostSouth = y;
            });
            return mostWest < p.x && mostEast > p.x && mostNorth < p.y && mostSouth > p.y;
        }
        helper.IsPointWithinShapeSquare = IsPointWithinShapeSquare;
        function polyContains(points, p) {
            var result = false;
            for (var i = 0; i < points.length - 1; i++) {
                if ((((points[i + 1].y <= p.y) && (p.y < points[i].y)) || ((points[i].y <= p.y) && (p.y < points[i + 1].y))) && (p.x < (points[i].x - points[i + 1].x) * (p.y - points[i + 1].y) / (points[i].y - points[i + 1].y) + points[i + 1].x)) {
                    result = !result;
                }
            }
            return result;
        }
        helper.polyContains = polyContains;
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
        DrawingManager.prototype.undo = function () {
            var _this = this;
            if (this.drawnShapes.length > 0) {
                this.stage.clear();
                this.drawnShapes.pop();
                this.stage.removeAllChildren();
                this.drawnShapes.forEach(function (shape) {
                    _this.stage.addChild(shape);
                });
                this.stage.update();
            }
        };
        DrawingManager.prototype.startAgain = function () {
            this.stage.clear();
            this.stage.removeAllChildren();
            this.drawnShapes = [];
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
                    manager.locateShape();
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
            this.currentShape = new createjs.Shape();
            this.currentShape.graphics.clear()
                .beginStroke(this.color)
                .beginFill(this.color)
                .drawCircle(this.oldPoint.x, this.oldPoint.y, this.stroke / 2);
            this.stage.addChild(this.currentShape);
            this.stage.update();
            this.attachMouseMove(this);
        };
        DrawingManager.prototype.handleMouseMove = function (event) {
            if (!event.primary) {
                return;
            }
            var newMidPoint = new createjs.Point(this.oldPoint.x + this.stage.mouseX >> 1, this.oldPoint.y + this.stage.mouseY >> 1);
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
        };
        DrawingManager.prototype.handleMouseUp = function (event) {
            if (!event.primary) {
                return;
            }
            if (this.currentShape !== undefined) {
                this.drawnShapes.push(this.currentShape);
            }
            this.currentShape = undefined;
            this.removeMouseMove(this);
        };
        DrawingManager.prototype.locateShape = function () {
            var potentialShapes = [];
            var mousePoint = new createjs.Point(this.stage.mouseX, this.stage.mouseY);
            for (var i = 0; i < this.drawnShapes.length; i++) {
                var shape = this.drawnShapes[i];
                if (simplepaint.helper.IsPointWithinShapeSquare(shape, mousePoint)) {
                    potentialShapes.push(shape);
                }
            }
            for (var i = 0; i < potentialShapes.length; i++) {
                var shape = potentialShapes[i];
                var points = simplepaint.helper.getValidInstructions(shape);
                if (simplepaint.helper.polyContains(points, mousePoint)) {
                    this.fillShape(shape, points);
                }
            }
        };
        DrawingManager.prototype.fillShape = function (shape, instructions) {
            var poly = new createjs.Shape();
            poly.x = shape.x;
            poly.y = shape.y;
            poly.graphics.beginFill(this.color);
            poly.graphics.moveTo(instructions[0].x, instructions[0].y);
            for (var i = 0; i < instructions.length; i++) {
                poly.graphics.lineTo(instructions[i].x, instructions[i].y);
            }
            this.drawnShapes.push(poly);
            this.stage.addChild(poly);
            this.stage.update();
        };
        return DrawingManager;
    }());
    simplepaint.DrawingManager = DrawingManager;
})(simplepaint || (simplepaint = {}));
