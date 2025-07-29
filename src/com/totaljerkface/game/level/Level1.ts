import MemoryTest from "@/com/totaljerkface/game/MemoryTest";
import Session from "@/com/totaljerkface/game/Session";
import Settings from "@/com/totaljerkface/game/Settings";
import Bridge from "@/com/totaljerkface/game/level/Bridge";
import Gear from "@/com/totaljerkface/game/level/Gear";
import LandMine from "@/com/totaljerkface/game/level/LandMine";
import LevelB2D from "@/com/totaljerkface/game/level/LevelB2D";
import PrisBlock from "@/com/totaljerkface/game/level/PrisBlock";
import BackDrop from "@/com/totaljerkface/game/level/visuals/BackDrop";
import { boundClass } from 'autobind-decorator';
import Bitmap from "flash/display/Bitmap";
import BitmapData from "flash/display/BitmapData";
import DisplayObject from "flash/display/DisplayObject";
import MovieClip from "flash/display/MovieClip";
import Sprite from "flash/display/Sprite";

@boundClass
export default class Level1 extends LevelB2D {
    constructor(param1: Sprite, param2: Session) {
        super(param1, param2);
        var _loc3_ = MemoryTest.instance;
        _loc3_.addEntry("Level1_", this);
        _loc3_.traceContents();
    }

    public override convertBackground() {
        var _loc4_: Bitmap = null;
        super.convertBackground();
        if (Settings.useCompressedTextures) {
            return;
        }
        var _loc1_: DisplayObject = this.background["chasm"];
        var _loc2_ = new BitmapData(
            _loc1_.width,
            _loc1_.height,
            true,
            16777215,
        );
        _loc2_.draw(_loc1_);
        var _loc3_: number = 0;
        while (_loc3_ < 4) {
            _loc4_ = new Bitmap(_loc2_);
            this.background.addChildAt(
                _loc4_,
                this.background.getChildIndex(_loc1_),
            );
            _loc4_.x = _loc1_.x;
            _loc4_.y = _loc1_.y + _loc3_ * _loc1_.height;
            _loc3_++;
        }
        this.background.removeChild(_loc1_);
    }

    public override createBackDrops() {
        var _loc4_: MovieClip = null;
        var _loc5_: BackDrop = null;
        var _loc6_: MovieClip = null;
        var _loc7_: BackDrop = null;
        var _loc8_: MovieClip = null;
        var _loc9_: BackDrop = null;
        this.backDrops = new Vector<BackDrop>();
        var _loc1_: number = Settings.numBackgroundLayers;
        if (_loc1_ > 1) {
            _loc4_ = this.levelData["backdrop3"];
            _loc5_ = new BackDrop(_loc4_, 0.1, true, 3);
            this._session.addChildAt(_loc5_, 0);
            this.backDrops.push(_loc5_);
        }
        if (_loc1_ > 2) {
            _loc6_ = this.levelData["backdrop2"];
            _loc7_ = new BackDrop(_loc6_, 0.05, true, 6);
            this._session.addChildAt(_loc7_, 0);
            this.backDrops.push(_loc7_);
        }
        var _loc2_: MovieClip = this.levelData["backdrop4"];
        var _loc3_ = new BackDrop(_loc2_, 0.01, true, 7);
        this._session.addChildAt(_loc3_, 0);
        this.backDrops.push(_loc3_);
        if (_loc1_ > 0) {
            _loc8_ = this.levelData["backdrop1"];
            _loc9_ = new BackDrop(_loc8_, 0, false);
            this._session.addChildAt(_loc9_, 0);
            this.backDrops.push(_loc9_);
        }
    }

    public override createItems() {
        super.createItems();
        var _loc1_ = [
            this.shapeGuide["ba0"],
            this.shapeGuide["ba1"],
            this.shapeGuide["ba2"],
            this.shapeGuide["ba3"],
            this.shapeGuide["ba4"],
            this.shapeGuide["ba5"],
        ];
        var _loc2_ = [
            this.background["bmc0"],
            this.background["bmc1"],
            this.background["bmc2"],
            this.background["bmc3"],
            this.background["bmc4"],
            this.background["bmc5"],
        ];
        var _loc3_ = new Bridge("ba", 6);
        this.paintItemVector.push(_loc3_);
        var _loc4_ = new Gear("geara", 0.1);
        this.paintItemVector.push(_loc4_);
        var _loc5_ = new Gear("gearb", 0.1, 3, 0.75, 0.1);
        this.paintItemVector.push(_loc5_);
        var _loc6_ = new PrisBlock("pb1", 3, 3.4);
        this.paintItemVector.push(_loc6_);
        this.actionsVector.push(_loc6_);
        var _loc7_ = new PrisBlock("pb2", 3, 3.4, 60, 90);
        this.paintItemVector.push(_loc7_);
        this.actionsVector.push(_loc7_);
        var _loc8_ = new PrisBlock("pb3", 3, 3.4);
        this.paintItemVector.push(_loc8_);
        this.actionsVector.push(_loc8_);
        var _loc9_ = new LandMine("mine1");
    }
}