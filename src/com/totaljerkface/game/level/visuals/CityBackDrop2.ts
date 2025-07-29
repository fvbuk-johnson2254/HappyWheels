import BackDrop from "@/com/totaljerkface/game/level/visuals/BackDrop";
import CitySource2 from "@/top/CitySource2";
import { boundClass } from 'autobind-decorator';
import Sprite from "flash/display/Sprite";

@boundClass
export default class CityBackDrop2 extends BackDrop {
    constructor() {
        super(new CitySource2(), 0.25, true, 5, 3);
    }

    protected override createBitmaps() {
        var _loc1_: Sprite = this._visual.getChildByName("b1") as Sprite;
        this.drawBitmap(_loc1_, true, 2500);
        _loc1_ = this._visual.getChildByName("b2") as Sprite;
        this.drawBuilding(_loc1_, 40, 50, true, 2500);
        _loc1_ = this._visual.getChildByName("b3") as Sprite;
        this.drawBuilding(_loc1_, 46, 50, true, 2500);
        _loc1_ = this._visual.getChildByName("b4") as Sprite;
        this.drawBuilding(_loc1_, 15, 50, true, 2500);
        this._visual = null;
    }
}