export type Player = "X" | "O";
export type Board = (Player | null)[][];

/*
Sample board
[
  [X, X, O, O],
  [O, X, O, O],
  [O, X, X, O],
  [X, X, O, X],
]
*/

export class TicTacToe {
  public checkWinner(board: Board ):Player | null {
    this.validateBoard(board);

    const horizontal = this.checkHorizontal(board);
    if (horizontal) return horizontal;

    const vertical = this.checkVertical(board);
    if (vertical) return vertical;

    const corners = this.checkCorners(board);
    if (corners) return corners;

    const diagonal = this.checkDiagonal(board);
    if (diagonal) return diagonal;

    const boxes = this.checkBoxes(board);
    if (boxes) return boxes;

    return null;
  }

  public anyMovesLeft(board: Board):boolean {
    this.validateBoard(board);

    for (let i=0; i<board.length; i++) {
      const row = board[i];
      if (row.includes(null)) return true;
    }
    return false;
  }

  public isGameOver(board: Board):boolean {
    this.validateBoard(board);
    
    if (this.checkWinner(board) || !this.anyMovesLeft(board)) {
      return true;
    }
    return false;
  }

  private checkHorizontal(board: Board): Player | null {
    for (let i=0; i<board.length; i++) {
      const row = board[i];
      // possible refactor
      if (row.every(space => space === "X")) return "X";
      if (row.every(space => space === "O")) return "O";
    }
    return null;
  }

  private checkVertical(board: Board): Player | null {
    for (let i=0; i<board.length; i++) {
      const column = board.map(row => row[i])
      if (column.every(space => space === "X")) return "X";
      if (column.every(space => space === "O")) return "O";
    }

    return null;
  }

  private checkDiagonal(board: Board): Player | null {
    const diagonal = board.map((row, idx) => row[idx])
    if (diagonal.every(space => space === "X")) return "X";
    if (diagonal.every(space => space === "O")) return "O";

    const oppositeDiagonal = board.map((row, idx) => row[3-idx])
    if (oppositeDiagonal.every(space => space === "X")) return "X";
    if (oppositeDiagonal.every(space => space === "O")) return "O";

    return null;
  }

  private checkCorners(board: Board): Player | null {
    const firstCorner = board[0][0];
    if (!firstCorner) return null;
    if (firstCorner === board[0][3] && firstCorner === board[3][0] && firstCorner === board[3][3]) {
      return firstCorner;
    }
    return null;
  }

  private checkBoxes(board: Board): Player| null {
    for (let row=0; row<board.length-1; row++) {
      for (let col=0; col<board[row].length-1; col++) {
        const topLeft = board[row][col];
        if (!topLeft) continue;

        if (
          topLeft === board[row][col + 1] &&
          topLeft === board[row + 1][col] &&
          topLeft === board[row + 1][col + 1]
        ) {
          return topLeft;
        }
      }
    }
    return null;
  }

  private validateBoard(board: unknown): asserts board is Board {
    if (!Array.isArray(board) || board.length !== 4) {
      throw new Error("Invalid board");
    }

    for (let row = 0; row < 4; row++) {
      if (!Array.isArray(board[row]) || board[row].length !== 4) {
        throw new Error("Invalid board");
      }

      for (let col = 0; col < 4; col++) {
        const cell = board[row][col];

        if (
          !(col in board[row]) ||
          (cell !== null && cell !== "X" && cell !== "O")
        ) {
          throw new Error("Invalid board");
        }
      }
    }
  }
}

