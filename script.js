//paste: python3 -m http.server
//goto: http://localhost:8000
//if in codespace paste: python -m http.server
//and do normal
// e is edit, h is help, i is quick import

let grid;
let cols;
let rows;
let resolution = 15; // Size of each cell
let running = false;
let speed = 6;
let born = [3];
let survive = [2, 3];
let set = -1;

function setup() {
  createCanvas(windowWidth, windowHeight - 50);
  cols = floor(width / resolution);
  rows = floor(height / resolution);

  grid = make2DArray(cols, rows);
  randomizeGrid();
}

function draw() {
  background(240); // Light gray background
  // 1. Draw the grid
  for(let i = 0; i < cols; i++){
    for(let j = 0; j < rows; j++){
      if(grid[i][j] == 1){
        fill(255, 255, 255);
      } else {
        fill(40, 40, 40);
      }
      noStroke;
      rect(i * resolution, j * resolution, resolution, resolution);
    }
  }
  // 2. Compute next state (if not paused)
  if(running && frameCount % speed == 0){
    //console.log("step")
    step();
  }


}

// --- INTERACTIVE CONTROLS ---

// 1. Click or Drag to Draw
function mousePressed() {
  setCell(set);
}

function mouseDragged() {
  setCell(set);
}

function toggleCell() {
  let TX = Math.floor(mouseX / resolution);
  let TY = Math.floor(mouseY / resolution);
  grid[TX][TY] += 1;
  grid[TX][TY] = grid[TX][TY] % 2;
}

// 2. Keyboard Controls
function keyPressed() {
  if(key === "r"){
    running = !running;
    //console.log(running);
  }
  if(key === "d"){
    setGrid(0);
  }
  if(key === "a"){
    setGrid(1);
  }
  if(key === "s"){
    step();
  }
  if(key === "e"){
    edit();
  }
  if(key === "i"){
    imp();
  }
  set = key;
}

// --- HELPER FUNCTIONS ---

function make2DArray(cols, rows) {
  let arr = new Array(cols);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows).fill(0);
  }
  return arr;
}

function randomizeGrid() {
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = floor(random(2));
    }
  }
}

function setGrid(state) {
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = state;
    }
  }
}

function countNeighbors(x, y) {
  let ans = 0;
  for(let i = x - 1; i <= x + 1; i++){
    for(let j = y -1 ; j<= y + 1; j++){
      if (!(i == x && j == y)){
        try {
          if(grid[i][j] == 1.1 || grid[i][j] == 0.9 || grid[i][j] == 1){
            ans += 1;
          }
        } catch {
          //console.log("Out of bounds");
        }
      }
    }
  }
  return ans;
}

function step(){
  for(let i = 0; i < cols; i++){
      for(let j = 0; j < rows; j++){
        let negbors = countNeighbors(i, j);
        if((survive.includes(negbors) && grid[i][j] == 1) || (born.includes(negbors) && grid[i][j] == 0)){
          if(grid[i][j] == 1){
            grid[i][j] = 1.1;
            //console.log("alive, survivng");
          } else {
            grid[i][j] = 0.1
            //console.log("dead, born");
          }
        } else {
          if(grid[i][j] == 1){
            grid[i][j] = 0.9;
            //console.log("alive, dying");
          } else {
            grid[i][j] = -0.1;
            //console.log("dead, staying");
          }
        }
      }
    }
    for(let i = 0; i < cols; i++){
      for(let j = 0; j < rows; j++){
        if (grid[i][j] == 0.1 || grid[i][j] == 1.1){
          grid[i][j] = 1;
        } else {
          grid[i][j] = 0;
        }
      }
    }
}

function edit(){
  speed = prompt("How many seconds between generations?");
  speed *= 60;
  if(prompt("Noise?") == true){
    randomizeGrid();
  }
}

function imp(){
  let rules = prompt("Paste rules here in format b#/s#(case-sensitive)");
  let slash = rules.indexOf("/");
  born = [];
  survive = [];
  for(let i = 1; i < slash; i++){
    born += rules[i];
  }
  for(let i = slash + 1; i < rules.length; i++){
    survive += rules[i];
  }
}

function setCell(to){
  let TX = Math.floor(mouseX / resolution);
  let TY = Math.floor(mouseY / resolution);
  if(to == 0){
    grid[TX][TY] = 0;
  } else if(to == 1){
    grid[TX][TY] = 1;
  } else {
    toggleCell();
  }
}