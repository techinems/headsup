/* global moment, io */

function updateCrew(crew_response) {
    let crew = crew_response;
    if (!crew.success) {
        console.error('Failed to fetch!');
    } else {
        crew = crew.data[0];
        const rider_radio_nums = [993, 992];
        // Sets the rider's radionums to 992 and 993 if they don't have one
        crew.rider1rn = crew.rider1rn == 0 ? rider_radio_nums.pop() : crew.rider1rn;
        crew.rider2rn = crew.rider2rn == 0 ? rider_radio_nums.pop() : crew.rider2rn;
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

function updateNotes(note_response) {
    document.querySelector('#notes').innerHTML = '';
    const notes = note_response.data;
    for (const note of notes) {
        const span = document.createElement('span');
        const paragraph = document.createElement('p');
        paragraph.textContent = note.note;
        span.appendChild(paragraph);
        document.querySelector('#notes').appendChild(span);
    }
}

function updateCallCount({call_count}) {
    document.querySelector('#total-count').innerHTML = call_count;
}

function updateDate() {
    const todays_date = moment();
    document.querySelector('#date').innerHTML = todays_date.format('D MMM YY');
    document.querySelector('#time').innerHTML = todays_date.format('HH:mm');
}

function updateChores(chore_list) {
    const chore_div = document.querySelector('#chores');
    chore_div.innerHTML = '';
    if (chore_list.length === 0) {
        chore_div.innerHTML = '<span>No chores tonight!</span>';
    } else {
        const ul = document.createElement('ul');
        for (const chore of chore_list) {
            const li = document.createElement('li');
            li.innerText = chore;
            ul.appendChild(li);
        }
        chore_div.appendChild(ul);
    }
}

updateDate();

const socket = io.connect();
socket.on('notes', (note_response) => {
    updateNotes(note_response);
});

socket.on('crews', (crew_response) => {
    updateCrew(crew_response);
});

socket.on('calls', (call_response) => {
    updateCallCount(call_response);
});

socket.on('chores', (chore_response) => {
    updateChores(chore_response);
});

setInterval(() => {
    updateDate();
}, 2000);
