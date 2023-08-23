const file = document.getElementById("fileIn"); // Add file button
const characterTable = document.getElementById("characterTable");
const canvas = document.getElementById("canvas"); // Canvas
const categories = ['Anime', 'Animated Film', 'Animated TV', 'Book', 'Comics', 'Live Action Film', 'Live Action TV', 'Video Game', 'Other'];

document.getElementById("Shadow_All").addEventListener("click", () => { updateChars("Shadowed") });
document.getElementById("Reveal_All").addEventListener("click", () => { updateChars("Reveal") });
document.getElementById("Background_All").addEventListener("click", () => { updateChars("Background") });
document.getElementById("Download").addEventListener("click", createHDImage);
document.getElementById("Refresh").addEventListener("click", processCanvas);
document.getElementById("Theme").addEventListener("input", processCanvas);

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
                const cCategory = row.insertCell();

                // Populate each cell with the associate elements.

                console.log("Create Cells", fr.fileName);
                cName.innerHTML = `<button class="link" id="${fr.fileName}_del">X</button> ${fr.fileName.replace(/\.[^/.]+$/, "")}`;
                cScale.innerHTML = `<input type="range" min="0" max="150" value="75" class="slider" id="${fr.fileName}_scale" />`;
                cHor.innerHTML = `<input type="range" min="0" max="100" value="50" class="slider" id="${fr.fileName}_hor" />`;
                cVer.innerHTML = `<input type="range" min="0" max="100" value="50" class="slider" id="${fr.fileName}_ver" />`;
                cState.innerHTML = `<input type="radio" name="${fr.fileName}_state" value="Reveal" id="${fr.fileName}_rev" checked="checked" /><label for="${fr.fileName}_rev">Reveal</label><br><input type="radio" name="${fr.fileName}_state" value="Shadowed" id="${fr.fileName}_sha" /><label for="${fr.fileName}_sha">Shadow</label><br><input type="radio" name="${fr.fileName}_state" value="Background" id="${fr.fileName}_bac" /><label for="${fr.fileName}_bac">Background</label>`;
                let catString = `<select name="${fr.fileName}_cat" id="${fr.fileName}_cat">`;
                for (let category of categories) {
                    catString += `<option value="${category}">${category}</option>`;
                }
                catString += `</select>`;
                cCategory.innerHTML = catString;

                const iDelete = document.getElementById(`${fr.fileName}_del`);
                iDelete.addEventListener("click", (event) => { deleteCharacterRow(event, fr.fileName) });
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
                const iCategory = document.getElementById(`${fr.fileName}_cat`);
                iCategory.addEventListener("change", (event) => { updateCharacterCategory(event, fr.fileName) });

                characterImages[fr.fileName] = { image: fr.result, scale: 75, hor: 50, ver: 50, state: "Reveal", category: "" };
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

function deleteCharacterRow(e, name) {
    const index = e.target.parentNode.parentNode.rowIndex;
    characterTable.deleteRow(index);
    delete characterImages[name];
    processCanvas();
}

function updateCharacterCategory(e, name) {
    characterImages[name].category = e.target.value;
    processCanvas();
}

function truncate(num) {
    if (num < 0) {
        return 0;
    }
    if (num > 255) {
        return 255;
    }
    return num;
}

function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function updateChars(value) {
    // Update the characters and radio values
    for (let character in characterImages) {
        characterImages[character].state = value;
        document.getElementById(`${character}_${value.slice(0, 3).toLowerCase()}`).checked = true;
    }
    processCanvas();
}

