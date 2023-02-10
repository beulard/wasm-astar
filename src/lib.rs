use noise::{NoiseFn, Perlin};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[repr(u8)]
#[derive(Copy, Clone)]
pub enum TileType {
    Grass,
    Wood,
    Mountain,
}

// #[wasm_bindgen]
// impl TileType {
//     pub fn cost(&self) -> f64 {
//         match self {
//             TileType::Grass => 1.0,
//             TileType::Wood => 1.1,
//             TileType::Mountain => 1.2,
//         }
//     }
// }

#[allow(dead_code)]
#[wasm_bindgen]
pub struct WorldGrid {
    width: usize,
    height: usize,
    tiles: Vec<TileType>,
}

#[wasm_bindgen]
impl WorldGrid {
    pub fn new(width: usize, height: usize) -> WorldGrid {
        let mut tiles = vec![TileType::Grass; width * height];

        let perlin = Perlin::new(2);

        for i in 0..width * height {
            let r = perlin.get([
                (i % width) as f64 / width as f64 * 10.,
                (i / width) as f64 / height as f64 * 10.,
            ]);
            if r < 0.33 {
                tiles[i] = TileType::Grass;
            } else if r < 0.66 {
                tiles[i] = TileType::Wood;
            } else {
                tiles[i] = TileType::Mountain;
            }
        }

        WorldGrid {
            width,
            height,
            tiles,
        }
    }

    /// L_inf distance, or the max absolute difference between components
    /// of the two positions
    pub fn distance(&self, ax: usize, ay: usize, bx: usize, by: usize) -> usize {
        let dx = std::cmp::max(ax, bx) - std::cmp::min(ax, bx);
        let dy = std::cmp::max(ay, by) - std::cmp::min(ay, by);
        std::cmp::max(dx, dy)
    }

    pub fn get_tile_type(&self, x: usize, y: usize) -> u8 {
        self.tiles[x + y * self.width] as u8
    }

    pub fn get_path(&self, ix: usize, iy: usize, fx: usize, fy: usize) -> usize {
        32
    }
}
