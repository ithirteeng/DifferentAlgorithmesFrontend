import {fiveMain} from "./five/fiveNeural.js";
import {fiftyMain} from "./fifty/fiftyNeural.js";

alert("Настройте громкость звука")
playMusic()

function playMusic() {
    let music = document.createElement("audio");
    music.src = "./src/music/neural2_2.m4a"
    music.autoplay = true;
}

let isFiftyNeural = false;
switchButtonEvent();

function switchButtonEvent() {
    fiveMain();
    let button = document.getElementById("fiftyButton");
    button.addEventListener("click", function () {
        let string = document.getElementById("updateNumber").textContent;
        if (string[string.length - 1] >= '0' && string[string.length - 1] <= '9') {
            string = string.slice(0, -1)
        }
        document.getElementById("updateNumber").textContent = string;

        if (!isFiftyNeural) {
            document.querySelector('td').remove();
            button.textContent = "5x5";
            isFiftyNeural = true;
            fiftyMain();
        } else {
            document.querySelector('td').remove();
            button.textContent = "50x50";
            isFiftyNeural = false;
            fiveMain();
        }
    })
}
