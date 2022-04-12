function parseCSV(stringSCV) {
    let answerStringArray = []
    let regex = /("([^"]|"")*"|([^"(,|;)\n]*))?([(,|;)\n])?/
    let size = 0;
    let flag = false;
    while (regex.test) {
        let tempArray = regex.exec(stringSCV);
        if (tempArray[0] === "") {
            break;
        }
        let currentString = tempArray[1]
        if (tempArray[1][0] === '"') {
            currentString = "";
            for (let i = 1; i < tempArray[1].length - 1; i++) {
                currentString += tempArray[1][i];
            }
        }
        answerStringArray[answerStringArray.length] = currentString
        if ((!flag) && (tempArray[4] === '\n')) {
            flag = true;
            size++;
        } else {
            if (!flag) {
                size++;
            }
        }
        stringSCV = stringSCV.replace(regex, "")
    }
    answerStringArray[answerStringArray.length] = size;

    let string = answerStringArray;
    let stringSize = string[string.length - 1];
    let counter = 0;
    let row = 0;
    let stringData = [];

    for (let i = 0; i < ((string.length - 1) / stringSize); i++) {
        stringData[i] = [];
    }
    for (let i = 0; i < string.length - 1; i++) {
        if (counter < stringSize) {
            stringData[row][counter] = string[i];
            counter++;
        } else {
            counter = 0;
            row++;
            i--;
        }
    }
    return stringData;
}