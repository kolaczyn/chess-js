const {
  sqIdToRowCol,
} = require("./utils");

class Piece {
  constructor(color, hasMoved,id) {
    this.color = color;
    this.hasMoved = hasMoved;
    this.id = id
    console.log(this.id)
    // we don't care if bishop or knight has moved
    // I might do something like this in the future:
    // if (hasMoved !== undefined){
    //   this.hasMoved=this.hasMoved
    // }
  }

  static  isInRange(row, col) {
    return 0 <= row && row <= 7 && 0 <= col && col <= 7;
  }
 
  
  static isSquareOccupied(row, col, virtualBoard) {
    let piece = virtualBoard[`${row}-${col}`];
    if (piece) {
      return piece.color;
    }
    return "";
  }
  
  static rowColToSqId(row, col) {
    return `${row}-${col}`;
  }

  static stringToClass(s) {
    switch (s) {
      case "rook":
        return Rook;
        break;
      case "knight":
        return Knight;
        break;
      case "bishop":
        return Bishop;
        break;
      case "queen":
        return Queen;
        break;
      case "king":
        return King;
        break;
      case "pawn":
        return Pawn;
        break;
      default:
        throw new Error("Invalid piece class name.");
    }
    
  }
  

  // definitely will have to refactor this
  // helper function
  // it stops when it encourters an obstacle
  checkMovesBreak(row, col, virtualBoard, calculateSquare) {
    let validMoves = [];
    for (let i = 1; i < 8; i++) {
      let checkedSquare = calculateSquare(row, col, i);
      if (Piece.isInRange(...checkedSquare)) {
        let potentialPiece = Piece.isSquareOccupied(...checkedSquare, virtualBoard);
        if (potentialPiece) {
          if (potentialPiece !== this.color) {
            validMoves.push(Piece.rowColToSqId(...checkedSquare));
          }
          break;
        } else validMoves.push(Piece.rowColToSqId(...checkedSquare));
      }
    }
    return validMoves;
  }
  // I should probably rewrite this so it accepts array of squares to check
  // and then checks them, returns array of valid squares
  checkMoves(row, col, virtualBoard, calculateSquare) {
    let validMoves = [];
    let checkedSquare = calculateSquare(row, col);
    if (Piece.isInRange(...checkedSquare)) {
      let potentialPiece = Piece.isSquareOccupied(...checkedSquare, virtualBoard);
      if (potentialPiece) {
        if (potentialPiece !== this.color) {
          validMoves.push(Piece.rowColToSqId(...checkedSquare));
        }
      } else validMoves.push(Piece.rowColToSqId(...checkedSquare));
    }
    return validMoves;
  }

  getValidHorizontalMoves(sqId, virtualBoard) {
    let [row, col] = sqIdToRowCol(sqId);
    let top = this.checkMovesBreak(row, col, virtualBoard, (r, c, i) => [
      r + i,
      c,
    ]);
    let right = this.checkMovesBreak(row, col, virtualBoard, (r, c, i) => [
      r,
      c + i,
    ]);
    let bottom = this.checkMovesBreak(row, col, virtualBoard, (r, c, i) => [
      r - i,
      c,
    ]);
    let left = this.checkMovesBreak(row, col, virtualBoard, (r, c, i) => [
      r,
      c - i,
    ]);

    return [...top, ...right, ...bottom, ...left];
  }

