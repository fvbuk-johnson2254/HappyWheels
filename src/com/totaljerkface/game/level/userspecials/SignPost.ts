import b2Body from "@/Box2D/Dynamics/b2Body";
import Settings from "@/com/totaljerkface/game/Settings";
import SignPostRef from "@/com/totaljerkface/game/editor/specials/SignPostRef";
import Special from "@/com/totaljerkface/game/editor/specials/Special";
import LevelB2D from "@/com/totaljerkface/game/level/LevelB2D";
import LevelItem from "@/com/totaljerkface/game/level/LevelItem";
import PostMC from "@/top/PostMC";
import SignMC from "@/top/SignMC";
import { boundClass } from 'autobind-decorator';
import DisplayObject from "flash/display/DisplayObject";
import MovieClip from "flash/display/MovieClip";
import Sprite from "flash/display/Sprite";
import Point from "flash/geom/Point";

@boundClass
export default class SignPost extends LevelItem {
    private mc: MovieClip;

    constructor(param1: Special, param2: b2Body = null, param3: Point = null) {
        super();
        var _loc7_: MovieClip = null;

        var _loc4_: SignPostRef = param1 as SignPostRef;
        _loc4_ = _loc4_.clone() as SignPostRef;
        var _loc5_: LevelB2D = Settings.currentSession.level;
        var _loc6_: Sprite = _loc5_.background;
        this.mc = new SignMC();
        this.mc.gotoAndStop(_loc4_.signPostType);
        _loc6_.addChild(this.mc);
        this.mc.x = param1.x;
        this.mc.y = param1.y;
        if (_loc4_.signPost) {
            _loc7_ = new PostMC();
            this.mc.addChildAt(_loc7_, 0);
        }
        this.mc.rotation = _loc4_.rotation;
    }

    public override get groupDisplayObject(): DisplayObject {
        return this.mc;
    }
}