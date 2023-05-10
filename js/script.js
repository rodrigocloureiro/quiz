let questions;
const question = document.querySelector('#question');
const alternatives = document.querySelectorAll('.alternative');
const btnNextQuestion = document.querySelector('button');
btnNextQuestion.addEventListener('click', nextQuestion);
const situation = document.querySelector('#situation');
const result = document.querySelector('#resultado');
let count = 0,
    successes = 0;
const modal = document.querySelector("#myModal");
const btn = document.querySelector(".next_btn");
const span = document.querySelector(".close");

span.onclick = function() {
  modal.style.display = "none";
}

function nextQuestion() {
  situation.classList.replace('show', 'hide');
  situation.classList.remove('success', 'mistake');
  alternatives.forEach(el => {
    el.classList.contains('success') ? el.classList.remove('success') : el.classList.remove('mistake');
  });
  if (count < questions.perguntas.length - 1) {
    count++;
  } else {
    modal.style.display = "block";
    result.textContent = `${(successes / questions.perguntas.length) * 100}%`;
    count = 0;
    successes = 0;
  }
  showQuestions();
}

function resetClicks() {
  result.textContent = '';
  alternatives.forEach(el => {
    el.removeEventListener('click', verifyAnswer);
  });
}

function verifyAnswer(e) {
  situation.classList.replace('hide', 'show');
  if (questions.perguntas[count].resposta_correta === e.target.textContent) {
    e.target.classList.add('success');
    situation.classList.add('success');
    situation.textContent = 'Correct..';
    successes += 1;
  }
  else {
    alternatives.forEach(el => {
      if(el.textContent === questions.perguntas[count].resposta_correta)
        el.classList.add('success');
    });
    e.target.classList.add('mistake');
    situation.classList.add('mistake');
    situation.textContent = 'Wrong..';
  }
  btnNextQuestion.disabled = false;
  resetClicks();
}

async function takeQuestions() {
  await fetch('assets/data.json')
    .then(response => response.json())
    .then(data => questions = data)
    .catch(err => console.log(err));

  return questions;
}

function showAlternatives() {
  alternatives.forEach((el, index) => {
    el.textContent = `${questions.perguntas[count].alternativas[index]}`;
    el.addEventListener('click', verifyAnswer);
  });
}

async function showQuestions() {
  questions = await takeQuestions();
  question.textContent = `Question ${questions.perguntas[count].id}: ${questions.perguntas[count].pergunta}`;
  btnNextQuestion.disabled = true;
  showAlternatives();
}

showQuestions();
