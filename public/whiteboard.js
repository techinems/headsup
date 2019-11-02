async function updateCrew() {
    const response = await fetch('/crew');
    let crew = await response.json();
    if (!crew.success) {
        console.error('Failed to fetch!');
    } else {
        crew = crew.data[0];
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

async function updateNotes() {
    document.querySelector('#notes').innerHTML = '';
    const response = await fetch('/notes');
    const notes = (await response.json()).data;
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
    document.querySelector('#date').innerHTML = todays_date.format('MM/DD/YYYY');
}

updateCrew();
updateDate();
updateNotes();

setInterval(async () => {
    updateDate();
    updateCrew();
    updateNotes();
}, 60000);
