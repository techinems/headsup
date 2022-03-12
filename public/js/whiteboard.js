/* global moment, io, SunCalc */

const longitude = -73.675770;
const latitude = 42.729270;
// 30 minutes in milliseconds (60000 ms in 1 min)
const thirtyMinutes = 60000 * 30;

function cleanRadioNum(id, rn) {
    return id > 0 ? rn : '';
}

function checkRiderNum(id, rn, radioNums) {
    if (id > 0 && rn == 0) {
        return radioNums.pop();
    } else {
        return rn;
    }
}

function updateCrew(crewResponse) {
    let crew = crewResponse;
    if (!crew.success) {
        console.error('Failed to fetch!');
    } else {
        const riderRadioNums = [993, 992];
        // Sets the rider's radionums to 992 and 993 if they don't have one
        crew.attendant.rn = checkRiderNum(crew.attendant.id, crew.attendant.rn, riderRadioNums);
        crew.observer.rn = checkRiderNum(crew.observer.id, crew.observer.rn, riderRadioNums);
        document.querySelector('#cc').innerHTML = crew.cc.name;
        document.querySelector('#cc-rn').innerHTML = cleanRadioNum(crew.cc.id, crew.cc.rn);
        document.querySelector('#driver').innerHTML = crew.driver.name;
        document.querySelector('#driver-rn').innerHTML = cleanRadioNum(crew.driver.id, crew.driver.rn);
        document.querySelector('#rider1').innerHTML = crew.attendant.name;
        document.querySelector('#rider1-rn').innerHTML = cleanRadioNum(crew.attendant.id, crew.attendant.rn);
        document.querySelector('#rider2').innerHTML = crew.observer.name;
        document.querySelector('#rider2-rn').innerHTML = cleanRadioNum(crew.observer.id, crew.observer.rn);
        document.querySelector('#dutysup').innerHTML = crew.dutysup.name;
        document.querySelector('#dutysup-rn').innerHTML = cleanRadioNum(crew.dutysup.id, crew.dutysup.rn);
    }
}

function updateNotes(noteResponse) {
    document.querySelector('#notes').innerHTML = '';
    const notes = noteResponse.data;
    for (const note of notes) {
        const p = document.createElement('p');
        p.textContent = note.note;
        document.querySelector('#notes').appendChild(p);
    }
}

function updateCallCount({data}) {
    document.querySelector('#total-count').innerHTML = data;
}

function updateMishapCount({data}) {
    document.querySelector('#total-mishaps').innerHTML = data;
}

function updateDate() {
    const todaysDate = moment();
    document.querySelector('#date').innerHTML = todaysDate.format('D MMM YY');
    document.querySelector('#time').innerHTML = todaysDate.format('HH:mm');

    const times = SunCalc.getTimes(new Date(), latitude, longitude);
    const now = Date.now();
    // if the current time falls between 30 minutes after sunrise and
    // 30 minutes after sunset, then we use the light stylesheet, otherwise
    // use the dark stylesheet. After updating the media attribute, all
    // styles are re-applied on the page.
    if (
        (times.sunrise.getTime() + thirtyMinutes) <= now
        && now < (times.sunset.getTime() + thirtyMinutes)
    ) {
        document.getElementById('stylesheet-light').media = '';
        document.getElementById('stylesheet-dark').media = 'none';
    }
    else {
        document.getElementById('stylesheet-dark').media = '';
        document.getElementById('stylesheet-light').media = 'none';
    }
}

function updateChores(choreList) {
    const choreDiv = document.querySelector('#chores');
    choreDiv.innerHTML = '';
    if (choreList.length === 0) {
        choreDiv.innerHTML = '<span>No chores tonight!</span>';
    } else {
        const ul = document.createElement('ul');
        for (const chore of choreList) {
            const li = document.createElement('li');
            li.innerText = chore;
            ul.appendChild(li);
        }
        choreDiv.appendChild(ul);
    }
}

updateDate();

const socket = io.connect();
socket.on('notes', (noteResponse) => {
    updateNotes(noteResponse);
});

socket.on('crews', (crewResponse) => {
    updateCrew(crewResponse);
});

socket.on('calls', (callResponse) => {
    updateCallCount(callResponse);
});

socket.on('mishaps', (mishapResponse) => {
    updateMishapCount(mishapResponse);
});

socket.on('chores', (choreResponse) => {
    updateChores(choreResponse.chores);
});

// Refreshes the page allowing us to update the UI without ever touching the tv
socket.on('refresh', () => window.location.reload());

setInterval(() => updateDate(), 2000);
