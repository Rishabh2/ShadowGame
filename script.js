const file = document.getElementById("fileIn"); // Add file button
const characterTable = document.getElementById("characterTable");
const canvas = document.getElementById("canvas"); // Canvas

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
                cHor.innerHTML = `<input type="range" min="0" max="100" value="50" class="slider" id="${fr.fileName}_hor">`;
                cVer.innerHTML = `<input type="range" min="0" max="100" value="50" class="slider" id="${fr.fileName}_ver">`;
                cState.innerHTML = "state";

                const iScale = document.getElementById(`${fr.fileName}_scale`);
                iScale.addEventListener("input", (event) => { updateImageScale(event, fr.fileName) });
                const iHor = document.getElementById(`${fr.fileName}_hor`);
                iHor.addEventListener("input", (event) => { updateImageHorizontal(event, fr.fileName) });
                const iVer = document.getElementById(`${fr.fileName}_ver`);
                iVer.addEventListener("input", (event) => { updateImageVertical(event, fr.fileName) });

                characterImages[fr.fileName] = { image: fr.result, scale: 100, hor: 0, ver: 0 };
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

function updateImageScale(e, name) {
    characterImages[name].scale = e.target.value;
    processCanvas();
}

function updateImageHorizontal(e, name) {
    characterImages[name].hor = e.target.value;
    processCanvas();
}

function updateImageVertical(e, name) {
    characterImages[name].ver = e.target.value;
    processCanvas();
}

function processCanvas() {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let character in characterImages) {
        const characterObject = characterImages[character];
        const image = new Image();
        image.onload = () => {
            image.crossOrigin = "Anonymous";
            ctx.drawImage(image,
                characterObject.hor * canvas.width,
                characterObject.ver * canvas.height,
                image.width * characterObject.scale / 100,
                image.height * characterObject.scale / 100);
        }
        image.src = characterObject.image;
    }
}