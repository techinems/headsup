/* global moment, io */

function updateCrew(crew_response) {
    let crew = crew_response;
    if (!crew.success) {
        console.error('Failed to fetch!');
    } else {
        crew = crew.data[0];
        console.log(crew);
        const rider_radio_nums = [993, 992];
        // Sets the rider's radionums to 992 and 993 if they don't have one
        crew.rider1rn = crew.rider1rn == 0 ? rider_radio_nums.pop() : crew.rider1rn;
        crew.rider2rn = crew.rider2rn == 0 ? rider_radio_nums.pop() : crew.rider2rn;
        document.querySelector('#cc').innerHTML = crew.cc;
        document.querySelector('#ccrn').innerHTML = crew.ccrn;
        document.querySelector('#driver').innerHTML = crew.driver;
        document.querySelector('#driverrn').innerHTML = crew.driverrn;
        document.querySelector('#rider1').innerHTML = crew.rider1;
        document.querySelector('#rider1rn').innerHTML = crew.rider1rn;
        document.querySelector('#rider2').innerHTML = crew.rider2;
        document.querySelector('#rider2rn').innerHTML = crew.rider2rn;
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
function updateDate() {
    const todays_date = moment();
    document.querySelector('#date').innerHTML =  todays_date.format('D MMM YY');
    document.querySelector('#time').innerHTML = todays_date.format('HH:mm');
}

updateDate();

const socket = io.connect();
socket.on('notes', (note_response) => {
    updateNotes(note_response);
});

socket.on('crews', (crew_response) => {
    updateCrew(crew_response);
});

setInterval(() => {
    updateDate();
}, 2000);
