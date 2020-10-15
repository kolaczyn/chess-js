class Board {
    constructor() {
      this.virtBoard = {
        "r0-c0": "white-rook",
        "r0-c1": "white-knight",
        "r0-c2": "white-bishop",
        "r0-c3": "white-queen",
        "r0-c4": "white-king",
        "r0-c5": "white-bishop",
        "r0-c6": "white-knight",
        "r0-c7": "white-rook",
        "r1-c0": "white-pawn",
        "r1-c1": "white-pawn",
        "r1-c2": "white-pawn",
        "r1-c3": "white-pawn",
        "r1-c4": "white-pawn",
        "r1-c5": "white-pawn",
        "r1-c6": "white-pawn",
        "r1-c7": "white-pawn",
  
        "r7-c0": "black-rook",
        "r7-c1": "black-knight",
        "r7-c2": "black-bishop",
        "r7-c3": "black-queen",
        "r7-c4": "black-king",
        "r7-c5": "black-bishop",
        "r7-c6": "black-knight",
        "r7-c7": "black-rook",
        "r6-c0": "black-pawn",
        "r6-c1": "black-pawn",
        "r6-c2": "black-pawn",
        "r6-c3": "black-pawn",
        "r6-c4": "black-pawn",
        "r6-c5": "black-pawn",
        "r6-c6": "black-pawn",
        "r6-c7": "black-pawn",
      };
      this.DomBoard = document.getElementById("chess-div");
      this.initializeSquares();
      this.initializePieces();
    }
    initializePieces() {
      ["black", "white"].forEach((color) => {
        this.virtBoard[color] = {};
        this.virtBoard[color].pawns = [];
        for (let i = 0; i < 8; i++) {
          this.virtBoard[color].pawns.push(new Pawn(color, i, this));
        }
        this.virtBoard[color].rook0 = new Rook(color, 0, this);
        this.virtBoard[color].knight0 = new Knight(color, 1, this);
        this.virtBoard[color].bishop0 = new Bishop(color, 2, this);
        this.virtBoard[color].queen = new Queen(color, this);
        this.virtBoard[color].king = new King(color, this);
        this.virtBoard[color].bishop1 = new Bishop(color, 3, this);
        this.virtBoard[color].knight1 = new Knight(color, 6, this);
        this.virtBoard[color].rook1 = new Rook(color, 7, this);
        // this
      });
    }
    initializeSquares() {
      for (let i = 0; i < 8; i++)
        for (let j = 0; j < 8; j++) {
          // console.log('run')
          this.DomBoard.appendChild(this.createSquare(i, j));
        }
    }
  
    createSquare(row, col) {
      const square = document.createElement("button");
      square.classList.add("square");
      if ((row + col) % 2) square.classList.add("square__black");
      else square.classList.add("square__white");
  
      square.classList.add("square");
      square.id = `r${7 - row}-c${col}`;
  
      return square;
    }
  }
  