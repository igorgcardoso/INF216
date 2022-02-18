const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
ctx.width = 2500;
ctx.height = 300;

var nome = navigator.userAgent;
var direita = 39;
var esquerda = 37;

if (nome.indexOf('Chrome') != -1) {
    direita = 100;
    esquerda = 97;
}

var fundo = new function () {
    this.img = new Image();
    this.img.src = 'fundo.png';
    this.iniframe = 0;
    this.w = 200;
    this.h = 30;
    this.length = 10;
}

var nave = new function () {
    this.x = 88;
    this.y = 220;
    this.w = 24;
    this.h = 24;
    this.frame = 1;
    this.img = new Image();
    this.img.src = './player.png';
}

var nuvem = new function () {
    this.img = new Image();
    this.img.src = './nuvem.png';
    this.iniframe = 0;
    this.w = 216;
    this.h = 200;
    this.length = 10;
}

function limpa() {
    ctx.fillStyle = '#d0e7f9';
    ctx.rect(0, 0, ctx.width, ctx.height);
    ctx.fill();
}

function desenha() {
    desenhaFundo();
    desenhaNuvem();
    ctx.drawImage(nave.img, nave.w * nave.frame, 0, nave.w, nave.h, nave.x, nave.y, nave.w, nave.h);
}

function desenhaFundo() {
    for (let i = 0; i < fundo.length; i++) {
        posicaoOrigemY = fundo.h * ((fundo.iniframe + i) % fundo.length);
        y = fundo.h * (fundo.length - i);
        ctx.drawImage(fundo.img, 0, posicaoOrigemY, fundo.w, fundo.h, 0, y, fundo.w, fundo.h);
    }
    fundo.iniframe = (fundo.iniframe + 1) % fundo.length;
}

function desenhaNuvem() {
    for (let i = 0; i < nuvem.length; i++) {
        const posicaoOrigemX = nuvem.w * ((nuvem.iniframe + i) % nuvem.length);
        const x = nuvem.w * (nuvem.length - i);
        ctx.drawImage(nuvem.img, posicaoOrigemX, 0, nuvem.w, nuvem.h, x, 0, nuvem.w, nuvem.h);
    }
    nuvem.iniframe = (nuvem.iniframe + 1) % nuvem.length;
}

var GameLoop = function () {
    desenha();
    setTimeout(GameLoop, 100);
}

GameLoop();


