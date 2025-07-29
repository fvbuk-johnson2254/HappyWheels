import BitmapData from "flash/display/BitmapData";
import { boundClass } from 'autobind-decorator';

@boundClass
export default class BitmapManager {
    private static _instance: BitmapManager;
    private _textures: {};

    constructor() {
        if (BitmapManager._instance) {
            throw new Error("BitmapManager already exists");
        }
        BitmapManager._instance = this;
        this.init();
    }

    public static get instance(): BitmapManager {
        return BitmapManager._instance;
    }

    private init() {
        this._textures = new Object();
    }

    public get textures(): {} {
        return this._textures;
    }

    public addTexture(param1: string, param2: BitmapData) {
        this._textures[param1] = param2;
    }

    public getTexture(param1: string): BitmapData {
        return this._textures[param1];
    }
}