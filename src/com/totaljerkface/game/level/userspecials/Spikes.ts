import b2ContactPoint from "@/Box2D/Collision/b2ContactPoint";
import b2PolygonDef from "@/Box2D/Collision/Shapes/b2PolygonDef";
import b2Shape from "@/Box2D/Collision/Shapes/b2Shape";
import b2Math from "@/Box2D/Common/Math/b2Math";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2Body from "@/Box2D/Dynamics/b2Body";
import b2BodyDef from "@/Box2D/Dynamics/b2BodyDef";
import b2Joint from "@/Box2D/Dynamics/Joints/b2Joint";
import b2PrismaticJoint from "@/Box2D/Dynamics/Joints/b2PrismaticJoint";
import b2PrismaticJointDef from "@/Box2D/Dynamics/Joints/b2PrismaticJointDef";
import CharacterB2D from "@/com/totaljerkface/game/character/CharacterB2D";
import ContactListener from "@/com/totaljerkface/game/ContactListener";
import Special from "@/com/totaljerkface/game/editor/specials/Special";
import SpikesRef from "@/com/totaljerkface/game/editor/specials/SpikesRef";
import LevelB2D from "@/com/totaljerkface/game/level/LevelB2D";
import LevelItem from "@/com/totaljerkface/game/level/LevelItem";
import Trigger from "@/com/totaljerkface/game/level/Trigger";
import FoodItem from "@/com/totaljerkface/game/level/userspecials/FoodItem";
import NPCharacter from "@/com/totaljerkface/game/level/userspecials/NPCharacter";
import Session from "@/com/totaljerkface/game/Session";
import Settings from "@/com/totaljerkface/game/Settings";
import AreaSoundInstance from "@/com/totaljerkface/game/sound/AreaSoundInstance";
import SoundController from "@/com/totaljerkface/game/sound/SoundController";
import Spike from "@/top/Spike";
import SpikeBlood from "@/top/SpikeBlood";
import SpikesMC from "@/top/SpikesMC";
import { boundClass } from 'autobind-decorator';
import Bitmap from "flash/display/Bitmap";
import BitmapData from "flash/display/BitmapData";
import DisplayObject from "flash/display/DisplayObject";
import MovieClip from "flash/display/MovieClip";
import Sprite from "flash/display/Sprite";
import Event from "flash/events/Event";
import ColorTransform from "flash/geom/ColorTransform";
import Matrix from "flash/geom/Matrix";
import Point from "flash/geom/Point";

@boundClass
export default class Spikes extends LevelItem {
    private static idCounter: number;
    private maxSounds: number = 2;
    private mc: SpikesMC;
    private id: string;
    private bitmap: Bitmap;
    private bmd: BitmapData;
    private body: b2Body;
    private sensor: b2Shape;
    private baseShape: b2Shape;
    private angle: number;
    private add: boolean;
    private remove: boolean;
    private bodiesToAdd: any[];
    private bodiesToRemove: any[];
    private bjDictionary: Dictionary<any, any>;
    private countDictionary: Dictionary<any, any>;
    private halfWidth: number;
    private bloodOffset: b2Vec2;
    private soundCounter: number = 0;

    constructor(param1: Special, param2: b2Body = null, param3: Point = null) {
        super();
        var _loc4_: SpikesRef = null;

        _loc4_ = param1 as SpikesRef;
        var _loc5_: number = 15 * _loc4_.numSpikes;
        this.halfWidth = _loc5_ / 2;
        this.bloodOffset = new b2Vec2();
        if (param2) {
            this.body = param2;
        }
        var _loc6_ = new b2Vec2(_loc4_.x, _loc4_.y);
        if (param3) {
            _loc6_.Add(new b2Vec2(param3.x, param3.y));
            this.bloodOffset = new b2Vec2(param3.x, param3.y);
        }
        this.createBody(
            _loc6_,
            _loc5_,
            (_loc4_.rotation * Math.PI) / 180,
            _loc4_.immovable2,
            _loc4_.sleeping,
        );
        this.mc = new SpikesMC();
        this.mc.x = _loc4_.x;
        this.mc.y = _loc4_.y;
        this.mc.rotation = _loc4_.rotation;
        this.setupMC(_loc4_.numSpikes);
        this.angle = (_loc4_.rotation * Math.PI) / 180;
        this.bodiesToAdd = new Array();
        this.bodiesToRemove = new Array();
        this.bjDictionary = new Dictionary();
        this.countDictionary = new Dictionary();
        Settings.currentSession.level.actionsVector.push(this);
        var _loc7_: ContactListener = Settings.currentSession.contactListener;
        _loc7_.registerListener(
            ContactListener.ADD,
            this.sensor,
            this.checkAdd,
        );
        _loc7_.registerListener(
            ContactListener.REMOVE,
            this.sensor,
            this.checkRemove,
        );
    }

