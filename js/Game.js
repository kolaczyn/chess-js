class Game {
    constructor() {
      this.chessDiv = document.getElementById("chess-div");
      this.initializeBoard();
      this.initializePieces();
      this.addListenersToSquares();
  
      this.notifications = new Notifications();
      this.turnIndicator = new TurnIndicator();
  
      this.isWhitesTurn = true;
      this.selectedSquare = null;
      this.selectedPiece = null;
    }
  
    initializePieces() {
      let whitePawns = document.getElementsByClassName("2");
      [...whitePawns].forEach((pawn) => {
        pawn.classList.add("white-pawn");
      });
      let blackPawns = document.getElementsByClassName("7");
      [...blackPawns].forEach((pawn) => {
        pawn.classList.add("black-pawn");
      });
      this.addPiece("A1", "white-rook");
      this.addPiece("B1", "white-knight");
      this.addPiece("C1", "white-bishop");
      this.addPiece("D1", "white-queen");
      this.addPiece("E1", "white-king");
      this.addPiece("F1", "white-bishop");
      this.addPiece("G1", "white-knight");
      this.addPiece("H1", "white-rook");
  
      this.addPiece("A8", "black-rook");
      this.addPiece("B8", "black-knight");
      this.addPiece("C8", "black-bishop");
      this.addPiece("D8", "black-queen");
      this.addPiece("E8", "black-king");
      this.addPiece("F8", "black-bishop");
      this.addPiece("G8", "black-knight");
      this.addPiece("H8", "black-rook");
    }
  
    rotateBoard() {
      this.chessDiv.classList.toggle("rotate");
    }
  
    initializeNextTurn() {
      this.isWhitesTurn = !this.isWhitesTurn;
      this.turnIndicator.changeTurnIndicators();
      this.selectedSquare = null;
      this.selectedPiece = null;
      this.notifications.sendNotification(
        `It's now ${this.isWhitesTurn ? "white" : "black"}s' turn`,
        "info"
      );
      this.rotateBoard();
    }
  
    addPiece(pos, piece) {
      document
        .getElementsByClassName(`${pos[0]} ${pos[1]}`)[0]
        .classList.add(piece);
    }
  
    createSq(order, row, col) {
      const square = document.createElement("button");
      square.classList.add(row, col, "square");
      if (order % 2) square.classList.add("black");
      else square.classList.add("white");
  
      square.classList.add("square");
  
      return square;
    }
  
    initializeBoard() {
      let rowArr = ["8", "7", "6", "5", "4", "3", "2", "1"];
      let colArr = ["A", "B", "C", "D", "E", "F", "G", "H"];
  
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          this.chessDiv.appendChild(this.createSq(i + j, rowArr[i], colArr[j]));
        }
      }
    }
  
    checkIfIsEmpty(square) {
      let classes = square.className.split(" ");
      let lastElement = classes.slice(-1)[0];
      return lastElement === "white" || lastElement === "black";
    }
  
    checkIfSelectedEnemyPiece(square) {
      let piece = [...square.classList].slice(-1)[0];
      let out = (piece[0] === "b") === this.isWhitesTurn;
      return out;
    }
  
    // listener shouldn't do all the logic, it should call the logic only if nessesary.
    // the way it works now, each time everything is calculated to every square
    // it would be better to do it only after you click the button
  
    addListenersToSquares() {
      [...this.chessDiv.children].forEach((square) => {
        square.addEventListener("click", () => {
          let classNames = square.className.split(" ");
          let [row, col, ..._] = classNames;
          let empty = this.checkIfIsEmpty(square);
          console.log('click')
  
          // if you select an empty square, and no piece prior
          if (!this.selectedPiece && empty) {
            this.notifications.sendNotification(
              "Selected empty square. Select your piece first.",
              "danger"
            );
          }
  
          // if you have selected a piece, but then selected another
          // it means that you either want to attack enemy piece, or
          // want to change a piece you want to move
          // also check if move is valid
          else if (this.selectedPiece && !empty) {
            if (this.checkIfSelectedEnemyPiece(square)) {
              this.notifications.sendNotification(
                `You want to attack ${row}${col}`,
                "info"
              );
              initializeNextTurn();
            } else {
              this.notifications.sendNotification(
                `You switched a piece you control to ${row}${col}`,
                "info"
              );
              this.selectedPiece = square;
            }
          }
  
          // if you selected a piece and then empty square
          // we have to check if the move is valid
          else if (this.selectedPiece && empty) {
            this.notifications.sendNotification(`You moved to ${row}${col}`);
            this.selectedSquare = square;
            this.moviePiece(this.selectedPiece, this.selectedSquare);
            this.initializeNextTurn();
          }
  
          // it is the first piece you selected
          // check if you selected a piece of your color
          else if (!this.selectedSquare && !empty) {
            if (this.checkIfSelectedEnemyPiece(square)) {
              this.notifications.sendNotification(
                "Selected enemy piece. First select your piece",
                "danger"
              );
            } else {
              this.selectedPiece = square;
              this.notifications.sendNotification(
                `Selected ${row}${col}`,
                "info"
              );
            }
          }
        });
      });
    }
  
    moviePiece() {
      let pieceName = this.selectedPieceName;
      this.selectedPiece.classList.remove(pieceName);
      this.selectedSquare.classList.add(pieceName);
    }
  
    get selectedPiecePos() {
      let [pieceRow, pieceCol, ..._] = [...this.selectedPiece.classList];
      return `${pieceRow} ${pieceCol}`;
    }
  
    get selectedSquarePos() {
      let [pieceRow, pieceCol, ..._] = [...selectedSquare.classList];
      return `${pieceRow} ${pieceCol}`;
    }
  
    get selectedPieceName() {
      return this.selectedPiece.classList.item(4);
    }
  }
  