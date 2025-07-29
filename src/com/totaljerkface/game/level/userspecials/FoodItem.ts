import b2ContactPoint from "@/Box2D/Collision/b2ContactPoint";
import b2PolygonDef from "@/Box2D/Collision/Shapes/b2PolygonDef";
import b2PolygonShape from "@/Box2D/Collision/Shapes/b2PolygonShape";
import b2Shape from "@/Box2D/Collision/Shapes/b2Shape";
import b2Math from "@/Box2D/Common/Math/b2Math";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2Body from "@/Box2D/Dynamics/b2Body";
import b2BodyDef from "@/Box2D/Dynamics/b2BodyDef";
import ContactListener from "@/com/totaljerkface/game/ContactListener";
import FoodItemRef from "@/com/totaljerkface/game/editor/specials/FoodItemRef";
import Special from "@/com/totaljerkface/game/editor/specials/Special";
import ContactEvent from "@/com/totaljerkface/game/events/ContactEvent";
import LevelB2D from "@/com/totaljerkface/game/level/LevelB2D";
import LevelItem from "@/com/totaljerkface/game/level/LevelItem";
import Trigger from "@/com/totaljerkface/game/level/Trigger";
import FoodChunk from "@/com/totaljerkface/game/level/userspecials/FoodChunk";
import Settings from "@/com/totaljerkface/game/Settings";
import SoundController from "@/com/totaljerkface/game/sound/SoundController";
import { boundClass } from 'autobind-decorator';
import DisplayObject from "flash/display/DisplayObject";
import MovieClip from "flash/display/MovieClip";
import Sprite from "flash/display/Sprite";
import Point from "flash/geom/Point";

@boundClass
export default class FoodItem extends LevelItem {
    public static FOOD_TAG: string;
    private _foodItemType: number;
    private _shape: b2Shape;
    private _body: b2Body;
    private _interactive: boolean;
    private _willSmash: boolean = false;
    private _crackImpulse: number = 7;
    private _smashImpulse: number = 20;
    private _chunksMC: MovieClip;
    private _MCNames: any[] = ["WatermelonMC", "PumpkinMC", "PineappleMC"];
    private _particleMCs: any[] = [
        "WatermelonParticlesMC",
        "PumpkinParticlesMC",
        "PineappleParticlesMC",
    ];
    private _juiceColor: any[] = [13703445, 15695667, 15066224];
    private _initialStateShapeCount: any[] = [1, 1, 1];
    private _initialSmashImpulse: any[] = [8, 8, 3];
    private _shapes: any[] = [];
    private _break: boolean = false;
    private mc: MovieClip;

    constructor(param1: Special, param2: b2Body = null, param3: Point = null) {
        super();
        var _loc4_: FoodItemRef = param1 as FoodItemRef;
        this.createBody(_loc4_);
    }

    public static getChildrenWithPrefix(
        param1: MovieClip,
        param2: string,
    ): any[] {
        var _loc3_: any[] = [];
        var _loc4_: number = 0;
        while (_loc4_ < param1.numChildren) {
            if (param1.getChildAt(_loc4_).name.indexOf(param2) == 0) {
                _loc3_.push(param1.getChildAt(_loc4_));
            }
            _loc4_++;
        }
        return _loc3_;
    }

    public get juiceColor(): number {
        return this._juiceColor[this._foodItemType - 1];
    }

    public get particleType(): string {
        return this._particleMCs[this._foodItemType - 1];
    }

