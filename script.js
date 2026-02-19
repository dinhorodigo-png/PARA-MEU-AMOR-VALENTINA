// ==============================
// ✍️ EDITE AQUI (opcional):
// Se você tiver um MP3, coloque ele na pasta e troque o nome abaixo.
// Ex.: const MUSIC_FILE = "musica.mp3";
// ==============================
const MUSIC_FILE = ""; // "" = sem música

// Dicas de edição rápida (textos):
// - No HTML, procure por "✍️ EDITE AQUI".
// - Você também pode editar via JS se quiser, mas não precisa.

const $ = (sel) => document.querySelector(sel);

const modalSurpresa = $("#modalSurpresa");
const modalCarta = $("#modalCarta");

$("#btnSurpresa").addEventListener("click", () => modalSurpresa.showModal());
$("#fecharSurpresa").addEventListener("click", () => modalSurpresa.close());

$("#btnCarta").addEventListener("click", () => modalCarta.showModal());
$("#fecharCarta").addEventListener("click", () => modalCarta.close());

// Fechar modal clicando fora do conteúdo
[modalSurpresa, modalCarta].forEach((dlg) => {
  dlg.addEventListener("click", (e) => {
    const rect = dlg.getBoundingClientRect();
    const clickedInside =
      e.clientX >= rect.left && e.clientX <= rect.right &&
      e.clientY >= rect.top && e.clientY <= rect.bottom;
    if (!clickedInside) dlg.close();
  });
});

// "Outra surpresa" troca o texto (fofinho)
const frases = [
  "Você é meu pedacinho de paz 💗",
  "Seu sorriso melhora meu dia inteiro 😊",
  "Que hoje seja doce igual você 🍰",
  "Você é raridade boa ✨",
  "Te amo mais que ontem e menos que amanhã ♾️"
];
$("#btnOutro").addEventListener("click", () => {
  const el = $("#textoSurpresa");
  el.textContent = frases[Math.floor(Math.random() * frases.length)];
  burstConfetti(140);
});

// Barra de amor animada
const amorBar = $("#amorBar");
let w = 65;
setInterval(() => {
  w += (Math.random() * 8 - 4);
  w = Math.max(55, Math.min(98, w));
  amorBar.style.width = w.toFixed(0) + "%";
}, 1200);

// Música (opcional)
const musicBtn = $("#musicBtn");
const music = $("#music");
let musicOn = false;

function setMusicLabel(){
  musicBtn.textContent = musicOn ? "🎵 Música: ON" : "🎵 Música: OFF";
  musicBtn.setAttribute("aria-pressed", musicOn ? "true" : "false");
}

if (MUSIC_FILE) {
  music.src = MUSIC_FILE;
  musicBtn.style.display = "inline-flex";
} else {
  // se não tiver arquivo, deixa o botão visível mesmo (fica OFF)
  musicBtn.style.display = "inline-flex";
}

musicBtn.addEventListener("click", async () => {
  if (!MUSIC_FILE) {
    alert("Para usar música: coloque um MP3 na pasta e escreva o nome dele em MUSIC_FILE no script.js 🙂");
    return;
  }
  try {
    if (!musicOn) {
      await music.play();
      musicOn = true;
    } else {
      music.pause();
      musicOn = false;
    }
    setMusicLabel();
  } catch {
    alert("Seu navegador bloqueou autoplay. Clique de novo 🙂");
  }
});
setMusicLabel();

// ==============================
// CONFETTI (canvas) - simples e leve
// ==============================
const canvas = $("#confetti");
const ctx = canvas.getContext("2d");
let W, H;

function resize(){
  W = canvas.width = window.innerWidth * devicePixelRatio;
  H = canvas.height = window.innerHeight * devicePixelRatio;
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";
}
window.addEventListener("resize", resize);
resize();

const confetti = [];
const emojis = ["🎊","✨","💖","🌈","🧁","💞","🎂","🌸"];

function addPiece(x, y, big=false){
  confetti.push({
    x, y,
    vx: (Math.random()*2-1) * (big ? 3.6 : 2.3),
    vy: (Math.random()*-3 - 2) * (big ? 1.2 : 1),
    g: 0.09 + Math.random()*0.07,
    r: Math.random()*Math.PI*2,
    vr: (Math.random()*0.2-0.1),
    s: (big ? 26 : 18) * devicePixelRatio,
    t: 160 + Math.random()*40,
    emoji: emojis[Math.floor(Math.random()*emojis.length)]
  });
}

function burstConfetti(n=120){
  const x = (window.innerWidth * 0.5) * devicePixelRatio;
  const y = (window.innerHeight * 0.22) * devicePixelRatio;
  for(let i=0;i<n;i++) addPiece(x, y, true);
}

function loop(){
  ctx.clearRect(0,0,W,H);

  for(let i=confetti.length-1;i>=0;i--){
    const p = confetti[i];
    p.vy += p.g;
    p.x += p.vx;
    p.y += p.vy;
    p.r += p.vr;
    p.t -= 1;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.r);
    ctx.font = `${p.s}px "Fredoka", system-ui`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.globalAlpha = Math.max(0, Math.min(1, p.t/180));
    ctx.fillText(p.emoji, 0, 0);
    ctx.restore();

    if (p.t <= 0 || p.y > H + 50) confetti.splice(i,1);
  }

  requestAnimationFrame(loop);
}
loop();

// Soltar confete ao abrir
window.addEventListener("load", () => burstConfetti(170));
$("#btnCoracoes").addEventListener("click", () => burstConfetti(160));

// Atalho: espaço = mais confete
window.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault();
    burstConfetti(140);
  }
});

// Confete ao clicar em qualquer lugar do site
window.addEventListener("click", (e) => {
  // evita “spam” quando clicar dentro do modal
  if (modalSurpresa.open || modalCarta.open) return;
  const x = e.clientX * devicePixelRatio;
  const y = e.clientY * devicePixelRatio;
  for (let i=0;i<30;i++) addPiece(x, y, false);
});