  getValidDiagonalMoves(sqId, virtualBoard) {
    let [row, col] = sqIdToRowCol(sqId);
    let tl = this.checkMovesBreak(row, col, virtualBoard, (r, c, i) => [
      r + i,
      c - i,
    ]);
    let tr = this.checkMovesBreak(row, col, virtualBoard, (r, c, i) => [
      r + i,
      c + i,
    ]);
    let br = this.checkMovesBreak(row, col, virtualBoard, (r, c, i) => [
      r - i,
      c + i,
    ]);
    let bl = this.checkMovesBreak(row, col, virtualBoard, (r, c, i) => [
      r - i,
      c - i,
    ]);

    return [...tl, ...tr, ...br, ...bl];
  }
}
class Bishop extends Piece {
  constructor(color, hasMoved, id) {
    super(color, hasMoved, id);
    this.name = "bishop";
    this.getValidMoves = this.getValidDiagonalMoves;
  }
}
class King extends Piece {
  constructor(color, hasMoved, id) {
    super(color, hasMoved,id);
    this.name = "king";
  }
  // for now there is no checkmate and castling as of now
  getValidMoves(sqId, virtualBoard) {
    let [row, col] = sqIdToRowCol(sqId);
    let validMoves = [];
    let range = [-1, 0, 1];
    // there's probably a better way of doing it, but it's more JS-y than a C-style for loop
    // try to improve this algorithm
    range.forEach((i) => {
      range.forEach((j) => {
        // this way we don't check (0, 0) && a square is in range
        if ((i || j) && Piece.isInRange(row + i, col + j)) {
          let potentialPiece = Piece.isSquareOccupied(row + i, col + j, virtualBoard);
          if (potentialPiece) {
            if (potentialPiece !== this.color)
              validMoves.push(Piece.rowColToSqId(row + i, col + j));
          } else {
            validMoves.push(Piece.rowColToSqId(row + i, col + j));
          }
        }
      });
    });
    return validMoves;
  }
}
class Knight extends Piece {
  constructor(color, hasMoved, id) {
    super(color, hasMoved, id);
    this.name = "knight";
  }

  getValidMoves(sqId, virtualBoard) {
    let moves = [];
    let [row, col] = sqIdToRowCol(sqId);
    // I don't like it; find another way
    moves.push(
      ...this.checkMoves(row, col, virtualBoard, (r, c, i) => [r - 2, c - 1])
    );
    moves.push(
      ...this.checkMoves(row, col, virtualBoard, (r, c, i) => [r - 2, c + 1])
    );
    moves.push(
      ...this.checkMoves(row, col, virtualBoard, (r, c, i) => [r + 2, c - 1])
    );
    moves.push(
      ...this.checkMoves(row, col, virtualBoard, (r, c, i) => [r + 2, c + 1])
    );

    moves.push(
      ...this.checkMoves(row, col, virtualBoard, (r, c, i) => [r - 1, c - 2])
    );
    moves.push(
      ...this.checkMoves(row, col, virtualBoard, (r, c, i) => [r - 1, c + 2])
    );
    moves.push(
      ...this.checkMoves(row, col, virtualBoard, (r, c, i) => [r + 1, c - 2])
    );
    moves.push(
      ...this.checkMoves(row, col, virtualBoard, (r, c, i) => [r + 1, c + 2])
    );

    // console.log(moves);

    return [...moves];
  }
}
class Pawn extends Piece {
  constructor(color, hasMoved, id) {
    super(color, false, id);
    this.name = "pawn";
  }

  // this is very messy, will have to come up with something better
  // also, implement attacking and en passant
  getValidMoves(sqId, virtualBoard) {
    console.log(Piece.rowColToSqId)
    let out = [];
    let [row, col] = sqIdToRowCol(sqId);
    let moveSquaresToCheck = [];
    // attacks need to be checked differently, because pawn is weird
    let attackSquaresToCheck = [];
    let direction;
    if (this.color === "white") {
      direction = 1;
    } else {
      direction = -1;
    }
    // if a pawn reaches the end, the next move may let him go beyond the board
    // look into that later
    moveSquaresToCheck.push(Piece.rowColToSqId(row + direction, col));
    if (!this.hasMoved) {
      moveSquaresToCheck.push(Piece.rowColToSqId(row + direction * 2, col));
    }
    // C style loop, hell yeah
    let i = 0;
    for (; i < moveSquaresToCheck.length; i++) {
      let { row, col } = moveSquaresToCheck[i];
      if (Piece.isSquareOccupied(row, col, virtualBoard)) {
        break;
      }
    }
    return moveSquaresToCheck.slice(0, i);
  }
}
class Queen extends Piece {
  constructor(color, hasMoved, id) {
    super(color, hasMoved, id);
    this.name = "queen";
  }
  getValidMoves(sqId, virtualBoard) {
    return [
      ...this.getValidDiagonalMoves(sqId, virtualBoard),
      ...this.getValidHorizontalMoves(sqId, virtualBoard),
    ];
  }
}
class Rook extends Piece {
  constructor(color, hasMoved, id) {
    super(color, hasMoved, id);
    this.name = "rook";
    this.getValidMoves = this.getValidHorizontalMoves;
  }
}

module.exports = {
  Piece,
  Rook,
  Bishop,
  Knight,
  Queen,
  King,
  Pawn,
};
