/// <reference path="../types/jquery.d.ts" />

module simplepaint {
    "use strict";

    interface ICanvasManagerOptions {
        height?: number,
        colours?: string[],
        brushSizes?: number[]
    }

    export class CanvasManager {
        private $canvas: JQuery;
        private $menu: JQuery;
        private $strokeContainer: JQuery;
        private $colourContainer: JQuery;
        private $colourMenuItem: JQuery;

        private colours: string[];
        private brushSizes: number[];
        private drawingManager: simplepaint.DrawingManager;

        constructor(private $container: JQuery, private options?: ICanvasManagerOptions) {
            this.buildSimplePaint();
            this.setOptions();
            this.attachEvents();
            this.buildStrokeOptions();
            this.buildColourOptions();

            this.drawingManager = new simplepaint.DrawingManager(<HTMLCanvasElement>this.$canvas.get(0));
            this.setMiddleStroke();
            this.setRandomColour();
        }

        public getImage(): string {
            return this.drawingManager.getImage();
        }

        public clearCanvas(): void {
            this.drawingManager.startAgain();
        }

        private attachEvents(): void {
            let $brush = this.$menu.find(".ui-brush");
            let $fill = this.$menu.find(".ui-fill");
            let $stroke = this.$menu.find(".ui-show-stroke");

            $brush.click(() => {
                this.drawingManager.toggleFillMode(false);
                this.selectTool($brush);
            });

            $stroke.click(() => {
                this.$colourContainer.removeClass("open");
                this.$strokeContainer.toggleClass("open");
            });

            this.$menu.find(".ui-show-colour").click(() => {
                this.$strokeContainer.removeClass("open");
                this.$colourContainer.toggleClass("open");
            });

            $fill.click(() => {
                let active = this.drawingManager.toggleFillMode();
                if (active) {
                    this.selectTool($fill);
                } else {
                    this.selectTool($brush);
                }
            });

            this.$menu.find(".ui-clear").click(() => {
                this.drawingManager.startAgain();
                this.selectTool($brush);
            });

            this.$strokeContainer.on("click", ".ui-stroke-option", (e) => {
                this.selectStroke($(e.currentTarget));
            });

            this.$colourContainer.on("click", ".ui-colour-option", (e) => {
                let $colour = $(e.currentTarget);

                this.selectColour($colour.data("colour"));
                this.$colourContainer.removeClass("open");

                this.$colourContainer.find(".selected").removeClass("selected");
                $colour.addClass("selected");
            });

            this.$canvas.mousedown(() => {
                this.$strokeContainer.removeClass("open");
                this.$colourContainer.removeClass("open");
            });
        }

        private selectTool($tool: JQuery): void {
            this.$strokeContainer.removeClass("open");
            this.$colourContainer.removeClass("open");

            if (!$tool.hasClass("selected")) {
                let $currentSelected = $tool.parent().find(".ui-menu-item-container.selected");
                $currentSelected.removeClass("selected");
                $tool.addClass("selected");
            }
        }

        private selectStroke($stroke: JQuery): void {
            this.drawingManager.setStroke($stroke.data("stroke"));
            this.$strokeContainer.removeClass("open");

            this.$strokeContainer.find(".selected").removeClass("selected");
            $stroke.addClass("selected");
        }

        private selectColour(colour: string): void {
            this.drawingManager.setColour(colour);

            this.$colourMenuItem.find("i").css("background-color", colour);
        }

        private setOptions(): void {
            let optionsSet = this.isNotNullOrUndefined(this.options);

            if (optionsSet && this.isNotNullOrUndefined(this.options.colours)) {
                this.colours = this.options.colours;
            } else {
                this.colours = ["#2ecc71", "#1abc9c", "#3498db", "#f1c40f", "#e67e22", "#e74c3c", "#9b59b6", "#bdc3c7", "#7f8c8d", "#34495e", "red", "orange", "blue", "lime", "aqua", "magenta", "#000000", "#ffffff"];
            }

            if (optionsSet && this.isNotNullOrUndefined(this.options.brushSizes)) {
                this.brushSizes = this.options.brushSizes;
            } else {
                this.brushSizes = [4, 8, 12, 16, 20, 24, 28, 32];
            }

            if (optionsSet && this.isNotNullOrUndefined(this.options.height)) {
                this.$canvas.attr("height", this.options.height);
            } else {
                this.$canvas.attr("height", 400); // chosen randomly by fair dice roll * 100
            }

            let canvasWidth = this.$canvas.width();
            this.$canvas.attr("width", canvasWidth);
        }

