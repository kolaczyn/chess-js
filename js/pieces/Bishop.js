class Bishop extends Piece {
    constructor(color, hasMoved) {
      super(color, hasMoved);
      this.name = "bishop";
    }
    getValidMoves = this.getValidDiagonalMoves;
  }
  