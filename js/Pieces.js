class Piece {
  constructor(color, hasMoved) {
    this.color = color;
    this.hasMoved = hasMoved;
    // we don't care if bishop or knight has moved
    // I might do something like this in the future:
    // if (hasMoved !== undefined){
    //   this.hasMoved=this.hasMoved
    // }
  }

  getValidMoves() {
    throw new Error("Not implemented yet.");
  }
  getValidHorizontalMoves(sqId, virtualBoard) {
    let [row, col] = sqIdToRowCol(sqId);
    // if ((i || j) && isInRange(row + i, col + j)) {

    let validMoves = [];
    // I have split it into a functions
    // I did it this way for now, to see if that works
    // I should create general function which takes an array
    // of potential moves, check them one by one and break if there's an obstacle.
    // I would use that function here
    for (let i = 1; i < 8; i++) {
      let checkedSquare = [row, col - i];
      if (isInRange(...checkedSquare)) {
        let potentialPiece = isSquareOccupied(...checkedSquare, virtualBoard);
        if (potentialPiece) {
          if (potentialPiece !== this.color) {
            validMoves.push([...checkedSquare]);
          }
          break;
        } else validMoves.push([...checkedSquare]);
      }
    }
    for (let i = 1; i < 8; i++) {
      let checkedSquare = [row, col + i];
      if (isInRange(...checkedSquare)) {
        let potentialPiece = isSquareOccupied(...checkedSquare, virtualBoard);
        if (potentialPiece) {
          if (potentialPiece !== this.color) {
            validMoves.push([...checkedSquare]);
          }
          break;
        } else validMoves.push([...checkedSquare]);
      }
    }
    for (let i = 1; i < 8; i++) {
      let checkedSquare = [row-i, col];
      if (isInRange(...checkedSquare)) {
        let potentialPiece = isSquareOccupied(...checkedSquare, virtualBoard);
        if (potentialPiece) {
          if (potentialPiece !== this.color) {
            validMoves.push([...checkedSquare]);
          }
          break;
        } else validMoves.push([...checkedSquare]);
      }
    }
    for (let i = 1; i < 8; i++) {
      let checkedSquare = [row+i, col];
      if (isInRange(...checkedSquare)) {
        let potentialPiece = isSquareOccupied(...checkedSquare, virtualBoard);
        if (potentialPiece) {
          if (potentialPiece !== this.color) {
            validMoves.push([...checkedSquare]);
          }
          break;
        } else validMoves.push([...checkedSquare]);
      }
    }

    return validMoves;
  }


  getValidDiagonalMoves(sqId, virtualBoard) {
    return [];
  }
}

class Pawn extends Piece {
  constructor(color, hasMoved) {
    super(color, false);
    this.name = "pawn";
  }

  // this is very messy, will have to come up with something better
  // also, implement attacking and en passant
  getValidMoves(sqId, virtualBoard) {
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
    moveSquaresToCheck.push({ row: row + direction, col });
    if (!this.hasMoved) {
      moveSquaresToCheck.push({ row: row + direction * 2, col });
    }
    // C style loop, hell yeah
    let i = 0;
    for (; i < moveSquaresToCheck.length; i++) {
      let { row, col } = moveSquaresToCheck[i];
      if (isSquareOccupied(row, col, virtualBoard)) {
        break;
      }
    }
    return moveSquaresToCheck.slice(0, i);
  }
}

class King extends Piece {
  constructor(color, hasMoved) {
    super(color, hasMoved);
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
        // console.log(i,j)
        // this way we don't check (0, 0) && a square is in range
        if ((i || j) && isInRange(row + i, col + j)) {
          let potentialPiece = isSquareOccupied(row + i, col + j, virtualBoard);
          if (potentialPiece) {
            if (potentialPiece !== this.color)
              validMoves.push({ row: row + i, col: col + j });
          } else {
            validMoves.push({ row: row + i, col: col + j });
          }
        }
        // if (isSquareOccupied{}
      });
    });
    return validMoves;
  }
}
class Queen extends Piece {
  constructor(color, hasMoved) {
    super(color, hasMoved);
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
  constructor(color, hasMoved) {
    super(color, hasMoved);
    this.name = "rook";
  }

  getValidMoves = this.getValidHorizontalMoves;
}

class Bishop extends Piece {
  constructor(color, hasMoved) {
    super(color, hasMoved);
    this.name = "bishop";
  }
  getValidMoves = this.getValidDiagonalMoves;
}

class Knight extends Piece {
  constructor(color, hasMoved) {
    super(color, hasMoved);
    this.name = "knight";
  }
}

// this is just dumb
// I have to find another way of doing things
function stringToClass(s) {
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
