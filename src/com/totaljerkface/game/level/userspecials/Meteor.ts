import b2CircleDef from "@/Box2D/Collision/Shapes/b2CircleDef";
import b2Shape from "@/Box2D/Collision/Shapes/b2Shape";
import b2ContactPoint from "@/Box2D/Collision/b2ContactPoint";
import b2Math from "@/Box2D/Common/Math/b2Math";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2Body from "@/Box2D/Dynamics/b2Body";
import b2BodyDef from "@/Box2D/Dynamics/b2BodyDef";
import ContactListener from "@/com/totaljerkface/game/ContactListener";
import Settings from "@/com/totaljerkface/game/Settings";
import MeteorRef from "@/com/totaljerkface/game/editor/specials/MeteorRef";
import Special from "@/com/totaljerkface/game/editor/specials/Special";
import LevelB2D from "@/com/totaljerkface/game/level/LevelB2D";
import LevelItem from "@/com/totaljerkface/game/level/LevelItem";
import Trigger from "@/com/totaljerkface/game/level/Trigger";
import SoundController from "@/com/totaljerkface/game/sound/SoundController";
import MeteorMC from "@/top/MeteorMC";
import { boundClass } from 'autobind-decorator';
import Sprite from "flash/display/Sprite";

@boundClass
export default class Meteor extends LevelItem {
    private shape: b2Shape;
    private body: b2Body;
    private mc: Sprite;

    constructor(param1: Special) {
        super();
        var _loc2_: MeteorRef = param1 as MeteorRef;
        this.createBody(
            new b2Vec2(_loc2_.x, _loc2_.y),
            _loc2_.shapeWidth,
            _loc2_.immovable2,
            _loc2_.sleeping,
        );
    }

    public createBody(
        param1: b2Vec2,
        param2: number,
        param3: boolean,
        param4: boolean,
    ) {
        var _loc8_: b2CircleDef = null;
        var _loc5_ = new b2BodyDef();
        this.mc = new MeteorMC();
        this.mc.width = (407.1 * param2) / 400;
        this.mc.height = (401.4 * param2) / 400;
        this.mc.x = param1.x;
        this.mc.y = param1.y;
        var _loc6_: LevelB2D = Settings.currentSession.level;
        var _loc7_: Sprite = _loc6_.background;
        _loc7_.addChild(this.mc);
        _loc8_ = new b2CircleDef();
        _loc8_.density = 75;
        _loc8_.friction = 0.5;
        _loc8_.restitution = 0.1;
        _loc8_.radius = (param2 * 0.5) / this.m_physScale;
        _loc8_.filter.categoryBits = 8;
        if (!param3) {
            _loc5_.position.Set(
                param1.x / this.m_physScale,
                param1.y / this.m_physScale,
            );
            _loc5_.isSleeping = param4;
            this.body = Settings.currentSession.m_world.CreateBody(_loc5_);
            this.shape = this.body.CreateShape(_loc8_);
            this.body.SetMassFromShapes();
            this.body.SetUserData(this.mc);
            _loc6_.paintItemVector.push(this);
            Settings.currentSession.contactListener.registerListener(
                ContactListener.ADD,
                this.shape,
                this.checkAdd,
            );
        } else {
            _loc8_.localPosition.Set(
                param1.x / this.m_physScale,
                param1.y / this.m_physScale,
            );
            _loc6_.levelBody.CreateShape(_loc8_);
        }
    }

    public override paint() {
        var _loc1_: b2Vec2 = this.body.GetWorldCenter();
        this.mc.x = _loc1_.x * this.m_physScale;
        this.mc.y = _loc1_.y * this.m_physScale;
        this.mc.rotation =
            (this.body.GetAngle() * LevelItem.oneEightyOverPI) % 360;
    }

    private checkAdd(param1: b2ContactPoint) {
        if (param1.shape2.m_isSensor) {
            return;
        }
        var _loc2_: number = param1.shape2.m_body.m_mass;
        if (_loc2_ != 0 && _loc2_ < this.body.m_mass) {
            return;
        }
        var _loc3_: number = b2Math.b2Dot(param1.velocity, param1.normal);
        _loc3_ = Math.abs(_loc3_);
        if (_loc3_ > 2) {
            SoundController.instance.playAreaSoundInstance(
                "MeteorImpact",
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