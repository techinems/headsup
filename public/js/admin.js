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

async function createItem(category) {
    if (category != 'note' && category != 'mishap') {
        console.log('Unknown item');
        return;
    }
    const item = document.querySelector(`#add-a-${category}`).value;
    if (item === '') return;
    if (category == 'note') {
        await postToServer('/note/create', {note: item});
    } else if (category == 'mishap') {
        await postToServer('/mishap/create', {mishap: item});
    }
    document.querySelector(`#add-a-${category}`).value = '';
}

// eslint-disable-next-line no-unused-vars
async function createNote() {
    await createItem('note');
    await getNotes();
}

// eslint-disable-next-line no-unused-vars
async function deleteNote(note_id) {
    await postToServer('/note/delete', {note: note_id});
    await getNotes();
}

// eslint-disable-next-line no-unused-vars
async function createMishap() {
    await createItem('mishap');
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

// eslint-disable-next-line no-unused-vars
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