        private setRandomColour(): void {
            let chosenColour: string;
            do {
                chosenColour = this.colours[Math.floor(Math.random() * this.colours.length)];
            } while (chosenColour.toLowerCase() === "#ffffff" || chosenColour.toLowerCase() === "white");

            this.selectColour(chosenColour);

            let $allColours = this.$colourContainer.find(".ui-colour-option");
            let $chosenColour = $allColours.filter((index, element) => {
                return $(element).data("colour") === chosenColour;
            });

            $chosenColour.addClass("selected");
        }

        private setMiddleStroke(): void {
            let $allStrokes = this.$strokeContainer.find(".ui-stroke-option");
            let $centerStroke = $($allStrokes[Math.floor($allStrokes.length / 2)])
            this.selectStroke($centerStroke);
        }

        private isNotNullOrUndefined(value: any): boolean {
            return value !== undefined && value !== null;
        }

        private buildSimplePaint(): void {
            let $b_simplePaint = $("<div class=\"simplepaint\"></div>");

            let $b_menu = $("<div class=\"menu\"></div>");
            let $b_strokeOption = $("<i class=\"icon-brush\" title=\"Stroke\"></i>");
            let $b_colourOption = $("<i class=\"colour\" title=\"Colour\"></i>");
            let $b_sizeOption = $("<i class=\"icon-radio-unchecked\" title=\"Colour\"></i>");
            let $b_fill = $("<i class=\"icon-bucket\" title=\"Fill\"></i>");
            let $b_startAgainOption = $("<i class=\"icon-bin bottom\" title=\"Start Again\"></i>");

            let $b_strokeContainer = $("<div class=\"slider\"></div>");
            let $b_strokeContainerTitle = $("<p><i class=\"icon-brush\"></i>Select a brush size</p>");

            let $b_colourContainer = $("<div class=\"slider\"></div>");
            let $b_colourContainerTitle = $("<p><i class=\"icon-palette\"></i> Select a colour</p>");

            let $b_canvas = $("<canvas></canvas>");

            $b_strokeContainer.append($b_strokeContainerTitle);
            $b_colourContainer.append($b_colourContainerTitle);

            let $simplePaintContainer = $b_simplePaint.appendTo(this.$container);

            this.$menu = $b_menu.appendTo($simplePaintContainer);
            this.$strokeContainer = $b_strokeContainer.appendTo($simplePaintContainer);
            this.$colourContainer = $b_colourContainer.appendTo($simplePaintContainer);
            this.$canvas = $b_canvas.appendTo($simplePaintContainer);

            let menuItems: JQuery[] = [this.wrapMenuItem($b_strokeOption, "ui-brush selected")];

            if (this.canFill()) {
                menuItems.push(this.wrapMenuItem($b_fill, "ui-fill"));
            }

            menuItems.push(this.wrapMenuItem($b_sizeOption, "ui-show-stroke"))
            menuItems.push(this.wrapMenuItem($b_colourOption, "ui-show-colour"));
            menuItems.push(this.wrapMenuItem($b_startAgainOption, "ui-clear bottom"));

            $b_menu.append(menuItems);

            this.$colourMenuItem = this.$menu.find(".ui-show-colour");
        }

        private wrapMenuItem($item: JQuery, cssClasses?: string): JQuery {
            return $("<div></div>")
                .addClass("menu-item-container ui-menu-item-container")
                .addClass(cssClasses)
                .append($item);
        }

        private buildStrokeOptions(): void {
            for (let i = 0; i < this.brushSizes.length; i++) {
                let $option = $("<i class='icon-radio-unchecked' style='font-size: " + this.brushSizes[i] + "px'></i>");

                let $optionWrapper = $("<div></div>")
                    .addClass("option-wrapper ui-stroke-option")
                    .data("stroke", this.brushSizes[i])
                    .append($option);

                this.$strokeContainer.append($optionWrapper);
            }
        }

        private buildColourOptions(): void {
            for (let i = 0; i < this.colours.length; i++) {
                let $option = $("<span style='background: " + this.colours[i] + "'></i>")
                    .addClass("option-wrapper ui-colour-option")
                    .data("colour", this.colours[i]);

                this.$colourContainer.append($option);
            }
        }

        private canFill(): boolean {
            let canvas = <HTMLCanvasElement>this.$canvas.get(0);
            let context = canvas.getContext("2d");

            // Test for cross origin security error (SECURITY_ERR: DOM Exception 18)
            try {
                let outlineLayerData = context.getImageData(0, 0, canvas.width, canvas.height);
            } catch (ex) {
                return false;
            }

            return true;
        }
    }
}