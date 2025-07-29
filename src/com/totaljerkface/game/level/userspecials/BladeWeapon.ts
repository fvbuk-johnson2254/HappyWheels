import b2PolygonDef from "@/Box2D/Collision/Shapes/b2PolygonDef";
import b2Shape from "@/Box2D/Collision/Shapes/b2Shape";
import b2ContactPoint from "@/Box2D/Collision/b2ContactPoint";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2Joint from "@/Box2D/Dynamics/Joints/b2Joint";
import b2PrismaticJoint from "@/Box2D/Dynamics/Joints/b2PrismaticJoint";
import b2PrismaticJointDef from "@/Box2D/Dynamics/Joints/b2PrismaticJointDef";
import b2Body from "@/Box2D/Dynamics/b2Body";
import b2BodyDef from "@/Box2D/Dynamics/b2BodyDef";
import b2World from "@/Box2D/Dynamics/b2World";
import ContactListener from "@/com/totaljerkface/game/ContactListener";
import Session from "@/com/totaljerkface/game/Session";
import Settings from "@/com/totaljerkface/game/Settings";
import CharacterB2D from "@/com/totaljerkface/game/character/CharacterB2D";
import BladeWeaponRef from "@/com/totaljerkface/game/editor/specials/BladeWeaponRef";
import Special from "@/com/totaljerkface/game/editor/specials/Special";
import LevelB2D from "@/com/totaljerkface/game/level/LevelB2D";
import LevelItem from "@/com/totaljerkface/game/level/LevelItem";
import Trigger from "@/com/totaljerkface/game/level/Trigger";
import FoodItem from "@/com/totaljerkface/game/level/userspecials/FoodItem";
import NPCharacter from "@/com/totaljerkface/game/level/userspecials/NPCharacter";
import AreaSoundInstance from "@/com/totaljerkface/game/sound/AreaSoundInstance";
import SoundController from "@/com/totaljerkface/game/sound/SoundController";
import BladeBloodMC from "@/top/BladeBloodMC";
import BladeWeaponMC from "@/top/BladeWeaponMC";
import BladeWeaponShapesMC from "@/top/BladeWeaponShapesMC";
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
import Rectangle from "flash/geom/Rectangle";

@boundClass
export default class BladeWeapon extends LevelItem {
    public mc: BladeWeaponMC;
    public weaponBody: b2Body;
    private sensorShape: b2Shape;
    private solidShape: b2Shape;
    private handleShape: b2Shape;
    private previousBody: b2Body;
    private add: boolean;
    private remove: boolean;
    private bodiesToAdd: any[];
    private bodiesToRemove: any[];
    private bjDictionary: Dictionary<any, any>;
    private countDictionary: Dictionary<any, any>;
    private bladeAngle: number;
    private fleshSound: AreaSoundInstance;
    private solidSound: AreaSoundInstance;
    private bloodOffset: b2Vec2;
    private bladeOffset: b2Vec2;
    private weaponPosOffset: b2Vec2;
    private weaponAngleOffset: number = 0;
    protected maskSprite: Sprite;
    protected bitmap: Bitmap;
    protected bmd: BitmapData;

    constructor(param1: Special, param2: b2Body = null, param3: Point = null) {
        super();
        var _loc4_: BladeWeaponRef = null;
        var _loc5_ = null;
        this.bladeOffset = new b2Vec2(0, 0);
        this.weaponPosOffset = new b2Vec2(0, 0);

        _loc4_ = param1 as BladeWeaponRef;
        this.mc = new BladeWeaponMC();
        _loc5_ = getDefinitionByName("BladeMask" + _loc4_.bladeWeaponType);
        this.maskSprite = new _loc5_();
        this.mc.gotoAndStop(_loc4_.bladeWeaponType);
        this.mc.x = _loc4_.x;
        this.mc.y = _loc4_.y;
        this.mc.rotation = _loc4_.rotation;
        this.setupMC();
        if (_loc4_.reverse) {
            this.mc.scaleX *= -1;
        }
        var _loc6_: Sprite = Settings.currentSession.level.background;
        _loc6_.addChild(this.mc);
        if (!_loc4_.interactive) {
            return;
        }
        this.mc.visible = false;
        this.bloodOffset = new b2Vec2();
        if (param2) {
            this.weaponBody = param2;
        }
        var _loc7_ = new b2Vec2(_loc4_.x, _loc4_.y);
        if (param3) {
            _loc7_.Add(new b2Vec2(param3.x, param3.y));
            this.bloodOffset = new b2Vec2(param3.x, param3.y);
        }
        this.createBody(_loc4_, _loc7_);
        this.bodiesToAdd = new Array();
        this.bodiesToRemove = new Array();
        this.bjDictionary = new Dictionary();
        this.countDictionary = new Dictionary();
        var _loc8_: ContactListener = Settings.currentSession.contactListener;
        _loc8_.registerListener(
            ContactListener.ADD,
            this.sensorShape,
            this.checkAdd,
        );
        _loc8_.registerListener(
            ContactListener.REMOVE,
            this.sensorShape,
            this.checkRemove,
        );
        var _loc9_: LevelB2D = Settings.currentSession.level;
        _loc9_.singleActionVector.push(this);
        _loc9_.actionsVector.push(this);
        if (!param2) {
            _loc9_.paintItemVector.push(this);
        }
    }