    private setupMC(param1: number) {
        var _loc2_: number = NaN;
        var _loc7_: DisplayObject = null;
        var _loc8_: b2Vec2 = null;
        var _loc9_: number = NaN;
        _loc2_ = 15 * param1;
        this.bmd = new BitmapData(_loc2_, 50, true, 0);
        this.bitmap = new Bitmap(this.bmd);
        this.bitmap.smoothing = true;
        this.bitmap.x = -this.halfWidth;
        this.bitmap.y = -25;
        this.mc.addChild(this.bitmap);
        var _loc3_: Sprite = Settings.currentSession.level.background;
        _loc3_.addChild(this.mc);
        var _loc4_: Sprite = this.mc.spikes;
        var _loc5_: DisplayObject = this.mc.base;
        _loc5_.width = _loc2_;
        _loc4_.x = -this.halfWidth;
        var _loc6_: number = 20;
        while (_loc6_ < param1) {
            _loc7_ = new Spike();
            _loc4_.addChild(_loc7_);
            _loc7_.x = _loc6_ * 15;
            _loc6_++;
        }
        if (this.body) {
            _loc8_ = this.body.GetLocalCenter();
            _loc9_ = _loc8_.y * this.m_physScale;
            _loc4_.y -= _loc9_;
            _loc5_.y -= _loc9_;
            this.bitmap.y -= _loc9_;
        }
    }

    public createBody(
        param1: b2Vec2,
        param2: number,
        param3: number,
        param4: boolean = false,
        param5: boolean = false,
    ) {
        var _loc8_: b2Vec2 = null;
        var _loc9_: b2BodyDef = null;
        var _loc6_ = new b2PolygonDef();
        _loc6_.isSensor = true;
        _loc6_.density = 0.25;
        _loc6_.friction = 0.3;
        _loc6_.restitution = 0.1;
        _loc6_.filter.categoryBits = 8;
        var _loc7_: LevelB2D = Settings.currentSession.level;
        if (!param4) {
            if (this.body) {
                _loc6_.SetAsOrientedBox(
                    this.halfWidth / this.m_physScale,
                    25 / this.m_physScale,
                    new b2Vec2(
                        param1.x / this.m_physScale,
                        param1.y / this.m_physScale,
                    ),
                    param3,
                );
                this.sensor = this.body.CreateShape(_loc6_);
                _loc6_.isSensor = false;
                _loc6_.density = 3;
                _loc8_ = new b2Vec2(
                    (param1.x - Math.sin(param3) * 35) / this.m_physScale,
                    (param1.y + Math.cos(param3) * 35) / this.m_physScale,
                );
                _loc6_.SetAsOrientedBox(
                    this.halfWidth / this.m_physScale,
                    10 / this.m_physScale,
                    _loc8_,
                    param3,
                );
                this.baseShape = this.body.CreateShape(_loc6_);
            } else {
                _loc9_ = new b2BodyDef();
                _loc6_.SetAsBox(
                    this.halfWidth / this.m_physScale,
                    25 / this.m_physScale,
                );
                _loc9_.position.Set(
                    param1.x / this.m_physScale,
                    param1.y / this.m_physScale,
                );
                _loc9_.angle = param3;
                _loc9_.isSleeping = param5;
                this.body = Settings.currentSession.m_world.CreateBody(_loc9_);
                this.sensor = this.body.CreateShape(_loc6_);
                this.body.SetMassFromShapes();
                _loc6_.isSensor = false;
                _loc6_.density = 3;
                _loc6_.SetAsOrientedBox(
                    this.halfWidth / this.m_physScale,
                    10 / this.m_physScale,
                    new b2Vec2(0, 35 / this.m_physScale),
                    0,
                );
                this.baseShape = this.body.CreateShape(_loc6_);
                this.body.SetMassFromShapes();
                _loc7_.paintItemVector.push(this);
            }
            Settings.currentSession.contactListener.registerListener(
                ContactListener.ADD,
                this.baseShape,
                this.checkBaseAdd,
            );
        } else {
            _loc6_.SetAsOrientedBox(
                this.halfWidth / this.m_physScale,
                25 / this.m_physScale,
                new b2Vec2(
                    param1.x / this.m_physScale,
                    param1.y / this.m_physScale,
                ),
                param3,
            );
            this.sensor = _loc7_.levelBody.CreateShape(_loc6_);
            _loc6_.isSensor = false;
            _loc6_.SetAsOrientedBox(
                this.halfWidth / this.m_physScale,
                10 / this.m_physScale,
                new b2Vec2(
                    (param1.x - Math.sin(param3) * 35) / this.m_physScale,
                    (param1.y + Math.cos(param3) * 35) / this.m_physScale,
                ),
                param3,
            );
            _loc7_.levelBody.CreateShape(_loc6_);
        }
    }

