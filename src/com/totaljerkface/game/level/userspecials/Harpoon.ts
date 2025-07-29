import b2ContactPoint from "@/Box2D/Collision/b2ContactPoint";
import b2PolygonDef from "@/Box2D/Collision/Shapes/b2PolygonDef";
import b2Shape from "@/Box2D/Collision/Shapes/b2Shape";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2Body from "@/Box2D/Dynamics/b2Body";
import b2BodyDef from "@/Box2D/Dynamics/b2BodyDef";
import b2Joint from "@/Box2D/Dynamics/Joints/b2Joint";
import b2PrismaticJoint from "@/Box2D/Dynamics/Joints/b2PrismaticJoint";
import b2PrismaticJointDef from "@/Box2D/Dynamics/Joints/b2PrismaticJointDef";
import CharacterB2D from "@/com/totaljerkface/game/character/CharacterB2D";
import ContactListener from "@/com/totaljerkface/game/ContactListener";
import LevelItem from "@/com/totaljerkface/game/level/LevelItem";
import FoodItem from "@/com/totaljerkface/game/level/userspecials/FoodItem";
import NPCharacter from "@/com/totaljerkface/game/level/userspecials/NPCharacter";
import Session from "@/com/totaljerkface/game/Session";
import Settings from "@/com/totaljerkface/game/Settings";
import AreaSoundInstance from "@/com/totaljerkface/game/sound/AreaSoundInstance";
import SoundController from "@/com/totaljerkface/game/sound/SoundController";
import HarpoonBloodMC from "@/top/HarpoonBloodMC";
import HarpoonMC from "@/top/HarpoonMC";
import { boundClass } from 'autobind-decorator';
import Bitmap from "flash/display/Bitmap";
import BitmapData from "flash/display/BitmapData";
import MovieClip from "flash/display/MovieClip";
import Sprite from "flash/display/Sprite";
import Event from "flash/events/Event";
import ColorTransform from "flash/geom/ColorTransform";

@boundClass
export default class Harpoon extends LevelItem {
    public static HIT: string;
    private mc: HarpoonMC;
    private bitmap: Bitmap;
    private bmd: BitmapData;
    public harpoonBody: b2Body;
    private sensorShape: b2Shape;
    private previousBody: b2Body;
    private add: boolean;
    private remove: boolean;
    private bodiesToAdd: any[];
    private bodiesToRemove: any[];
    private bjDictionary: Dictionary<any, any>;
    private countDictionary: Dictionary<any, any>;
    private fleshSound: AreaSoundInstance;
    private solidSound: AreaSoundInstance;
    private fixedTurret: boolean;

    constructor(
        param1: b2Vec2,
        param2: number,
        param3: b2Vec2,
        param4: boolean = false,
    ) {
        super();
        this.fixedTurret = param4;
        this.mc = new HarpoonMC();
        this.mc.x = param1.x * this.m_physScale;
        this.mc.y = param1.y * this.m_physScale;
        this.mc.rotation = (param2 * 180) / Math.PI;
        var _loc5_: Sprite = Settings.currentSession.level.background;
        _loc5_.addChild(this.mc);
        this.bmd = new BitmapData(106, 16, true, 0);
        this.bitmap = new Bitmap(this.bmd);
        this.bitmap.smoothing = true;
        this.bitmap.x = -53;
        this.bitmap.y = -8;
        this.mc.addChild(this.bitmap);
        this.createBody(param1, param2, param3);
        this.harpoonBody.SetUserData(this.mc);
        this.bodiesToAdd = new Array();
        this.bodiesToRemove = new Array();
        this.bjDictionary = new Dictionary();
        this.countDictionary = new Dictionary();
        var _loc6_: ContactListener = Settings.currentSession.contactListener;
        _loc6_.registerListener(
            ContactListener.ADD,
            this.sensorShape,
            this.checkAdd,
        );
        _loc6_.registerListener(
            ContactListener.REMOVE,
            this.sensorShape,
            this.checkRemove,
        );
        Settings.currentSession.level.actionsVector.push(this);
        Settings.currentSession.level.paintBodyVector.push(this.harpoonBody);
    }

