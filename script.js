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
                cState.innerHTML = `<input type="radio" name="${fr.fileName}_state" value="Reveal" id="${fr.fileName}_rev"><label for="${fr.fileName}_rev">Reveal</label><input type="radio" name="${fr.fileName}_state" value="Shadow" id="${fr.fileName}_sha"><label for="${fr.fileName}_sha">Shadow</label><input type="radio" name="${fr.fileName}_state" value="Background" id="${fr.fileName}_bgd"><label for="${fr.fileName}_bgd">Background</label>`;

                const iScale = document.getElementById(`${fr.fileName}_scale`);
                iScale.addEventListener("input", (event) => { updateImageScale(event, fr.fileName) });
                const iHor = document.getElementById(`${fr.fileName}_hor`);
                iHor.addEventListener("input", (event) => { updateImageHorizontal(event, fr.fileName) });
                const iVer = document.getElementById(`${fr.fileName}_ver`);
                iVer.addEventListener("input", (event) => { updateImageVertical(event, fr.fileName) });
                const iStates = document.getElementsByName(`${fr.fileName}_state`);
                for (let iState of iStates) {
                    iState.addEventListener("click", (event) => { updateImageState(event, fr.fileName) });
                }

                characterImages[fr.fileName] = { image: fr.result, scale: 100, hor: 50, ver: 50, state: "Reveal" };
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
function updateImageState(e, name) {
    characterImages[name].state = e.target.value;
    console.log("Updated State", e.target.value, e.target, e);
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
            if (characterObject.state == "Shadow") {
                console.log("Shadow image", character, characterObject);
                // Use a temp canvas to convert the image appropriately
                const tempCanvas = document.createElement("canvas");
                const tempContext = tempCanvas.getContext('2d');
                tempContext.drawImage(image, 0, 0);
                let imgd = tempContext.getImageData(0, 0, image.width, image.height);

                for (let i = 0; i < imageData.data.length; i += 4) {
                    if (imgd.data[i + 3] < 5) { // buffer check for pixel A value
                        imgd.data[i + 0] = 0;
                        imgd.data[i + 1] = 0;
                        imgd.data[i + 2] = 0;
                    }
                }
                ctx.putImageData(imgd,
                    characterObject.hor * canvas.width / 100,
                    characterObject.ver * canvas.height / 100,
                    image.width * characterObject.scale / 100,
                    image.height * characterObject.scale / 100);
            }
            else {
                ctx.drawImage(image,
                    characterObject.hor * canvas.width / 100,
                    characterObject.ver * canvas.height / 100,
                    image.width * characterObject.scale / 100,
                    image.height * characterObject.scale / 100);
            }
        }
        image.src = characterObject.image;
    }
}