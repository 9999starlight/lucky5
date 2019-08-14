class UI {
    constructor() {
        this.drawnNumbersDiv = document.querySelector('.drawnNumbers');
        this.ticketsList = document.querySelector('.ticketsList');
        this.addBtn = document.querySelector('#addBtn');
        this.playBtn = document.querySelector('#playBtn');
        this.betValue = document.querySelector('#betValue');
        this.overlay = document.querySelector('.overlay');
        this.calculateBets = document.querySelector('#calculateBets');
        this.calculateWins = document.querySelector('#calculateWins');
        this.calculateTotal = document.querySelector('#calculateTotal');
        this.resultBody = document.querySelector('.resultBody');
        this.numbersToPick = '';
        this.oneTicketBet = '';
    }

    lightTheme() {
        document.querySelectorAll('.wrapper').forEach(w => this.toggleClasses(w, 'dark', 'light'));
        this.toggleClasses(document.body, 'dark', 'light');
    }

    darkTheme() {
        document.querySelectorAll('.wrapper').forEach(w => this.toggleClasses(w, 'light', 'dark'));
        this.toggleClasses(document.body, 'light', 'dark');
    }

    addClass(item, classToAdd) {
        item.classList.add(classToAdd);
    }

    toggleClasses(item, classToRemove, classToAdd) {
        item.classList.remove(classToRemove);
        item.classList.add(classToAdd);
    }

    // UI settings for the beggining of the game
    createNumbersSelection() {
        this.drawnNumbersDiv.innerHTML = '';
        let output = '';
        selectionArray.forEach(num => {
            output += `<div class = "numberDiv numbersToPick flex center">${num}</div>`
        });
        document.querySelector('.numbersSelection').innerHTML = output;
        this.numbersToPick = document.querySelectorAll('.numbersToPick');
        this.toggleClasses(this.addBtn, 'hide', 'flex');
        this.toggleClasses(this.playBtn, 'flex', 'hide');
        this.ticketsList.innerHTML = '';
        this.createTicketDiv();
    }

    createTicketDiv() {
        this.ticketsList.innerHTML +=
            `<div class = "oneTicket flex">
        <div class = "oneTicketNumbers flex"></div><div class = "bet flex"></div>
        </div>`;
    }

    appendNumber() {
        let output = '';
        oneTicket.numbersPlayed.forEach(number => {
            output = `<div class = "ticketNumber flex center">${number}</div>`
        });
        const oneTicketNumbers = document.querySelectorAll('.oneTicketNumbers');
        oneTicketNumbers[oneTicketNumbers.length - 1].innerHTML += output;
    }

    appendBet() {
        this.oneTicketBet = document.querySelectorAll('.bet');
        this.oneTicketBet[this.oneTicketBet.length - 1].innerHTML = oneTicket.bet;
    }

    openWarn(info) {
        this.toggleClasses(this.overlay, 'hide', 'flex');
        document.querySelector('.alertText').innerText = info;
        this.toggleClasses(document.querySelector('.alert'), 'hide', 'flex');
    }

    resultDisplay(nums, lost, winAmount, difference) {
        const cloned = document.querySelector('.ticketsContainer').cloneNode(true);
        this.resultBody.innerHTML += `
        <h2 class="mb1">Result</h2>
        <h4>Bet amount: ${lost}</h4>
        <h4>Won: ${winAmount}</h4>
        <h4 class = "mb1">Total: ${difference}</h4>
        <h4 class = "mb1">Drawn numbers: ${nums}</h4>
        <div class = "allTickets"><div>`
        document.querySelector('.allTickets').appendChild(cloned);
    }
}