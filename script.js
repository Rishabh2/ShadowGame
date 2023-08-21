var file = document.getElementById("fileIn"); // Add file button
var characterTable = document.getElementById("characterTable");

file.onchange = function (e) {
    var tgt = e.target || window.event.srcElement;
    var files = tgt.files;

    // FileReader support
    if (FileReader && files && files.length) {
        for (var fileToLoad of files) {
            var fr = new FileReader();
            fr.fileName = fileToLoad.name;
            fr.onload = () => {
                var row = characterTable.insertRow();
                var cName = row.insertCell();
                var cScale = row.insertCell();
                var cHor = row.insertCell();
                var cVer = row.insertCell();
                var cState = row.insertCell();

                // Populate each cell with the associate elements.

                console.log(fr.fileName);
                cName.innerHTML = fr.fileName;
                cScale.innerHTML = "scale";
                cHor.innerHTML = "hor";
                cVer.innerHTML = "ver";
                cState.innerHTML = "state";
            }
            fr.readAsDataURL(fileToLoad);
        }
        file.value = "";
    }

    // Not supported
    else {
        // fallback -- perhaps submit the input to an iframe and temporarily store
        // them on the server until the user's session ends.
    }

};