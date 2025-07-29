import b2PolygonDef from "@/Box2D/Collision/Shapes/b2PolygonDef";
import b2Shape from "@/Box2D/Collision/Shapes/b2Shape";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2Body from "@/Box2D/Dynamics/b2Body";
import b2BodyDef from "@/Box2D/Dynamics/b2BodyDef";
import b2World from "@/Box2D/Dynamics/b2World";
import ContactListener from "@/com/totaljerkface/game/ContactListener";
import Settings from "@/com/totaljerkface/game/Settings";
import ChairRef from "@/com/totaljerkface/game/editor/specials/ChairRef";
import Special from "@/com/totaljerkface/game/editor/specials/Special";
import ContactEvent from "@/com/totaljerkface/game/events/ContactEvent";
import LevelB2D from "@/com/totaljerkface/game/level/LevelB2D";
import LevelItem from "@/com/totaljerkface/game/level/LevelItem";
import Trigger from "@/com/totaljerkface/game/level/Trigger";
import SoundController from "@/com/totaljerkface/game/sound/SoundController";
import ChairBackMC from "@/top/ChairBackMC";
import ChairLegMC from "@/top/ChairLegMC";
import ChairMC from "@/top/ChairMC";
import ChairTopMC from "@/top/ChairTopMC";
import { boundClass } from 'autobind-decorator';
import DisplayObject from "flash/display/DisplayObject";
import Sprite from "flash/display/Sprite";
import Point from "flash/geom/Point";

@boundClass
export default class Chair extends LevelItem {
    private mc: ChairMC;
    private body: b2Body;
    private top: b2Shape;
    private leftLeg: b2Shape;
    private rightLeg: b2Shape;
    private back: b2Shape;
    private break2: boolean;
    private breakLimit: number = 10;
    private _sign: number = 1;

    constructor(param1: Special, param2: b2Body = null, param3: Point = null) {
        super();
        var _loc4_: ChairRef = null;

        _loc4_ = param1 as ChairRef;
        this._sign = _loc4_.reverse ? -1 : 1;
        this.mc = new ChairMC();
        this.mc.gotoAndStop(1);
        this.mc.container.scaleX *= this._sign;
        this.mc.x = _loc4_.x;
        this.mc.y = _loc4_.y;
        this.mc.rotation = _loc4_.rotation;
        var _loc5_: Sprite = Settings.currentSession.level.background;
        _loc5_.addChild(this.mc);
        if (Settings.currentSession.version < 1.67) {
            this.createBody(
                new b2Vec2(_loc4_.x, _loc4_.y),
                (_loc4_.rotation * Math.PI) / 180,
                false,
            );
        } else if (_loc4_.interactive) {
            this.createBody(
                new b2Vec2(_loc4_.x, _loc4_.y),
                (_loc4_.rotation * Math.PI) / 180,
                _loc4_.sleeping,
            );
        }
    }

    public createBody(param1: b2Vec2, param2: number, param3: boolean) {
        var _loc4_ = new b2BodyDef();
        _loc4_.position.Set(
            param1.x / this.m_physScale,
            param1.y / this.m_physScale,
        );
        _loc4_.angle = param2;
        _loc4_.isSleeping = param3;
        this.body = Settings.currentSession.m_world.CreateBody(_loc4_);
        var _loc5_ = new b2PolygonDef();
        _loc5_.density = 5;
        _loc5_.friction = 0.1;
        _loc5_.restitution = 0.2;
        _loc5_.filter.categoryBits = 8;
        _loc5_.SetAsOrientedBox(
            21 / this.m_physScale,
            3 / this.m_physScale,
            new b2Vec2(0, -3 / this.m_physScale),
            0,
        );
        this.top = this.body.CreateShape(_loc5_);
        _loc5_.SetAsOrientedBox(
            3 / this.m_physScale,
            16 / this.m_physScale,
            new b2Vec2(-18 / this.m_physScale, 16 / this.m_physScale),
            0,
        );
        this.leftLeg = this.body.CreateShape(_loc5_);
        _loc5_.SetAsOrientedBox(
            3 / this.m_physScale,
            16 / this.m_physScale,
            new b2Vec2(18 / this.m_physScale, 16 / this.m_physScale),
            0,
        );
        this.rightLeg = this.body.CreateShape(_loc5_);
        _loc5_.SetAsOrientedBox(
            3 / this.m_physScale,
            25 / this.m_physScale,
            new b2Vec2(
                (-18 * this._sign) / this.m_physScale,
                -31 / this.m_physScale,
            ),
            0,
        );
        this.back = this.body.CreateShape(_loc5_);
        this.body.SetMassFromShapes();
        Settings.currentSession.level.paintItemVector.push(this);
        Settings.currentSession.contactListener.registerListener(
            ContactListener.RESULT,
            this.top,
            this.checkContact,
        );
        Settings.currentSession.contactListener.registerListener(
            ContactListener.RESULT,
            this.leftLeg,
            this.checkContact,
        );
        Settings.currentSession.contactListener.registerListener(
            ContactListener.RESULT,
            this.rightLeg,
            this.checkContact,
        );
        Settings.currentSession.contactListener.registerListener(
            ContactListener.RESULT,
            this.back,
            this.checkContact,
        );
    }

    public override paint() {
        var _loc1_: b2Vec2 = null;
        _loc1_ = this.body.GetWorldCenter();
        this.mc.x = _loc1_.x * this.m_physScale;
        this.mc.y = _loc1_.y * this.m_physScale;
        this.mc.rotation =
            (this.body.GetAngle() * LevelItem.oneEightyOverPI) % 360;
    }

