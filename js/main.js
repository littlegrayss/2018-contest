function Game() {     
    this.init();    //初始化
}

//初始化
Game.prototype.init = function() {     
    this.deleteAll();
    this.score = 0;    //游戏分数
    this.pieceArr = [];    //棋子数组  
    this.updateScore();    //更新分数
    this.createArray(this.pieceArr); //创建二维数组
    this.createPiece();    //创建一个随机棋子
    this.createPiece();
    this.listenEvent();    //监听键盘事件
    this.liestenTouch();    //监听移动端手指事件
}
//创建二维数组并赋值为0
Game.prototype.createArray = function(arr) {        
    for (var i = 0; i < 4; i++) {
        arr[i] = [];
        for (var j = 0; j < 4; j++) {
            arr[i][j] = 0;
        }
    }    
    return arr;
}
//创建一个随机棋子
Game.prototype.createPiece = function() {
    var num = Math.random()>0.8?4:2;
    var x = Math.floor(Math.random() * 4);
    var y = Math.floor(Math.random() * 4);
    while (this.pieceArr[y][x] != 0 ) { //如果棋盘上已经有棋子，跳过再创建  warn:有可能会溢出
        x = Math.floor(Math.random()*4);
        y = Math.floor(Math.random()*4);
    }    
    this.pieceArr[y][x] = num;   
    var option = {} 
    option.isNew = true;
    option.isMerge = false;
    this.drawPiece(y,x,num,option);    //绘制棋子
}
/*
 * 绘制棋子
 * param1：棋子纵坐标
 * param2：棋子横坐标
 * param3：棋子数字
 * param4: 棋子配置：
 *      sNew: true 新棋子的样式
 *      isMerge: true 合并棋子的样式
 */
Game.prototype.drawPiece = function(y,x,num,option) {
    var option = option || {};
    var isNew = option.isNew|| false;
    var isMerge = option.isMerge || false;
    var chessboard = document.getElementById('chessboard');
    var piece = document.createElement('div');
    piece.id = y + ' ' + x;
    piece.className = 'piece piece-' + num;
    if (isNew) {
        piece.classList.add('new-piece');
    }
    if (isMerge) {
        piece.classList.add('merge-piece');
    }
    piece.textContent = num;
    piece.style.left = x*6 + 'rem';
    piece.style.top = y*6 + 'rem';
    chessboard.appendChild(piece);
}
/*
 * 删除棋子
 * param1：棋子纵坐标
 * param2：棋子横坐标
 */
Game.prototype.deletePiece = function(y, x) {
    var piece = document.getElementById(y + ' ' + x);
    var chessboard = document.getElementById('chessboard');
    if (piece) {
        chessboard.removeChild(piece);
    }
}

