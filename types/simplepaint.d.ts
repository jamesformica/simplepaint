interface ICanvasManagerOptions {
    height?: number,
    colours?: string[],
    brushSizes?: number[]
}

declare namespace simplepaint {
    class CanvasManager {
        constructor(canvas: HTMLCanvasElement);

        getImage(): string;

        clearCanvas(): void;
    }
}