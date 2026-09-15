document.addEventListener('DOMContentLoaded', () => {
  const menuPage = document.getElementById('menuPage');
  const letterPage = document.getElementById('letterPage');
  const futurePage = document.getElementById('futurePage');
  const celebrationPage = document.getElementById('celebrationPage');
  const countdownPage = document.getElementById('countdownPage');
  const videoPage = document.getElementById('videoPage');
  const nextPageButton = document.getElementById('nextPageButton');
  const letter = document.getElementById('letter');
  const questionFooter = document.getElementById('questionFooter');
  const btnYes = document.getElementById('btnYes');
  const btnNo = document.getElementById('btnNo');
  const btnFutureYes = document.getElementById('btnFutureYes');
  const btnFutureNo = document.getElementById('btnFutureNo');
  const photoSurprise = document.getElementById('photoSurprise');
  const photoClose = document.getElementById('photoClose');
  const countdownTimer = document.getElementById('countdownTimer');
  const finalVideo = document.getElementById('finalVideo');
  const bgMusic = document.getElementById('bgMusic');

  const screens = [menuPage, letterPage, futurePage, celebrationPage, countdownPage, videoPage];
  let firstNoAttempts = 0;
  let futureNoAttempts = 0;
  let appStarted = false;
  let countdownStarted = false;

  const letterText = [
    'Si estás leyendo esto, es porque ya pasaste la primera página. Y sí, todo esto lo armé para ti.',
    'No soy el tipo más romántico del mundo, pero quería hacer algo que te hiciera sonreír de verdad. Algo que recordaras.',
    'Porque desde que llegaste, mi vida cambió de una forma que no esperaba. Y aunque a veces no lo diga, cada detalle cuenta.',
    'Tal vez nunca habrá un momento perfecto en la vida para nada, y no quiero que se me pase la vida buscándolo.',
    'Sé lo que quiero en mi futuro y te quiero a ti. Con mis errores y virtudes, eres lo que me ayuda a ser mejor y me motiva a mejorar.',
    'Te amo, Paloma.',
    'Este es mi momento para decírtelo y embarcarnos en lo que traiga la vida. Desconozco el futuro, pero quiero vivirlo contigo.',
    'Así que... aquí va la pregunta importante.'
  ];

  function showScreen(target) {
    screens.forEach((screen) => {
      screen.hidden = screen !== target;
    });

    target.classList.remove('screen-restart');
    void target.offsetWidth;
    target.classList.add('screen-restart');
  }

  function sleep(ms) {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
  }

  function typeText(text, target, speed = 27) {
    return new Promise((resolve) => {
      let index = 0;

      function type() {
        if (index < text.length) {
          target.textContent += text[index];
          index += 1;
          window.setTimeout(type, speed);
        } else {
          resolve();
        }
      }

      type();
    });
  }

  async function showLetter() {
    letter.innerHTML = '';
    questionFooter.hidden = true;

    for (const paragraphText of letterText) {
      const paragraph = document.createElement('p');
      letter.appendChild(paragraph);
      await typeText(paragraphText, paragraph);
      await sleep(450);
    }

    questionFooter.hidden = false;
  }

  function resetButton(button) {
    button.style.position = '';
    button.style.left = '';
    button.style.top = '';
    button.style.zIndex = '';
  }

  function moveButton(button) {
    const width = button.offsetWidth || 120;
    const height = button.offsetHeight || 50;
    const margin = 15;
    const maxX = Math.max(margin, window.innerWidth - width - margin);
    const maxY = Math.max(margin, window.innerHeight - height - margin);

    button.style.position = 'fixed';
    button.style.left = `${Math.floor(margin + Math.random() * (maxX - margin))}px`;
    button.style.top = `${Math.floor(margin + Math.random() * (maxY - margin))}px`;
    button.style.zIndex = '500';
  }

  function openFac(button) {
    resetButton(button);
    photoSurprise.hidden = false;
  }

  function closeFac() {
    photoSurprise.hidden = true;
  }

  function startCountdown() {
    if (countdownStarted) return;
    countdownStarted = true;

    showScreen(countdownPage);
    let seconds = 5;
    countdownTimer.textContent = String(seconds);

    const interval = window.setInterval(() => {
      seconds -= 1;

      if (seconds > 0) {
        countdownTimer.textContent = String(seconds);
        return;
      }

      window.clearInterval(interval);
      showScreen(videoPage);
      finalVideo.play().catch(() => {});
    }, 1000);
  }

  function showCelebration() {
    resetButton(btnFutureNo);
    showScreen(celebrationPage);
    window.setTimeout(startCountdown, 7000);
  }

  nextPageButton.addEventListener('click', async () => {
    if (appStarted) return;

    appStarted = true;
    showScreen(letterPage);

    if (bgMusic) {
      bgMusic.volume = 0.5;
      bgMusic.play().catch(() => {});
    }

    await showLetter();
  });

  btnYes.addEventListener('click', () => {
    resetButton(btnNo);
    showScreen(futurePage);
  });

  btnNo.addEventListener('click', () => {
    firstNoAttempts += 1;

    if (firstNoAttempts < 3) {
      moveButton(btnNo);
    } else {
      firstNoAttempts = 0;
      openFac(btnNo);
    }
  });

  btnFutureYes.addEventListener('click', showCelebration);

  btnFutureNo.addEventListener('click', () => {
    futureNoAttempts += 1;

    if (futureNoAttempts < 3) {
      moveButton(btnFutureNo);
    } else {
      futureNoAttempts = 0;
      openFac(btnFutureNo);
    }
  });

  photoClose.addEventListener('click', closeFac);

  photoSurprise.addEventListener('click', (event) => {
    if (event.target === photoSurprise) {
      closeFac();
    }
  });
});