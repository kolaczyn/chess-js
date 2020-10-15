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
        return piece.name;
    }
    return "";
}

function isInRange(row,col){
    return (0<=row && row <=7 && 0<=col && col <=7)
}

// function isSquareOccupied(row, col, virtualBoard){
//     if (!isSquareEmpty(row,col, virtualBoard))
// }