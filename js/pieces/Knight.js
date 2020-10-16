class Knight extends Piece {
    constructor(color, hasMoved) {
      super(color, hasMoved);
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
  
      console.log(moves);
  
      return [...moves];
    }
  }
  