    private setupMC() { }

    private createBody(param1: BladeWeaponRef, param2: b2Vec2) {
        var _loc10_: Matrix = null;
        var _loc11_: number = NaN;
        var _loc12_: b2BodyDef = null;
        var _loc3_: LevelB2D = Settings.currentSession.level;
        var _loc4_: b2World = Settings.currentSession.m_world;
        var _loc5_: Sprite = _loc3_.background;
        var _loc6_: number = (param1.rotation * Math.PI) / 180;
        var _loc7_: MovieClip = new BladeWeaponShapesMC();
        _loc7_.gotoAndStop(param1.bladeWeaponType);
        var _loc8_ = new b2PolygonDef();
        _loc8_.friction = 0.75;
        _loc8_.restitution = 0.1;
        _loc8_.filter.categoryBits = 8;
        _loc8_.density = 0.5;
        _loc8_.isSensor = true;
        var _loc9_: number = param1.reverse ? -1 : 1;
        // @ts-expect-error
        _loc7_.blade.x *= _loc9_;
        // @ts-expect-error
        _loc7_.handle.x *= _loc9_;
        // @ts-expect-error
        _loc7_.blade.rotation *= _loc9_;
        if (this.weaponBody) {
            _loc10_ = new Matrix();
            // @ts-expect-error
            _loc10_.rotate((_loc7_.blade.rotation * Math.PI) / 180);
            _loc10_.translate(
                // @ts-expect-error
                _loc7_.blade.x / this.m_physScale,
                // @ts-expect-error
                _loc7_.blade.y / this.m_physScale,
            );
            _loc10_.rotate(_loc6_);
            _loc10_.translate(
                param2.x / this.m_physScale,
                param2.y / this.m_physScale,
            );
            // @ts-expect-error
            _loc11_ = ((_loc7_.blade.rotation + param1.rotation) * Math.PI) / 180;
            this.bladeOffset = new b2Vec2(_loc10_.tx, _loc10_.ty);
            _loc8_.SetAsOrientedBox(
                // @ts-expect-error
                (_loc7_.blade.scaleX * 100) / 2 / this.m_physScale,
                // @ts-expect-error
                (_loc7_.blade.scaleY * 100) / 2 / this.m_physScale,
                this.bladeOffset,
                _loc11_,
            );
            this.sensorShape = this.weaponBody.CreateShape(_loc8_);
            _loc8_.filter.maskBits = 8;
            _loc8_.isSensor = false;
            this.solidShape = this.weaponBody.CreateShape(_loc8_);
            _loc8_.filter.maskBits = 65535;
            this.bladeAngle = this.weaponBody.GetAngle() + _loc11_;
            _loc10_ = new Matrix();
            // @ts-expect-error
            _loc10_.rotate((_loc7_.handle.rotation * Math.PI) / 180);
            _loc10_.translate(
                // @ts-expect-error
                _loc7_.handle.x / this.m_physScale,
                // @ts-expect-error
                _loc7_.handle.y / this.m_physScale,
            );
            _loc10_.rotate(_loc6_);
            _loc10_.translate(
                param2.x / this.m_physScale,
                param2.y / this.m_physScale,
            );
            // @ts-expect-error
            _loc11_ = ((_loc7_.handle.rotation + param1.rotation) * Math.PI) / 180;
            this.weaponAngleOffset = _loc11_;
            this.weaponPosOffset = new b2Vec2(_loc10_.tx, _loc10_.ty);
            _loc8_.SetAsOrientedBox(
                // @ts-expect-error
                (_loc7_.handle.scaleX * 100) / 2 / this.m_physScale,
                // @ts-expect-error
                (_loc7_.handle.scaleY * 100) / 2 / this.m_physScale,
                new b2Vec2(_loc10_.tx, _loc10_.ty),
                _loc11_,
            );
            this.handleShape = this.weaponBody.CreateShape(_loc8_);
        } else {
            _loc12_ = new b2BodyDef();
            _loc12_.position = new b2Vec2(
                param2.x / this.m_physScale,
                param2.y / this.m_physScale,
            );
            _loc12_.angle = _loc6_;
            _loc12_.isSleeping = param1.sleeping;
            this.weaponBody = _loc4_.CreateBody(_loc12_);
            this.bladeOffset = new b2Vec2(
                // @ts-expect-error
                _loc7_.blade.x / this.m_physScale,
                // @ts-expect-error
                _loc7_.blade.y / this.m_physScale,
            );
            _loc8_.SetAsOrientedBox(
                // @ts-expect-error
                (_loc7_.blade.scaleX * 100) / 2 / this.m_physScale,
                // @ts-expect-error
                (_loc7_.blade.scaleY * 100) / 2 / this.m_physScale,
                this.bladeOffset,
                // @ts-expect-error
                (_loc7_.blade.rotation * Math.PI) / 180,
            );
            this.sensorShape = this.weaponBody.CreateShape(_loc8_);
            _loc8_.filter.maskBits = 8;
            _loc8_.isSensor = false;
            this.solidShape = this.weaponBody.CreateShape(_loc8_);
            _loc8_.filter.maskBits = 65535;
            // @ts-expect-error
            this.bladeAngle = _loc6_ + (_loc7_.blade.rotation * Math.PI) / 180;
            _loc8_.SetAsOrientedBox(
                // @ts-expect-error
                (_loc7_.handle.scaleX * 100) / 2 / this.m_physScale,
                // @ts-expect-error
                (_loc7_.handle.scaleY * 100) / 2 / this.m_physScale,
                new b2Vec2(
                    // @ts-expect-error
                    _loc7_.handle.x / this.m_physScale,
                    // @ts-expect-error
                    _loc7_.handle.y / this.m_physScale,
                ),
            );
            this.handleShape = this.weaponBody.CreateShape(_loc8_);
            this.weaponBody.SetMassFromShapes();
            this.weaponBody.SetUserData(this.mc);
        }
    }

