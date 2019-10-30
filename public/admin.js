async function getNotes() {
    const response = await fetch(`/notes`);
    const notes = (await response.json()).data;
    for (const note of notes) {
        const span = document.createElement('span');
        const paragraph = document.createElement('p');
        const button = document.createElement('button');
        button.className = "btn-danger";
        button.setAttribute("onclick", `deleteNote(${note.id})`);
        button.textContent = "X";
        paragraph.textContent = note.note;
        span.appendChild(paragraph);
        span.appendChild(button);
        document.querySelector('#notes').appendChild(span);
    }
}

function createNote() {
    const note = document.querySelector("#new-notes").value;
    fetch('/note/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow',
        body: JSON.stringify({ note })
    });
}

function deleteNote(note_id) {
    fetch('/note/delete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow',
        body: JSON.stringify({ note: note_id })
    });
    document.querySelector("#notes").innerHTML = "";
    getNotes();
}

getNotes();