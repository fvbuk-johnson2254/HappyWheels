import b2PolygonDef from "@/Box2D/Collision/Shapes/b2PolygonDef";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import BitmapManager from "@/com/totaljerkface/game/BitmapManager";
import Settings from "@/com/totaljerkface/game/Settings";
import Building2Ref from "@/com/totaljerkface/game/editor/specials/Building2Ref";
import Special from "@/com/totaljerkface/game/editor/specials/Special";
import LevelItem from "@/com/totaljerkface/game/level/LevelItem";
import { boundClass } from 'autobind-decorator';
import Sprite from "flash/display/Sprite";
import Matrix from "flash/geom/Matrix";

@boundClass
export default class Building2 extends LevelItem {
    private sprite: Sprite;

    constructor(param1: Special) {
        super();
        var _loc2_: Building2Ref = null;
        var _loc4_: number = NaN;
        var _loc6_: number = NaN;
        var _loc7_: number = NaN;

        _loc2_ = param1 as Building2Ref;
        var _loc3_ = new b2PolygonDef();
        _loc3_.friction = 0.3;
        _loc3_.restitution = 0.1;
        _loc3_.filter.categoryBits = 8;
        _loc4_ = _loc2_.floorWidth * 500 + 226;
        var _loc5_: number = _loc2_.numFloors * 180 + 120;
        _loc6_ = 0;
        _loc7_ = 0;
        var _loc8_ = new b2Vec2(
            _loc2_.x + _loc6_ + _loc4_ * 0.5,
            _loc2_.y + _loc7_ + _loc5_ * 0.5,
        );
        _loc3_.SetAsOrientedBox(
            (_loc4_ * 0.5) / this.m_physScale,
            (_loc5_ * 0.5) / this.m_physScale,
            new b2Vec2(
                _loc8_.x / this.m_physScale,
                _loc8_.y / this.m_physScale,
            ),
            0,
        );
        Settings.currentSession.level.levelBody.CreateShape(_loc3_);
        var _loc9_ = BitmapManager.instance;
        this.sprite = new Sprite();
        this.sprite.x = param1.x;
        this.sprite.y = param1.y;
        var _loc10_ = new Matrix(1, 0, 0, 1, _loc6_, _loc7_);
        this.sprite.graphics.beginBitmapFill(
            _loc9_.getTexture(Building2Ref.B2_ROOF),
            _loc10_,
            true,
            false,
        );
        this.sprite.graphics.drawRect(_loc6_, _loc7_, _loc4_, 120);
        this.sprite.graphics.endFill();
        _loc7_ += 120;
        _loc10_ = new Matrix(1, 0, 0, 1, _loc6_, _loc7_);
        this.sprite.graphics.beginBitmapFill(
            _loc9_.getTexture(Building2Ref.B2_FLOOR),
            _loc10_,
            true,
            false,
        );
        this.sprite.graphics.drawRect(
            _loc6_,
            _loc7_,
            _loc4_,
            180 * _loc2_.numFloors,
        );
        this.sprite.graphics.endFill();
        var _loc11_: Sprite = Settings.currentSession.level.background;
        _loc11_.addChild(this.sprite);
    }
}