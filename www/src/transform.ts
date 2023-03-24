

export class Transform {

    canvasRect: DOMRect;
    canvasWidth: number;
    canvasHeight: number;
    cellSize: number;
    worldWidth: number;
    worldHeight: number;

    constructor(worldWidth: number, worldHeight: number, canvasWidth: number, canvasHeight: number, canvasRect: DOMRect, cellSize: number) {
        this.canvasRect = canvasRect;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.cellSize = cellSize;
        this.worldWidth = worldWidth;
        this.worldHeight = worldHeight;
    }

    // Compute canvas pixel coordinates based on global browser coords (e.g. from mouse event)
    globalToCanvas(x: number, y: number) {
        var boundingRect = this.canvasRect;
        const scaleX = this.canvasWidth / boundingRect.width;
        const scaleY = this.canvasHeight / boundingRect.height;

        const canvasX = (x - boundingRect.left) * scaleX;
        const canvasY = (y - boundingRect.top) * scaleY;

        return { canvasX, canvasY }
    }

    // Compute cell indices based on x, y position inside the canvas
    canvasToCell(x: number, y: number) {
        const gridX = Math.min(Math.floor(x / (this.cellSize + 1)), this.worldWidth - 1);
        const gridY = Math.min(Math.floor(y / (this.cellSize + 1)), this.worldHeight - 1);

        return { gridX, gridY }
    }

    // Same as canvasToCell(globalToCanvas(x, y))
    globalToCell(x: number, y: number) {
        var cx = this.globalToCanvas(x, y);
        return this.canvasToCell(cx.canvasX, cx.canvasY);
    }

    /// Returns the pixel position center of the cell at index x, y
    cellCenter(x: number, y: number) {
        const boundingRect = this.canvasRect;

        const canvasX = x * (this.cellSize + 1)
        const canvasY = y * (this.cellSize + 1)

        const centerX = canvasX + this.cellSize / 2 + 1.5;
        const centerY = canvasY + this.cellSize / 2 + 1.5;

        return { x: centerX, y: centerY };
    }
}