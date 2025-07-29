import b2ContactPoint from "@/Box2D/Collision/b2ContactPoint";
import b2FilterData from "@/Box2D/Collision/Shapes/b2FilterData";
import b2PolygonDef from "@/Box2D/Collision/Shapes/b2PolygonDef";
import b2PolygonShape from "@/Box2D/Collision/Shapes/b2PolygonShape";
import b2Shape from "@/Box2D/Collision/Shapes/b2Shape";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2Body from "@/Box2D/Dynamics/b2Body";
import b2World from "@/Box2D/Dynamics/b2World";
import b2Joint from "@/Box2D/Dynamics/Joints/b2Joint";
import b2PrismaticJoint from "@/Box2D/Dynamics/Joints/b2PrismaticJoint";
import b2PrismaticJointDef from "@/Box2D/Dynamics/Joints/b2PrismaticJointDef";
import CharacterB2D from "@/com/totaljerkface/game/character/CharacterB2D";
import ContactListener from "@/com/totaljerkface/game/ContactListener";
import ContactEvent from "@/com/totaljerkface/game/events/ContactEvent";
import LevelB2D from "@/com/totaljerkface/game/level/LevelB2D";
import LevelItem from "@/com/totaljerkface/game/level/LevelItem";
import NPCharacter from "@/com/totaljerkface/game/level/userspecials/NPCharacter";
import Session from "@/com/totaljerkface/game/Session";
import Settings from "@/com/totaljerkface/game/Settings";
import AreaSoundInstance from "@/com/totaljerkface/game/sound/AreaSoundInstance";
import SoundController from "@/com/totaljerkface/game/sound/SoundController";
import GlassBloodMC from "@/top/GlassBloodMC";
import { boundClass } from 'autobind-decorator';
import Bitmap from "flash/display/Bitmap";
import BitmapData from "flash/display/BitmapData";
import MovieClip from "flash/display/MovieClip";
import Sprite from "flash/display/Sprite";
import Event from "flash/events/Event";
import Matrix from "flash/geom/Matrix";
import Point from "flash/geom/Point";
import Rectangle from "flash/geom/Rectangle";

@boundClass
export default class GlassShard extends LevelItem {
    protected shatterImpulse: number;
    protected stabImpulse: number;
    protected soundSuffix: string;
    protected glassParticles: number;
    protected bloodParticles: number = 50;
    protected shape: b2PolygonShape;
    protected sensor: b2Shape;
    protected body: b2Body;
    protected sprite: Sprite;
    protected maskSprite: Sprite;
    protected previousBody: b2Body;
    protected stab: boolean;
    protected shatter: boolean;
    protected add: boolean;
    protected remove: boolean;
    protected bodiesToAdd: any[];
    protected bodiesToRemove: any[];
    protected normals: any[];
    protected bjDictionary: Dictionary<any, any>;
    protected countDictionary: Dictionary<any, any>;
    protected fleshSound: AreaSoundInstance;
    protected bitmap: Bitmap;
    protected bmd: BitmapData;
    protected inSAA: boolean;
    protected fatal: boolean;

    constructor(param1: b2Body, param2: Sprite, param3: Sprite) {
        super();
        this.body = param1;
        this.shape = param1.GetShapeList() as b2PolygonShape;
        this.sprite = param2;
        this.maskSprite = param3;
        this.setValues();
        this.bodiesToAdd = new Array();
        this.normals = new Array();
        this.bodiesToRemove = new Array();
        this.bjDictionary = new Dictionary();
        this.countDictionary = new Dictionary();
        var _loc4_: Session = Settings.currentSession;
        _loc4_.contactListener.registerListener(
            ContactListener.RESULT,
            this.shape,
            this.checkContact,
        );
        _loc4_.level.paintItemVector.push(this);
    }

    protected setValues() {
        var _loc1_: number = this.body.GetMass();
        this.shatterImpulse = _loc1_ * 10;
        this.stabImpulse = _loc1_ * 2;
        if (_loc1_ >= 0.15) {
            this.fatal = true;
        }
        if (_loc1_ < 0.75) {
            this.soundSuffix = "Light";
            this.glassParticles = 50;
        } else if (_loc1_ < 4) {
            this.soundSuffix = "Mid";
            this.glassParticles = 100;
        } else {
            this.soundSuffix = "Heavy";
            this.glassParticles = 200;
        }
    }

