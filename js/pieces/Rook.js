class Rook extends Piece {
    constructor(color, hasMoved) {
      super(color, hasMoved);
      this.name = "rook";
    }
  
    getValidMoves = this.getValidHorizontalMoves;
  }
  