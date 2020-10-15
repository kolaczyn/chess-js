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
}

class Pawn extends Piece {
  constructor(color, hasMoved) {
    super(color, false);
    this.name = "pawn";
  }

  // this is very messy, will have to come up with something better
  getValidMoves(sqId, virtualBoard) {
    let out = [];
    let [row, col] = sqIdToRowCol(sqId);
    if (this.color === "white") {
      if (!isSquareOccupied(row + 1, col, virtualBoard)) {
        out.push(rowColToSqId(row + 1, col));
      }
      if (!this.hasMoved) {
        if (!isSquareOccupied(row + 2, col, virtualBoard)) {
          out.push(rowColToSqId(row + 2, col));
        }
      }
    } else {
      if (!isSquareOccupied(row - 1, col, virtualBoard)) {
        out.push(rowColToSqId(row - 1, col));
      }
      if (!this.hasMoved) {
        if (!isSquareOccupied(row - 2, col, virtualBoard)) {
          out.push(rowColToSqId(row - 2, col));
        }
      }
    }
    return out;
  }
}

class King extends Piece {
  constructor(color, hasMoved) {
    super(color, hasMoved);
    this.name = "king";
  }
}
class Queen extends Piece {
  constructor(color, hasMoved) {
    super(color, hasMoved);
    this.name = "queen";
  }
}
class Rook extends Piece {
  constructor(color, hasMoved) {
    super(color, hasMoved);
    this.name = "rook";
  }
}

class Bishop extends Piece {
  constructor(color, hasMoved) {
    super(color, hasMoved);
    this.name = "bishop";
  }
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
