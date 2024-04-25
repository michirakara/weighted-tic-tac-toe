import { useState, useEffect } from "react";
import "./App.css";
import init,{ put_stone, check_condition, cpu_turn } from '../wasm/pkg/wasm';

function App() {
    const [board1,setBoard1] = useState(0);
    const [board2,setBoard2] = useState(0);
    const [numBoard,_] = useState(new Int32Array(9).map((_)=>Math.floor(Math.random()*201-100)));
    const [playerScore, setPlayerScore] = useState(0);
    const [enemyScore,setEnemyScore] = useState(0);
    const [condition,setCondition]= useState('ganbare~');

    useEffect(() => {
        init();
    }, [])

    function checkCondition(board1:number,board2:number){
        var tmp_pl_score=0;
        var tmp_en_score=0;
        for(var i=0;i<9;i++){
            if((board1)&(1<<i)){
                tmp_pl_score+=numBoard[i];
            }
            if((board2)&(1<<i)){
                tmp_en_score+=numBoard[i];
            }
        }
        setPlayerScore(tmp_pl_score);
        setEnemyScore(tmp_en_score);
        var condition=check_condition(board1,board2,numBoard);
        console.log(condition);
        if(condition!=0){
            if(condition>0){
                setCondition("you win");
            }
            else{
                setCondition("CPU win");
            }
        }
    }

    function putStone(index:number) {
        let new_board1=put_stone(board1,index);
        setBoard1(new_board1);
        checkCondition(new_board1,board2);
        let new_board2=cpu_turn(new_board1,board2,numBoard);
        setBoard2(new_board2);
        checkCondition(new_board1,new_board2)
    }
    function isOpen(index:number):string {
        if(((board1|board2)>>index)&1){
            return "close";
        }
        return "open";
    }
    function getText(index:number):string{
        var ret=''
        if(board1 & (1<<index)){
            ret+= 'O';
        }else if(board2 & (1<<index)){
            ret+= 'X';
        }else{
            ret+=' ';
        }
        return ret;
    }
    function getBackGroundColor(index:number):string{
        let r=255-Math.floor((numBoard[index]+100)/200*217);
        let g=255-Math.floor((numBoard[index]+100)/200*123);
        let b=255-Math.floor((numBoard[index]+100)/200*3);
        return 'rgb('+r.toString()+','+g.toString()+','+b.toString()+')';
    }
    return <>
        <div className="main">
            <div className="board">
                <button style={{background: getBackGroundColor(0)}}className={isOpen(0)}id="n0" disabled={isOpen(0)=='close'} onClick={() => putStone(0)}>{getText(0)}<br/>{numBoard[0]}</button>
                <button style={{background: getBackGroundColor(1)}}className={isOpen(1)}id="n1" disabled={isOpen(1)=='close'} onClick={() => putStone(1)}>{getText(1)}<br/>{numBoard[1]}</button>
                <button style={{background: getBackGroundColor(2)}}className={isOpen(2)}id="n2" disabled={isOpen(2)=='close'} onClick={() => putStone(2)}>{getText(2)}<br/>{numBoard[2]}</button>
                <button style={{background: getBackGroundColor(3)}}className={isOpen(3)}id="n3" disabled={isOpen(3)=='close'} onClick={() => putStone(3)}>{getText(3)}<br/>{numBoard[3]}</button>
                <button style={{background: getBackGroundColor(4)}}className={isOpen(4)}id="n4" disabled={isOpen(4)=='close'} onClick={() => putStone(4)}>{getText(4)}<br/>{numBoard[4]}</button>
                <button style={{background: getBackGroundColor(5)}}className={isOpen(5)}id="n5" disabled={isOpen(5)=='close'} onClick={() => putStone(5)}>{getText(5)}<br/>{numBoard[5]}</button>
                <button style={{background: getBackGroundColor(6)}}className={isOpen(6)}id="n6" disabled={isOpen(6)=='close'} onClick={() => putStone(6)}>{getText(6)}<br/>{numBoard[6]}</button>
                <button style={{background: getBackGroundColor(7)}}className={isOpen(7)}id="n7" disabled={isOpen(7)=='close'} onClick={() => putStone(7)}>{getText(7)}<br/>{numBoard[7]}</button>
                <button style={{background: getBackGroundColor(8)}}className={isOpen(8)}id="n8" disabled={isOpen(8)=='close'} onClick={() => putStone(8)}>{getText(8)}<br/>{numBoard[8]}</button>
            </div>
            <div>
                <p className="condition">
                    {playerScore} vs {enemyScore}
                    <br />{condition}
                </p>
            </div>
        </div>
        <div>
            <h1>これはなに？</h1>
            <p>
                競技プログラミングサイト AtCoder において出題された<a href='https://atcoder.jp/contests/abc349/tasks/abc349_e'>問題</a>に登場したゲームを実際にコンピューターと遊べるようにしたゲームです<br />
            </p>
        </div>
    </>
}

export default App;