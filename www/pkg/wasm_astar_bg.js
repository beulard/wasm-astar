let wasm;
export function __wbg_set_wasm(val) {
    wasm = val;
}


const heap = new Array(128).fill(undefined);

heap.push(undefined, null, true, false);

let heap_next = heap.length;

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    if (typeof(heap_next) !== 'number') throw new Error('corrupt heap');

    heap[idx] = obj;
    return idx;
}

const lTextDecoder = typeof TextDecoder === 'undefined' ? (0, module.require)('util').TextDecoder : TextDecoder;

let cachedTextDecoder = new lTextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachedUint8Memory0 = null;

function getUint8Memory0() {
    if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {
        cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

function getObject(idx) { return heap[idx]; }

function dropObject(idx) {
    if (idx < 132) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

function _assertNum(n) {
    if (typeof(n) !== 'number') throw new Error('expected a number argument');
}

function logError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        let error = (function () {
            try {
                return e instanceof Error ? `${e.message}\n\nStack:\n${e.stack}` : e.toString();
            } catch(_) {
                return "<failed to stringify thrown value>";
            }
        }());
        console.error("wasm-bindgen: imported JS function that was not marked as `catch` threw an error:", error);
        throw e;
    }
}

function _assertBoolean(n) {
    if (typeof(n) !== 'boolean') {
        throw new Error('expected a boolean argument');
    }
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        wasm.__wbindgen_exn_store(addHeapObject(e));
    }
}
/**
*/
export const TileType = Object.freeze({ Grass:0,"0":"Grass",Wood:1,"1":"Wood",Mountain:2,"2":"Mountain", });
/**
*/
export class WorldGrid {

    constructor() {
        throw new Error('cannot invoke `new` directly');
    }

    static __wrap(ptr) {
        const obj = Object.create(WorldGrid.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_worldgrid_free(ptr);
    }
    /**
    * @returns {number}
    */
    get width() {
        if (this.ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.ptr);
        const ret = wasm.__wbg_get_worldgrid_width(this.ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} arg0
    */
    set width(arg0) {
        if (this.ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.ptr);
        _assertNum(arg0);
        wasm.__wbg_set_worldgrid_width(this.ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get height() {
        if (this.ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.ptr);
        const ret = wasm.__wbg_get_worldgrid_height(this.ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} arg0
    */
    set height(arg0) {
        if (this.ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.ptr);
        _assertNum(arg0);
        wasm.__wbg_set_worldgrid_height(this.ptr, arg0);
    }
    /**
    * @param {number} width
    * @param {number} height
    * @returns {WorldGrid}
    */
    static new(width, height) {
        _assertNum(width);
        _assertNum(height);
        const ret = wasm.worldgrid_new(width, height);
        return WorldGrid.__wrap(ret);
    }
    /**
    * L_inf distance, or the max absolute difference between components
    * of the two positions
    * This distance is valid if we assume that we can move horizontally, vertically or diagonally at the same cost
    * @param {number} ax
    * @param {number} ay
    * @param {number} bx
    * @param {number} by
    * @returns {number}
    */
    distance(ax, ay, bx, by) {
        if (this.ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.ptr);
        _assertNum(ax);
        _assertNum(ay);
        _assertNum(bx);
        _assertNum(by);
        const ret = wasm.worldgrid_distance(this.ptr, ax, ay, bx, by);
        return ret >>> 0;
    }
    /**
    * @param {number} x
    * @param {number} y
    * @returns {number}
    */
    get_tile_type(x, y) {
        if (this.ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.ptr);
        _assertNum(x);
        _assertNum(y);
        const ret = wasm.worldgrid_get_tile_type(this.ptr, x, y);
        return ret >>> 0;
    }
    /**
    * @param {number} ix
    * @param {number} iy
    * @param {number} fx
    * @param {number} fy
    * @returns {Array<any>}
    */
    get_path(ix, iy, fx, fy) {
        if (this.ptr == 0) throw new Error('Attempt to use a moved value');
        _assertNum(this.ptr);
        _assertNum(ix);
        _assertNum(iy);
        _assertNum(fx);
        _assertNum(fy);
        const ret = wasm.worldgrid_get_path(this.ptr, ix, iy, fx, fy);
        return takeObject(ret);
    }
}

export function __wbindgen_number_new(arg0) {
    const ret = arg0;
    return addHeapObject(ret);
};

export function __wbindgen_string_new(arg0, arg1) {
    const ret = getStringFromWasm0(arg0, arg1);
    return addHeapObject(ret);
};

export function __wbg_log_7bb108d119bafbc1() { return logError(function (arg0) {
    console.log(getObject(arg0));
}, arguments) };

export function __wbg_new_b525de17f44a8943() { return logError(function () {
    const ret = new Array();
    return addHeapObject(ret);
}, arguments) };

export function __wbg_push_49c286f04dd3bf59() { return logError(function (arg0, arg1) {
    const ret = getObject(arg0).push(getObject(arg1));
    _assertNum(ret);
    return ret;
}, arguments) };

export function __wbg_new_f9876326328f45ed() { return logError(function () {
    const ret = new Object();
    return addHeapObject(ret);
}, arguments) };

export function __wbg_set_6aa458a4ebdb65cb() { return handleError(function (arg0, arg1, arg2) {
    const ret = Reflect.set(getObject(arg0), getObject(arg1), getObject(arg2));
    _assertBoolean(ret);
    return ret;
}, arguments) };

export function __wbindgen_object_drop_ref(arg0) {
    takeObject(arg0);
};

export function __wbindgen_throw(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};

