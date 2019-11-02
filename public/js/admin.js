async function getNotes() {
    const response = await fetch('/notes');
    const notes = (await response.json()).data;
    for (const note of notes) {
        const span = document.createElement('span');
        const paragraph = document.createElement('p');
        const button = document.createElement('button');
        button.className = 'btn-danger';
        button.setAttribute('onclick', `deleteNote(${note.id})`);
        button.textContent = 'X';
        paragraph.textContent = note.note;
        span.appendChild(paragraph);
        span.appendChild(button);
        document.querySelector('#notes').appendChild(span);
    }
}

// eslint-disable-next-line
function createNote() {
    const note = document.querySelector('#new-notes').value;
    fetch('/note/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow',
        body: JSON.stringify({ note })
    });
}

// eslint-disable-next-line
function deleteNote(note_id) {
    fetch('/note/delete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow',
        body: JSON.stringify({ note: note_id })
    });
    document.querySelector('#notes').innerHTML = '';
    getNotes();
}

async function generateCategoryDropdown() {
    const response = await fetch('/public/call-categories.json');
    const categories = await response.json();
    for (const category of categories) {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        document.querySelector('#category').appendChild(option);
    }
}

// eslint-disable-next-line
async function addCall() {
    const prid = document.querySelector('#prid').value;
    const cc = document.querySelector('#tic').value;
    const driver = document.querySelector('#driver').value;
    const category = document.querySelector('#category').value;
    const response = document.querySelector('#response').value;
    const call_data = { prid, cc, driver, category, response };
    fetch('/call/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow',
        body: JSON.stringify(call_data)
    });
}

getNotes();
generateCategoryDropdown();