const WIDTH = 128;
const HEIGHT = 128;
const CELL_SIZE = 5;

let canvas = null;

import("wasm-astar").then((wasm) => {
    const ldmsg = document.getElementById("loading-message");
    ldmsg.textContent = "";


    const worldGrid = wasm.WorldGrid.new(WIDTH, HEIGHT);
    
    canvas = document.getElementById("grid-canvas");
    canvas.width = WIDTH * (CELL_SIZE + 1) + 1;
    canvas.height = HEIGHT * (CELL_SIZE + 1) + 1;
    const ctx = canvas.getContext("2d");

    console.log(ctx);

    drawGrid(ctx);
    drawAllCells(ctx, worldGrid);

    let startingPoint = null;

    canvas.addEventListener("click", (event) => {
        console.log(event); 
        console.log(startingPoint); 
        if (startingPoint === null) {
            startingPoint = absPositionToGridCell(event.x, event.y);
            const topLeftPos = gridCellToCellTopLeftPosition(startingPoint[0], startingPoint[1]);
            ctx.fillStyle = "#00000055";
            ctx.fillRect(topLeftPos[0] + 1, topLeftPos[1] + 1, CELL_SIZE, CELL_SIZE);
        } else {
            drawSingleCell(ctx, worldGrid, startingPoint[0], startingPoint[1]);
            const endPoint = absPositionToGridCell(event.x, event.y);
            const dist = worldGrid.distance(startingPoint[0], startingPoint[1], endPoint[0], endPoint[1]);
            console.log(dist);
            const path = worldGrid.getPath(startingPoint[0], startingPoint[1], endPoint[0], endPoint[1]);
            startingPoint = null;
        }
    });

    //canvas.addEventListener("mousemove", (event) => {
    //    const gridPos = absPositionToGridCell(event.x, event.y);
    //    //drawHoverCell(ctx, gridPos[0], gridPos[1]);
    //});

    const somePath = [[1, 1], [2, 2], [2, 3], [3, 2], [4, 2], [3, 1], [4, 1], [5, 2], [63, 2], [63, 3]]
    drawPath(ctx, somePath);

});

const drawHoverCell = (ctx, x, y) => {
    ctx.fillStyle = "#22002288";

    ctx.fillRect(x * (CELL_SIZE + 1) + 1, y * (CELL_SIZE + 1) + 1, CELL_SIZE, CELL_SIZE);
}

const drawPath = (ctx, path) => {
    ctx.beginPath();
    ctx.strokeStyle = "white";
    ctx.lineWidth = 3;
    path.forEach(node => {
        const centerPos = gridCellToCellCenterPosition(node[0], node[1], canvas); 
        ctx.lineTo(centerPos[0], centerPos[1]);
    });
    ctx.stroke();
}

const absPositionToGridCell = (x, y) => {
    const boundingRect = canvas.getBoundingClientRect();

    const scaleX = canvas.width / boundingRect.width;
    const scaleY = canvas.height / boundingRect.height;

    const canvasX = (x - boundingRect.left) * scaleX;
    const canvasY = (y - boundingRect.top) * scaleY;

    const gridX = Math.min(Math.floor(canvasX / (CELL_SIZE + 1)), WIDTH - 1);
    const gridY = Math.min(Math.floor(canvasY / (CELL_SIZE + 1)), HEIGHT - 1);

    return [gridX, gridY]
}

const gridCellToCellCenterPosition = (x, y, canvas) => {

    const topLeft = gridCellToCellTopLeftPosition(x, y);

    const centerX = topLeft[0] + CELL_SIZE / 2 + 1.5;
    const centerY = topLeft[1] + CELL_SIZE / 2 + 1.5;

    return [centerX, centerY];
}

const gridCellToCellTopLeftPosition = (x, y) => {
    const boundingRect = canvas.getBoundingClientRect();

    const scaleX = canvas.width / boundingRect.width;
    const scaleY = canvas.height / boundingRect.height;

    const canvasX = x * (CELL_SIZE + 1)
    const canvasY = y * (CELL_SIZE + 1)

    const centerX = canvasX;
    const centerY = canvasY;

    return [centerX, centerY];

}

const drawGrid = (ctx) => {
    ctx.lineWidth = 1;
    ctx.strokeStyle = "gray";
    ctx.beginPath();

    // Vertical lines
    for (let i=0; i<=WIDTH; ++i) {
        ctx.moveTo(0.5 + i * (CELL_SIZE + 1), 0);
        ctx.lineTo(0.5 + i * (CELL_SIZE + 1), HEIGHT * (CELL_SIZE + 1) + 1);
    }
    // Horizontal lines
    for (let i=0; i<=HEIGHT; ++i) {
        ctx.moveTo(0, 0.5 + i * (CELL_SIZE + 1));
        ctx.lineTo(WIDTH * (CELL_SIZE + 1), 0.5 + i * (CELL_SIZE + 1));
    }

    ctx.stroke();
}

const TILE_STYLE = [
    "#EFEFD0",
    "#BB999C",
    "#1D70A2",
]

const drawAllCellsByType = (ctx, world, type) => {
    ctx.fillStyle = TILE_STYLE[type];
    for (let y=0; y<HEIGHT; ++y) {
        for (let x=0; x<WIDTH; ++x) {
            if (world.get_tile_type(x, y) === type) {
                const pos = gridCellToCellTopLeftPosition(x, y, canvas);
                ctx.fillRect(pos[0] + 1, pos[1] + 1, CELL_SIZE, CELL_SIZE);
            }
        }
    }
}

const drawAllCells = (ctx, world) => {
    drawAllCellsByType(ctx, world, 0);
    drawAllCellsByType(ctx, world, 1);
    drawAllCellsByType(ctx, world, 2);
}

const drawSingleCell = (ctx, world, x, y) => {
    const type = world.get_tile_type(x, y);
    ctx.fillStyle = TILE_STYLE[type];
    const pos = gridCellToCellTopLeftPosition(x, y, canvas);
    ctx.fillRect(pos[0] + 1, pos[1] + 1, CELL_SIZE, CELL_SIZE);
}



