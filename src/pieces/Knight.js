const Piece = require('./Piece')


class Knight extends Piece {
  constructor(color, hasMoved, id) {
    super(color, hasMoved, id);
    this.name = "knight";
  }

  getValidMoves(sqId, virtualBoard, checkForCheckmate) {
    let moves = [];
    // I don't like it; find another way
    moves.push(
      ...this.checkMoves(virtualBoard, (r, c, i) => [r - 2, c - 1])
    );
    moves.push(
      ...this.checkMoves(virtualBoard, (r, c, i) => [r - 2, c + 1])
    );
    moves.push(
      ...this.checkMoves(virtualBoard, (r, c, i) => [r + 2, c - 1])
    );
    moves.push(
      ...this.checkMoves(virtualBoard, (r, c, i) => [r + 2, c + 1])
    );

    moves.push(
      ...this.checkMoves(virtualBoard, (r, c, i) => [r - 1, c - 2])
    );
    moves.push(
      ...this.checkMoves(virtualBoard, (r, c, i) => [r - 1, c + 2])
    );
    moves.push(
      ...this.checkMoves(virtualBoard, (r, c, i) => [r + 1, c - 2])
    );
    moves.push(
      ...this.checkMoves(virtualBoard, (r, c, i) => [r + 1, c + 2])
    );

    if (checkForCheckmate) {
      return moves.filter((id) => {
        return this.checkForCheckmate(id, virtualBoard);
      });
    }

    return [...moves];
  }
}

module.exports= Knight