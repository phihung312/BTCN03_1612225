import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
function Square(props) {
  return (
    <button style= {{'background': props.color}} className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

function Board(props) {
  const renderSquare = (i) => {
    return (
      <Square 
        value={props.squares[i]}
        onClick={() => props.onClick(i)}
        color = {props.colors[i]}
      />
    );
  }
    let board = [];
    for (let index = 0; index < 3; index++) {
      let row = []
      for (let i = 0; i < 3; i++) {
        row.push(renderSquare(index * 3 + i));
      }
      board.push(
      <div className="board-row">
        {row}
      </div>
      );
    }
    return (
      <div>
              {board}
      </div>
    );
}

function Game (props) {
  const [_history,setHistory] = useState( [
    {
      squares: Array(9).fill(null)
    }
  ]);
  const [stepNumber, setStepNumber] = useState(0)
  const [xIsNext, setXIsNext] = useState(true)
  const[isIncrease, setIsIncrease] = useState(true)
  const [colors, setColors] =useState(Array(9).fill('while'))
  const handleClick =(i)=> {
    const value = i;
    const history = _history.slice(0, stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = xIsNext ? "X" : "O";
    // this.setState({
    //   history: history.concat([
    //     {
    //       position: value,
    //       squares: squares
    //     }
    //   ]),
    //   stepNumber: history.length,
    //   xIsNext: !this.state.xIsNext,
    // });
    setHistory(history.concat([
      {
        position: value,
        squares: squares
      }
    ]))
    setStepNumber( history.length)
    setXIsNext(!xIsNext)
  }

  const jumpTo = (step) => {
    var length = _history.length;
    for (let i = 0; i < length; i++) {
      if (i === step) {
        document.getElementById(i).style.fontWeight = "900";
      }
      else {
        document.getElementById(i).style.fontWeight = "100";
      }
    };
    // this.setState({
    //   stepNumber: step,
    //   xIsNext: (step % 2) === 0,
    //   colors: Array(9).fill('while')
    // });
    setStepNumber(step)
    setXIsNext((step % 2) === 0)
    setColors(Array(9).fill('while'))
  }
  const handleClickSort = ()=> {
    // this.setState({
    //   isIncrease: !this.state.isIncrease,
    // })
    setIsIncrease( !isIncrease)
  }
  const paintWinLine = (winLine)=> {
    for (let count = 0; count < 3; count++) {
      colors[winLine[count]] = '#37d422';
    }
    winLine = [];
  }
  
    const history = _history;
    const current = history[stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const row = Math.floor(history[move].position / 3);
      const col = (history[move].position) % 3;      
      const desc = move ? `Go to move #${move} [${row},${col}]` : 'Go to game start';       
      return (
        <li key={move}>
          <button id={move} onClick={() => jumpTo(move)}>{desc}</button>
        </li>
      );
    });
    if (!isIncrease)
      {
        moves.reverse();
      }
    let status;
    if (winner) {
      status = "Winner: " + winner.win;
      paintWinLine(winner.winline)
    } else {
      if (_history.length===10){
        status="Draw"
      }
      else{  status = "Next player: " + (xIsNext ? "X" : "O");}
     
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            colors = {colors}
            onClick={i => handleClick(i)}
          />

        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => handleClickSort()}> Sort </button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return{
        win: squares[a],
        winline :lines[i]
      } 
    }
  }
  return null;
}
