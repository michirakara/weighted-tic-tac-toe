use std::cmp::min;
use wasm_bindgen::prelude::*;

const WIN_CONDITION:[u32; 8]=[7, 56, 448, 292, 146, 73, 273, 84];

#[wasm_bindgen]
pub fn put_stone(board:u32,index:u32) -> u32{
    return board|(1<<index);
}

fn search(board1:u32,board2:u32,num_board:Vec<i32>) -> i32 {
    let condition=check_condition(board1, board2, num_board.clone());
    if  condition != 0{
        return condition
    }
    let mut min_score=1000000000;
    for i in 0..9{
        if ((1<<i)&(board1|board2))==0{
            min_score=min(min_score,search(board2,board1|(1<<i),num_board.clone()));
        }
    }
    return -min_score
}

#[wasm_bindgen]
pub fn cpu_turn(board1:u32,board2:u32,num_board:Vec<i32>) -> u32{
    let mut max_score=-1000000000;
    let mut to_ret=board2;
    for i in 0..9{
        if (board1|board2)&(1<<i)==0{
            let tmp=-search(board1,board2|(1<<i),num_board.clone());
            if max_score<tmp{
                max_score=tmp;
                to_ret=board2|(1<<i);
            }
        }
    }
    return to_ret;
}

#[wasm_bindgen]
pub fn check_condition(board1:u32,board2:u32,num_board:Vec<i32>) -> i32{
    for i in WIN_CONDITION{
        if (i&board1) == i{
            return 1000000
        }
        if (i&board2) == i{
            return -1000000
        }
    }
    if (board1 | board2) == (1<<9)-1 {
        let mut score1: i32=0;
        let mut score2: i32=0;
        for (idx,num) in num_board.iter().enumerate(){
            if board1&(1<<idx)!=0{
                score1+=num;
            }else{
                score2+=num;
            }
        }
        return score1-score2
    }
    return 0
}