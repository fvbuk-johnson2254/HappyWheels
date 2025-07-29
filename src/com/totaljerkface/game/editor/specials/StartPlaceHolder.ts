import Settings from "@/com/totaljerkface/game/Settings";
import RefSprite from "@/com/totaljerkface/game/editor/RefSprite";
import { boundClass } from 'autobind-decorator';
import MovieClip from "flash/display/MovieClip";
import Sprite from "flash/display/Sprite";

/* [Embed(source="/_assets/assets.swf", symbol="symbol991")] */
@boundClass
export default class StartPlaceHolder extends RefSprite {
    public mc: MovieClip;
    private minIndex: number = 1;
    private maxIndex: number = Settings.totalCharacters;
    private _characterIndex: number = 1;
    private _forceChar: boolean;
    private _hideVehicle: boolean = false;

    constructor() {
        super();
        this.maxIndex = Settings.totalCharacters;
        this.name = "main character";
        this.deletable = false;
        this.cloneable = false;
        this.rotatable = false;
        this.scalable = false;
        this.mc.gotoAndStop(1);
    }

    public override setAttributes() {
        this._attributes = [
            "x",
            "y",
            "characterIndex",
            "forceChar",
            "hideVehicle",
        ];
    }

    public get characterIndex(): number {
        return this._characterIndex;
    }

    public set characterIndex(param1: number) {
        if (param1 < this.minIndex) {
            param1 = this.minIndex;
        }
        if (param1 > this.maxIndex) {
            param1 = this.maxIndex;
        }
        trace("character index value: " + param1);
        this._characterIndex = param1;
        this.mc.gotoAndStop(param1);
        // @ts-expect-error
        var _loc2_: Sprite = this.mc.vehicle;
        // @ts-expect-error
        this.mc.vehicle.visible = this._hideVehicle ? false : true;
        if (this._selected) {
            this.drawBoundingBox();
        }
        this.x = this.x;
        this.y = this.y;
    }

    public get hideVehicle(): boolean {
        return this._hideVehicle;
    }

    public set hideVehicle(param1: boolean) {
        this._hideVehicle = param1;
        // @ts-expect-error
        this.mc.vehicle.visible = this._hideVehicle ? false : true;
        if (this._selected) {
            this.drawBoundingBox();
        }
    }

    public get forceChar(): boolean {
        return this._forceChar;
    }

    public set forceChar(param1: boolean) {
        this._forceChar = param1;
    }
}