    public override actions() {
        var _loc2_: b2World = null;
        var _loc1_: LevelB2D = Settings.currentSession.level;
        _loc2_ = Settings.currentSession.m_world;
        _loc1_.removeFromActionsVector(this);
        _loc1_.removeFromPaintItemVector(this);
        var _loc3_: b2Vec2 = this.body.GetWorldCenter();
        var _loc4_: b2Vec2 = this.body.GetLinearVelocity();
        var _loc5_: number = this.body.GetAngularVelocity();
        var _loc6_: number = this.body.GetAngle();
        var _loc7_ = new b2BodyDef();
        _loc7_.angle = _loc6_;
        _loc7_.position = _loc3_;
        var _loc8_ = new b2PolygonDef();
        _loc8_.density = 5;
        _loc8_.friction = 0.1;
        _loc8_.restitution = 0.2;
        _loc8_.filter.categoryBits = 8;
        _loc8_.SetAsOrientedBox(
            3 / this.m_physScale,
            16 / this.m_physScale,
            new b2Vec2(-18 / this.m_physScale, 16 / this.m_physScale),
            0,
        );
        var _loc9_: b2Body = _loc2_.CreateBody(_loc7_);
        _loc9_.CreateShape(_loc8_);
        _loc9_.SetMassFromShapes();
        _loc8_.SetAsOrientedBox(
            3 / this.m_physScale,
            16 / this.m_physScale,
            new b2Vec2(18 / this.m_physScale, 16 / this.m_physScale),
            0,
        );
        var _loc10_: b2Body = _loc2_.CreateBody(_loc7_);
        _loc10_.CreateShape(_loc8_);
        _loc10_.SetMassFromShapes();
        _loc8_.SetAsOrientedBox(
            3 / this.m_physScale,
            25 / this.m_physScale,
            new b2Vec2(
                (-18 * this._sign) / this.m_physScale,
                -31 / this.m_physScale,
            ),
            0,
        );
        var _loc11_: b2Body = _loc2_.CreateBody(_loc7_);
        _loc11_.CreateShape(_loc8_);
        _loc11_.SetMassFromShapes();
        _loc8_.SetAsOrientedBox(
            21 / this.m_physScale,
            3 / this.m_physScale,
            new b2Vec2(0, -3 / this.m_physScale),
            0,
        );
        var _loc12_: b2Body = _loc2_.CreateBody(_loc7_);
        _loc12_.CreateShape(_loc8_);
        _loc12_.SetMassFromShapes();
        _loc9_.SetLinearVelocity(
            this.body.GetLinearVelocityFromLocalPoint(_loc9_.GetLocalCenter()),
        );
        _loc9_.SetAngularVelocity(_loc5_);
        _loc10_.SetLinearVelocity(
            this.body.GetLinearVelocityFromLocalPoint(_loc10_.GetLocalCenter()),
        );
        _loc10_.SetAngularVelocity(_loc5_);
        _loc11_.SetLinearVelocity(
            this.body.GetLinearVelocityFromLocalPoint(_loc11_.GetLocalCenter()),
        );
        _loc11_.SetAngularVelocity(_loc5_);
        _loc12_.SetLinearVelocity(
            this.body.GetLinearVelocityFromLocalPoint(_loc12_.GetLocalCenter()),
        );
        _loc12_.SetAngularVelocity(_loc5_);
        var _loc13_: Sprite = new ChairLegMC();
        var _loc14_: Sprite = new ChairLegMC();
        var _loc15_: Sprite = new ChairTopMC();
        var _loc16_: Sprite = new ChairBackMC();
        var _loc17_: number = _loc1_.background.getChildIndex(this.mc);
        this.mc.parent.removeChild(this.mc);
        _loc15_.scaleX *= this._sign;
        _loc1_.background.addChildAt(_loc13_, _loc17_);
        _loc1_.background.addChildAt(_loc14_, _loc17_);
        _loc1_.background.addChildAt(_loc15_, _loc17_);
        _loc1_.background.addChildAt(_loc16_, _loc17_);
        _loc9_.SetUserData(_loc13_);
        _loc10_.SetUserData(_loc14_);
        _loc11_.SetUserData(_loc16_);
        _loc12_.SetUserData(_loc15_);
        _loc1_.paintBodyVector.push(_loc9_);
        _loc1_.paintBodyVector.push(_loc10_);
        _loc1_.paintBodyVector.push(_loc11_);
        _loc1_.paintBodyVector.push(_loc12_);
        SoundController.instance.playAreaSoundInstance("TableBreak1", _loc12_);
        _loc2_.DestroyBody(this.body);
        this.body = null;
    }

    public checkContact(param1: ContactEvent) {
        if (param1.impulse > this.breakLimit) {
            Settings.currentSession.contactListener.deleteListener(
                ContactEvent.RESULT,
                this.top,
            );
            Settings.currentSession.contactListener.deleteListener(
                ContactEvent.RESULT,
                this.leftLeg,
            );
            Settings.currentSession.contactListener.deleteListener(
                ContactEvent.RESULT,
                this.rightLeg,
            );
            Settings.currentSession.contactListener.deleteListener(
                ContactEvent.RESULT,
                this.back,
            );
            Settings.currentSession.level.actionsVector.push(this);
        }
    }

    public override getJointBody(param1: b2Vec2 = null): b2Body {
        return this.body;
    }

    public override get groupDisplayObject(): DisplayObject {
        return this.mc;
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