const ui = new UI;
// settings for the game start
let selectionArray, ticketsArray, numbersDrawn;
const createOnStart = () => {
    selectionArray = [];
    ticketsArray = [];
    numbersDrawn = [];
    betValue.value = 1;
    for (let i = 1; i <= 30; i++) {
        selectionArray.push(i);
    }
    ui.createNumbersSelection();
    ui.toggleClasses(ui.playBtn, 'block', 'hide');
    ui.toggleClasses(ui.addBtn, 'hide', 'block');
    ui.numbersToPick.forEach(num => {
        num.addEventListener('click', numberIsPicked);
    })
    ui.playBtn.addEventListener('click', drawNumbers);
    ui.playBtn.classList.remove('disable');
    ui.overlay.addEventListener('click', overlayDisplay);
}

const overlayDisplay = (e) => {
    document.querySelectorAll('.popup').forEach(p => ui.toggleClasses(p, 'flex', 'hide'));
    ui.toggleClasses(e.target, 'flex', 'hide');
    ui.resultBody.innerHTML = '';
}

class Ticket {
    constructor(numbersPlayed, bet) {
        this.numbersPlayed = [];
        this.bet = bet;
    }
}
let oneTicket = new Ticket();

// select numbers; validate bets, add & display tickets
const numberIsPicked = (e) => {
    if (oneTicket.numbersPlayed.length < 5) {
        oneTicket.numbersPlayed.push(Number(e.target.innerText));
        e.target.removeEventListener('click', numberIsPicked);
        ui.toggleClasses(e.target, 'numbersToPick', 'disable');
        ui.appendNumber();
    } else ui.openWarn('You have already added 5 numbers to one ticket. Click "add ticket" button to submit your ticket');
}

const inputValidation = () => {
    const betValidation = /^([1-9][0-9]?|100)$/;
    !betValidation.test(betValue.value) ? ui.openWarn('Enter your bet between 1 and 100') : addTicketToArray();
}

const addTicketToArray = () => {
    if (ticketsArray.length < 5) {
        if (oneTicket.numbersPlayed.length === 0) {
            ui.openWarn('Please select at least 1 maximum 5 numbers');
        } else {
            oneTicket.bet = Number(betValue.value);
            ui.appendBet(oneTicket.bet);
            ticketsArray.push(oneTicket);
            ui.createTicketDiv();
        }
    }
    ui.numbersToPick.forEach(num => {
        num.addEventListener('click', numberIsPicked);
        ui.toggleClasses(num, 'disable', 'numbersToPick');
    })
    if (ticketsArray.length === 5) {
        ui.toggleClasses(ui.addBtn, 'block', 'hide');
        ui.toggleClasses(ui.playBtn, 'hide', 'block');
        ui.numbersToPick.forEach(num => num.removeEventListener('click', numberIsPicked));
    }
    oneTicket = new Ticket([], betValue.value);
}

// draw numbers; overlay on container to prevent interaction;
const drawNumbers = () => {
    ui.playBtn.removeEventListener('click', drawNumbers);
    ui.playBtn.classList.add('disable');
    ui.toggleClasses(ui.overlay, 'hide', 'flex');
    ui.overlay.removeEventListener('click', overlayDisplay);
    ui.ticketsList.removeChild(ui.ticketsList.lastChild);
    let setOfNumbers = new Set();
    while (setOfNumbers.size < 12) {
        let randomNums = Math.floor(Math.random() * 31);
        if (randomNums !== 0)
            setOfNumbers.add(randomNums);
    }
    numbersDrawn = [...setOfNumbers];
    let i = 0;
    (function displayNumbers() {
        ui.drawnNumbersDiv.innerHTML += `<div class= "numberDiv drawnNumber flex center">${numbersDrawn[i]}</div>`;
        if (++i < numbersDrawn.length)
            setTimeout(displayNumbers, 2000);
    })();
    setTimeout(markWins, 25000);
}

// winning/loosing tickets & calculations;
// mark & display results; Restart after result popup has been displayed;
const markWins = () => {
    const wins = [];
    document.querySelectorAll('.ticketNumber').forEach(num => {
        numbersDrawn.some(drawn => {
            if (num.innerText == drawn)
                ui.addClass(num, 'numberHit');
        })
    })
    document.querySelectorAll('.oneTicketNumbers').forEach(ticket => {
        if ([...ticket.children].every(child => child.classList.contains("numberHit"))) {
            let winningTicket = Math.pow(5, ticket.childElementCount) * Number(ticket.nextSibling.innerText);
            wins.push(winningTicket);
            ui.addClass(ticket.parentNode, 'ticketHit');
        } else
            ui.addClass(ticket.parentNode, 'ticketMissed');
    })
    const totalBets = ticketsArray.map(ticket => ticket.bet)
        .reduce((total, bets) => total + bets, 0);
    const won = wins.reduce((total, win) => total + win, 0);
    const total = won - totalBets;
    ui.resultDisplay(numbersDrawn.join(', '), totalBets, won, total);
    ui.calculateBets.value = Number(ui.calculateBets.value) + totalBets;
    ui.calculateWins.value = Number(ui.calculateWins.value) + won;
    ui.calculateTotal.value = Number(ui.calculateTotal.value) + total;
    setTimeout(() => {
        ui.toggleClasses(ui.overlay, 'hide', 'flex');
        ui.toggleClasses(document.querySelector('.resultsPopup'), 'hide', 'flex');
        createOnStart();
    }, 3000)

}

// increment/decrement
document.querySelector('#decrease').addEventListener('click', () => ui.betValue.stepDown());
document.querySelector('#increase').addEventListener('click', () => ui.betValue.stepUp());

// themes switch
document.querySelector('#dark').addEventListener('click', () => ui.darkTheme());
document.querySelector('#light').addEventListener('click', () => ui.lightTheme());

// closing functions & listeners
document.querySelectorAll('.fa-times').forEach(x =>
    x.addEventListener('click', function () {
        ui.toggleClasses(x.parentElement.parentElement, 'flex', 'hide');
        ui.toggleClasses(ui.overlay, 'flex', 'hide');
        ui.resultBody.innerHTML = '';
    }));

document.querySelector('#rules').addEventListener('click', function () {
    ui.toggleClasses(ui.overlay, 'hide', 'flex');
    ui.toggleClasses(document.querySelector('.rules'), 'hide', 'flex');
});

window.addEventListener('load', createOnStart);
ui.addBtn.addEventListener('click', inputValidation);