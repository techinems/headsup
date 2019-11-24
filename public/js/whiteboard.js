/* global moment, io, EmojiConvertor */

function updateCrew(crewResponse) {
    let crew = crewResponse;
    if (!crew.success) {
        console.error('Failed to fetch!');
    } else {
        crew = crew.data[0];
        const riderRadioNums = [993, 992];
        // Sets the rider's radionums to 992 and 993 if they don't have one
        crew.rider1rn = crew.rider1rn == 0 ? riderRadioNums.pop() : crew.rider1rn;
        crew.rider2rn = crew.rider2rn == 0 ? riderRadioNums.pop() : crew.rider2rn;
        document.querySelector('#cc').innerHTML = crew.cc;
        document.querySelector('#cc-rn').innerHTML = crew.ccrn;
        document.querySelector('#driver').innerHTML = crew.driver;
        document.querySelector('#driver-rn').innerHTML = crew.driverrn;
        document.querySelector('#rider1').innerHTML = crew.rider1;
        document.querySelector('#rider1-rn').innerHTML = crew.rider1rn;
        document.querySelector('#rider2').innerHTML = crew.rider2;
        document.querySelector('#rider2-rn').innerHTML = crew.rider2rn;
    }
}

function updateNotes(noteResponse) {
    let emoji = new EmojiConvertor();
    emoji.init_env();
    emoji.replace_mode = 'unified';
    emoji.allow_native = true;
    document.querySelector('#notes').innerHTML = '';
    const notes = noteResponse.data;
    for (const note of notes) {
        const span = document.createElement('span');
        const paragraph = document.createElement('p');
        paragraph.textContent = emoji.replace_colons(note.note);
        span.appendChild(paragraph);
        document.querySelector('#notes').appendChild(span);
    }
}

function updateCallCount({callCount}) {
    document.querySelector('#total-count').innerHTML = callCount;
}

function updateDate() {
    const todaysDate = moment();
    document.querySelector('#date').innerHTML = todaysDate.format('D MMM YY');
    document.querySelector('#time').innerHTML = todaysDate.format('HH:mm');
}

function updateChores(choreList) {
    let emoji = new EmojiConvertor();
    emoji.init_env();
    emoji.replace_mode = 'unified';
    emoji.allow_native = true;
    const choreDiv = document.querySelector('#chores');
    choreDiv.innerHTML = '';
    if (choreList.length === 0) {
        choreDiv.innerHTML = '<span>No chores tonight!</span>';
    } else {
        const ul = document.createElement('ul');
        for (const chore of choreList) {
            const li = document.createElement('li');
            li.innerText = emoji.replace_colons(chore);
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

socket.on('chores', (choreResponse) => {
    updateChores(choreResponse.chores);
});

// Refreshes the page allowing us to update the UI without ever touching the tv
socket.on('refresh', () => {
    window.location.reload();
});

setInterval(() => {
    updateDate();
}, 2000);