    private createBody(param1: b2Vec2, param2: number, param3: b2Vec2) {
        var _loc7_: b2Vec2 = null;
        var _loc4_: Session = Settings.currentSession;
        var _loc5_ = new b2BodyDef();
        _loc5_.position = param1;
        _loc5_.angle = param2;
        this.harpoonBody = _loc4_.m_world.CreateBody(_loc5_);
        var _loc6_ = new b2PolygonDef();
        _loc6_.SetAsOrientedBox(
            26.25 / this.m_physScale,
            2.5 / this.m_physScale,
            new b2Vec2(26.25 / this.m_physScale, 0),
        );
        _loc6_.isSensor = true;
        _loc6_.density = 3;
        _loc6_.filter.categoryBits = 8;
        _loc6_.filter.groupIndex = _loc4_.version > 1.42 ? -21 : -20;
        this.sensorShape = this.harpoonBody.CreateShape(_loc6_);
        _loc6_.SetAsOrientedBox(
            26.25 / this.m_physScale,
            2.5 / this.m_physScale,
            new b2Vec2(-26.25 / this.m_physScale, 0),
        );
        _loc6_.isSensor = false;
        this.harpoonBody.CreateShape(_loc6_);
        if (this.fixedTurret) {
            _loc7_ = this.harpoonBody.GetWorldPoint(
                new b2Vec2(52.5 / this.m_physScale, 0),
            );
            this.harpoonBody.SetXForm(_loc7_, param2);
        }
        this.harpoonBody.SetMassFromShapes();
        this.harpoonBody.SetLinearVelocity(param3);
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

    private checkAdd(param1: b2ContactPoint) {
        var _loc2_: b2Body = param1.shape2.GetBody();
        if (!(param1.shape2.GetMaterial() & 6) && _loc2_.GetMass() != 0) {
            return;
        }
        if (param1.shape2.IsSensor()) {
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
        var _loc8_: number = 0;
        var _loc9_: string = null;
        var _loc10_: number = 0;
        var _loc11_: FoodItem = null;
        var _loc12_ = undefined;
        var _loc13_: MovieClip = null;
        var _loc14_: CharacterB2D = null;
        var _loc15_: NPCharacter = null;
        var _loc16_: ColorTransform = null;
        var _loc17_: number = 0;
        var _loc2_: b2Shape = param1.GetShapeList();
        if (this.bjDictionary.get(param1)) {
            _loc8_ = int(this.countDictionary.get(param1));
            this.countDictionary.set(param1, _loc8_ + 1);
            return;
        }
        var _loc3_: Session = Settings.currentSession;
        var _loc4_ = new b2PrismaticJointDef();
        var _loc5_: b2Vec2 = this.harpoonBody.GetWorldPoint(
            new b2Vec2(26.25 / this.m_physScale, 0),
        );
        var _loc6_: number = this.harpoonBody.GetAngle();
        var _loc7_ = new b2Vec2(Math.cos(_loc6_), Math.sin(_loc6_));
        _loc4_.Initialize(this.harpoonBody, param1, _loc5_, _loc7_);
        _loc4_.enableLimit = true;
        _loc4_.upperTranslation = 0;
        _loc4_.lowerTranslation = 0;
        _loc4_.collideConnected = true;
        _loc4_.enableMotor = true;
        _loc4_.maxMotorForce = 100000;
        _loc4_.motorSpeed = 0;
        this.bjDictionary.set(
            param1,
            _loc3_.m_world.CreateJoint(_loc4_) as b2PrismaticJoint,
        );
        this.countDictionary.set(param1, 1);
        this.dispatchEvent(new Event(Harpoon.HIT));
        if (param1 == this.previousBody) {
            return;
        }
        this.previousBody = param1;
        if (_loc2_.GetMaterial() & 6) {
            _loc12_ = _loc2_.GetUserData();
            if (_loc12_ instanceof CharacterB2D) {
                _loc10_ = 50;
                _loc14_ = _loc12_ as CharacterB2D;
                _loc14_.shapeImpale(_loc2_, true);
                _loc3_.particleController.createPointBloodBurst(
                    _loc5_.x * this.m_physScale,
                    _loc5_.y * this.m_physScale,
                    5,
                    15,
                    _loc10_,
                );
            } else if (_loc12_ instanceof NPCharacter) {
                _loc10_ = 50;
                _loc15_ = _loc12_ as NPCharacter;
                _loc3_.particleController.createPointBloodBurst(
                    _loc5_.x * this.m_physScale,
                    _loc5_.y * this.m_physScale,
                    5,
                    15,
                    _loc10_,
                );
                _loc15_.shapeImpale(_loc2_, true);
            } else if (_loc12_ instanceof FoodItem) {
                _loc11_ = _loc12_ as FoodItem;
                _loc9_ = _loc11_.particleType;
                _loc10_ = 25;
                _loc3_.particleController.createPointBurst(
                    _loc9_,
                    _loc5_.x * this.m_physScale,
                    _loc5_.y * this.m_physScale,
                    5,
                    15,
                    _loc10_,
                );
            }
            _loc13_ = new HarpoonBloodMC();
            _loc13_.gotoAndStop(Math.ceil(Math.random() * 5));
            if (_loc11_) {
                _loc16_ = _loc13_.transform.colorTransform;
                _loc16_.color = _loc11_.juiceColor;
                _loc16_.alphaMultiplier = 0.75;
                this.bmd.draw(_loc13_, null, _loc16_);
            } else {
                this.bmd.draw(_loc13_);
            }
            if (!this.fleshSound) {
                _loc17_ = Math.ceil(Math.random() * 2);
                this.fleshSound =
                    SoundController.instance.playAreaSoundInstance(
                        "HarpoonFlesh" + _loc17_,
                        this.harpoonBody,
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
        } else if (!this.solidSound) {
            _loc17_ = Math.ceil(Math.random() * 2);
            this.solidSound = SoundController.instance.playAreaSoundInstance(
                "HarpoonSolid" + _loc17_,
                this.harpoonBody,
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
}