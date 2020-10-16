class Board {
  constructor(initialBoardState) {
    this.DomBoard = document.getElementById("chess-div");
    this.initializeVirtualBoard(initialBoardState);
    this.validMoves = []
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
        ]

        let colorPiece = ''; // jjust a workaround, It's probably not the cleanset solution
        if (potentialPiece !== undefined) {
          colorPiece = `${potentialPiece.color}-${potentialPiece.name}`;
          classes.push(colorPiece);
        }
        this.DomBoard.appendChild(
          this.createSquare(col, row, classes,colorPiece)
        );
      }
  }

  showValidMoves(sqId) {
    let piece = this.virtualBoard[sqId];
    if (piece) {
      // removing class from the old moves
      this.validMoves.forEach(m=>{
        let moveSq = document.getElementById(m)
        moveSq.classList.remove('square--valid-move')
      })
      let moves = piece.getValidMoves(sqId, this.virtualBoard);
      console.log(moves)
      moves.forEach(m =>{
        let moveSq = document.getElementById(m)
        moveSq.classList.add('square--valid-move')
      })
      this.validMoves = moves;
    } else {
      // console.log("This square is empty");
      this.validMoves.forEach(m=>{
        let moveSq = document.getElementById(m)
        moveSq.classList.remove('square--valid-move')
      })
      this.validMoves=[]
      
    }
  }

  createSquare(col, row, classes, colorPiece) {
    let id = `${col}-${row}`;
    const square = document.createElement("button");
    square.addEventListener("click", () => {
      this.showValidMoves(id);
    });
    // square.id = classes;
    classes.forEach((cl) => {
      square.classList.add(cl);
    });
    if (colorPiece) {
      square.style.backgroundImage = `url(img/${colorPiece}.svg)`;
    }
    // background-image: url(img/black-king.png);

    square.id = `${col}-${row}`;

    return square;
  }
}
