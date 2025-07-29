import b2PolygonDef from "@/Box2D/Collision/Shapes/b2PolygonDef";
import b2PolygonShape from "@/Box2D/Collision/Shapes/b2PolygonShape";
import b2Shape from "@/Box2D/Collision/Shapes/b2Shape";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2Body from "@/Box2D/Dynamics/b2Body";
import b2BodyDef from "@/Box2D/Dynamics/b2BodyDef";
import ContactListener from "@/com/totaljerkface/game/ContactListener";
import Settings from "@/com/totaljerkface/game/Settings";
import BottleRef from "@/com/totaljerkface/game/editor/specials/BottleRef";
import Special from "@/com/totaljerkface/game/editor/specials/Special";
import ContactEvent from "@/com/totaljerkface/game/events/ContactEvent";
import LevelB2D from "@/com/totaljerkface/game/level/LevelB2D";
import LevelItem from "@/com/totaljerkface/game/level/LevelItem";
import Trigger from "@/com/totaljerkface/game/level/Trigger";
import SoundController from "@/com/totaljerkface/game/sound/SoundController";
import BottleMC from "@/top/BottleMC";
import DisplayObject from "flash/display/DisplayObject";
import MovieClip from "flash/display/MovieClip";
import Sprite from "flash/display/Sprite";
import Point from "flash/geom/Point";
import { boundClass } from 'autobind-decorator';

@boundClass
export default class Bottle extends LevelItem {
    private _shape: b2Shape;
    private _body: b2Body;
    private _interactive: boolean;
    private _bottleType: number;
    private mc: MovieClip;

    constructor(param1: Special, param2: b2Body = null, param3: Point = null) {
        super();
        this.createBody(param1);
    }

    public createBody(param1: Special) {
        var _loc2_: LevelB2D = null;
        var _loc4_: BottleRef = null;
        _loc2_ = Settings.currentSession.level;
        var _loc3_: Sprite = _loc2_.background;
        _loc4_ = param1 as BottleRef;
        _loc4_ = _loc4_.clone() as BottleRef;
        var _loc5_: number = (this._bottleType = _loc4_.bottleType);
        var _loc6_ = getDefinitionByName("BottleShards" + _loc5_ + "MC");
        // @ts-expect-error
        var _loc7_: MovieClip = new _loc6_();
        Settings.currentSession.particleController.createBMDArray(
            "bottleShards" + _loc5_,
            _loc7_,
        );
        this._interactive = _loc4_.interactive;
        this.mc = new BottleMC();
        this.mc.gotoAndStop(_loc5_);
        _loc3_.addChild(this.mc);
        this.mc.x = param1.x;
        this.mc.y = param1.y;
        this.mc.rotation = param1.rotation;
        if (!this._interactive) {
            return;
        }
        var _loc8_ = new b2Vec2(_loc4_.x, _loc4_.y);
        var _loc9_: number = _loc4_.rotation;
        var _loc10_ = new b2BodyDef();
        var _loc11_ = new b2PolygonDef();
        _loc11_.density = 2;
        _loc11_.friction = 0.3;
        _loc11_.filter.categoryBits = 8;
        _loc11_.restitution = 0.1;
        _loc11_.SetAsBox(5 / this.m_physScale, 14.5 / this.m_physScale);
        _loc10_.position.Set(
            _loc8_.x / this.m_physScale,
            _loc8_.y / this.m_physScale
        );
        _loc10_.angle = (_loc9_ * Math.PI) / 180;
        _loc10_.isSleeping = _loc4_.sleeping;
        var _loc12_: b2Body = (this._body =
            Settings.currentSession.m_world.CreateBody(_loc10_));
        this._shape = _loc12_.CreateShape(_loc11_) as b2PolygonShape;
        _loc12_.SetMassFromShapes();
        _loc2_.paintBodyVector.push(_loc12_);
        _loc12_.SetUserData(this.mc);
        Settings.currentSession.contactListener.registerListener(
            ContactListener.RESULT,
            this._shape,
            this.checkContact,
        );
    }

    public override get groupDisplayObject(): DisplayObject {
        return this.mc;
    }

    private checkContact(param1: ContactEvent) {
        if (param1.impulse > 1.78) {
            Settings.currentSession.contactListener.deleteListener(
                ContactEvent.RESULT,
                this._shape,
            );
            Settings.currentSession.level.singleActionVector.push(this);
        }
    }

    public override singleAction() {
        var _loc1_: LevelB2D = Settings.currentSession.level;
        var _loc2_: Sprite = _loc1_.background;
        _loc1_.removeFromActionsVector(this);
        _loc1_.removeFromPaintBodyVector(this._body);
        var _loc3_: number = Math.ceil(Math.random() * 2);
        Settings.currentSession.particleController.createRectBurst(
            "bottleShards" + this._bottleType,
            10,
            this._body,
            30,
        );
        SoundController.instance.playAreaSoundInstance(
            "GlassLight" + _loc3_,
            this._body,
        );
        _loc1_.background.removeChild(this.mc);
        Settings.currentSession.m_world.DestroyBody(this._body);
        this._body = null;
    }

    public override getJointBody(param1: b2Vec2 = null): b2Body {
        return this._body;
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
            if (this._body) {
                this._body.WakeUp();
            }
        } else if (param2 == "apply impulse") {
            if (this._body) {
                _loc4_ = Number(param3[0]);
                _loc5_ = Number(param3[1]);
                _loc6_ = this._body.GetMass();
                this._body.ApplyImpulse(
                    new b2Vec2(_loc4_ * _loc6_, _loc5_ * _loc6_),
                    this._body.GetWorldCenter(),
                );
                _loc7_ = Number(param3[2]);
                _loc8_ = this._body.GetAngularVelocity();
                this._body.SetAngularVelocity(_loc8_ + _loc7_);
            }
        }
    }

    public override get bodyList(): any[] {
        if (this._body) {
            return [this._body];
        }
        return [];
    }
}