let isFileChosen = false;
let isBuilt = false;
let data;
let tree = new Tree(new Node());
let isGachi = false;

inputFileEvent();
buildTreeEvent();
clearAllEvent();
findPathEvent();

function drawTree(node, treeEl) {
    let li = document.createElement("li");
    let a = document.createElement("a");
    a.href = "#";
    if (node.criteria != null) {
        a.textContent = node.criteria + " -> "
    }
    a.textContent += node.name;
    li.appendChild(a);
    treeEl.appendChild(li);
    node.htmlElement = a;
    if (node.branches.length === 0) {
        return;
    }

    let ul = document.createElement("ul");
    li.appendChild(ul);

    for (let i = node.branches.length - 1; i >= 0; i--) {
        drawTree(node.branches[i], ul);
    }
}

function inputFileEvent() {
    let input = document.getElementById("fileEntry");
    let inputButton = document.getElementById("chooseFileButton");
    inputButton.addEventListener("mousedown", function () {
        if (isBuilt) {
            alert("If you want to rebuild the tree, please press \"Clear All\" button.");
        }
    });
    if (!isBuilt) {
        input.onchange = function () {
            document.getElementById("fileName").textContent = this.files.item(0).name;
            if (this.files.item(0).name === "gachiData.csv") {
                isGachi = true;
            }
            isFileChosen = true;
            disableInput(true);
        }
    }

}

function disableInput(flag) {
    let textArea = document.getElementById("inputDataset");
    if (flag) {
        textArea.placeholder = "You can't input dataset!"
        textArea.value = "";
        textArea.disabled = true;
    } else {
        textArea.placeholder = "Please, input dataset"
        textArea.disabled = false;
    }
}

function buildTreeEvent() {
    document.getElementById("buildTree").addEventListener("click", function () {
        if (isBuilt) {
            alert("If you want to rebuild the tree, please press \"Clear All\" button.");
        } else {
            document.getElementById("treeDiv").classList.add("border")
            isBuilt = true;
            let root = document.getElementById("treeStart");
            while (root.hasChildNodes()) {
                root.removeChild(root.firstChild);
            }
            let textArea = document.getElementById("inputDataset");
            if (isFileChosen) {
                let file = document.getElementById("fileEntry").files[0];
                let reader = new FileReader();
                reader.readAsText(file);
                reader.onload = function () {
                    data = parseCSV(reader.result);
                    tree.id3Algorithm(data);
                    let treeRoot = document.getElementById("treeStart");
                    drawTree(tree.root, treeRoot);
                    textArea.placeholder = "Please, input the path"
                }
                disableInput(false);
            } else {
                if (textArea.value === "") {
                    isBuilt = false;
                    alert("Please choose the file or input dataset");
                } else {
                    data = parseCSV(textArea.value);
                    tree.id3Algorithm(data);
                    let treeRoot = document.getElementById("treeStart");
                    drawTree(tree.root, treeRoot);
                    textArea.value = "";
                    textArea.placeholder = "Please, input the path"
                }
            }
        }

    });
}

function clearAllEvent() {
    document.getElementById("buttonClear").addEventListener("click", function () {
        document.getElementById("result").textContent = "";
        document.getElementById("treeDiv").classList.remove("border")
        let temp = document.querySelectorAll("a");
        for (let i = 0; i < temp.length; i++) {
            temp[i].classList.remove("path");
        }
        isGachi = false;
        isBuilt = false;
        data = undefined;
        let root = document.getElementById("treeStart");
        while (root.hasChildNodes()) {
            root.removeChild(root.firstChild);
        }
        tree = new Tree(new Node());
        document.getElementById("fileName").textContent = "File isn't chosen";
        isFileChosen = false;

        let textArea = document.getElementById("inputDataset");
        textArea.value = "";
        disableInput(false);
    });
}

function findPathEvent() {
    document.getElementById("showResultButton").addEventListener("click", async function () {
        if (isBuilt) {
            let temp = document.querySelectorAll("a");
            for (let i = 0; i < temp.length; i++) {
                temp[i].classList.remove("path");
            }
            document.getElementById("result").textContent = "";

            let textArea = document.getElementById("inputDataset");
            if (textArea.value === "") {
                alert("Please, input your request");
            } else {
                let inputData = parseCSV(textArea.value);
                inputData = inputData[inputData.length - 1];
                if (isCorrectData(inputData)) {
                    let path = pathFinder(inputData);
                    await drawPath(path);
                } else {
                    alert("Please, input correct request");
                }
            }
        } else {
            alert("Tree wasn't built")
        }
    })

}

function pathFinder(inputData) {
    let path = [];
    path.push(tree.root);

    while (inputData.length !== 0) {
        let node = path[path.length - 1];
        let counter = 0;
        for (let i = 0; i < node.branches.length; i++) {
            let criteria = node.branches[i].criteria;
            let index = findElementInArray(criteria, inputData);
            if (index === null) {
                counter++;
            } else {
                path.push(node.branches[i]);
                inputData.splice(index, 1);
                break;
            }
        }
        if (counter === node.branches.length) {
            inputData.splice(0, 1)
        }
    }
    return path;
}

function findElementInArray(elem, array) {
    let index = null;
    for (let i = 0; i < array.length; i++) {
        if (array[i] === elem) {
            index = i;
            break;
        }
    }
    return index;
}

function isCorrectData(inputData) {
    let flag = findElementInArray(inputData[0], data[0]);
    if (!(inputData.length === data[0].length - 1 && flag === null)) {
        return false;
    }
    for (let i = 0; i < inputData.length; i++) {
        let counter = 0;
        for (let j = 1; j < data.length; j++) {
            for (let k = 0; k < data[0].length; k++) {
                if (data[j][k] === inputData[i]) {
                    counter++;
                }
            }
        }
        if (counter === 0) {
            return false;
        }
    }
    return true;
}

function makeButtonsDisabled(mode) {
    let buttons = document.querySelectorAll("button");
    if (mode) {
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].disabled = true;
        }
    } else {
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].disabled = false;
        }
    }
}

async function drawPath(path) {
    let counter = 0;
    makeButtonsDisabled(true);
    while (counter !== path.length) {
        let node = path[counter];
        node.htmlElement.classList.add("path");
        counter++;
        await new Promise(resolve => setTimeout(resolve, 500))
        if (counter !== path.length) {
            node.htmlElement.classList.remove("path");
        }
    }
    if (isGachi) {
        if (path[path.length - 1].name === "fucking slaves") {
            gachiSounds("fucking slaves");
        } else {
            gachiSounds("300 bucks")
        }
    }
    document.getElementById("result").textContent = path[path.length - 1].name;
    makeButtonsDisabled(false);
}

function gachiSounds(name) {
    let music = document.createElement("audio");
    if (name === "fucking slaves") {
        music.src = "./music/fuckingSlavesSound.mp3";
    } else {
        music.src = "./music/threeHundredBucksSound.mp3";
    }
    music.autoplay = true;
}

function playMusic() {

}
