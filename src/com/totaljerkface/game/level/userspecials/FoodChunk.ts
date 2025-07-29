import b2CircleDef from "@/Box2D/Collision/Shapes/b2CircleDef";
import b2Shape from "@/Box2D/Collision/Shapes/b2Shape";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2Body from "@/Box2D/Dynamics/b2Body";
import b2BodyDef from "@/Box2D/Dynamics/b2BodyDef";
import Settings from "@/com/totaljerkface/game/Settings";
import LevelItem from "@/com/totaljerkface/game/level/LevelItem";
import FoodItem from "@/com/totaljerkface/game/level/userspecials/FoodItem";
import { boundClass } from 'autobind-decorator';
import MovieClip from "flash/display/MovieClip";

@boundClass
export default class FoodChunk extends LevelItem {
    private _index: number;
    private _refMC: MovieClip;
    private _mc: MovieClip;
    private _shape: b2Shape;
    private _body: b2Body;
    private _pointPrefix: string = "p";
    private _circlePrefix: string;

    constructor(
        param1: number,
        param2: b2Body,
        param3: MovieClip,
        param4: FoodItem,
    ) {
        super();
        this.createBody(param1, param3, param2, param4);
    }

    public createBody(
        param1: number,
        param2: MovieClip,
        param3: b2Body,
        param4: FoodItem,
    ) {
        var _loc5_: b2Vec2 = null;
        var _loc7_: number = NaN;
        this._mc = param2["m" + param1];
        _loc5_ = param3.GetWorldPoint(
            new b2Vec2(
                this._mc.x / this.m_physScale,
                this._mc.y / this.m_physScale,
            ),
        );
        var _loc6_: number = _loc5_.x * this.m_physScale;
        _loc7_ = _loc5_.y * this.m_physScale;
        this._mc.x = _loc6_;
        this._mc.y = _loc7_;
        this._mc.rotation =
            (param3.GetAngle() * LevelItem.oneEightyOverPI) % 360;
        var _loc8_ = new b2BodyDef();
        var _loc9_ = new b2CircleDef();
        _loc9_.density = 2;
        _loc9_.friction = 0.3;
        _loc9_.filter.categoryBits = 8;
        _loc9_.restitution = 0.1;
        _loc8_.position.Set(_loc5_.x, _loc5_.y);
        _loc8_.angle = param3.GetAngle();
        var _loc10_: b2Body =
            Settings.currentSession.m_world.CreateBody(_loc8_);
        _loc10_.SetLinearVelocity(param3.GetLinearVelocity());
        _loc10_.SetAngularVelocity(param3.GetAngularVelocity());
        var _loc11_: MovieClip = param2["c" + param1];
        _loc9_.radius = _loc11_.width / 2 / this.m_physScale;
        var _loc12_: b2Shape = _loc10_.CreateShape(_loc9_);
        _loc12_.SetMaterial(1);
        _loc12_.SetUserData(param4);
        _loc10_.SetMassFromShapes();
        Settings.currentSession.level.paintBodyVector.push(_loc10_);
        _loc10_.SetUserData(this._mc);
        Settings.currentSession.level.background.addChild(this._mc);
    }
}