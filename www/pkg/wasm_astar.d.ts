/* tslint:disable */
/* eslint-disable */
/**
*/
export enum TileType {
  Grass = 0,
  Wood = 1,
  Mountain = 2,
}
/**
*/
export class WorldGrid {
  free(): void;
/**
* @param {number} width
* @param {number} height
* @returns {WorldGrid}
*/
  static new(width: number, height: number): WorldGrid;
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
  distance(ax: number, ay: number, bx: number, by: number): number;
/**
* @param {number} x
* @param {number} y
* @returns {number}
*/
  get_tile_type(x: number, y: number): number;
/**
* @param {number} ix
* @param {number} iy
* @param {number} fx
* @param {number} fy
* @returns {Array<any>}
*/
  get_path(ix: number, iy: number, fx: number, fy: number): Array<any>;
/**
*/
  height: number;
/**
*/
  width: number;
}
