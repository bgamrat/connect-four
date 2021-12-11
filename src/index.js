import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const ROWS = 6;
const COLS = 7;

function Square(props) {
  return (
    <div className="col square" data-color={props.value}>
      {props.dataId}
    </div>
  );
}

function Button(props) {
  return (
    <button className="col btn" data-color={props.dataColor} disabled={props.disabled} onClick={props.onClick}></button>
  );
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(ROWS * COLS).fill(null),
      buttons: Array(COLS).fill(true),
      redIsNext: true,
      winner: false
    };
  }

  handleClick(c) {
    const squares = this.state.squares.slice();
    const buttons = this.state.buttons.slice();
    
      let found = COLS;
      for (let i = ROWS; i >= 0; i--) {
        let j = i * COLS + c;
        if (squares[j] === null) {
          squares[j] = this.state.redIsNext ? "red" : "yellow";
          found = j;
          break;
        }
      }

      const winner = calculateWinner(squares,found);
      // if there is a winner - disable all the buttons, game's over
      if (winner !== null) {
          buttons.fill(false);
      } else if (found < COLS) {
        buttons[found] = false;
      }
      
    this.setState({
      squares: squares,
      buttons: buttons,
      redIsNext: !this.state.redIsNext,
      winner: winner
    });
  }

  renderSquare(i) {
    return <Square key={i} value={this.state.squares[i]} dataId={i} />;
  }

  renderButton(i,color) {
    return <Button dataColor={color} key={i} disabled={!this.state.buttons[i]} onClick={() => this.handleClick(i)} />;
  }
  
  render() {
    const winner = this.state.winner;
    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.redIsNext ? "red" : "yellow");
    }

    const rows = [];
    for (let r = 0; r < ROWS; r++) {
      rows[r] = [];
      for (let c = 0; c < COLS; c++)
        rows[r].push(this.renderSquare(r * COLS + c ));
    }

    const board = [];
    for (let i = 0; i < ROWS; i++) {
      board.push(
        <div className="board-row" key={i}>
          {rows[i]}
        </div>
      );
    }

    const buttons = [];
    const color = this.state.redIsNext ? "red" : "yellow";
    for (let i = 0; i < COLS; i++) {
      buttons.push(
        this.renderButton(i,color)
      );
    }

    return (
      <div>
        <div className="status">{status}</div>
        {buttons}
        {board}
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares,s) {

    // strategy - overlay the board with a 7x7 grid centered on the square that just changed
    // loop through the grid finding matching squares

    // convert s into the two-dimensional equivalent
    let [ row, col ] = twoD(s);
    // create a 3x3 array to count matches on the axis
    let axisCount = [Array(3).fill(0),Array(3).fill(0),Array(3).fill(0)];
    const l = squares.length;
    // get the current color, that which was last played
    let current = squares[s];
    // scan a 7x7 block around the most recently populated square
    for (let i = 0; i < 7; i++) {
        // adjust the y axis (row)
        let r = row+(i-3);
        // if the y axis is negative, skip it
        if (r < 0) continue;
        // x axis
        for (let j = 0; j < 7; j++) {
            // adjust (as above)
            let c = col+(j-3);
            if (c < 0) continue;
            // convert the r and c coordinates to single dimensional
            let o = oneD(r,c); 
            // ensure they are within the bounds of the array
            if (o >= 0 && o < l) {
                // set the array indicies for the axisCounter to reflect the square being checked
                let x = cmp(r,row);
                let y = cmp(c,col);
                // if the square being checked is the same as the one that was just updated 
                if (squares[o] === current) {
                    // check it this is diagonal or on the same row or column
                    if (i === j || ((i + j) === 6) || i === 3 || j === 3) {
                        // increment the axisCount
                        axisCount[x][y]++;
                    }
                    // if there are three items on that axis - that color has won
                    // this isn't pretty ...
                    console.log(row+","+col);
                    console.log(axisCount);
                    if ((axisCount[0][0] + axisCount[2][2] === 3) ||
                     (axisCount[2][0] + axisCount[0][2] === 3) ||
                     (axisCount[1][0] + axisCount[1][2] === 3) ||
                     (axisCount[0][1] + axisCount[2][1] === 3)) return squares[s];
                }
            }
        }
    }
    
    return null;
}

function cmp(a,b) {
    if (a === b) return 1;
    if (a < b) return 0;
    return 2;
}

function twoD(c) {
    const row = Math.floor(c / COLS);
    const col = c % COLS;
    return [ row, col ];
}

function oneD(row,col) {
    return row*COLS+col;
}