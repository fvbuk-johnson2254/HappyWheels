import BackDrop from "@/com/totaljerkface/game/level/visuals/BackDrop";
import CitySource1 from "@/top/CitySource1";
import { boundClass } from 'autobind-decorator';
import Sprite from "flash/display/Sprite";

@boundClass
export default class CityBackDrop1 extends BackDrop {
    constructor() {
        super(new CitySource1(), 0.5, true, 2, 3);
    }

    protected override createBitmaps() {
        var _loc1_: Sprite = this._visual.getChildByName("b1") as Sprite;
        this.drawBuilding(_loc1_, 90, 88, true, 5000);
        _loc1_ = this._visual.getChildByName("b2") as Sprite;
        this.drawBuilding(_loc1_, 140, 90, true, 5000);
        _loc1_ = this._visual.getChildByName("b3") as Sprite;
        this.drawBuilding(_loc1_, 60, 102, true, 5000);
        _loc1_ = this._visual.getChildByName("b4") as Sprite;
        this.drawBuilding(_loc1_, 160, 101, true, 5000);
        this._visual = null;
    }
}