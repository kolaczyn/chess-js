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
  