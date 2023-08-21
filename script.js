var file = document.getElementById("fileIn"); // Add file button
var characterTable = document.getElementById("characterTable");

file.onchange = function (e) {
    var tgt = e.target || window.event.srcElement;
    var files = tgt.files;

    // FileReader support
    if (FileReader && files && files.length) {
        var fr = new FileReader();
        fr.onload = function () {
            var fileResult = fr.result;

            var row = characterTable.insertRow();
            var cName = row.insertCell();
            var cThumb = row.insertCell();
            var cHor = row.insertCell();
            var cVer = row.insertCell();
            var cState = row.insertCell();

            // Populate each cell with the associate elements.
            cName.innerHTML = fileResult.name;
            cThumb.innerHTML = "thumb";
            cHor.innerHTML = "hor";
            cVer.innerHTML = "ver";
            cState.innerHTML = "state";
        }
        for (i = 0; i < files.length; i++) {
            fr.readAsDataURL(files[i]);
        }
        file.value = "";
    }

    // Not supported
    else {
        // fallback -- perhaps submit the input to an iframe and temporarily store
        // them on the server until the user's session ends.
    }

};