    public override actions() {
        var _loc1_: number = 0;
        if (this.add) {
            _loc1_ = 0;
            while (_loc1_ < this.bodiesToAdd.length) {
                this.createPrisJoint(this.bodiesToAdd[_loc1_]);
                _loc1_++;
            }
            this.bodiesToAdd = new Array();
            this.add = false;
        }
        if (this.remove) {
            _loc1_ = 0;
            while (_loc1_ < this.bodiesToRemove.length) {
                this.removeJoint(this.bodiesToRemove[_loc1_]);
                _loc1_++;
            }
            this.bodiesToRemove = new Array();
            this.remove = false;
        }
    }

    public checkAdd(param1: b2ContactPoint) {
        var _loc2_: b2Body = null;
        if (param1.shape2.GetMaterial() & 6) {
            _loc2_ = param1.shape2.GetBody();
            this.bodiesToAdd.push(_loc2_);
            this.add = true;
        }
    }

    private checkRemove(param1: b2ContactPoint) {
        var _loc2_: b2Body = null;
        if (param1.shape2.GetMaterial() & 6) {
            _loc2_ = param1.shape2.GetBody();
            if (
                Boolean(this.bjDictionary.get(_loc2_)) ||
                this.bodiesToAdd.indexOf(_loc2_) > -1
            ) {
                this.bodiesToRemove.push(_loc2_);
                this.remove = true;
            }
        }
    }

    private createPrisJoint(param1: b2Body) {
        var _loc8_: string = null;
        var _loc9_: number = 0;
        var _loc10_: number = 0;
        var _loc11_: CharacterB2D = null;
        var _loc12_: NPCharacter = null;
        var _loc13_: FoodItem = null;
        var _loc14_: number = 0;
        var _loc15_: AreaSoundInstance = null;
        if (this.bjDictionary.get(param1)) {
            _loc10_ = int(this.countDictionary.get(param1));
            this.countDictionary.set(param1, _loc10_ + 1);
            return;
        }
        var _loc2_: Session = Settings.currentSession;
        var _loc3_: b2Shape = param1.GetShapeList();
        var _loc4_ = _loc3_.GetUserData();
        if (_loc4_ instanceof CharacterB2D) {
            _loc11_ = _loc4_ as CharacterB2D;
            _loc11_.shapeImpale(_loc3_);
        } else if (_loc4_ instanceof NPCharacter) {
            _loc12_ = _loc4_ as NPCharacter;
            _loc12_.shapeImpale(_loc3_);
        }
        var _loc5_ = new b2PrismaticJointDef();
        var _loc6_: b2Vec2 = param1.GetWorldCenter();
        var _loc7_: b2Body =
            this.body != null
                ? this.body
                : Settings.currentSession.level.levelBody;
        _loc5_.Initialize(
            _loc7_,
            param1,
            _loc6_,
            new b2Vec2(-Math.sin(this.angle), Math.cos(this.angle)),
        );
        _loc5_.collideConnected = true;
        _loc5_.enableMotor = true;
        _loc5_.maxMotorForce = 30;
        _loc5_.motorSpeed = 0;
        this.bjDictionary.set(
            param1,
            _loc2_.m_world.CreateJoint(_loc5_) as b2PrismaticJoint,
        );
        this.countDictionary.set(param1, 1);
        if (_loc3_.GetUserData() instanceof FoodItem) {
            _loc13_ = _loc3_.GetUserData() as FoodItem;
            _loc8_ = _loc13_.particleType;
            _loc9_ = 25;
            _loc2_.particleController.createPointBurst(
                _loc8_,
                _loc6_.x * this.m_physScale,
                _loc6_.y * this.m_physScale,
                5,
                15,
                _loc9_,
            );
        } else {
            _loc9_ = 50;
            _loc2_.particleController.createPointBloodBurst(
                _loc6_.x * this.m_physScale,
                _loc6_.y * this.m_physScale,
                5,
                15,
                _loc9_,
            );
        }
        this.paintBlood(
            _loc6_.x * this.m_physScale,
            _loc6_.y * this.m_physScale,
            _loc3_,
        );
        if (this.soundCounter < this.maxSounds) {
            _loc14_ = Math.ceil(Math.random() * 3);
            _loc15_ = SoundController.instance.playAreaSoundInstance(
                "ImpaleSpikes" + _loc14_,
                param1,
            );
            if (_loc15_) {
                this.soundCounter += 1;
                _loc15_.addEventListener(
                    AreaSoundInstance.AREA_SOUND_STOP,
                    this.soundStopped,
                    false,
                    0,
                    true,
                );
            }
        }
    }

