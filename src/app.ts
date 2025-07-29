import "./global";
import HappyWheels from "@/com/totaljerkface/game/HappyWheels";

globalThis.HappyWheels = HappyWheels;

globalThis.document.getElementById('happyswf').scrollHappened = () => {};

const hw = new HappyWheels();

globalThis.hw = hw;

stage.addChild(hw);

if (root.loaderInfo.parameters.levelID) {
    hw.levelID = Number(root.loaderInfo.parameters.levelID);
} else if (root.loaderInfo.parameters.replayID) {
    hw.replayID = Number(root.loaderInfo.parameters.replayID);
}

if (root.loaderInfo.parameters.userID) {
    hw.userID = Number(root.loaderInfo.parameters.userID);
    hw.userName = String(root.loaderInfo.parameters.userName);
}

if (root.loaderInfo.parameters.potato) {
    hw.potato = String(root.loaderInfo.parameters.potato);
}

if (root.loaderInfo.parameters.isMac == "true") {
    hw.isMac = true;
}

if (root.loaderInfo.parameters.readOnly == "true") {
    hw.readOnly = true;
}

// hw.preloadTimer = this.timer; ?

hw.init();