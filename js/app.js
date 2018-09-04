document.addEventListener('DOMContentLoaded', function () {

    //DOM elements
    var newNoteTitle = document.getElementById('new-note-title');
    var noteContentBox = document.getElementById('note-contents');
    var saveAsButton = document.getElementById('save-as');
    var loadFile = document.getElementById('loadFile');


    //global variables
    var idIndex = 0;
    var listNotes = [];
    var JsonListNotes;
    var deleteIndexOf;
    var loadedFile;
    var isSaved = false;

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


    loadFile.addEventListener('click', function () {
        var notesUpload = document.getElementById('fileUpload').files[0];
        var reader = new FileReader();

        reader.onload = function (e) {
            var result = reader.result;
            var parsed = JSON.parse(result);
            console.log(parsed);
            var obValues = Object.values(parsed);
            console.log(obValues.length);
            loadedFile = obValues;

            loadedFileButtonGeneration();
        }
        reader.readAsText(notesUpload);
    });

    saveAsButton.addEventListener('click', function () {
        var json = JSON.stringify(listNotes),
            blob = new Blob([json], {
                type: "octet/stream"
            }),
            url = window.URL.createObjectURL(blob);

        this.href = url;
        this.target = '_blank';
        this.download = 'notes.json';
    });

    window.onbeforeunload = function () {
        if (isSaved) {
            return;
        } else {
            return 'save work';
        }
    }


    saveAsButton.addEventListener('click', saved(true));

    ///////////////////////////////////////////////////////////////////////////
    //////////////////////////// Core functions ///////////////////////////////


    //Create buttons from loaded in file
    function loadedFileButtonGeneration(){
        console.log('Run');
        for(var i = 0; i < loadedFile.length; i++){

            createNoteButton(loadedFile[i].title, loadedFile[i].id, true);
            var loadedNote = noteElement(loadedFile[i].title, loadedFile[i].noteContent, loadedFile[i].id, false);
            console.log(loadedNote);
            listNotes.push(loadedNote);
            printArray();
        }
    }


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


    //Display buttons
    function createNoteButton(noteTitle, noteIndex, loaded) {

        //////////////////////////////////////////
        // New functionality nested buttons in div
        var noteContainer = document.createElement('div');
        noteContainer.className = 'note-element-container';
        noteContainer.setAttribute('data-id', noteIndex);
        document.getElementById('side-container').appendChild(noteContainer);
        //////////////////////////////////////////

        //Selecting certain note to show content
        var noteButton = document.createElement('button');

        if (newNoteTitle.value == '' && loaded == false) {
            noteButton.innerHTML = 'New note' + idIndex;
        } else {
            noteButton.innerHTML = noteTitle;
        }

        noteButton.className = 'note-element'
        noteButton.onclick = displayNote;
        noteButton.setAttribute('data-id', noteIndex);
        document.getElementsByClassName('note-element-container')[idIndex].appendChild(noteButton);

        //Selecting certain note to show content
        var deleteButton = document.createElement('button');
        deleteButton.className = 'delete-element'
        deleteButton.onclick = deleteNote;
        deleteButton.innerHTML = 'X';
        deleteButton.setAttribute('data-id', noteIndex);
        document.getElementsByClassName('note-element-container')[idIndex].appendChild(deleteButton);
    }

    //Runs both button methods 
    function createNote(title, id, loaded) {
        createNoteObject();
        createNoteButton(newNoteTitle.value, idIndex, false);

        //Clear entries for next note
        (function clearEntrys() {
            document.getElementById('note-contents').value = '';
            document.getElementById('new-note-title').value = '';
        }());

        idIndex++;

        saved(false);
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
                document.getElementById('new-title').innerHTML = listNotes[i].title;
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

});