    private checkAdd(param1: b2ContactPoint) {
        var _loc2_: b2Body = param1.shape2.GetBody();
        if (!(param1.shape2.GetMaterial() & 6) && _loc2_.GetMass() != 0) {
            return;
        }
        if (param1.shape2.IsSensor() || _loc2_.GetMass() == 0) {
            return;
        }
        this.bodiesToAdd.push(_loc2_);
        this.add = true;
    }

    private checkRemove(param1: b2ContactPoint) {
        var _loc2_: b2Body = param1.shape2.GetBody();
        if (!(param1.shape2.GetMaterial() & 6) && _loc2_.GetMass() != 0) {
            return;
        }
        if (param1.shape2.IsSensor()) {
            return;
        }
        if (
            Boolean(this.bjDictionary.get(_loc2_)) ||
            this.bodiesToAdd.indexOf(_loc2_) > -1
        ) {
            this.bodiesToRemove.push(_loc2_);
            this.remove = true;
        }
    }

    private createPrisJoint(param1: b2Body) {
        var _loc3_ = undefined;
        var _loc9_: CharacterB2D = null;
        var _loc10_: NPCharacter = null;
        var _loc11_: number = 0;
        var _loc12_: ContactListener = null;
        var _loc13_: string = null;
        var _loc14_: number = 0;
        var _loc15_: b2Vec2 = null;
        var _loc16_: FoodItem = null;
        var _loc17_: number = 0;
        var _loc18_: number = NaN;
        var _loc2_: b2Shape = param1.GetShapeList();
        _loc3_ = _loc2_.GetUserData();
        if (_loc3_ instanceof CharacterB2D) {
            _loc9_ = _loc3_ as CharacterB2D;
            _loc9_.shapeImpale(_loc2_);
        } else if (_loc3_ instanceof NPCharacter) {
            _loc10_ = _loc3_ as NPCharacter;
            _loc10_.shapeImpale(_loc2_);
        }
        if (this.bjDictionary.get(param1)) {
            _loc11_ = int(this.countDictionary.get(param1));
            this.countDictionary.set(param1, _loc11_ + 1);
            return;
        }
        var _loc4_: Session = Settings.currentSession;
        var _loc5_ = new b2PrismaticJointDef();
        var _loc6_: b2Vec2 = this.weaponBody.GetWorldCenter();
        var _loc7_: number =
            this.weaponBody.GetAngle() - this.bladeAngle + Math.PI / 2;
        var _loc8_ = new b2Vec2(Math.cos(_loc7_), Math.sin(_loc7_));
        _loc5_.Initialize(this.weaponBody, param1, _loc6_, _loc8_);
        _loc5_.enableLimit = true;
        _loc5_.upperTranslation = 0;
        _loc5_.lowerTranslation = 0;
        _loc5_.collideConnected = true;
        _loc5_.enableMotor = true;
        _loc5_.maxMotorForce = 100000;
        _loc5_.motorSpeed = 0;
        this.bjDictionary.set(
            param1,
            _loc4_.m_world.CreateJoint(_loc5_) as b2PrismaticJoint,
        );
        this.countDictionary.set(param1, 1);
        if (!this.previousBody) {
            _loc12_ = _loc4_.contactListener;
        }
        if (param1 == this.previousBody) {
            return;
        }
        this.previousBody = param1;
        if (_loc2_.GetMaterial() & 6) {
            _loc3_ = _loc2_.GetUserData();
            if (_loc3_ instanceof CharacterB2D) {
                _loc14_ = 50;
                _loc9_ = _loc3_ as CharacterB2D;
                _loc9_.shapeImpale(_loc2_, true, _loc6_, 0.01);
                _loc15_ = param1.GetWorldCenter();
                _loc4_.particleController.createPointBloodBurst(
                    _loc15_.x * this.m_physScale,
                    _loc15_.y * this.m_physScale,
                    5,
                    15,
                    _loc14_,
                );
            } else if (_loc3_ instanceof NPCharacter) {
                _loc14_ = 50;
                _loc10_ = _loc3_ as NPCharacter;
                _loc10_.shapeImpale(_loc2_, true);
                _loc15_ = param1.GetWorldCenter();
                _loc4_.particleController.createPointBloodBurst(
                    _loc15_.x * this.m_physScale,
                    _loc15_.y * this.m_physScale,
                    5,
                    15,
                    _loc14_,
                );
            } else if (_loc3_ instanceof FoodItem) {
                _loc16_ = _loc3_ as FoodItem;
                _loc13_ = _loc16_.particleType;
                _loc14_ = 25;
                _loc15_ = param1.GetWorldCenter();
                _loc4_.particleController.createPointBurst(
                    _loc13_,
                    _loc15_.x * this.m_physScale,
                    _loc15_.y * this.m_physScale,
                    5,
                    15,
                    _loc14_,
                );
            }
            this.paintBlood(
                _loc15_.x * this.m_physScale,
                _loc15_.y * this.m_physScale,
                _loc16_,
            );
            if (!this.fleshSound) {
                _loc17_ = Math.ceil(Math.random() * 3);
                this.fleshSound =
                    SoundController.instance.playAreaSoundInstance(
                        "BladeFlesh" + _loc17_,
                        this.weaponBody,
                    );
                if (this.fleshSound) {
                    this.fleshSound.addEventListener(
                        AreaSoundInstance.AREA_SOUND_STOP,
                        this.fleshSoundStopped,
                        false,
                        0,
                        true,
                    );
                }
            }
        } else {
            _loc18_ = this.weaponBody.GetLinearVelocity().LengthSquared();
            if (!this.solidSound && _loc18_ > 9) {
                _loc17_ = Math.ceil(Math.random() * 3);
                this.solidSound =
                    SoundController.instance.playAreaSoundInstance(
                        "BladeSolid" + _loc17_,
                        this.weaponBody,
                    );
                if (this.solidSound) {
                    this.solidSound.addEventListener(
                        AreaSoundInstance.AREA_SOUND_STOP,
                        this.solidSoundStopped,
                        false,
                        0,
                        true,
                    );
                }
            }
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

    public override singleAction() {
        if (!this.mc.visible) {
            this.mc.visible = true;
        }
    }

    private fleshSoundStopped(param1: Event) {
        this.fleshSound.removeEventListener(
            AreaSoundInstance.AREA_SOUND_STOP,
            this.fleshSoundStopped,
        );
        this.fleshSound = null;
    }

    private solidSoundStopped(param1: Event) {
        this.solidSound.removeEventListener(
            AreaSoundInstance.AREA_SOUND_STOP,
            this.solidSoundStopped,
        );
        this.solidSound = null;
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

    public override die() {
        var _loc1_: Session = Settings.currentSession;
        if (this.fleshSound) {
            this.fleshSound.removeEventListener(
                AreaSoundInstance.AREA_SOUND_STOP,
                this.fleshSoundStopped,
            );
            this.fleshSound = null;
        }
        if (this.solidSound) {
            this.solidSound.removeEventListener(
                AreaSoundInstance.AREA_SOUND_STOP,
                this.solidSoundStopped,
            );
            this.solidSound = null;
        }
        this.add = false;
        this.remove = false;
        this.bodiesToAdd = null;
        this.bodiesToRemove = null;
        this.bjDictionary = null;
        this.countDictionary = null;
        _loc1_.contactListener.deleteListener(
            ContactListener.ADD,
            this.sensorShape,
        );
        _loc1_.contactListener.deleteListener(
            ContactListener.REMOVE,
            this.sensorShape,
        );
        _loc1_.contactListener.deleteListener(
            ContactListener.RESULT,
            this.handleShape,
        );
    }

    public override getJointBody(param1: b2Vec2 = null): b2Body {
        return this.weaponBody;
    }

    public override get groupDisplayObject(): DisplayObject {
        return this.mc;
    }

    protected paintBlood(param1: number, param2: number, param3: FoodItem) {
        var _loc7_: Rectangle = null;
        var _loc8_: ColorTransform = null;
        if (!this.bitmap) {
            _loc7_ = this.mc.getBounds(this.mc);
            this.bmd = new BitmapData(
                Math.ceil(_loc7_.width),
                Math.ceil(_loc7_.height),
                true,
                0,
            );
            this.bitmap = new Bitmap(this.bmd);
            this.bitmap.smoothing = true;
            this.bitmap.x = _loc7_.x;
            this.bitmap.y = _loc7_.y;
            this.mc.addChild(this.bitmap);
            this.bitmap.alpha = 0.85;
        }
        var _loc4_ = new Point(param1, param2);
        _loc4_ = Settings.currentSession.level.background.localToGlobal(_loc4_);
        _loc4_ = this.mc.globalToLocal(_loc4_);
        var _loc5_: MovieClip = new BladeBloodMC();
        // @ts-expect-error
        _loc5_.inner.x = _loc4_.x;
        // @ts-expect-error
        _loc5_.inner.y = _loc4_.y;
        // @ts-expect-error
        _loc5_.inner.rotation = Math.random() * 360;
        if (Math.random() > 0.5) {
            // @ts-expect-error
            _loc5_.inner.scaleX = -1;
        }
        _loc5_.mask = this.maskSprite;
        var _loc6_ = new Matrix();
        _loc6_.translate(-this.bitmap.x, -this.bitmap.y);
        if (param3) {
            _loc8_ = _loc5_.transform.colorTransform;
            _loc8_.color = param3.juiceColor;
            _loc8_.alphaMultiplier = 0.75;
            this.bmd.draw(_loc5_, _loc6_, _loc8_);
        } else {
            this.bmd.draw(_loc5_, _loc6_);
        }
    }

    public override paint() {
        var _loc1_: b2Vec2 = this.weaponBody.GetWorldPoint(
            this.weaponPosOffset,
        );
        this.mc.rotation =
            ((this.weaponBody.GetAngle() * LevelItem.oneEightyOverPI) % 360) +
            this.weaponAngleOffset;
        this.mc.x = _loc1_.x * this.m_physScale;
        this.mc.y = _loc1_.y * this.m_physScale;
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
            if (this.weaponBody) {
                this.weaponBody.WakeUp();
            }
        } else if (param2 == "apply impulse") {
            if (this.weaponBody) {
                _loc4_ = Number(param3[0]);
                _loc5_ = Number(param3[1]);
                _loc6_ = this.weaponBody.GetMass();
                this.weaponBody.ApplyImpulse(
                    new b2Vec2(_loc4_ * _loc6_, _loc5_ * _loc6_),
                    this.weaponBody.GetWorldCenter(),
                );
                _loc7_ = Number(param3[2]);
                _loc8_ = this.weaponBody.GetAngularVelocity();
                this.weaponBody.SetAngularVelocity(_loc8_ + _loc7_);
            }
        }
    }

    public override get bodyList(): any[] {
        if (this.weaponBody) {
            return [this.weaponBody];
        }
        return [];
    }
}