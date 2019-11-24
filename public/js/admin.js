/* global EmojiConvertor */

async function getNotes() {
    const emoji = new EmojiConvertor();
    const response = await fetch('/notes');
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
        <label for="note${id}">${emoji.replace_colons(note)}</label>
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
function createNote() {
    const note = document.querySelector('#add-a-note').value;
    fetch('/note/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow',
        body: JSON.stringify({ note })
    });
    window.location.reload();
}

// eslint-disable-next-line
async function deleteNote(note_id) {
    await fetch('/note/delete', {
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
    const response = await fetch('/public/js/call-categories.json');
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
    window.location.reload();
}

getNotes();
generateCategoryDropdown();
