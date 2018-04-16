function Game() { 
    this.score = 0;    //游戏分数
    this.max = 0;    //最大的棋子
    this.pieceArr = [];    //棋子数组
    this.init();    //初始化
}

//初始化
Game.prototype.init = function() {   
    this.createArray();    //创建二维数组
    this.createPiece();    //创建一个随机棋子
    this.createPiece();
    this.listenEvent();
}
//创建二维数组并赋值为0
Game.prototype.createArray = function() {    
    for (var i = 0; i < 4; i++) {
        this.pieceArr[i]  = [];
        for (var j = 0; j < 4; j++) {
            this.pieceArr[i][j] = 0;
        }
    }
}
//创建一个随机棋子
Game.prototype.createPiece = function() {
    var num = 2;
    var x = Math.floor(Math.random() * 4);
    var y = Math.floor(Math.random() * 4);
    while (this.pieceArr[y][x] != 0) {    //如果棋盘上已经有棋子，跳过再创建
        x = Math.floor(Math.random()*4);
        y = Math.floor(Math.random()*4);
    }
    this.pieceArr[y][x] = num;    
    this.drawPiece(y,x,num);    //绘制棋子
}
/*
 * 绘制棋子
 * param1：棋子纵坐标
 * param2：棋子横坐标
 * param3：棋子数字
 */
Game.prototype.drawPiece = function(y,x,num) {
    var chessboard = document.getElementById('chessboard');
    var piece = document.createElement('div');
    piece.className = 'piece piece-' + num;
    piece.textContent = num;
    piece.style.left = x*120 + 'px';
    piece.style.top = y*120 + 'px';
    chessboard.appendChild(piece);
}
//监听上下左右键
Game.prototype.listenEvent = function() {
    var _this = this;
    document.onkeydown = KeyDown;
    function KeyDown(e) {
        var keycode = e.which;        
        console.log(keycode);
        switch(keycode) {
            case 37: { _this.moveLeft();break;}
            case 38: { _this.moveUp(); break;}
            case 39: { _this.moveRight(); break;}
            case 40: { _this.moveDown(); break;}
        }
    }
}
Game.prototype.moveUp = function() {
    console.log('上');
}
Game.prototype.moveDown = function() {
    console.log('下');
}
Game.prototype.moveLeft = function() {
    console.log('左'); 
}
Game.prototype.moveRight = function() {
    console.log('右');
}
Game.prototype.movePiece = function() {

}
Game.prototype.mergePiece = function() {

}
Game.prototype.checkWin = function() {

}
Game.prototype.again = function() {

}
window.onload = function() {
    var game = new Game();
}