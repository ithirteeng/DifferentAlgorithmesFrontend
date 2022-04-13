class Node {
    constructor() {
        this.criteria = null;
        this.level = 0;
        this.branches = [];
        this.parent = null;
        this.name = null;
        this.data = null;
    }

    setParent(parent) {
        this.parent = parent;
    }

    addBranch(branch) {
        this.branches.push(branch);
    }

    setName(name) {
        this.name = name;
    }

}

class Tree {
    constructor(root) {
        this.root = root;
        this.nodes = [root]
    }

    getMaxGain(data) {
        let maxKey;
        let maxGain = 0;
        for (let i = 0; i < data[0].length - 1; i++) {
            let gain = this.gainCalculation(data[0][i], data);
            if (gain > maxGain) {
                maxGain = gain;
                maxKey = data[0][i];
            }
        }
        return maxKey;
    }

    splitData(key, object, data) {
        let index = this.getKeyIndex(key, data);
        let updateData = [];
        updateData[0] = [];
        for (let i = 0; i < data[0].length; i++) {
            updateData[0][i] = data[0][i];
        }
        for (let i = 1; i < data.length; i++) {
            if (object === data[i][index]) {
                updateData[updateData.length] = [];
                for (let j = 0; j < data[0].length; j++) {
                    updateData[updateData.length - 1].push(data[i][j]);
                }
            }
        }
        return updateData;
    }

    gainCalculation(key, data) {
        let gain = this.getEntropy(key, null, data);
        let names = this.getUniqueNames(key, data);
        let mainQuantity = this.sumOfClassCount(key, null, data);

        for (let i = 0; i < names.length; i++) {
            let currentEntropy = this.getEntropy(key, names[i], data);
            let currentQuantity = this.sumOfClassCount(key, names[i], data);
            gain -= Math.abs(currentQuantity / mainQuantity) * currentEntropy;
        }

        return gain;
    }

    getEntropy(key, object, data) {
        let countArray = this.getClassCount(key, object, data);
        for (let i = 0; i < countArray.length; i++) {
            if (countArray[i] === 0) {
                return 0;
            }
        }
        let entropy = 0;
        for (let i = 0; i < countArray.length; i++) {
            let p = this.getProportions(countArray, i);
            entropy -= p * Math.log2(p);
        }

        return entropy;
    }

    sumOfClassCount(key, object, data) {
        let tempArray = this.getClassCount(key, object, data);
        let sum = 0;
        for (let i = 0; i < tempArray.length; i++) {
            sum += tempArray[i];
        }
        return sum;
    }

    getKeyIndex(key, data) {
        let index = 0;
        for (let i = 0; i < data[0].length; i++) {
            if (data[0][i] === key) {
                index = i;
                break;
            }
        }

        return index;
    }

    getUniqueNames(key, data) {
        let index = this.getKeyIndex(key, data);
        let names = []
        for (let i = 1; i < data.length; i++) {
            let string = data[i][index];
            let counter = 0;
            for (let j = 0; j < names.length; j++) {
                if (names[j] === string) {
                    counter++;
                }
            }
            if (counter === 0) {
                names.push(string);
            }
        }

        return names;
    }

    getClassCount(key, object, data) {
        let flag = false;
        let index = this.getKeyIndex(key, data);
        if (object === null) {
            flag = true;
        }
        let uniqueClassNames = this.getUniqueNames(data[0][data[0].length - 1], data);
        let lastClassSymbols = new Array(uniqueClassNames.length);
        for (let i = 0; i < lastClassSymbols.length; i++) {
            lastClassSymbols[i] = 0;
        }
        for (let i = 1; i < data.length; i++) {
            for (let j = 0; j < uniqueClassNames.length; j++) {
                if (flag) {
                    if (uniqueClassNames[j] === data[i][data[0].length - 1]) {
                        lastClassSymbols[j]++;
                    }
                } else {
                    if (uniqueClassNames[j] === data[i][data[0].length - 1] && object === data[i][index]) {
                        lastClassSymbols[j]++;
                    }
                }
            }
        }

        return lastClassSymbols;
    }

    getProportions(array, index) {
        let sum = 0;
        for (let i = 0; i < array.length; i++) {
            sum += array[i];
        }

        return array[index] / sum;
    }

    splitForOne(path, data) {
        let currentMatrix = [];
        currentMatrix[0] = []
        for (let i = path.length - 1; i >= 0; i -= 2) {
            let key = path[i];
            for (let j = 0; j < data[0].length; j++) {
                if (data[0][j] === key) {
                    currentMatrix[0].push(key);
                }
                if (i - 2 < 0 && j === data[0].length - 1) {
                    currentMatrix[0].push(data[0][data[0].length - 1]);
                }
            }
        }
        for (let i = 1; i < data.length; i++) {
            currentMatrix[i] = [];
        }
        for (let j = 0; j < currentMatrix[0].length; j++) {
            for (let k = 1; k < data.length; k++) {
                for (let l = 0; l < data[0].length; l++) {
                    if (data[0][l] === currentMatrix[0][j]) {
                        currentMatrix[k].push(data[k][l]);
                    }
                }
            }
        }
        for (let i = path.length - 1; i >= 0; i -= 2) {
            let key = path[i];
            let object = path[i - 1];
            for (let j = 0; j < currentMatrix[0].length - 1; j++) {
                let counter = 0
                if (currentMatrix[0][j] === key) {
                    for (let k = 1; k < currentMatrix.length; k++) {
                        if (currentMatrix[k][j] !== object) {
                            counter++;
                        }
                    }
                    let secondCounter = 0;
                    while (secondCounter !== counter) {
                        for (let k = 1; k < currentMatrix.length; k++) {
                            if (currentMatrix[k][j] !== object) {
                                currentMatrix.splice(k, 1);
                                secondCounter++;
                            }
                        }
                    }
                }

            }

        }


        return currentMatrix;
    }

    id3Algorithm(data) {
        let rootName = this.getMaxGain(data);
        this.root.setName(rootName);
        this.root.data = data;
        let stack = [];
        stack.push(this.root);
        while (stack.length !== 0) {
            console.log(stack)
            let variants = this.getUniqueNames(stack[0].name, stack[0].data);
            for (let i = 0; i < variants.length; i++) {
                let splitMatrix = this.splitData(stack[0].name, variants[i], stack[0].data);
                let node = new Node();
                node.criteria = variants[i];
                node.data = splitMatrix;
                node.setParent(stack[0]);
                node.level = node.parent.level + 1;
                this.nodes.push(node);

                let entropyOfVariant = this.getEntropy(stack[0].name, variants[i], stack[0].data);
                if (entropyOfVariant === 0 || node.data[0].length === 1) {
                    if (entropyOfVariant === 0) {
                        let namesLast = this.getUniqueNames(data[0][data[0].length - 1], node.data);
                        node.setName(namesLast[0]);
                    } else {
                        let currentNode = node;
                        let path = [];
                        while (currentNode.parent != null) {
                            path.push(currentNode.criteria);
                            path.push(currentNode.parent.name);
                            currentNode = currentNode.parent;
                        }
                        let matrix = this.splitForOne(path, node.data);
                        let namesLast = this.getUniqueNames(data[0][data[0].length - 1], matrix);
                        node.setName(namesLast[0]);
                    }
                } else {
                    node.setName(this.getMaxGain(node.data));
                    stack.push(node);
                }
                stack[0].addBranch(node);
            }
            stack.splice(0, 1);
        }

        return this.root;
    }

}


