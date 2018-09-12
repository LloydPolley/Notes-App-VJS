document.addEventListener('DOMContentLoaded', function () {

    //DOM elements
    var newNoteTitle = document.getElementById('new-note-title');
    var noteContentBox = document.getElementById('note-contents');


    //global variables
    var idIndex = 0;
    var listNotes = [];
    var deleteIndexOf;

 
    (function () {
        if (localStorage.getItem('User1')) {
            getLocal('User1');
        } else {
            console.log('No user');
        }
    }());


    function noteElement(title, noteContent, id, activeNote) {
        return {
            title: title,
            noteContent: noteContent,
            id: id,
            activeNote: activeNote
        }
    }

    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////// Event binding ///////////////////////////////

    newNoteTitle.addEventListener('keyup', function () {
        if (event.key === 'Enter') {
            createNote();
        }
    });

    noteContentBox.addEventListener('blur', function (event) {
        //entered text value
        var newTextValue = event.target.value;

        //get current value
        for (var i = 0; i < listNotes.length; i++) {
            if (listNotes[i].activeNote == true) {
                listNotes[i].noteContent = newTextValue;
            }
        }
    });

    ///////////////////////////////////////////////////////////////////////////
    //////////////////////////// Core functions ///////////////////////////////

    //Data buttons
    function createNoteObject() {
        var noteTitle = document.getElementById('new-note-title').value;
        if (noteTitle == '') {
            noteTitle = 'New Note' + idIndex;
        }

        var content = document.getElementById('note-contents').value;
        var note = noteElement(noteTitle, content, idIndex, false);

        // adding objects to array
        listNotes.push(note);
        printArray();
    }

    function createButtonDiv() {

        // New functionality nested buttons in div
        var noteContainer = document.createElement('div');
        noteContainer.className = 'note-element-container';
        noteContainer.setAttribute('data-id', idIndex);
        document.getElementById('side-container').appendChild(noteContainer);
        //////////////////////////////////////////
    }


    //Display buttons
    function createNoteButton(noteTitle, loaded) {
        //Selecting certain note to show content
        var noteButton = document.createElement('button');

        if (newNoteTitle.value == '' && loaded == false) {
            noteButton.innerHTML = 'New note' + idIndex;
        } else {
            noteButton.innerHTML = noteTitle;
        }

        noteButton.className = 'note-element'
        noteButton.onclick = displayNote;
        noteButton.setAttribute('data-id', idIndex);
        document.getElementsByClassName('note-element-container')[idIndex].appendChild(noteButton);


    }

    function createNoteDelete() {
        //Selecting certain note to show content
        var deleteButton = document.createElement('button');
        deleteButton.className = 'delete-element'
        deleteButton.onclick = deleteNote;
        deleteButton.innerHTML = 'X';
        deleteButton.setAttribute('data-id', idIndex);
        document.getElementsByClassName('note-element-container')[idIndex].appendChild(deleteButton);
    }

    //Runs both button methods 
    function createNote() {
        createNoteObject();

        createButtonDiv();
        createNoteButton(newNoteTitle.value, false);
        createNoteDelete();

        //Clear entries for next note
        (function clearEntrys() {
            document.getElementById('note-contents').value = '';
            document.getElementById('new-note-title').value = '';
        }());

        idIndex++;

        saved(false);
        localSaving('User1', listNotes);
    }


    function displayNote(e) {
        //loop to make all values false
        for (var i = 0; i < listNotes.length; i++) {
            listNotes[i].activeNote = false;
        }
        //active to true
        buttonClickedId = e.target.getAttribute('data-id');

        for (var i = 0; i < listNotes.length; i++) {
            if (listNotes[i].id == buttonClickedId) {
                document.getElementById('note-contents').value = listNotes[i].noteContent;
                document.getElementById('note-title').innerHTML = listNotes[i].title;
                listNotes[i].activeNote = true;
                noteContentBox.focus();
            }
        }
    }

    function deleteNoteArray(deleteIdButton) {
        if (listNotes.length > -1) {
            //find array object with same id
            for (var i = 0; i < listNotes.length; i++) {
                if (deleteIdButton == listNotes[i].id) {
                    //delete the index of that object currently
                    var indexOf = listNotes.indexOf(listNotes[i]);
                    listNotes.splice(indexOf, 1);

                    deleteIndexOf = indexOf;
                }
            }
        }
        localSaving('User1', listNotes);
    }

    function deleteNoteButtons(deleteId) {
        var buttonNotes = document.querySelectorAll('.note-element');
        var buttonDelete = document.querySelectorAll('.delete-element');
        var noteContainer = document.querySelectorAll('.note-element-container');
        //noteContainer[deleteIndexOf].parentNode.removeChild(noteContainer[deleteIndexOf]);
        buttonNotes[deleteIndexOf].parentNode.removeChild(buttonNotes[deleteIndexOf]);
        buttonDelete[deleteIndexOf].parentNode.removeChild(buttonDelete[deleteIndexOf]);
    }

    function deleteNote(e) {
        var deleteId = e.target.getAttribute('data-id');
        deleteNoteArray(deleteId);
        deleteNoteButtons(deleteId);
        printArray();
    }

    function printArray() {
        console.log(listNotes);
    }

    function saved(value) {
        isSaved = value;
    }

    //////////////////////////////////////////////////////////////////////////
    ///////////////////////////// Data saving ////////////////////////////////

    var clearButton = document.getElementById('clearLocal');

    clearButton.addEventListener('click', function () {
        localStorage.clear();
    });

    function localSaving(user, jsonFile) {
        localStorage.setItem(user, JSON.stringify(jsonFile));
    }

    function getLocal(user) {
        var localSaved = localStorage.getItem(user);

        //convert string into Json object
        listNotes = JSON.parse(localSaved);

        loadedFileButtonGeneration();
    }

    //Create buttons from loaded in file
    function loadedFileButtonGeneration() {
        for (var i = 0; i < listNotes.length; i++) {

            //Change ids back in order
            listNotes[i].id = idIndex;
            listNotes[i].activeNote = false;

            createButtonDiv();
            createNoteButton(listNotes[i].title, true);
            createNoteDelete();
            
            //Iterate each button creation
            idIndex++;
        }
        console.log(listNotes);
    }

});