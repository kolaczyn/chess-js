class Board {
  constructor(initialBoardState) {
    this.DomBoard = document.getElementById("chess-div");
    this.initializeVirtualBoard(initialBoardState);
    this.initializeSquaresAndPieces();
    // console.log(this.DomBoard)
  }

  initializeVirtualBoard(initialBoardState) {
    this.virtualBoard = {};
    Object.entries(initialBoardState).forEach(([key, value]) => {
      let [color, pieceName] = value.split("-");
      const pieceConstructor = stringToClass(pieceName);
      this.virtualBoard[key] = new pieceConstructor(color, false);
    });
    console.log(this.virtualBoard);
  }
  initializeSquaresAndPieces() {
    for (let col = 7; col >= 0; col--)
      for (let row = 0; row < 8; row++) {
        let classes = [];
        classes.push("square");
        if ((col + row) % 2) classes.push("square__white");
        else classes.push("square__black");
        let potentialPiece = this.virtualBoard[
          `${col.toString()}-${row.toString()}`
        ];
        if (potentialPiece !== undefined) {
          classes.push(`${potentialPiece.color}-${potentialPiece.name}`);
        }
        this.DomBoard.appendChild(this.createSquare(col, row, classes));
      }
  }

  createSquare(col, row, classes) {
    const square = document.createElement("button");
    // square.id = classes;
    classes.forEach(cl => {
      square.classList.add(cl);
    })
    square.id = `${row}-${col}`;

    return square;
  }
}