function drawToCanvas(canvasToDrawTo, drawScale) {
    const ctx = canvasToDrawTo.getContext('2d');
    ctx.fillStyle = document.getElementById("BG_Color").value;
    ctx.fillRect(0, 0, canvasToDrawTo.width, canvasToDrawTo.height);


    const themeText = document.getElementById("Theme").value;
    let vertFactor = 1;
    if (themeText) {
        vertFactor = 0.85; // Scale down vertical motion if theme text enabled
    }

    // Draw the characters
    sortedChars = [];
    for (let character in characterImages) {
        sortedChars.push(characterImages[character]);
    }
    sortedChars.sort((a, b) => { return b.state.length - a.state.length });
    for (let characterObject of sortedChars) {
        const image = new Image();

        image.onload = () => {
            image.crossOrigin = "Anonymous";
            const imageX = characterObject.hor * canvasToDrawTo.width / 100;
            const imageY = vertFactor * characterObject.ver * canvasToDrawTo.height / 100; // only 3/4 of the height is for characters, the bottom is for the text
            const imageW = image.width * characterObject.scale * drawScale / 100;
            const imageH = image.height * characterObject.scale * drawScale / 100;

            if (characterObject.state == "Shadowed") {
                // Use a temp canvas to convert the image appropriately
                const tempCanvas = document.createElement("canvas");
                tempCanvas.width = imageW;
                tempCanvas.height = imageH;
                const tempContext = tempCanvas.getContext('2d');
                tempContext.drawImage(image, 0, 0, imageW, imageH); // Pre-scale image data
                let imgd = tempContext.getImageData(0, 0, imageW, imageH);
                const color = hexToRgb(document.getElementById("SH_Color").value);

                for (let i = 0; i < imgd.data.length; i += 4) {
                    imgd.data[i + 0] = color.r;
                    imgd.data[i + 1] = color.g;
                    imgd.data[i + 2] = color.b;
                    imgd.data[i + 3] = imgd.data[i + 3]; // For some reason I need this line.
                }
                tempContext.putImageData(imgd, 0, 0);
                ctx.drawImage(tempCanvas, imageX, imageY);
            }
            else if (characterObject.state == "Background") {
                // Use a temp canvas to convert the image appropriately
                const tempCanvas = document.createElement("canvas");
                tempCanvas.width = imageW;
                tempCanvas.height = imageH;
                const tempContext = tempCanvas.getContext('2d');
                tempContext.drawImage(image, 0, 0, imageW, imageH); // Pre-scale image data
                let imgd = tempContext.getImageData(0, 0, imageW, imageH);
                const C = -50;
                const F = 259 * (255 + C) / (255 * (259 - C));
                console.log("F", F);
                for (let i = 0; i < imgd.data.length; i += 4) {
                    imgd.data[i + 0] = truncate(F * imgd.data[i + 0] - 128) + 128;
                    imgd.data[i + 1] = truncate(F * imgd.data[i + 1] - 128) + 128;
                    imgd.data[i + 2] = truncate(F * imgd.data[i + 2] - 128) + 128;
                    imgd.data[i + 3] = 255 * Math.round(imgd.data[i + 3] / 255);
                }
                tempContext.putImageData(imgd, 0, 0);
                ctx.drawImage(tempCanvas, imageX, imageY);
            }
            else {
                ctx.drawImage(image, imageX, imageY, imageW, imageH);
            }
        };
        image.src = characterObject.image;
    }

    // Draw the bottom text
    if (themeText) {
        const tLine1 = 1 - (2 * (1 - vertFactor) / 3);
        const tLine2 = 1 - (1 - vertFactor) / 3;
        ctx.fillStyle = document.getElementById("SH_Color").value;
        ctx.fillRect(0, canvasToDrawTo.height * vertFactor, canvasToDrawTo.width, canvasToDrawTo.height * (1 - vertFactor));

        ctx.fillStyle = document.getElementById("BG_Color").value;
        ctx.font = '30px Comic Sans';
        ctx.textAlign = 'center';
        ctx.fillText(themeText, canvasToDrawTo.width / 2, canvasToDrawTo.height * tLine1);

        let categoryText = "";
        for (let category of categories) {
            let count = 0;
            for (let character in characterImages) {
                if (characterImages[character].category == category) {
                    count++;
                }
            }
            if (count) {
                categoryText += `${category}: ${count}\t`;
            }
        }
        ctx.font = '20px Comic Sans';
        ctx.fillText(categoryText.trim(), canvasToDrawTo.width / 2, canvasToDrawTo.height * tLine2);
    }
}

function processCanvas() {
    drawToCanvas(canvas, 1);
}

function createHDImage() {
    const scale = 8;
    const hdCanvas = document.createElement("canvas");
    hdCanvas.width = canvas.width * scale;
    hdCanvas.height = canvas.height * scale;
    drawToCanvas(hdCanvas, scale);
    var dataURL = canvas.toDataURL("image/png");
    // Create a dummy link text
    var a = document.createElement('a');
    // Set the link to the image so that when clicked, the image begins downloading
    a.href = dataURL
    // Specify the image filename
    a.download = 'canvas-download.png';
    // Click on the link to set off download
    a.click();
}