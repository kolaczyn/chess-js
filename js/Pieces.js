class Piece {
    constructor(color, col, row, boardRef) {
      // this.color = color;
      this.col = col;
      // don't modify it, it's for anylising
      // valid movesb
      this.boardRef = boardRef;
    }
    // learn in depth how classes work in JS
    checkIfValid() {
      throw new Error("You didn' overwrite default checkIfValid method!");
    }
    // putPiece(squareDiv){
    //   this.currentSq;
    // }
  }
  
  // I will be probably more optimal (performance wise) to use prototypes instead of classes
  // check if that's true
  // also check what TS compiler does with classes
  class Pawn extends Piece {
    constructor(color, col, boardRef) {
      // we probably can already deduce that from its position, but whatever
      // I'll fix that later
      let row = color == "white" ? 1 : 6;
      super(color, col, row, boardRef);
      this.hasMoved = false;
      this.name = "pawn";
    }
    checkIfValid() {
      return false;
    }
  }
  
  class King extends Piece {
    constructor(color, boardRef) {
      // we probably can already deduce that from its position, but whatever
      // I'll fix that later
      let row = color === "white" ? 0 : 7;
      let col = 4;
      super(color, col, boardRef);
      this.hasMoved = false;
      this.name = "king";
    }
    checkIfValid() {
      return false;
    }
  }
  class Queen extends Piece {
    constructor(color, boardRef) {
      // we probably can already deduce that from its position, but whatever
      // I'll fix that later
      let row = color === "white" ? 0 : 7;
      let col = 3;
      super(color, col, row, boardRef);
      this.name = "queen";
    }
    checkIfValid() {
      return false;
    }
  }
  class Rook extends Piece {
    constructor(color, col, boardRef) {
      // we probably can already deduce that from its position, but whatever
      // I'll fix that later
      let row = color === "white" ? 0 : 7;
      super(color, col, row, boardRef);
      this.name = "rook";
    }
    checkIfValid() {
      return false;
    }
  }
  
  class Bishop extends Piece {
    constructor(color, col, boardRef) {
      // we probably can already deduce that from its position, but whatever
      // I'll fix that later
      let row = color === "white" ? 0 : 7;
      super(color, col, row, boardRef);
      this.name = "bishop";
    }
    checkIfValid() {
      return false;
    }
  }
  
  class Knight extends Piece {
    constructor(color, col, boardRef) {
      // we probably can already deduce that from its position, but whatever
      // I'll fix that later
      let row = color === "white" ? 0 : 7;
      super(color, row, col, boardRef);
      this.name = "knight";
    }
    checkIfValid() {
      return false;
    }
  }
  