    private soundStopped(param1: Event) {
        var _loc2_: AreaSoundInstance = param1.target as AreaSoundInstance;
        _loc2_.removeEventListener(
            AreaSoundInstance.AREA_SOUND_STOP,
            this.soundStopped,
        );
        --this.soundCounter;
    }

    private paintBlood(param1: number, param2: number, param3: b2Shape) {
        var _loc9_: ColorTransform = null;
        var _loc11_: FoodItem = null;
        var _loc4_ = new Point(param1, param2);
        _loc4_ = Settings.currentSession.level.background.localToGlobal(_loc4_);
        _loc4_ = this.mc.spikes.globalToLocal(_loc4_);
        var _loc5_: number = _loc4_.x;
        var _loc6_: number = _loc5_ % 15;
        if (_loc6_ < 0) {
            if (_loc6_ < -7.5) {
                _loc6_ = -15 - _loc6_;
            } else {
                _loc6_ *= -1;
            }
        } else if (_loc6_ > 7.5) {
            _loc6_ = 15 - _loc6_;
        } else {
            _loc6_ *= -1;
        }
        var _loc7_: number = _loc5_ + _loc6_;
        var _loc8_: MovieClip = new SpikeBlood();
        _loc9_ = _loc8_.transform.colorTransform;
        _loc9_.color = 16763904;
        _loc9_.alphaMultiplier = 0.5;
        _loc8_.gotoAndStop(Math.ceil(Math.random() * 5));
        var _loc10_ = new Matrix();
        _loc10_.translate(_loc7_, 0);
        if (param3.GetUserData() instanceof FoodItem) {
            _loc11_ = param3.GetUserData() as FoodItem;
            _loc9_ = _loc8_.transform.colorTransform;
            _loc9_.color = _loc11_.juiceColor;
            _loc9_.alphaMultiplier = 0.75;
            this.bmd.draw(_loc8_, _loc10_, _loc9_);
        } else {
            this.bmd.draw(_loc8_, _loc10_);
        }
    }

    public override paint() {
        var _loc1_: b2Vec2 = this.body.GetWorldCenter();
        this.mc.x = _loc1_.x * this.m_physScale;
        this.mc.y = _loc1_.y * this.m_physScale;
        this.mc.rotation =
            (this.body.GetAngle() * LevelItem.oneEightyOverPI) % 360;
    }

    private removeJoint(param1: b2Body) {
        var _loc3_: b2Joint = null;
        var _loc2_ = int(this.countDictionary.get(param1));
        _loc2_--;
        if (_loc2_ == 0) {
            _loc3_ = this.bjDictionary.get(param1);
            Settings.currentSession.m_world.DestroyJoint(_loc3_);
            this.bjDictionary.delete(param1);
            this.countDictionary.delete(param1);
        } else {
            this.countDictionary.set(param1, _loc2_);
        }
    }

    public override getJointBody(param1: b2Vec2 = null): b2Body {
        return this.body;
    }

    public override get groupDisplayObject(): DisplayObject {
        return this.mc;
    }

    private checkBaseAdd(param1: b2ContactPoint) {
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
                "SpikeBaseHit" + _loc4_,
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