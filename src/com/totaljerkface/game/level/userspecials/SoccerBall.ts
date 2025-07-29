import b2CircleDef from "@/Box2D/Collision/Shapes/b2CircleDef";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2Body from "@/Box2D/Dynamics/b2Body";
import b2BodyDef from "@/Box2D/Dynamics/b2BodyDef";
import Settings from "@/com/totaljerkface/game/Settings";
import Special from "@/com/totaljerkface/game/editor/specials/Special";
import LevelB2D from "@/com/totaljerkface/game/level/LevelB2D";
import LevelItem from "@/com/totaljerkface/game/level/LevelItem";
import SoccerBallMC from "@/top/SoccerBallMC";
import { boundClass } from 'autobind-decorator';
import MovieClip from "flash/display/MovieClip";
import Sprite from "flash/display/Sprite";

@boundClass
export default class SoccerBall extends LevelItem {
    constructor(param1: Special) {
        super();
        this.createBody(new b2Vec2(param1.x, param1.y));
    }

    public createBody(param1: b2Vec2) {
        var _loc2_: b2BodyDef = null;
        _loc2_ = new b2BodyDef();
        var _loc3_ = new b2CircleDef();
        _loc3_.density = 0.5;
        _loc3_.friction = 0.1;
        _loc3_.restitution = 0.5;
        _loc3_.filter.categoryBits = 8;
        _loc3_.radius = 10 / this.m_physScale;
        _loc2_.position.Set(
            param1.x / this.m_physScale,
            param1.y / this.m_physScale,
        );
        var _loc4_: b2Body = Settings.currentSession.m_world.CreateBody(_loc2_);
        _loc4_.CreateShape(_loc3_);
        _loc4_.SetMassFromShapes();
        var _loc5_: LevelB2D = Settings.currentSession.level;
        var _loc6_: MovieClip = new SoccerBallMC();
        var _loc7_: Sprite = _loc5_.background;
        _loc7_.addChild(_loc6_);
        _loc4_.SetUserData(_loc6_);
        _loc5_.paintBodyVector.push(_loc4_);
    }
}