    public createBody(param1: FoodItemRef) {
        var _loc3_: Sprite = null;
        var _loc12_: number = 0;
        var _loc13_: MovieClip = null;
        var _loc14_: number = 0;
        var _loc15_: number = 0;
        var _loc16_: number = 0;
        var _loc17_ = null;
        var _loc18_: b2PolygonShape = null;
        var _loc20_: any[] = null;
        this._foodItemType = param1.foodItemType;
        var _loc2_: LevelB2D = Settings.currentSession.level;
        _loc3_ = _loc2_.background;
        this._interactive = param1.interactive;
        var _loc4_ = getDefinitionByName(
            this._MCNames[param1.foodItemType - 1],
        );
        // @ts-expect-error
        this.mc = new _loc4_();
        // @ts-expect-error
        var _loc5_: MovieClip = this.mc.shapes;
        // @ts-expect-error
        this.mc.removeChild(this.mc.shapes);
        // @ts-expect-error
        this._chunksMC = this.mc.chunks;
        // @ts-expect-error
        this.mc.removeChild(this.mc.chunks);
        this.mc.x = param1.x;
        this.mc.y = param1.y;
        this.mc.rotation = param1.rotation;
        _loc3_.addChild(this.mc);
        if (!this._interactive) {
            return;
        }
        var _loc6_ = getDefinitionByName(
            this._particleMCs[this._foodItemType - 1],
        );
        // @ts-expect-error
        var _loc7_: MovieClip = new _loc6_();
        Settings.currentSession.particleController.createBMDArray(
            this._particleMCs[this._foodItemType - 1],
            _loc7_,
        );
        var _loc8_ = new b2Vec2(param1.x, param1.y);
        var _loc9_: number = param1.rotation;
        var _loc10_ = new b2BodyDef();
        var _loc11_ = new b2PolygonDef();
        _loc11_.density = 2;
        _loc11_.friction = 0.3;
        _loc11_.filter.categoryBits = 8;
        _loc11_.restitution = 0.1;
        _loc10_.position.Set(
            _loc8_.x / this.m_physScale,
            _loc8_.y / this.m_physScale,
        );
        _loc10_.angle = (_loc9_ * Math.PI) / 180;
        _loc10_.isSleeping = param1.sleeping;
        var _loc19_: b2Body = (this._body =
            Settings.currentSession.m_world.CreateBody(_loc10_));
        _loc15_ = 0;
        while (
            _loc15_ < this._initialStateShapeCount[param1.foodItemType - 1]
        ) {
            _loc12_ = 0;
            _loc20_ = FoodItem.getChildrenWithPrefix(_loc5_, "p" + _loc15_);
            _loc14_ = 0;
            while (_loc14_ < _loc20_.length) {
                _loc13_ = _loc5_["p" + _loc15_ + "_" + _loc14_];
                _loc11_.vertexCount = _loc20_.length;
                _loc11_.vertices[_loc14_] = new b2Vec2(
                    _loc13_.x / this.m_physScale,
                    _loc13_.y / this.m_physScale,
                );
                _loc14_++;
            }
            _loc18_ = _loc19_.CreateShape(_loc11_) as b2PolygonShape;
            _loc18_.SetMaterial(4);
            _loc18_.SetUserData(this);
            Settings.currentSession.contactListener.registerListener(
                ContactListener.RESULT,
                _loc18_,
                this.checkContact,
            );
            this._shapes.push(_loc18_);
            _loc15_++;
        }
        _loc19_.SetMassFromShapes();
        _loc2_.paintBodyVector.push(_loc19_);
        _loc19_.SetUserData(this.mc);
    }

    private checkContact(param1: ContactEvent) {
        if (
            param1.impulse > this._initialSmashImpulse[this._foodItemType - 1]
        ) {
            this._willSmash = true;
            Settings.currentSession.level.singleActionVector.push(this);
            this.removeListeners();
        }
    }

    private removeListeners() {
        if (!this._shapes) {
            return;
        }
        var _loc1_: number = 0;
        while (_loc1_ < this._shapes.length) {
            Settings.currentSession.contactListener.deleteListener(
                ContactEvent.RESULT,
                this._shapes[_loc1_],
            );
            _loc1_++;
        }
        this._shapes = null;
    }

    public grindShape(param1: b2Shape) {
        this._willSmash = false;
        this.removeListeners();
    }

    public override singleAction() {
        var _loc2_: FoodChunk = null;
        if (!this._willSmash) {
            return;
        }
        var _loc1_ = int(
            FoodItem.getChildrenWithPrefix(this._chunksMC, "m").length,
        );
        var _loc3_: number = 0;
        while (_loc3_ < _loc1_) {
            _loc2_ = new FoodChunk(_loc3_, this._body, this._chunksMC, this);
            _loc3_++;
        }
        Settings.currentSession.level.removeFromPaintBodyVector(this._body);
        var _loc4_: number = Math.ceil(Math.random() * 3);
        SoundController.instance.playAreaSoundInstance(
            "FoodSplat" + _loc4_,
            this._body,
        );
        Settings.currentSession.particleController.createRectBurst(
            this._particleMCs[this._foodItemType - 1],
            10,
            this._body,
            30,
        );
        Settings.currentSession.m_world.DestroyBody(this._body);
        Settings.currentSession.level.background.removeChild(this.mc);
        this.mc = null;
        this._chunksMC = null;
    }

    public override getJointBody(param1: b2Vec2 = null): b2Body {
        return this._body;
    }

    private checkAdd(param1: b2ContactPoint) {
        if (param1.shape2.m_isSensor) {
            return;
        }
        var _loc2_: number = param1.shape2.m_body.m_mass;
        if (_loc2_ != 0 && _loc2_ < this._body.m_mass) {
            return;
        }
        var _loc3_: number = b2Math.b2Dot(param1.velocity, param1.normal);
        _loc3_ = Math.abs(_loc3_);
        if (_loc3_ > 4) {
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

    public override get groupDisplayObject(): DisplayObject {
        return this.mc;
    }

    public override get bodyList(): any[] {
        if (this._body) {
            return [this._body];
        }
        return [];
    }
}