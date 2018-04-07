'use strict';
var W, H, S = 20;
var snake = [],
  foods = [];
var keyCode = 0;
var point = 0;
var timer = NaN;
var context;
const button = document.getElementById('button');
const canvas = document.getElementById('field');
const cancel = document.getElementById('cancel');
const resultDivided = document.getElementById('result-area');

// Point オブジェクト
function Point(x, y) {
  this.x = x;
  this.y = y;
}

button.onclick = () => {
  W = canvas.width / S;
  H = canvas.height / S;
  context = canvas.getContext('2d');
  context.font = '20px sans-serif';

  // MARK: 蛇の初期化
  snake.push(new Point(W / 2, H / 2));

  // MARK: 餌の初期化
  for (var i = 0; i < 10; i++) {
    addFood();
  }

  timer = setInterval('trick()', 200);
  window.onkeydown = keydown;
};

cancel.onclick = () => {
  location.reload();
}
// MARK: 餌の追加
function addFood() {
  while (true) {
    var x = Math.floor(Math.random() * W);
    var y = Math.floor(Math.random() * H);

    if (isHit(foods, x, y) || isHit(snake, x, y)) {
      continue;
    }

    foods.push(new Point(x, y));
    break;
  }
}

// MARK: 衝突判定
function isHit(data, x, y) {
  for (var i = 0; i < data.length; i++) {
    if (data[i].x == x && data[i].y == y) {
      return true;
    }
  }
  return false;
}

function moveFood(x, y) {
  foods = foods.filter(function (p) {
    return (p.x != x || p.y != y);
  })
  addFood();
}

function trick() {
  var x = snake[0].x;
  var y = snake[0].y;

  switch (keyCode) {
    case 37:
      x--;
      break; // 左
    case 38:
      y--;
      break; // 上
    case 39:
      x++;
      break; // 右
    case 40:
      y++;
      break; // 下
    default:
      paint();
      return;
  }

  // MARK: 自分 or 壁に衝突
  if (isHit(snake, x, y) || x < 0 || x >= W || y < 0 || y >= H) {
    clearInterval(timer);
    paint();
    removeAllChildren(resultDivided);
    const header = document.createElement('h3');
    header.innerText = `合計スコアは、${point}点です。`;
    resultDivided.appendChild(header);
    return;
  }

  // 頭を先頭に追加
  snake.unshift(new Point(x, y));

  if (isHit(foods, x, y)) {
    // MARK: 餌を食べた
    point += 10;
    moveFood(x, y);
  } else {
    // MARK: 食べていない。尻尾削除
    snake.pop();
  }
  paint();
}

function paint() {
  context.clearRect(0, 0, W * S, H * S);
  context.fillStyle = 'rgb(256,0,0)';
  context.fillText(point, S, S * 2);
  context.fillStyle = 'rgb(0,0,255)';

  foods.forEach(function (p) {
    context.fillText("+", p.x * S, (p.y + 1) * S);
  });
  snake.forEach(function (p) {
    context.fillText("★", p.x * S, (p.y + 1) * S);
  });
}

function keydown(event) {
  console.log(event);
  console.log(event.keyCode);
  keyCode = event.keyCode;
}

function removeAllChildren(element) {
  while (element.firstChild) { // 子どもの要素があるかぎり除去
    element.removeChild(element.firstChild);
  }
}