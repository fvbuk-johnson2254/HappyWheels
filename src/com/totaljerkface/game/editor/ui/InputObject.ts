import MouseHelper from "@/com/totaljerkface/game/editor/MouseHelper";
import { boundClass } from 'autobind-decorator';
import Sprite from "flash/display/Sprite";
import MouseEvent from "flash/events/MouseEvent";

@boundClass
export default class InputObject extends Sprite {
    protected _editable: boolean;
    protected _ambiguous: boolean;
    protected _multipleIndex: number = 0;
    protected _multipleKey: {};
    protected _expandable: boolean;
    public attribute: string;
    public childInputs: any[];
    public parentInput: InputObject;
    protected _helpCaption: string;
    protected _defaultValue;

    public set editable(param1: boolean) {
        this._editable = param1;
    }

    public get editable(): boolean {
        return this._editable;
    }

    public die() {
        this.removeEventListener(MouseEvent.ROLL_OVER, this.mouseOverHandler);
    }

    public setToAmbiguous() { }

    public get ambiguous(): boolean {
        return this._ambiguous;
    }

    public get multipleIndex(): number {
        return this._multipleIndex;
    }

    public set multipleIndex(param1: number) {
        this._multipleIndex = param1;
    }

    public get multipleKey(): {} {
        return this._multipleKey;
    }

    public set multipleKey(param1: {}) {
        this._multipleKey = param1;
    }

    public setValue(param1) { }

    public get helpCaption(): string {
        return this._helpCaption;
    }

    public set helpCaption(param1: string) {
        this._helpCaption = param1;
        if (this._helpCaption) {
            this.addEventListener(MouseEvent.ROLL_OVER, this.mouseOverHandler);
        }
    }

    protected mouseOverHandler(param1: MouseEvent) {
        if (!this._editable) {
            return;
        }
        MouseHelper.instance.show(this._helpCaption, this);
    }

    public get defaultValue() {
        return this._defaultValue;
    }

    public set defaultValue(param1) {
        this._defaultValue = param1;
    }

    public get expandable(): boolean {
        return this._expandable;
    }
}