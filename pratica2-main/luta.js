const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const width = 675;
const height = 353;
ctx.width = width;
ctx.height = height;

const intervalo = 10;
let tempo = 0;
const maxtempo = 10000;

const somMove = new Audio("chute.ogg");
const somPancada = new Audio("pancada.ogg");
const somAh = new Audio("ah.ogg");

function Personagem(imagem, x, y, h, w) {
    this.x = x;
    this.y = y;
    this.estado = 0;
    this.img = new Image();
    this.img.src = imagem;
    this.width = w;
    this.height = h;
}

function Estado(ini, fini, sx, sy, vel) {
    this.frameIni = ini;
    this.frameFim = fini;
    this.num = ini;
    this.sx = sx;
    this.sy = sy;
    this.velocidade = vel;
    this.transx = 0;
    this.transy = 0;
    this.tabelatrans;

    this.prox = function () {
        if (this.num === this.frameFim) {
            this.num = this.frameIni;
        }
        else {
            this.num = this.num + 1;
            this.trans();
        }
    }
    this.muda = function () {
        var x = tempo / this.velocidade;
        if (x - Math.floor(x) > 0) return false;
        else return true;;

    }
    this.trans = function () {
        if (this.tabelatrans == undefined) {
            this.transx = 0;
            this.transy = 0;
        } else {
            this.transx = this.tabelatrans[this.num].x;
            this.transy = this.tabelatrans[this.num].y;
        }
    }
}

const fundo = new function () {
    this.img = new Image();
    this.img.src = 'fundonoite.png';
    this.desenha = function () {
        ctx.drawImage(this.img, 0, 0);
    }
}

const santa = new function () {
    this.agente = new Personagem('Idle.png', 150, 150, 249, 169);
    this.frames = 1;
    this.corrente = 0;
    this.estados = new Array();
    this.estados[0] = new Estado(0, 0, 0, 0, 500);

    this.estados[1] = new Estado(1, 1, 0, 0, 100);
    this.estados[1].tabelatrans = new Array();
    this.estados[1].tabelatrans[0] = new Object();
    this.estados[1].tabelatrans[0].x = 0;
    this.estados[1].tabelatrans[0].y = 0;

    this.desenha = function () {
        const sx = this.agente.width * this.estados[this.corrente].num + this.estados[this.corrente].sx;
        if (this.estados[this.corrente].muda()) this.estados[this.corrente].prox();
        try {
            ctx.save();
            ctx.translate(this.estados[this.corrente].transx, this.estados[this.corrente].transy)
            ctx.drawImage(this.agente.img, sx, 0, this.agente.width, this.agente.height,
                this.agente.x, this.agente.y, this.agente.width, this.agente.height);
            ctx.restore();

        } catch (e) {
            alert(e.toString());
        }
        this.calculaProxEstado();
    }

    this.iniciaEstado = function (n) {
        this.corrente = n;
        if (n === 1) {
            this.estados[santa.corrente].num = santa.estados[santa.corrente].frameIni;
            somMove.play();
        }
    }

    this.calculaProxEstado = function () {
        switch (this.corrente) {
            case 1:
                if (this.estados[this.corrente].num ===
                    this.estados[this.corrente].frameFim) {
                    this.corrente = 0;
                }
                break;
            case 0:
                break;
        }
    }

    this.idle = () => {
        this.agente.img.src = 'Idle.png';
        this.agente.y = 150;
    }

    this.jump = () => {
        this.agente.img.src = 'Jump.png';
        this.agente.y = 75;
        setTimeout(this.idle, 250);
    }

    this.down = () => {
        this.agente.img.src = 'Slide.png';
        setTimeout(this.idle, 250);
    }
}

// const lutadora = new function () {
//     this.agente = new Personagem('lutadora.png', 500, 150, 95, 80);
//     this.frames = 5;
//     this.corrente = 0;
//     this.estados = new Array();
//     this.estados[0] = new Estado(0, 1, 0, 0, 1000);

//     this.estados[1] = new Estado(1, 5, 0, 0, 100);

//     this.desenha = function () {
//         const sx = this.agente.width * this.estados[this.corrente].num + this.estados[this.corrente].sx;
//         if (this.estados[this.corrente].muda()) this.estados[this.corrente].prox();
//         try {
//             ctx.save();
//             ctx.translate(this.estados[this.corrente].transx, this.estados[this.corrente].transy)
//             ctx.drawImage(this.agente.img, sx, 0, this.agente.width, this.agente.height,
//                 this.agente.x, this.agente.y, this.agente.width, this.agente.height);
//             ctx.restore();
//         } catch (e) {
//             alert(e.toString());
//         }
//         this.calculaProxEstado();
//     }

//     this.iniciaEstado = function (n) {
//         this.corrente = n;
//     }

//     this.calculaProxEstado = function () {
//         switch (this.corrente) {
//             case 1:
//                 if (this.estados[this.corrente].num ===
//                     this.estados[this.corrente].frameFim) {
//                     this.corrente = 0;
//                 }
//                 break;
//             case 0:
//                 break;
//         }
//     }
// }

function desenha() {
    fundo.desenha();
    santa.desenha();
    // lutadora.desenha();
}

var GameLoop = function () {
    desenha();
    setTimeout(GameLoop, intervalo);
    tempo = tempo + intervalo;
    if (tempo > maxtempo) tempo = 0;
}

document.onkeydown = function (e) {
    const keycode = e.code;

    if (keycode == 'ArrowDown') {
        santa.down();
    } else if (keycode == 'ArrowUp') {
        santa.jump();
    }
}

GameLoop();

