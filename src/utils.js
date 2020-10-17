function sqIdToRowCol(sqId) {
    let [row, col] = sqId.split("-");
    return [parseInt(row), parseInt(col)];
  }
 
  
  
  // this is just dumb
  // I have to find another way of doing things
module.exports  ={
    sqIdToRowCol,
}