document.addEventListener('DOMContentLoaded', function () {

    var newNoteTitle = document.getElementById('new-note-title');
    var noteContentBox = document.getElementById('note-contents');
    var saveAsButton = document.getElementById('save-as');

    var loadFile = document.getElementById('loadFile');


    var idIndex = 0;
    var listNotes = [];
    var JsonListNotes;
    var deleteIndexOf;

    var loadedFile;
    var isSaved = false;

    document.getElementById('cookie-print').onclick = getCookie;


    window.onbeforeunload = function () {
        if (isSaved) {
            return;
        }else{
            return 'save work';
        }
    }

    saveAsButton.addEventListener('click', saved(true));



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

            loadedFile = parsed;
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

        this.download = 'my-download.json';
    });




    ///////////////////////////////////////////////////////////////////////////
    //////////////////////////// Core functions ///////////////////////////////

    //Data
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


    //Display
    function createNoteButton() {
        //Selecting certain note to show content
        var noteButton = document.createElement('button');

        if (newNoteTitle.value == '') {
            noteButton.innerHTML = 'New note' + idIndex;
        } else {
            noteButton.innerHTML = newNoteTitle.value;
        }
        noteButton.className = 'note-element'
        noteButton.onclick = displayNote;
        noteButton.setAttribute('data-id', idIndex);
        document.getElementById('side-container').appendChild(noteButton);

        //Selecting certain note to show content
        var deleteButton = document.createElement('button');
        deleteButton.className = 'delete-element'
        deleteButton.onclick = deleteNote;
        deleteButton.innerHTML = 'Del';
        deleteButton.setAttribute('data-id', idIndex);
        document.getElementById('side-container').appendChild(deleteButton);

    }

    function createNote() {
        createNoteObject();
        createNoteButton();

        //Clear entries for next note
        (function clearEntrys() {
            document.getElementById('note-contents').value = '';
            document.getElementById('new-note-title').value = '';
        }());

        //Cookie creation on note creation
        setCookie('User', convertToJson(listNotes), 7);
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

    function saved(value){
        isSaved = value;
    }

    //////////////////////////////////////////////////////////////////////////
    ///////////////////////////// Data   saving //////////////////////////////

    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = 'expires=' + d.toUTCString();
        document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
    }

    function getCookie(cname) {
        console.log(document.cookie);
    }

    function convertToJson(object) {
        var json_str = JSON.stringify(object);
        return json_str;
    }

    function JsonToObject(JsonValue) {
        var object = JSON.parse(JsonValue);
        console.log(object);
    }


    function readUpload() {
        var notesUpload = document.getElementById('fileUpload').files[0];
        //
        var uploadedFileConversion = JsonToObject(notesUpload);

        console.log(notesUpload);
    }


});