//监听上下左右键
Game.prototype.listenEvent = function() {
    var _this = this;
    document.onkeydown = KeyDown;
    function KeyDown(e) {
        var keycode = e.which;        
        console.log(keycode);
        switch(keycode) {
            case 37: { 
                if (_this.canMoveLeft()) { 
                    _this.moveLeft();                   
                    setTimeout(function () {
                        _this.createPiece(); 
                        _this.updateScore();
                        _this.checkWin(); 
                    }, 300) 
                                      
                }     
                
                break;
            }
            case 38: { 
                if (_this.canMoveUp()) {
                    _this.moveUp();
                    setTimeout(function () {
                        _this.createPiece();
                        _this.updateScore();
                        _this.checkWin();
                    }, 300) 
                }
                
                break;
            }
            case 39: { 
                if (_this.canMoveRight()) {
                    _this.moveRight();
                    setTimeout(function () {
                        _this.createPiece();
                        _this.updateScore();
                        _this.checkWin();
                    }, 300) 
                }
                
                break;
            }
            case 40: {                 
                if (_this.canMoveDown()) {
                    _this.moveDown(); 
                    setTimeout(function () {
                        _this.createPiece();
                        _this.updateScore();
                        _this.checkWin();
                    }, 300) 
                }
                
                break;
            }
        }
    }
}
//监听手指移动事件
Game.prototype.liestenTouch = function() {
    var _this = this;
    var startX, startY, endX, endY;
    document.addEventListener('touchstart',touchFn,false);
    document.addEventListener('touchend',touchFn,false);
    function touchFn(e) {
        // e.preventDefault();
        // if (e.cancelable) {
        //     // 判断默认行为是否已经被禁用
        //     if (!e.defaultPrevented) {
        //         e.preventDefault();
        //     }
        // }
        e.stopPropagation();
        var firstTouch = e.changedTouches[0];
        switch(e.type) {
            case 'touchstart': 
                startX = firstTouch.pageX;
                startY = firstTouch.pageY;
                break;
            case 'touchend':
                endX = firstTouch.pageX;
                endY = firstTouch.pageY;
                if (Math.abs(endX - startX) >= Math.abs(endY - startY)) {
                    if (startX - endX >= 25) {
                        if (_this.canMoveLeft()) {
                            _this.moveLeft();
                            setTimeout(function () { _this.createPiece(); }, 300)
                            _this.updateScore();
                            _this.checkWin();
                        }
                    } else if (endX - startX >= 25){
                            if (_this.canMoveRight()) {
                                _this.moveRight();
                                setTimeout(function () { _this.createPiece(); }, 300)
                                _this.updateScore();
                                _this.checkWin();
                            }
                        }
                    
                } else {
                    if (startY - endY >= 25) {
                        
                        if (_this.canMoveUp()) {
                            _this.moveUp();
                            setTimeout(function () { _this.createPiece(); }, 300)
                            _this.updateScore();
                            _this.checkWin();
                        }
                    } else if (endY - startY >= 25){
                        if (_this.canMoveDown()) {
                            _this.moveDown();
                            setTimeout(function () { _this.createPiece(); }, 300)
                            _this.updateScore();
                            _this.checkWin();
                        }
                    }
                }
                
        }

    }
}
//判断是否能左移，能为true，不能返回false
Game.prototype.canMoveUp = function() {
    for (var i = 0; i < 4; i++) {
        for (var j = 1; j < 4; j++) {
            if (this.pieceArr[j][i] != 0) {
                if (this.pieceArr[j - 1][i] === 0 || this.pieceArr[j][i] === this.pieceArr[j - 1][i]) {
                    return true;
                }
            }
        }
    }
    return false;
}
Game.prototype.canMoveLeft = function() {
    for (var i = 0; i < 4; i++) {
        for (var j = 1; j < 4; j++) {
            if (this.pieceArr[i][j] != 0) {
                if (this.pieceArr[i][j - 1] === 0 || this.pieceArr[i][j] === this.pieceArr[i][j - 1]) {
                    return true;
                }
            }
        }
    }
    return false;
}
Game.prototype.canMoveDown = function() {
    for (var i = 0; i < 4; i++) {
        for (var j = 2; j >= 0; j--) {
            if (this.pieceArr[j][i] != 0) {
                if (this.pieceArr[j + 1][i] === 0 || this.pieceArr[j][i] === this.pieceArr[j + 1][i]) {
                    return true;
                }
            }
        }
    }
    return false;
}
Game.prototype.canMoveRight = function() {
    for (var i = 0; i < 4; i++) {
        for (var j = 2; j >=0; j--) {
            if (this.pieceArr[i][j] != 0) {
                if (this.pieceArr[i][j + 1] === 0 || this.pieceArr[i][j] === this.pieceArr[i][j + 1]) {
                    return true;
                }
            }
        }
    }
    return false;
}
Game.prototype.moveUp = function() {
    console.log('上');
    var localScore = this.score;
    for (var i = 0; i < 4; i++) {

        for (var j = 0; j < 4; j++) {

            var next = -1;
            for (var m = j + 1, len = this.pieceArr[i].length; m < len; m++) {

                if (this.pieceArr[m][i] !== 0) {
                    next = m;
                    break;
                }
            }
            if (next !== -1) {
                if (this.pieceArr[j][i] === 0) {
                    
                    this.pieceArr[j][i] = this.pieceArr[next][i];
                    this.movePiece(j, i, next, i, this.pieceArr[next][i]);
                    this.pieceArr[next][i] = 0;
                    j--;
                    console.log(this.pieceArr);
                } else if (this.pieceArr[next][i] === this.pieceArr[j][i]) {
                    localScore += this.pieceArr[j][i]*2;
                    this.mergePiece(j, i, next, i, this.pieceArr[next][i] * 2);                    
                    this.pieceArr[j][i] = this.pieceArr[next][i] + this.pieceArr[j][i];
                    
                    this.pieceArr[next][i] = 0;
                    console.log(this.pieceArr); 
                }     
            }
        }
    }
    this.score = localScore;
}
Game.prototype.moveDown = function() {
    console.log('下');
    var localScore = this.score;
    for (var i = 0; i < 4; i++) {

        for (var j = 3; j >= 0; j--) {

            var next = -1;
            for (var m = j - 1; m >= 0; m--) {

                if (this.pieceArr[m][i] !== 0) {
                    next = m;
                    break;
                }
            }
            if (next !== -1) {
                if (this.pieceArr[j][i] === 0) {
                    this.pieceArr[j][i] = this.pieceArr[next][i];
                    this.movePiece(j, i, next, i, this.pieceArr[next][i]);
                    this.pieceArr[next][i] = 0;
                    j++;
                } else if (this.pieceArr[j][i] === this.pieceArr[next][i]) {
                    localScore += this.pieceArr[j][i]*2;
                    this.mergePiece(j, i, next, i, this.pieceArr[j][i] * 2);
                    this.pieceArr[j][i] = this.pieceArr[j][i] + this.pieceArr[next][i];                    
                    this.pieceArr[next][i] = 0;
                } 
            }
        }
    }
    this.score = localScore;
}
Game.prototype.moveLeft = function() {
    console.log('左'); 
    var localScore = this.score;
    for (var i = 0; i < 4; i++) {       
        
        for (var j = 0; j < 4; j++) {
            
            var next = -1;
            for (var m = j + 1, len = this.pieceArr[i].length; m < len; m++) {
                
                if (this.pieceArr[i][m] !== 0) {
                    next = m;
                    break;
                }
            }
            if (next !== -1) {
                if (this.pieceArr[i][j] === 0) {                    
                    this.pieceArr[i][j] = this.pieceArr[i][next];
                    this.movePiece(i, j, i,next, this.pieceArr[i][next]);
                    this.pieceArr[i][next] = 0;
                    j--;
                }
                else if (this.pieceArr[i][j] === this.pieceArr[i][next]) {
                        this.mergePiece(i, j, i, next,this.pieceArr[i][j] * 2);
                        this.pieceArr[i][j] = this.pieceArr[i][j] + this.pieceArr[i][next];
                        localScore += this.pieceArr[j][i];
                        this.pieceArr[i][next] = 0;
                    }            
                
                
            }
        }
    }
    this.score = localScore;
}
Game.prototype.moveRight = function() {
    console.log('右');
    var localScore = this.score;
    for (var i = 0; i < 4; i++) {

        for (var j = 3; j >= 0; j--) {

            var next = -1;
            for (var m = j - 1; m >= 0; m--) {

                if (this.pieceArr[i][m] !== 0) {
                    next = m;
                    break;
                }
            }
            if (next !== -1) {
                if (this.pieceArr[i][j] === 0) {
                    this.pieceArr[i][j] = this.pieceArr[i][next];
                    this.movePiece(i, j, i, next, this.pieceArr[i][next]);
                    this.pieceArr[i][next] = 0;
                    j++;
                } else if (this.pieceArr[i][j] === this.pieceArr[i][next]) {
                    this.mergePiece(i, j, i, next, this.pieceArr[i][j] * 2);
                    this.pieceArr[i][j] = this.pieceArr[i][j] + this.pieceArr[i][next];
                    localScore += this.pieceArr[j][i];
                    this.pieceArr[i][next] = 0;
                } 
            }
        }
    }
    this.score = localScore;
   
}
/*  移动棋子
 *  param1：  最终移动位置的纵坐标
 *  param2：  最终移动位置的横坐标
 *  param3：  开始移动位置的纵坐标
 *  param4：  开始移动位置的横坐标
 *  param5：  要移动的数字
 */ 
