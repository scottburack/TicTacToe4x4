import { describe, it, expect, beforeEach } from "vitest";
import { TicTacToe, type Board, type Player } from "./TicTacToe";

// Helpers
const emptyBoard = (): Board => [
  [null, null, null, null],
  [null, null, null, null],
  [null, null, null, null],
  [null, null, null, null],
];

// Start from an empty board and place `player` at each [row, col] given.
const boardWith = (player: Player, cells: [number, number][]): Board => {
  const board = emptyBoard();
  for (const [row, col] of cells) board[row][col] = player;
  return board;
};

// A full board with no row, column, diagonal, corner, or 2x2 win.
const fullNoWinner = (): Board => [
  ["X", "O", "X", "O"],
  ["X", "O", "X", "O"],
  ["O", "X", "O", "X"],
  ["O", "X", "O", "X"],
];

const players: Player[] = ["X", "O"];

describe("TicTacToe", () => {
  let game: TicTacToe;

  beforeEach(() => {
    game = new TicTacToe();
  });
  

  // 1
  describe("invalid boards", () => {
    const invalidBoards: [string, unknown][] = [
      ["an empty array", []],
      ["a 3x3 board", [[null, null, null], [null, null, null], [null, null, null]]],
      ["a 5x4 board", [...emptyBoard(), [null, null, null, null]]],
      ["a 4x5 board", emptyBoard().map(row => [...row, null])],
      ["a board with one short row", [...emptyBoard().slice(0, 3), [null, null, null]]],
      ["a board with an invalid cell value", [["Z", null, null, null], ...emptyBoard().slice(1)]],
      ["a non-array", "not a board"],
      ["null", null],
    ];

    it.each(invalidBoards)("checkWinner throws for %s", (_, board) => {
      expect(() => game.checkWinner(board as Board)).toThrow("Invalid board");
    });

    it.each(invalidBoards)("anyMovesLeft throws for %s", (_, board) => {
      expect(() => game.anyMovesLeft(board as Board)).toThrow("Invalid board");
    });

    it.each(invalidBoards)("isGameOver throws for %s", (_, board) => {
      expect(() => game.isGameOver(board as Board)).toThrow("Invalid board");
    });

  });

  // 2
  describe("full board with no winner", () => {
    it("has no winner", () => {
      expect(game.checkWinner(fullNoWinner())).toBeNull();
    });

    it("is game over", () => {
      expect(game.isGameOver(fullNoWinner())).toBe(true);
    });
  });

  // 3
  describe("moves left", () => {
    it("an empty board has moves left", () => {
      expect(game.anyMovesLeft(emptyBoard())).toBe(true);
    });

    it("a single null space means there are moves left", () => {
      const board = fullNoWinner();
      board[2][1] = null;
      expect(game.anyMovesLeft(board)).toBe(true);
    });

    it("a full board has no moves left", () => {
      expect(game.anyMovesLeft(fullNoWinner())).toBe(false);
    });

    it("a board with moves left and no winner is not game over", () => {
      const board = fullNoWinner();
      board[2][1] = null;
      expect(game.isGameOver(board)).toBe(false);
    });
  });

  // 4
  describe("horizontal wins", () => {
    for (const player of players) {
      for (let row = 0; row < 4; row++) {
        it(`4 ${player}s in row ${row} is a win`, () => {
          const board = boardWith(player, [[row, 0], [row, 1], [row, 2], [row, 3]]);
          expect(game.checkWinner(board)).toBe(player);
        });
      }
    }

    it("3 in a row is not a win", () => {
      const board = boardWith("X", [[0, 0], [0, 1], [0, 2]]);
      expect(game.checkWinner(board)).toBeNull();
    });
  });

  // 5
  describe("vertical wins", () => {
    for (const player of players) {
      for (let col = 0; col < 4; col++) {
        it(`4 ${player}s in column ${col} is a win`, () => {
          const board = boardWith(player, [[0, col], [1, col], [2, col], [3, col]]);
          expect(game.checkWinner(board)).toBe(player);
        });
      }
    }

    it("3 in a column is not a win", () => {
      const board = boardWith("O", [[1, 2], [2, 2], [3, 2]]);
      expect(game.checkWinner(board)).toBeNull();
    });
  });

  // 6
  describe("diagonal wins", () => {
    for (const player of players) {
      it(`4 ${player}s on the main diagonal is a win`, () => {
        const board = boardWith(player, [[0, 0], [1, 1], [2, 2], [3, 3]]);
        expect(game.checkWinner(board)).toBe(player);
      });

      it(`4 ${player}s on the opposite diagonal is a win`, () => {
        const board = boardWith(player, [[0, 3], [1, 2], [2, 1], [3, 0]]);
        expect(game.checkWinner(board)).toBe(player);
      });
    }

    it("a mixed diagonal is not a win", () => {
      const board = boardWith("X", [[0, 0], [1, 1], [2, 2]]);
      board[3][3] = "O";
      expect(game.checkWinner(board)).toBeNull();
    });
  });

  // 7
  describe("corner wins", () => {
    for (const player of players) {
      it(`all 4 corners as ${player} is a win`, () => {
        const board = boardWith(player, [[0, 0], [0, 3], [3, 0], [3, 3]]);
        expect(game.checkWinner(board)).toBe(player);
      });
    }

    it("3 matching corners is not a win", () => {
      const board = boardWith("X", [[0, 0], [0, 3], [3, 0]]);
      board[3][3] = "O";
      expect(game.checkWinner(board)).toBeNull();
    });
  });

  // 8
  describe("2x2 box wins", () => {
    for (const player of players) {
      // Every possible top-left corner of a 2x2 box on a 4x4 board.
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          it(`a 2x2 box of ${player}s at [${row}][${col}] is a win`, () => {
            const board = boardWith(player, [
              [row, col], [row, col + 1],
              [row + 1, col], [row + 1, col + 1],
            ]);
            expect(game.checkWinner(board)).toBe(player);
          });
        }
      }
    }

    it("a 2x2 box with one different cell is not a win", () => {
      const board = boardWith("O", [[1, 1], [1, 2], [2, 1]]);
      board[2][2] = "X";
      expect(game.checkWinner(board)).toBeNull();
    });
  });

  // 9
  describe("only one winner / game stops", () => {
    it("returns the first winner when both players have a winning line", () => {
      const board = emptyBoard();
      board[0] = ["X", "X", "X", "X"];
      board[3] = ["O", "O", "O", "O"];

      expect(game.checkWinner(board)).toBe("X");
    });

    it("the game is over as soon as there is a winner, even with moves left", () => {
      const board = boardWith("X", [[0, 0], [0, 1], [0, 2], [0, 3]]);
      expect(game.anyMovesLeft(board)).toBe(true);
      expect(game.isGameOver(board)).toBe(true);
    });

    it("the game is over when the board is full", () => {
      expect(game.anyMovesLeft(fullNoWinner())).toBe(false);
      expect(game.isGameOver(fullNoWinner())).toBe(true);
    });
  });
});
