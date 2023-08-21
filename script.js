var file = document.getElementById("fileIn"); // Add file button
var characterTable = document.getElementById("characterTable");

file.onchange = () => {
    const files = file.files;

    // FileReader support
    if (FileReader && files && files.length) {
        for (let fileToLoad of files) {
            const fr = new FileReader();
            fr.fileName = fileToLoad.name;
            console.log("Read name", fileToLoad.name, fr.fileName);
            fr.onload = () => {
                const row = characterTable.insertRow();
                const cName = row.insertCell();
                const cScale = row.insertCell();
                const cHor = row.insertCell();
                const cVer = row.insertCell();
                const cState = row.insertCell();

                // Populate each cell with the associate elements.

                console.log("Create Cells", fr.fileName);
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