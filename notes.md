## Just before pawn promotion

```js
const save =  {"whoseTurn":"black","boardState":{"0-0":"white-rook","4-3":"white-pawn","0-4":"white-king","0-6":"white-knight","1-0":"white-pawn","5-3":"black-pawn","4-1":"black-pawn","7-1":"white-queen","7-7":"white-pawn","3-3":"white-bishop","3-6":"black-pawn","6-4":"black-king","4-5":"black-bishop","0-1":"white-knight","0-5":"white-bishop","1-6":"black-pawn","0-7":"white-rook","3-1":"white-pawn","4-0":"black-pawn"}}
localStorage.setItem('gameSave', JSON.stringify(save));
```

## Just before castling

```js
const save =  {"boardState":{"1-3":"white-pawn","6-5":"black-pawn","1-5":"white-pawn","6-3":"black-pawn","1-0":"white-pawn","6-0":"black-pawn","7-7":"black-rook","6-6":"black-pawn","6-7":"black-pawn","5-5":"black-knight","5-3":"black-bishop","7-4":"black-king","4-2":"black-pawn","7-0":"black-rook","5-1":"black-pawn","6-1":"black-bishop","3-4":"white-pawn","6-4":"black-queen","1-1":"white-bishop","0-0":"white-rook","0-7":"white-rook","1-6":"white-pawn","1-7":"white-pawn","5-0":"black-knight","2-3":"white-bishop","4-4":"black-pawn","2-5":"white-knight","2-2":"white-pawn","2-1":"white-pawn","2-0":"white-knight","0-4":"white-king","1-2":"white-queen"},"boardInfo":{"whoseTurn":"white","didKingMove":{"white":false,"black":false},"didRookMove":{"a-black":false,"a-white":false,"h-black":false,"h-white":false}}}
localStorage.setItem('gameSave', JSON.stringify(save));
```