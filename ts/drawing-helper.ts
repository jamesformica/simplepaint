module simplepaint.helper {
    "use strict";

    export function getValidInstructions(shape: createjs.Shape): createjs.Point[] {
        return <createjs.Point[]>shape.graphics.getInstructions().filter((instruction: createjs.Point) => {
            let x = instruction.x;
            let y = instruction.y;

            return x !== 0 && x !== undefined && y !== 0 && y !== undefined;
        });
    }

    export function IsPointWithinShapeSquare(shape: createjs.Shape, p: createjs.Point): boolean {
        let mostNorth = 0;
        let mostEast = 0;
        let mostSouth = 0;
        let mostWest = 0;

        simplepaint.helper.getValidInstructions(shape).forEach((instruction) => {
            let x = instruction.x;
            let y = instruction.y;

            if (mostWest === 0 || x < mostWest) mostWest = x;
            if (mostEast === 0 || x > mostEast) mostEast = x;
            if (mostNorth === 0 || y < mostNorth) mostNorth = y;
            if (mostSouth === 0 || y > mostSouth) mostSouth = y;
        });

        return mostWest < p.x && mostEast > p.x && mostNorth < p.y && mostSouth > p.y;
    }

    export function polyContains(points: createjs.Point[], p: createjs.Point): boolean {
        let result = false;

        for (let i = 0; i < points.length - 1; i++) {
            if ((((points[i + 1].y <= p.y) && (p.y < points[i].y)) || ((points[i].y <= p.y) && (p.y < points[i + 1].y))) && (p.x < (points[i].x - points[i + 1].x) * (p.y - points[i + 1].y) / (points[i].y - points[i + 1].y) + points[i + 1].x)) {
                result = !result;
            }
        }

        return result;
    }
}