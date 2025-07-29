import { boundClass } from 'autobind-decorator';
import Sprite from "flash/display/Sprite";
import ColorTransform from "flash/geom/ColorTransform";

@boundClass
export default class DropperCursor extends Sprite {
    public changer: Sprite;
    private _color: number = 16777215;

    public get color(): number {
        return this._color;
    }

    public set color(param1: number) {
        this._color = param1;
        var _loc2_ = new ColorTransform();
        _loc2_.color = param1;
        this.changer.transform.colorTransform = _loc2_;
    }
}