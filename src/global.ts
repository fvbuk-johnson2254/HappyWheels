import OpenFlStage from "flash/display/Stage";
import OpenFlEvent from "flash/events/Event";
import FlashDate from "./extra/Date";
import FlashDictionary from "./extra/Dictionary";
import FlashVector from "./extra/Vector";
import FlashXML from "./extra/XML";
import FlashXMLList from "./extra/XMLList";
import assets from "@assets/json/assets.json";
import Sprite from 'flash/display/Sprite';
import TextField from 'flash/text/TextField';
import Bitmap from "flash/display/Bitmap";
import BitmapData from "flash/display/BitmapData";
import DisplayObjectContainer from "flash/display/DisplayObjectContainer";


const FIXED_ONE = 65536;

async function loadBitmap(imgPath: string, container: DisplayObjectContainer): Promise<void> {
    try {
        const bitmapData = await BitmapData.loadFromFile(imgPath);
        const bitmap = new Bitmap(bitmapData);

        bitmap.x = -bitmap.width / 2;
        bitmap.y = -bitmap.height / 2;
        console.log(bitmap.width + "," + bitmap.height);

        container.addChild(bitmap);
    } catch (error) {
        console.error("Bitmap load failed:", error);

        const placeholder = new Sprite()
        placeholder.graphics.beginFill(0xFF0000, 0.5);
        placeholder.graphics.drawRect(0, 0, 50, 50);
        container.addChild(placeholder);
    }
}

function screenToLocal(absX: number, absY: number, parent: DisplayObjectContainer) {
    // Step 1: translate by parent's position
    let dx = absX - (parent.x || 0);
    let dy = absY - (parent.y || 0);

    // Step 2: rotate by negative parent rotation
    const angle = -((parent.rotation || 0) * Math.PI / 180);
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    const rotatedX = dx * cos - dy * sin;
    const rotatedY = dx * sin + dy * cos;

    // Step 3: scale by inverse parent scale
    const scaleX = parent.scaleX || 1;
    const scaleY = parent.scaleY || 1;

    const localX = rotatedX / scaleX;
    const localY = rotatedY / scaleY;

    return { x: localX, y: localY };
}


function rgbaToDecimal(r, g, b, a) {
    // Ensure RGB values are within 0-255 and alpha is between 0-1
    r = Math.max(0, Math.min(255, r));
    g = Math.max(0, Math.min(255, g));
    b = Math.max(0, Math.min(255, b));
    a = Math.max(0, Math.min(1, a));

    // Convert alpha from [0,1] to [0,255]
    const alpha = Math.round(a * 255);

    // Shift values into a single integer (decimal)
    return ((alpha << 24) | (r << 16) | (g << 8) | b) >>> 0;
}

const logEmbed = false;

globalThis.embedRecursive = function embedRecursive(root, names, symbolId, parent = root, index = 0) {
    const symbol = (assets as any).tags.find(sym => sym.id === symbolId);
    if (!symbol || !symbol?.tags?.length) return;

    const entries = Object.entries(names);

    for (const tag of symbol.tags) {
        // Skip ShowFrame and other blacklisted tags
        if (['ShowFrame'].includes(tag.type)) continue;

        // Check if this is a PlaceObject tag with a characterId
        if (tag.character_id) {
            const childSymbol = (assets as any).tags.find(sym => sym.id === tag.character_id);
            if (!childSymbol) continue;

            // Check if this is a named item from our names object
            const entry = entries.find(([n]) => n === tag.name);
            const Class = entry ? entry[1] : Sprite;
            const item = new (Class as any)();

            if (entry) {
                item.name = tag.name;
                root[tag.name] = item;
            }

            // Set position if it's a PlaceObject tag
            if (tag.matrix) {
                // flash is special because it wants to use twip units (1/20 of a pixel) so we divide it here
                let posX = tag.matrix.translate_x / 20;
                let posY = tag.matrix.translate_y / 20;


                item.x = posX;
                item.y = posY;
            }

            // Handle DefineShape
            if (childSymbol.type === 'DefineShape') {
                loadBitmap(
                    `assets/out/${childSymbol.id}.png`,
                    item
                );
            }
            // Handle DefineDynamicText (added back)
            else if (childSymbol.type === 'DefineDynamicText') {
                item.textColor = rgbaToDecimal(childSymbol.color.r, childSymbol.color.g, childSymbol.color.b, childSymbol.color.a);
                item.autoSize = true;
                if (childSymbol.html) {
                    item.htmlText = childSymbol.text;
                } else {
                    item.text = childSymbol.text;
                }
            }

            // Recursively process the child symbol
            embedRecursive(root, names, tag.character_id, item, index + 1);

            // Add to parent
            parent.addChild?.(item);
        }
    }
}


const trace = (...args: any[]) => console.log(...args);

const root = {
    loaderInfo: {
        url: "https://totaljerkface.com/",
        parameters: {
            levelID: "",
            replayID: "",
            userID: "",
            potato: "",
            userName: "",
            isMac: "false",
            readOnly: "false"
        }
    }
};

const stage = new OpenFlStage(900, 500, 0xFFFFFF, null);

globalThis.document.body.appendChild(stage.element);

const addChild = (child: any) => stage.addChild(child);
const removeChild = (child: any) => stage.removeChild(child);
const addChildAt = (child: any, index: number) => stage.addChildAt(child, index);

const getDefinitionByName = (name: string) => {
    console.log('getDefinitionByName()');
    return {};
};

const getQualifiedClassName = (object: any) => {
    console.log('getQualifiedClassName()');
    return '';
};

const navigateToURL = (url: any, target?: string) => {
    console.log('navigateToURL()');
};

const int = (n: any): number => Math.trunc(n);
const uint = (n: any): number => n >>> 0;

const startTime = performance.now();
const getTimer = () => performance.now() - startTime;

const Event = OpenFlEvent;
const Vector = FlashVector;
const Dictionary = FlashDictionary;
const XML = FlashXML;
const XMLList = FlashXMLList;
const Date = FlashDate;

export const TopLevel = {
    trace,
    root,
    stage,
    addChild,
    removeChild,
    addChildAt,
    getDefinitionByName,
    getQualifiedClassName,
    navigateToURL,
    int,
    uint,
    getTimer,
    Event,
    Vector,
    Dictionary,
    XML,
    XMLList,
    Date
};

Object.assign(globalThis, TopLevel);

export { };