    public override actions() {
        var _loc1_: number = 0;
        if (this.add) {
            _loc1_ = 0;
            while (_loc1_ < this.bodiesToAdd.length) {
                this.createPrisJoint(
                    this.bodiesToAdd[_loc1_],
                    this.normals[_loc1_],
                );
                _loc1_++;
            }
            this.bodiesToAdd = new Array();
            this.normals = new Array();
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
        var _loc5_: b2FilterData = null;
        var _loc6_: b2PolygonDef = null;
        var _loc7_: number = NaN;
        var _loc1_: Session = Settings.currentSession;
        var _loc2_: LevelB2D = _loc1_.level;
        var _loc3_: b2World = _loc1_.m_world;
        var _loc4_: ContactListener = _loc1_.contactListener;
        this.inSAA = false;
        if (this.stab) {
            this.stab = false;
            _loc4_.deleteListener(ContactEvent.RESULT, this.shape);
            _loc5_ = this.shape.GetFilterData().Copy();
            _loc5_.maskBits = 8;
            this.shape.SetFilterData(_loc5_);
            _loc3_.Refilter(this.shape);
            _loc6_ = new b2PolygonDef();
            _loc6_.isSensor = true;
            _loc6_.filter.categoryBits = 8;
            _loc6_.filter.maskBits = 4;
            _loc6_.vertexCount = this.shape.GetVertexCount();
            _loc6_.vertices = this.shape.GetVertices();
            this.sensor = this.body.CreateShape(_loc6_);
            _loc2_.actionsVector.push(this);
            _loc4_.registerListener(
                ContactEvent.RESULT,
                this.shape,
                this.checkContact,
            );
            _loc4_.registerListener(
                ContactListener.ADD,
                this.sensor,
                this.checkAdd,
            );
            _loc4_.registerListener(
                ContactListener.REMOVE,
                this.sensor,
                this.checkRemove,
            );
        } else {
            _loc2_.removeFromPaintItemVector(this);
            _loc2_.removeFromActionsVector(this);
            _loc7_ = Math.ceil(Math.random() * 2);
            _loc1_.particleController.createRectBurst(
                "glass",
                10,
                this.body,
                this.glassParticles,
            );
            SoundController.instance.playAreaSoundInstance(
                "Glass" + this.soundSuffix + _loc7_,
                this.body,
            );
            _loc3_.DestroyBody(this.body);
            this.sprite.parent.removeChild(this.sprite);
            _loc4_.deleteListener(ContactEvent.RESULT, this.shape);
            if (this.sensor) {
                this.add = this.remove = false;
                _loc4_.deleteListener(ContactListener.ADD, this.sensor);
                _loc4_.deleteListener(ContactListener.REMOVE, this.sensor);
                if (this.bmd) {
                    this.bmd.dispose();
                }
            }
        }
    }

    protected checkContact(param1: ContactEvent) {
        var _loc2_: Vector<LevelItem> = null;
        if (param1.impulse > this.stabImpulse) {
            _loc2_ = Settings.currentSession.level.singleActionVector;
            if (param1.impulse > this.shatterImpulse) {
                this.stab = false;
                Settings.currentSession.contactListener.deleteListener(
                    ContactEvent.RESULT,
                    this.shape,
                );
                if (!this.inSAA) {
                    Settings.currentSession.level.singleActionVector.push(this);
                }
                this.inSAA = true;
                return;
            }
            if (Boolean(param1.otherShape.m_material & 2) && !this.sensor) {
                this.stab = true;
                if (!this.inSAA) {
                    Settings.currentSession.level.singleActionVector.push(this);
                }
                this.inSAA = true;
            }
        }
    }

    protected checkAdd(param1: b2ContactPoint) {
        var _loc2_: b2Body = null;
        if (param1.shape2.m_material & 2) {
            _loc2_ = param1.shape2.GetBody();
            this.bodiesToAdd.push(_loc2_);
            this.normals.push(param1.normal);
            this.add = true;
        }
    }

    protected checkRemove(param1: b2ContactPoint) {
        var _loc2_: b2Body = null;
        if (param1.shape2.m_material & 2) {
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

    protected createPrisJoint(param1: b2Body, param2: b2Vec2) {
        var _loc9_: number = 0;
        var _loc10_: CharacterB2D = null;
        var _loc11_: NPCharacter = null;
        var _loc12_: number = 0;
        if (this.bjDictionary.get(param1)) {
            _loc9_ = int(this.countDictionary.get(param1));
            this.countDictionary.set(param1, _loc9_ + 1);
            return;
        }
        var _loc3_: Session = Settings.currentSession;
        var _loc4_: b2Shape = param1.GetShapeList();
        var _loc5_ = _loc4_.GetUserData();
        if (_loc5_ instanceof CharacterB2D) {
            _loc10_ = _loc5_ as CharacterB2D;
            _loc10_.shapeImpale(_loc4_, this.fatal);
        } else if (_loc5_ instanceof NPCharacter) {
            _loc11_ = _loc5_ as NPCharacter;
            _loc11_.shapeImpale(_loc4_, this.fatal);
        }
        var _loc6_ = new b2PrismaticJointDef();
        var _loc7_: b2Vec2 = param1.GetWorldCenter();
        var _loc8_: b2Body =
            this.body != null
                ? this.body
                : Settings.currentSession.level.levelBody;
        _loc6_.Initialize(_loc8_, param1, _loc7_, param2);
        _loc6_.collideConnected = true;
        _loc6_.enableMotor = true;
        _loc6_.maxMotorForce = 30;
        _loc6_.motorSpeed = 0;
        this.bjDictionary.set(
            param1,
            _loc3_.m_world.CreateJoint(_loc6_) as b2PrismaticJoint,
        );
        this.countDictionary.set(param1, 1);
        if (param1 == this.previousBody) {
            return;
        }
        this.previousBody = param1;
        _loc3_.particleController.createPointBloodBurst(
            _loc7_.x * this.m_physScale,
            _loc7_.y * this.m_physScale,
            5,
            15,
            this.bloodParticles,
        );
        this.paintBlood(
            _loc7_.x * this.m_physScale,
            _loc7_.y * this.m_physScale,
        );
        if (!this.fleshSound) {
            _loc12_ = Math.ceil(Math.random() * 3);
            this.fleshSound = SoundController.instance.playAreaSoundInstance(
                "ImpaleSpikes" + _loc12_,
                this.body,
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
    }

    protected removeJoint(param1: b2Body) {
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

    protected paintBlood(param1: number, param2: number) {
        var _loc6_: Rectangle = null;
        if (!this.bitmap) {
            _loc6_ = this.sprite.getBounds(this.sprite);
            this.bmd = new BitmapData(
                Math.ceil(_loc6_.width),
                Math.ceil(_loc6_.height),
                true,
                0,
            );
            this.bitmap = new Bitmap(this.bmd);
            this.bitmap.smoothing = true;
            this.bitmap.x = _loc6_.x;
            this.bitmap.y = _loc6_.y;
            this.sprite.addChild(this.bitmap);
        }
        var _loc3_ = new Point(param1, param2);
        _loc3_ = Settings.currentSession.level.background.localToGlobal(_loc3_);
        _loc3_ = this.sprite.globalToLocal(_loc3_);
        var _loc4_: MovieClip = new GlassBloodMC();
        // @ts-expect-error
        _loc4_.inner.x = _loc3_.x;
        // @ts-expect-error
        _loc4_.inner.y = _loc3_.y;
        // @ts-expect-error
        _loc4_.inner.rotation = Math.random() * 360;
        if (Math.random() > 0.5) {
            // @ts-expect-error
            _loc4_.inner.scaleX = -1;
        }
        _loc4_.mask = this.maskSprite;
        var _loc5_ = new Matrix();
        _loc5_.translate(-this.bitmap.x, -this.bitmap.y);
        this.bmd.draw(_loc4_, _loc5_);
        _loc4_.mask = null;
    }

    protected fleshSoundStopped(param1: Event) {
        this.fleshSound.removeEventListener(
            AreaSoundInstance.AREA_SOUND_STOP,
            this.fleshSoundStopped,
        );
        this.fleshSound = null;
    }

    public override paint() {
        var _loc1_: b2Vec2 = null;
        _loc1_ = this.body.GetPosition();
        this.sprite.x = _loc1_.x * this.m_physScale;
        this.sprite.y = _loc1_.y * this.m_physScale;
        this.sprite.rotation =
            (this.body.GetAngle() * LevelItem.oneEightyOverPI) % 360;
    }
}