let stringData = parseCSV( "Соперник,Играем,Лидеры,Дождь,Победа\n" +
    "Выше,Дома,На месте,Идет,Нет\n" +
    "Выше,Дома,На месте,Не Идет,Да\n" +
    "Выше,Дома,Пропускают,Не Идет,Нет\n" +
    "Ниже,Дома,Пропускают,Не Идет,Да\n" +
    "Ниже,В гостях,Пропускают,Не Идет,Нет\n" +
    "Ниже,Дома,Пропускают,Идет,Да\n" +
    "Выше,В гостях,На месте,Идет,Нет\n" +
    "Ниже,В гостях,На месте,Не Идет,Да"
);

let node = new Node();
let tree = new Tree(node);

console.log("works");

let mainTree = document.getElementById("treeStart");
tree.id3Algorithm(stringData);

drawTree(tree.root, mainTree);

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