Game.prototype.movePiece = function (toY, toX, fromY, fromX, num) {
    console.log('move');  
    var _this = this; 

    var div = document.getElementById(fromY + ' ' + fromX);
    var x = parseInt(div.style.left)
    var y = parseInt(div.style.top);
    console.log(x, y)
    var timer = null;

    (function () {
        clearInterval(timer);
        console.time('time1')
        timer = setInterval(function () {
            if (x < toX * 6) {
                x = x + 0.5;
                div.style.left = x + 'rem'
            } else if (x > toX * 6) {
                x = x - 0.5;
                div.style.left = x + 'rem'
            }
            if (y < toY * 6) {
                y = y + 0.5;
                div.style.top = y + 'rem'
            } else if (y > toY * 6) {
                y = y - 0.5;
                div.style.top = y + 'rem'
            }
            if (y == toY * 6 && x == toX * 6) {
                clearInterval(timer);
                setTimeout(function () {
                    _this.deletePiece(fromY, fromX);
                    _this.drawPiece(toY, toX, num, false, false)
                    console.timeEnd('time1')
                }, 0)
            }
        }, 10)
    })
    

}
/*  合并棋子
 *  param1：  第一个棋子位置的纵坐标
 *  param2：  第一个棋子位置的横坐标
 *  param3：  第二个棋子位置的纵坐标
 *  param4：  第二个棋子位置的横坐标
 *  param5：  合并后的数字
 */
