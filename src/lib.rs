use noise::{ NoiseFn, Perlin, OpenSimplex };
use std::{ collections::{ BinaryHeap, HashMap }, cmp::Ordering, usize, mem::size_of, ptr::null };
use wasm_bindgen::prelude::*;
use web_sys;
use js_sys;

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

/// Path finding

type Cost = f32;

struct Node {
    f_score: Cost,
    position: (u32, u32),
}
impl PartialEq for Node {
    fn eq(&self, other: &Self) -> bool {
        self.position == other.position
    }
}
impl Eq for Node {}
impl PartialOrd for Node {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        Some(self.cmp(other))
    }
}
impl Ord for Node {
    fn cmp(&self, other: &Self) -> Ordering {
        // Order nodes by their f_score: the lower score goes higher in the heap
        other.f_score.total_cmp(&self.f_score)
    }
}

#[allow(dead_code)]
#[wasm_bindgen]
pub struct WorldGrid {
    pub width: u32,
    pub height: u32,
    tiles: Vec<TileType>,
    // path_length: usize,
}

#[wasm_bindgen]
impl WorldGrid {
    pub fn new(width: u32, height: u32) -> WorldGrid {
        let mut tiles = vec![TileType::Grass; width as usize * height as usize];

        let perlin = OpenSimplex::new(2);

        // Scale of the noise: the higher, the smaller. 
        // Use small factor for larger maps / smaller cell size
        // scale_factor = 8.0 is okay as a default.
        let scale_factor = 6.0;

        for i in 0..tiles.len() {
            let r = perlin.get([
                (((i % (width as usize)) as f64) / (width as f64)) * (width as f64 / 32.0) * scale_factor,
                (((i / (width as usize)) as f64) / (height as f64)) * (height as f64 / 32.0) * scale_factor,
            ]);
            if r < 0.0 {
                tiles[i] = TileType::Grass;
            } else if r < 0.2 {
                tiles[i] = TileType::Wood;
            } else {
                tiles[i] = TileType::Mountain;
            }
        }

        WorldGrid {
            width,
            height,
            tiles,
            // path_length: 0,
        }
    }

    /// L_inf distance, or the max absolute difference between components
    /// of the two positions
    /// This distance is valid if we assume that we can move horizontally, vertically or diagonally at the same cost
    pub fn distance(&self, ax: u32, ay: u32, bx: u32, by: u32) -> u32 {
        let dx = std::cmp::max(ax, bx) - std::cmp::min(ax, bx);
        let dy = std::cmp::max(ay, by) - std::cmp::min(ay, by);
        std::cmp::max(dx, dy)
    }

    pub fn get_tile_type(&self, x: u32, y: u32) -> TileType {
        self.tiles[(x + y * self.width) as usize]
    }

    fn get_next_step(&self, ix: u32, iy: u32) -> (u32, u32) {
        (32, 32)
    }

    fn reconstruct_path(
        &self,
        came_from: &HashMap<(u32, u32), (u32, u32)>,
        mut current: (u32, u32)
    ) -> Vec<(u32, u32)> {
        let mut path = Vec::new();
        path.insert(0, current);

        while came_from.contains_key(&current) {
            current = *came_from.get(&current).unwrap();
            path.insert(0, current);
        }

        path
    }

    // pub fn get_path_length(&self) -> usize {
    //     self.path_length
    // }

    // Implement Astar algorithm
    pub fn get_path(&mut self, ix: u32, iy: u32, fx: u32, fy: u32) -> js_sys::Array {
        use web_sys::console;
        console::log_1(&"Hello world".into());

        let mut openlist: BinaryHeap<Node> = BinaryHeap::new();
        openlist.push(Node { f_score: 0.0, position: (ix, iy) });

        let mut came_from: HashMap<(u32, u32), (u32, u32)> = HashMap::new();

        let mut g_score: HashMap<(u32, u32), Cost> = HashMap::new();
        g_score.insert((ix, iy), 0.0);
        let mut f_score: HashMap<(u32, u32), Cost> = HashMap::new();
        f_score.insert((ix, iy), 0.0);

        // Calculate the heuristic for each neighbor
        while !openlist.is_empty() {
            // Set the current node to the minimum f_score node in openlist
            let current = openlist.pop().unwrap();

            if current.position.0 == fx && current.position.1 == fy {
                // Success: return a JsArray of the path
                let path = self.reconstruct_path(&came_from, current.position);

                let js_path = js_sys::Array::new();
                for p in path {
                    let js_step = js_sys::Object::new();
                    js_sys::Reflect::set(&js_step, &"x".into(), &p.0.into());
                    js_sys::Reflect::set(&js_step, &"y".into(), &p.1.into());
                    js_path.push(&js_step);
                }
                return js_path;
            }

            // Iterate over neighbors
            for i in self.width - 1..self.width + 2 {
                for j in self.height - 1..self.height + 2 {
                    // console::log_2(&i.into(), &j.into());
                    if i == self.width && j == self.height {
                        continue;
                    }
                    let neighbor_pos = (
                        (current.position.0 + i) % self.width,
                        (current.position.1 + j) % self.height,
                    );
                    // console::log_2(&pos.0.into(), &pos.1.into());
                    // Movement penalty is based on the type of tile at the destination.
                    let movement_penalty = match self.get_tile_type(neighbor_pos.0, neighbor_pos.1) {
                        TileType::Grass => 1.0,
                        TileType::Wood => 3.0,
                        TileType::Mountain => 10.0
                    };
                    let mut tentative_g_score =
                        *g_score.get(&(current.position.0, current.position.1)).unwrap() + movement_penalty;
                    tentative_g_score +=
                        (neighbor_pos.0.abs_diff(current.position.0) as Cost) / 10.0 +
                        (neighbor_pos.1.abs_diff(current.position.1) as Cost) / 10.0;
                    let neighbor_g_score = match g_score.get(&neighbor_pos) {
                        Some(x) => *x,
                        None => Cost::MAX,
                    };

                    if tentative_g_score < neighbor_g_score {
                        came_from.insert(neighbor_pos, current.position);
                        g_score.insert(neighbor_pos, tentative_g_score);
                        f_score.insert(neighbor_pos, tentative_g_score + 1.0);
                        let mut neighbor_in_list = false;
                        for el in openlist.iter() {
                            if el.position == neighbor_pos {
                                neighbor_in_list = true;
                            }
                        }
                        if !neighbor_in_list {
                            openlist.push(Node {
                                f_score: tentative_g_score + 1.0,
                                position: neighbor_pos,
                            });
                        }
                    }
                }
            }
        }
        // If we get here it means no path was found
        return js_sys::Array::new();
    }
}