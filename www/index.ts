import Two from "two.js";
import { Group } from "two.js/src/group";
import { Character } from "./character";
import { Transform } from "./src/transform";
import { World } from "./src/world";


import("wasm-astar").then((wasm_astar) => {
    main(wasm_astar);
})

function main(wasm_astar: typeof import("wasm-astar")) {
    const ldmsg = document.getElementById("loading-message");
    ldmsg.textContent = "";

    const WIDTH = 64;
    const HEIGHT = 64;
    const CELL_SIZE = 6;

    const canvas = document.getElementById("grid-canvas");

    var two = new Two({
        width: WIDTH * (CELL_SIZE + 1) + 1, height: HEIGHT * (CELL_SIZE + 1) + 1,
        domElement: canvas,
        type: Two.Types.webgl,
        overdraw: true
    }).appendTo(document.body);
    var worldGrid = wasm_astar.WorldGrid.new(WIDTH, HEIGHT);

    var transform = new Transform(two.width, two.height, canvas.clientWidth, canvas.clientHeight, canvas.getBoundingClientRect(), CELL_SIZE);
    const world = new World(worldGrid, CELL_SIZE, transform);

    console.log(canvas.clientWidth, canvas.getBoundingClientRect().width, two.width, WIDTH * (CELL_SIZE + 1) + 1);

    var grid = world.drawGrid(two);
    var cells = world.drawCells(two);

    var character = new Character(two, transform);
    character.set_position({ x: WIDTH / 2, y: HEIGHT / 2 });

    var mainGroup = two.makeGroup();

    var fpsText = two.makeText("fps: ", 0, 0, { alignment: 'left', baseline: 'top' });

    var currentPathVisual: Group = null;

    var timeSinceFrame = 0.0;
    var time = 0.0;
    var secondTick = 0.0; // Resets every second
    var framesSinceLastSecondTick = 0;
    var characterStepTimer = { timeSinceStep: 0.0, stepTime: 0.08 }
    const update = (frameCount: number) => {
        timeSinceFrame += two.timeDelta;
        time += two.timeDelta;
        secondTick += two.timeDelta;
        framesSinceLastSecondTick += 1;

        if (secondTick > 1000) {
            secondTick = 0;

            // What we do every second
            fpsText.value = "fps: " + framesSinceLastSecondTick;
            framesSinceLastSecondTick = 0;
        }

        if (character.currentPath.length > 0) {
            characterStepTimer.timeSinceStep += two.timeDelta / 1000.0;
            if (characterStepTimer.timeSinceStep > characterStepTimer.stepTime) {
                characterStepTimer.timeSinceStep = 0.0;
                character.set_position(character.currentPath.shift());
                // Character has reached the end of the path
                if (character.currentPath.length == 0) {
                    currentPathVisual.remove();
                    currentPathVisual = null;
                }
            }
        }
    }

    console.log(two.scene.getBoundingClientRect(), canvas.getBoundingClientRect());


    function onClick(event: MouseEvent) {
        var canvasX = transform.globalToCanvas(event.x, event.y);
        console.log(canvasX);
        var cellX = transform.canvasToCell(canvasX.canvasX, canvasX.canvasY);
        console.log(cellX);
        const endPoint = transform.globalToCell(event.x, event.y);

        const path = worldGrid.get_path(character.x, character.y, endPoint.gridX, endPoint.gridY);
        console.log(path);
        var twoPath = world.drawPath(two, path);

        // Replace path visual
        if (currentPathVisual !== null) {
            currentPathVisual.remove();
        }
        currentPathVisual = twoPath;
        two.scene.add(currentPathVisual);
        console.log(currentPathVisual);

        character.currentPath = path;
    }

    canvas.addEventListener("click", onClick);

    two.bind('update', update);

    two.play();
}


// const drawHoverCell = (ctx, x, y) => {
//     ctx.fillStyle = "#22002288";

//     ctx.fillRect(x * (CELL_SIZE + 1) + 1, y * (CELL_SIZE + 1) + 1, CELL_SIZE, CELL_SIZE);
// }


// const gridCellToCellCenterPosition = (x, y, canvas) => {

//     const topLeft = gridCellToCellTopLeftPosition(x, y);

//     const centerX = topLeft[0] + CELL_SIZE / 2 + 1.5;
//     const centerY = topLeft[1] + CELL_SIZE / 2 + 1.5;

//     return [centerX, centerY];
// }

// const gridCellToCellTopLeftPosition = (x, y) => {
//     const boundingRect = canvas.getBoundingClientRect();

//     const scaleX = canvas.width / boundingRect.width;
//     const scaleY = canvas.height / boundingRect.height;

//     const canvasX = x * (CELL_SIZE + 1)
//     const canvasY = y * (CELL_SIZE + 1)

//     const centerX = canvasX;
//     const centerY = canvasY;

//     return [centerX, centerY];

// }


// TODO continue replacing 2d canvas with Two.js !

// const drawAllCellsByType = (ctx, world, type) => {
//     ctx.fillStyle = TILE_STYLE[type];
//     for (let y = 0; y < HEIGHT; ++y) {
//         for (let x = 0; x < WIDTH; ++x) {
//             if (world.get_tile_type(x, y) === type) {
//                 const pos = gridCellToCellTopLeftPosition(x, y, canvas);
//                 ctx.fillRect(pos[0] + 1, pos[1] + 1, CELL_SIZE, CELL_SIZE);
//             }
//         }
//     }
// }

// const drawAllCells = (ctx, world) => {
//     drawAllCellsByType(ctx, world, 0);
//     drawAllCellsByType(ctx, world, 1);
//     drawAllCellsByType(ctx, world, 2);
// }

// const drawSingleCell = (ctx, world, x, y) => {
//     const type = world.get_tile_type(x, y);
//     ctx.fillStyle = TILE_STYLE[type];
//     const pos = gridCellToCellTopLeftPosition(x, y, canvas);
//     ctx.fillRect(pos[0] + 1, pos[1] + 1, CELL_SIZE, CELL_SIZE);
// }



