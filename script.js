const triviaArray = [];

function loadTrivia() {
    let difficulty, category, questionsAmount;
    // https://opentdb.com/api.php?amount=30&category=22&difficulty=medium
    difficulty = document.getElementById('difficulty-selector').value;
    questionsAmount = document.getElementById('amount-selector').value;
    category = document.getElementById('category-selector').value;
    let questionsSettingAPILink;
    if (category === 'any') {
        questionsSettingAPILink = 'https://opentdb.com/api.php?amount=' + questionsAmount + '&difficulty=' + difficulty;
    } else {
        questionsSettingAPILink = 'https://opentdb.com/api.php?amount=' + questionsAmount + '&category=' + category + '&difficulty=' + difficulty;
    }
    console.log(questionsSettingAPILink);
    fetch(questionsSettingAPILink)
        .then(resp => resp.json())
        .then(createTrivias)
        .catch(err => console.log(err));
    // console.log('https://opentdb.com/api.php?amount=' + questionsAmount + '&category=' + category + '&difficulty=' + difficulty)
    // fetch('https://opentdb.com/api.php?amount=' + questionsAmount + '&category=' + category + '&difficulty=' + difficulty)
    //     .then(resp => resp.json())
    //     .then(createTrivias)
    //     .catch(err => console.log(err));
}

function createTrivias(data) {
    const results = data.results;

    for (const res of results) {
        const trivia = new Trivia(res.category, res.type, res.difficulty, res.question, res.correct_answer, res.incorrect_answers);
        triviaArray.push(trivia);
    }

    console.log(triviaArray);
    displayTrivia(triviaArray);
}


function displayTrivia() {
    const list = document.getElementById('question-container');
    for (const [i, trivia] of triviaArray.entries()) {
        let liElement = createTriviaListElement(trivia, i);
        list.appendChild(liElement);
    }
}


function createTriviaListElement(trivia, questionId) {
    let liElement = document.createElement('div');
    let span = document.createElement('span');

    liElement.className += "question-div";
    span.className += "question-text";
    span.style.fontWeight = 'bold';

    let textNode = document.createTextNode(formattedTextFromTextArea(trivia.question));

    span.appendChild(textNode);
    liElement.appendChild(span)

    let answersList = createAnswersList(trivia.getAllAnswers(), questionId)

    liElement.appendChild(answersList);

    return liElement;
}

function createAnswersList(answers, questionId) {
    let answerList = document.createElement('ul');
    answerList.id = "answers-q" + questionId;
    
    for (const answ of answers) {
        let liElement = createAnswerListElement(formattedTextFromTextArea(answ), questionId, answerList.id);     
        answerList.appendChild(liElement);
    }

    return answerList;
}

function createAnswerListElement(answ, questionId, answersContainerId) {
    let liElement = document.createElement('button');
    liElement.addEventListener('click', (event) => checkIfRight(event, questionId, answersContainerId, liElement));
    
    let span = document.createElement('span');
    let textNode = document.createTextNode(answ);

    span.clickable = false;

    //liElement.text(textNode);
    span.appendChild(textNode);
    liElement.appendChild(span);
    //liElement.appendChild(breakLine);
    return liElement;
}

function formattedTextFromTextArea(text){
        var txt = document.createElement('textarea');
        txt.innerHTML = text;
        return txt.value;
}

let points = 0;
let questionsDone = 0;

function checkIfRight(event, questionId, answersContainerId, button) {
    event.stopPropagation();
    console.log(event);
    let answerText = event.target.firstChild.textContent;
    let currentTriva = triviaArray[questionId];
    let isCorrect = currentTriva.checkAnswer(answerText);
    if (isCorrect) {
        points++;
        button.style.backgroundColor = 'green';
    } else {
        button.style.backgroundColor = 'red';
    }
    const answersContainer = document.getElementById(answersContainerId);
    const answersButtons = answersContainer.children;
    for (const answerButton of answersButtons) {
        console.log(answerButton);
        if (!isCorrect && answerButton.textContent === currentTriva.correctAnswer) {
            answerButton.style.backgroundColor = 'green';
        }
        answerButton.disabled = true;
        answerButton.style.color = 'white';
    }
    questionsDone++;
    if (questionsDone === triviaArray.length) {
        //alert('Hai risposto a tutto!')
        this.showResult();
    }
    if (triviaArray.length !== 0){
        document.getElementById('start-trivia').disabled = true;
    }
}

function showResult() {
    // Get the modal
    const modal = document.getElementById('resultModal');
    modal.style.display = 'flex';

    const modalContent = document.getElementById('modal-content');
    
    const image = document.getElementById('image-result');

    const pointsText = document.createElement('p');
    pointsText.className = 'points-done';

    const resultText = document.createElement('p');
    resultText.className = 'points-done';

    pointsText.innerHTML = '';
    resultText.innerHTML = '';

    // Get the <span> element that closes the modal
    const span = document.getElementsByClassName("close")[0];

    // When the user clicks the button, open the modal
    //modal.style.display = "block";

    let questionsNumber = triviaArray.length;
    if (points >=0 && points <= (questionsNumber / 3)) {
        image.src = './sad-face.png';
        pointsText.appendChild(document.createTextNode(points + ' / ' + (triviaArray.length)));
        resultText.appendChild(document.createTextNode('Sei proprio scarso!'));

        modalContent.appendChild(pointsText);
        modalContent.appendChild(resultText);
    }

    if (points >= (questionsNumber / 3)+1 && points <= (questionsNumber / 3)+(questionsNumber / 3)) {
        image.src = './neutral-face.jpg';
        pointsText.appendChild(document.createTextNode(points + ' / ' + (triviaArray.length)));
        resultText.appendChild(document.createTextNode('Potresti fare meglio..'));

        modalContent.appendChild(pointsText);
        modalContent.appendChild(resultText);
    }

    if (points >= (questionsNumber / 3)+(questionsNumber / 3) && points <= questionsNumber) {
        image.src = './happy-face.jpg';
        pointsText.appendChild(document.createTextNode(points + ' / ' + (triviaArray.length)));
        resultText.appendChild(document.createTextNode('Sei un campione!'));

        modalContent.appendChild(pointsText);
        modalContent.appendChild(resultText);
    }

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.style.display = "none";

        pointsText.innerHTML = '';
        resultText.innerHTML = '';
        location.reload();
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = 'none';

            pointsText.innerHTML = '';
            resultText.innerHTML = '';
            location.reload();
        }
    }
}

var timeleft = 60;
var downloadTimer = setInterval(function(){
  if(timeleft <= 0){
    clearInterval(downloadTimer);
    document.getElementById("countdown").innerHTML = "Il tempo è terminato";
    showResult();
  }
  document.getElementById("progressBar").value = 60 - timeleft;
  document.getElementById("countdown").innerHTML = timeleft + " secondi rimanenti";
  timeleft -= 1;
}, 1000);

var userLang = document.getElementsByTagName("html")[0].getAttribute("lang");

if (window.location.href.indexOf("translate") != -1){
    userLang = it;
}

if(userLang == "en"){
    if (confirm('This website is addressed to italian users. Do you want to get a live translated version?')) {
        window.open('https://ferrucogo-github-io.translate.goog/OpenTriviaAPI/?_x_tr_sl=en&_x_tr_tl=it&_x_tr_hl=it&_x_tr_pto=wapp', '_self');
      } else {
        //console.log('Nothing.');
      }
}
