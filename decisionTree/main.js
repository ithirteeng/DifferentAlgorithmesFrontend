let isFileChosen = false;
let isBuilt = false;
let data;
let tree = new Tree(new Node());

inputFileEvent();
buildTreeEvent();
clearAllEvent();

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
                    tree = new Tree(new Node());
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
                }
            }
            tree = new Tree(new Node());
        }

    });
}

function clearAllEvent() {
    document.getElementById("buttonClear").addEventListener("click", function () {
        isBuilt = false;
        data = undefined;
        let root = document.getElementById("treeStart");
        while (root.hasChildNodes()) {
            root.removeChild(root.firstChild);
        }

        document.getElementById("fileName").textContent = "File isn't chosen";
        isFileChosen = false;

        let textArea = document.getElementById("inputDataset");
        textArea.value = "";
        disableInput(false);
    });
}

function showResultEvent() {

}
