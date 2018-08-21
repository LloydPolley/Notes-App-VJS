document.addEventListener('DOMContentLoaded', function () {

    var newNoteTitle = document.getElementById('new-note-title');
    var noteContentBox = document.getElementById('note-contents');

    var idIndex = 0;
    var listNotes = [];
    var deleteIndexOf;

    document.getElementById('cookie-print').onclick = getCookie;

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

    window.onload = function () {
        //get cookie
        var cookie = document.cookie;
        console.log(cookie);

        //Select cookie by name
        //Split up cookie
        //convert json into object using JSON.parse
        //generate buttons for each object in array
    }


    newNoteTitle.addEventListener('keyup', function () {
        if (event.key === 'Enter') {
            createNote();
        }
    });

    noteContentBox.addEventListener('blur', function (event) {
        //entered text value
        console.log(event.target.value);
        var newTextValue = event.target.value;

        //get current value
        for (var i = 0; i < listNotes.length; i++) {
            if (listNotes[i].activeNote == true) {
                console.log('condition met');
                console.log(listNotes[i]);
                listNotes[i].noteContent = newTextValue;
            }
        }
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

        if(newNoteTitle.value == ''){
            noteButton.innerHTML = 'New note' + idIndex;
        }else{
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
    }


    function displayNote(e) {
        //loop to make all values false
        for (var i = 0; i < listNotes.length; i++) {
            listNotes[i].activeNote = false;
            console.log(listNotes[i]);
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
    }

    function printArray() {
        console.log(listNotes);
    }

    //////////////////////////////////////////////////////////////////////////
    ///////////////////////////// Cookie saving //////////////////////////////

    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = 'expires=' + d.toUTCString();
        document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
    }

    function getCookie(cname) {
        console.log(document.cookie);
    }

    function deleteCookie(name) {
        document.cookie = name + '=; Max-Age=-99999999'
    }

    function convertToJson(object) {
        var json_str = JSON.stringify(object);
        return json_str;
    }

    function JsonToObject(JsonValue) {
        var object = JSON.parse(JsonValue);
        console.log(object);
    }

});