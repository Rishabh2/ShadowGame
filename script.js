const file = document.getElementById("fileIn"); // Add file button
const characterTable = document.getElementById("characterTable");
const ctx = document.getElementById("canvas").getContext("2d"); // Canvas context

let characterImages = {};

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
                cScale.innerHTML = `<input type="range" min="0" max="200" value="100" class="slider" id="${fr.fileName}_scale">`;
                cHor.innerHTML = `<input type="range" min="-100" max="100" value="0" class="slider" id="${fr.fileName}_hor">`;
                cVer.innerHTML = `<input type="range" min="-100" max="100" value="0" class="slider" id="${fr.fileName}_ver">`;
                cState.innerHTML = "state";

                const iScale = document.getElementById(`${fr.fileName}_scale`);
                iScale.addEventListener("input", updateImageScale);
                const iHor = document.getElementById(`${fr.fileName}_hor`);
                iHor.addEventListener("input", updateImageHorizontal);
                const iVer = document.getElementById(`${fr.fileName}_ver`);
                iVer.addEventListener("input", updateImageVertical);

                const newImage = new Image();
                newImage.src = fr.result;
                characterImages[fr.fileName] = { image: newImage, scale: 100, hor: 0, ver: 0 };
            }
            fr.readAsDataURL(fileToLoad);
        }
        file.value = "";
        processCanvas();
    }

    // Not supported
    else {
        // fallback -- perhaps submit the input to an iframe and temporarily store
        // them on the server until the user's session ends.
    }

};

function updateImageScale(e) {
    characterImages[e.target.id.slice(0, -4)].scale = e.target.value;
    processCanvas();
}

function updateImageHorizontal(e) {
    characterImages[e.target.id.slice(0, -4)].hor = e.target.value;
    processCanvas();
}

function updateImageVertical(e) {
    characterImages[e.target.id.slice(0, -4)].ver = e.target.value;
    processCanvas();
}

function processCanvas() {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    for (let character in characterImages) {
        const characterObject = characterImages[character];
        ctx.drawImage(characterObject.image, characterObject.hor, characterObject.ver);
    }
}