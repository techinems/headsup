async function getNotes() {
    const response = await fetch('/notes');
    checkResult(response);
    const notes = (await response.json()).data;
    let html = '';
    if (notes.length !== 0) {
        for (const {id, note} of notes) {
            const currentHtml = `
        <div class="form-group">
        <button
        class="btn btn-sm btn-outline-danger"
        id="note${id}"
        onclick="deleteNote(${id})">
        <i class="fa fa-times" aria-hidden="true"></i> Delete
        </button>
        <label for="note${id}">${note}</label>
        </div>
        `;
            html += currentHtml;
        }
    }
    else {
        html = '<div class="no-current-notes">There are no current notes!</div>';
    }
    document.querySelector('#notes').innerHTML = html;
}

// eslint-disable-next-line
async function createNote() {
    const note = document.querySelector('#add-a-note').value;
    if (note === '') return;
    await postToServer('/note/create', {note: note});
    document.querySelector('#add-a-note').value = '';
    await getNotes();
}

// eslint-disable-next-line
async function deleteNote(note_id) {
    await postToServer('/note/delete', {note: note_id});
    await getNotes();
}

async function generateCategoryDropdown() {
    const response = await fetch('/public/js/call-categories.json');
    checkResult(response);
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
    await postToServer('/call/create',call_data);
    document.querySelector('#prid').value = '';
    document.querySelector('#tic').value = '';
    document.querySelector('#driver').value = '';
    document.querySelector('#category').value = '';
    document.querySelector('#response').value = '';
}

async function postToServer(endpoint, body) {
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow',
        body: JSON.stringify(body)
    });
    checkResult(response);
}

function checkResult(response) {
    if (!response.ok) {
        throw response.statusText;
    }
}

getNotes();
generateCategoryDropdown();
