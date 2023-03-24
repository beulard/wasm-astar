import Two from "two.js";
import { Path } from "two.js/src/path";
import { Transform } from "./src/transform";

export class Character {
    private position: { x: number, y: number }
    currentPath: Array<{x: number, y: number}> = [];
    sprite: Path;
    transform: Transform;

    constructor(two: Two, transform: Transform) {
        this.sprite = two.makeStar(0, 0, 12, 7, 5);
        this.sprite.fill = "orange";
        this.transform = transform;
    }

    set_position(pos: { x: number, y: number }) {
        this.position = pos;
        const cellCenter = this.transform.cellCenter(pos.x, pos.y);
        this.sprite.position.set(cellCenter.x, cellCenter.y);
    }

    get x() {
        return this.position.x;
    }
    get y() {
        return this.position.y;
    }

}