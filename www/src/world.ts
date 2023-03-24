import { WorldGrid } from "wasm-astar";
import Two from "two.js";
import { Transform } from "./transform";

export class World {

    cell_size: number;
    worldGrid: WorldGrid;
    transform: Transform;

    public constructor(worldGrid: WorldGrid, cell_size: number, transform: Transform) {
        this.cell_size = cell_size;
        this.worldGrid = worldGrid;
        this.transform = transform;
    }

    public drawGrid(two: Two) {
        const lines = []
        // Vertical lines
        for (let i = 0; i <= this.worldGrid.width; ++i) {
            var line = two.makeLine(0.5 + i * (this.cell_size + 1), 0, 0.5 + i * (this.cell_size + 1), this.worldGrid.height * (this.cell_size + 1) + 1);
            line.stroke = "#dddddd";
            lines.push(line);
        }
        // Horizontal lines
        for (let i = 0; i <= this.worldGrid.height; ++i) {
            var line = two.makeLine(0, 0.5 + i * (this.cell_size + 1), this.worldGrid.width * (this.cell_size + 1), 0.5 + i * (this.cell_size + 1));
            line.stroke = "#dddddd";
            lines.push(line);
        }
        return lines;
    }

    public static TILE_STYLE = [
        "#EFEFD0",
        "#BB999C",
        "#1D70A2",
    ]

    public drawCells(two: Two) {
        const cellRects = []
        var i = 0;
        var j = 0;
        for (var i = 0; i < this.worldGrid.width; ++i) {
            for (var j = 0; j < this.worldGrid.height; ++j) {
                const type = this.worldGrid.get_tile_type(i, j);
                var cellRect = two.makeRectangle(i * (this.cell_size + 1), j * (this.cell_size + 1), this.cell_size, this.cell_size);
                cellRect.fill = World.TILE_STYLE[type];
                cellRect.noStroke();
                cellRect.position.x += cellRect.width / 2 + 1;
                cellRect.position.y += cellRect.height / 2 + 1;
                cellRects.push(cellRect);
            }
        }

        return cellRects;
    }

    drawPath(two: Two, path: Array<{x: number, y: number}>) {
        var twoPath = two.makeGroup();
        var prevNode = path[0];
        for (var i = 1; i < path.length; ++i) {
            const node = path[i]
            const node_center = this.transform.cellCenter(node.x, node.y);
            const prev_center = this.transform.cellCenter(prevNode.x, prevNode.y);
            var line = two.makeLine(prev_center.x, prev_center.y, node_center.x, node_center.y);
            line.linewidth = 3;
            line.stroke = "#ff5555";
            prevNode = node;
            twoPath.add(line);
        }
        return twoPath;
    }

}
