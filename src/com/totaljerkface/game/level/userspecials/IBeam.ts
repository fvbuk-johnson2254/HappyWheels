import b2PolygonDef from "@/Box2D/Collision/Shapes/b2PolygonDef";
import b2Shape from "@/Box2D/Collision/Shapes/b2Shape";
import b2ContactPoint from "@/Box2D/Collision/b2ContactPoint";
import b2Math from "@/Box2D/Common/Math/b2Math";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2Body from "@/Box2D/Dynamics/b2Body";
import b2BodyDef from "@/Box2D/Dynamics/b2BodyDef";
import ContactListener from "@/com/totaljerkface/game/ContactListener";
import Settings from "@/com/totaljerkface/game/Settings";
import IBeamRef from "@/com/totaljerkface/game/editor/specials/IBeamRef";
import Special from "@/com/totaljerkface/game/editor/specials/Special";
import LevelItem from "@/com/totaljerkface/game/level/LevelItem";
import Trigger from "@/com/totaljerkface/game/level/Trigger";
import SoundController from "@/com/totaljerkface/game/sound/SoundController";
import IBeamMC from "@/top/IBeamMC";
import { boundClass } from 'autobind-decorator';
import DisplayObject from "flash/display/DisplayObject";
import MovieClip from "flash/display/MovieClip";
import Sprite from "flash/display/Sprite";
import Point from "flash/geom/Point";

@boundClass
export default class IBeam extends LevelItem {
    private mc: MovieClip;
    private body: b2Body;
    private shape: b2Shape;

    constructor(param1: Special, param2: b2Body = null, param3: Point = null) {
        super();
        var _loc4_: IBeamRef = param1 as IBeamRef;
        if (param2) {
            this.body = param2;
        }
        var _loc5_ = new b2Vec2(_loc4_.x, _loc4_.y);
        if (param3) {
            _loc5_.Add(new b2Vec2(param3.x, param3.y));
        }
        this.createBody(
            _loc5_,
            (_loc4_.rotation * Math.PI) / 180,
            _loc4_.shapeWidth,
            _loc4_.shapeHeight,
            _loc4_.immovable2,
            _loc4_.sleeping,
        );
        this.mc = new IBeamMC();
        this.mc.width = _loc4_.shapeWidth;
        this.mc.height = _loc4_.shapeHeight;
        this.mc.x = _loc4_.x;
        this.mc.y = _loc4_.y;
        this.mc.rotation = _loc4_.rotation;
        var _loc6_: Sprite = Settings.currentSession.level.background;
        _loc6_.addChild(this.mc);
    }

    public createBody(
        param1: b2Vec2,
        param2: number,
        param3: number,
        param4: number,
        param5: boolean,
        param6: boolean,
    ) {
        var _loc7_ = new b2BodyDef();
        var _loc8_ = new b2PolygonDef();
        _loc8_.density = 75;
        _loc8_.friction = 0.3;
        _loc8_.restitution = 0.1;
        _loc8_.filter.categoryBits = 8;
        if (!param5) {
            if (this.body) {
                _loc8_.SetAsOrientedBox(
                    (param3 * 0.5) / this.m_physScale,
                    (param4 * 0.5) / this.m_physScale,
                    new b2Vec2(
                        param1.x / this.m_physScale,
                        param1.y / this.m_physScale,
                    ),
                    param2,
                );
                this.shape = this.body.CreateShape(_loc8_);
            } else {
                _loc8_.SetAsBox(
                    (param3 * 0.5) / this.m_physScale,
                    (param4 * 0.5) / this.m_physScale,
                );
                _loc7_.position.Set(
                    param1.x / this.m_physScale,
                    param1.y / this.m_physScale,
                );
                _loc7_.angle = param2;
                _loc7_.isSleeping = param6;
                this.body = Settings.currentSession.m_world.CreateBody(_loc7_);
                this.shape = this.body.CreateShape(_loc8_);
                this.body.SetMassFromShapes();
                Settings.currentSession.level.paintItemVector.push(this);
            }
            Settings.currentSession.contactListener.registerListener(
                ContactListener.ADD,
                this.shape,
                this.checkAdd,
            );
        } else {
            _loc8_.SetAsOrientedBox(
                (param3 * 0.5) / this.m_physScale,
                (param4 * 0.5) / this.m_physScale,
                new b2Vec2(
                    param1.x / this.m_physScale,
                    param1.y / this.m_physScale,
                ),
                param2,
            );
            Settings.currentSession.level.levelBody.CreateShape(_loc8_);
        }
    }

    public override paint() {
        var _loc1_: b2Vec2 = this.body.GetWorldCenter();
        this.mc.x = _loc1_.x * this.m_physScale;
        this.mc.y = _loc1_.y * this.m_physScale;
        this.mc.rotation =
            (this.body.GetAngle() * LevelItem.oneEightyOverPI) % 360;
    }

    public override getJointBody(param1: b2Vec2 = null): b2Body {
        return this.body;
    }

    public override get groupDisplayObject(): DisplayObject {
        return this.mc;
    }

    private checkAdd(param1: b2ContactPoint) {
        var _loc4_: number = NaN;
        if (param1.shape2.m_isSensor) {
            return;
        }
        var _loc2_: number = param1.shape2.m_body.m_mass;
        if (_loc2_ != 0 && _loc2_ < this.body.m_mass) {
            return;
        }
        var _loc3_: number = b2Math.b2Dot(param1.velocity, param1.normal);
        _loc3_ = Math.abs(_loc3_);
        if (_loc3_ > 4) {
            _loc4_ = Math.ceil(Math.random() * 2);
            SoundController.instance.playAreaSoundInstance(
                "IBeamHit" + _loc4_,
                this.body,
            );
        }
    }

    public override triggerSingleActivation(
        param1: Trigger,
        param2: string,
        param3: any[],
    ) {
        var _loc4_: number = NaN;
        var _loc5_: number = NaN;
        var _loc6_: number = NaN;
        var _loc7_: number = NaN;
        var _loc8_: number = NaN;
        if (param2 == "wake from sleep") {
            if (this.body) {
                this.body.WakeUp();
            }
        } else if (param2 == "apply impulse") {
            if (this.body) {
                _loc4_ = Number(param3[0]);
                _loc5_ = Number(param3[1]);
                _loc6_ = this.body.GetMass();
                this.body.ApplyImpulse(
                    new b2Vec2(_loc4_ * _loc6_, _loc5_ * _loc6_),
                    this.body.GetWorldCenter(),
                );
                _loc7_ = Number(param3[2]);
                _loc8_ = this.body.GetAngularVelocity();
                this.body.SetAngularVelocity(_loc8_ + _loc7_);
            }
        }
    }

    public override get bodyList(): any[] {
        if (this.body) {
            return [this.body];
        }
        return [];
    }
}