Game.prototype.mergePiece = function (toY, toX, fromY, fromX,num) {

    console.log('merge');    

    var _this = this;

    var div = document.getElementById(fromY + ' ' + fromX);
    var x = parseInt(div.style.left)
    var y = parseInt(div.style.top);
    console.log(x, y)
    var timer = null;

    (function () {
        clearInterval(timer);
        timer = setInterval(function () {
            if (x < toX * 6) {
                x = x + 0.5;
                div.style.left = x + 'rem'
            } else if (x > toX * 6) {
                x = x - 0.5;
                div.style.left = x + 'rem'
            }
            if (y < toY * 6) {
                y = y + 0.5;
                div.style.top = y + 'rem'
            } else if (y > toY * 6) {
                y = y - 0.5;
                div.style.top = y + 'rem'
            }
            if (y == toY * 6 && x == toX * 6) {
                clearInterval(timer);
                setTimeout(function () {
                    _this.deletePiece(fromY, fromX);
                    _this.deletePiece(toY, toX);
                    _this.drawPiece(toY,toX,num,false,true);
                }, 0)
            }
        }, 10)
    })
   






    // this.deletePiece(fromY,fromX); 
    // this.deletePiece(toY, toX);
    // this.drawPiece(toY,toX,num,false,true);

}
//判断输赢
Game.prototype.checkWin = function() {
    var _this = this;
    function is2048() {
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                if (_this.pieceArr[i][j] === 2048) {    //如果有一个棋子等于2048
                    return true;
                }
            }
        }
        return false;
    }
    if (!is2048()) {  //没有2048
        console.log('no');
        
        if (!this.canMoveDown() && !this.canMoveLeft() && !this.canMoveRight() && !this.canMoveUp()) {    //如果下左右上都不能移动
            clearTimeout(timer)
            var timer = setTimeout(function() {
                 
                _this.again();
            },500)            
        }
    } else {  //有2048
        clearTimeout(timer)
        var timer = setTimeout(function () {
           
            _this.again();
        }, 500) 
    }
    
}
//重来
Game.prototype.again = function() {
    var _this = this;
    var frag = document.createDocumentFragment();

    var wrap = document.createElement('div');
    wrap.className = 'end-wrap';

    var score = document.createElement('h2');
    score.innerText = this.score;

    var btn = document.createElement('button');
    btn.id = 'again';
    btn.className = 'again-btn';
    btn.innerHTML ='重来';
    // var btn = document.getElementById('again')
    btn.addEventListener('click', function() {
        if (_this.score > localStorage.getItem('historyScore')) {
            localStorage.setItem('historyScore', _this.score);
        }
        _this.init();
        var wrap = document.getElementsByClassName('end-wrap')[0];
        var gameWrap = document.getElementsByClassName('game-wrap')[0];
        gameWrap.removeChild(wrap);
    }, false);
    wrap.appendChild(score);
    wrap.appendChild(btn);
    frag.appendChild(wrap);
    var gameWrap = document.getElementsByClassName('game-wrap')[0];
    gameWrap.appendChild(frag);    
}
Game.prototype.deleteAll = function() {
    var chessboard = document.getElementById('chessboard');
    while (chessboard.hasChildNodes()) chessboard.removeChild(chessboard.lastChild);
}
//更新数据
Game.prototype.updateScore = function() {
    var scoreBox = document.getElementById('score');
    scoreBox.innerText = this.score;
    var historyScore = localStorage.getItem('historyScore')
    if (this.score > historyScore) {
        localStorage.setItem('historyScore', this.score);
    }
    var history = document.getElementById('historyScore');
    history.innerText = historyScore || 0;
}
window.onload = function() {
    var game = new Game();
}
