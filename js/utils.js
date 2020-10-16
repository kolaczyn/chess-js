function sqIdToRowCol(sqId) {
  let [row, col] = sqId.split("-");
  return [parseInt(row), parseInt(col)];
}

function rowColToSqId(row, col) {
  return `${row}-${col}`;
}

function isSquareOccupied(row, col, virtualBoard) {
    let piece = virtualBoard[rowColToSqId(row, col)];
    if (piece){
        return piece.color;
    }
    return "";
}

function isInRange(row,col){
    return (0<=row && row <=7 && 0<=col && col <=7)
}

// this is just dumb
// I have to find another way of doing things
function stringToClass(s) {
  switch (s) {
    case "rook":
      return Rook;
      break;
    case "knight":
      return Knight;
      break;
    case "bishop":
      return Bishop;
      break;
    case "queen":
      return Queen;
      break;
    case "king":
      return King;
      break;
    case "pawn":
      return Pawn;
      break;
    default:
      throw new Error("Invalid piece class name.");
  }
}


// function isSquareOccupied(row, col, virtualBoard){
//     if (!isSquareEmpty(row,col, virtualBoard))
// }