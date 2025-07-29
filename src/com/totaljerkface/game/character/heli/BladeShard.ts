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
import HelicopterMan from "@/com/totaljerkface/game/character/HelicopterMan";
import ContactListener from "@/com/totaljerkface/game/ContactListener";
import ContactEvent from "@/com/totaljerkface/game/events/ContactEvent";
import NPCharacter from "@/com/totaljerkface/game/level/userspecials/NPCharacter";
import Session from "@/com/totaljerkface/game/Session";
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
export default class BladeShard {
    private static oneEightyOverPI: number;
    private static bloodParticles: number = 50;
    protected m_physScale: number;
    protected character: HelicopterMan;
    protected rightSide: boolean;
    protected shape: b2PolygonShape;
    protected sensor: b2Shape;
    protected body: b2Body;
    protected sprite: Sprite;
    protected maskSprite: Sprite;
    protected previousBody: b2Body;
    protected bitmap: Bitmap;
    protected bmd: BitmapData;
    protected stabImpulse: number;
    protected stab: boolean;
    protected add: boolean;
    protected remove: boolean;
    protected bodiesToAdd: any[];
    protected bodiesToRemove: any[];
    protected normals: any[];
    protected bjDictionary: Dictionary<any, any>;
    protected countDictionary: Dictionary<any, any>;
    protected fleshSound: AreaSoundInstance;
    protected fatal: boolean;

    constructor(param1: b2Body, param2: boolean, param3: HelicopterMan) {
        this.body = param1;
        this.character = param3;
        this.rightSide = param2;
        this.m_physScale = param3.session.m_physScale;
        this.shape = param1.GetShapeList() as b2PolygonShape;
        this.stabImpulse = param1.m_mass * 3;
        this.fatal = true;
        this.bodiesToAdd = new Array();
        this.normals = new Array();
        this.bodiesToRemove = new Array();
        this.bjDictionary = new Dictionary();
        this.countDictionary = new Dictionary();
        param3.session.contactListener.registerListener(
            ContactListener.RESULT,
            this.shape,
            this.checkContact,
        );
        this.createSprites();
    }

    private createSprites() {
        var _loc9_: number = 0;
        var _loc11_: b2Vec2 = null;
        var _loc12_: b2Vec2 = null;
        var _loc13_: number = 0;
        var _loc14_: b2Vec2 = null;
        this.sprite = new Sprite();
        this.maskSprite = new Sprite();
        this.character.session.level.background.addChild(this.sprite);
        var _loc1_: b2PolygonShape = this.body.GetShapeList() as b2PolygonShape;
        var _loc2_: number = _loc1_.m_vertexCount;
        var _loc3_: b2Vec2 = _loc1_.m_vertices[0];
        var _loc4_ = new Array();
        var _loc5_: number = 0;
        var _loc6_ = new b2Vec2(
            _loc3_.x * this.m_physScale,
            _loc3_.y * this.m_physScale,
        );
        var _loc7_ = uint(this.rightSide ? 5592411 : 13421772);
        this.sprite.graphics.beginFill(_loc7_);
        this.maskSprite.graphics.beginFill(_loc7_);
        this.sprite.graphics.moveTo(_loc6_.x, _loc6_.y);
        this.maskSprite.graphics.moveTo(_loc6_.x, _loc6_.y);
        var _loc8_ = new Array();
        _loc9_ = 0;
        while (_loc9_ < _loc2_) {
            _loc3_ = _loc1_.m_vertices[_loc9_];
            _loc6_ = new b2Vec2(
                _loc3_.x * this.m_physScale,
                _loc3_.y * this.m_physScale,
            );
            if (!(this.rightSide && _loc6_.y < 0)) {
                if (!(!this.rightSide && _loc6_.y > 0)) {
                    _loc8_[_loc9_] = _loc6_.Copy();
                    _loc5_++;
                }
            }
            this.sprite.graphics.lineTo(_loc6_.x, _loc6_.y);
            this.maskSprite.graphics.lineTo(_loc6_.x, _loc6_.y);
            _loc4_.push(_loc6_);
            _loc9_++;
        }
        _loc6_ = _loc4_[0];
        this.sprite.graphics.lineTo(_loc6_.x, _loc6_.y);
        this.maskSprite.graphics.lineTo(_loc6_.x, _loc6_.y);
        this.sprite.graphics.endFill();
        this.maskSprite.graphics.endFill();
        var _loc10_: number = this.rightSide ? -1.5 : 1.5;
        _loc9_ = 0;
        while (_loc9_ < _loc2_) {
            _loc11_ = _loc8_[_loc9_];
            if (_loc11_) {
                if (_loc5_ == 1) {
                    _loc12_ = _loc11_.Copy();
                    _loc13_ = _loc9_ > 0 ? _loc9_ - 1 : _loc2_ - 1;
                    _loc14_ = _loc4_[_loc13_];
                    this.trimVert(_loc11_, _loc14_, _loc10_);
                    _loc4_[_loc9_] = _loc11_;
                    _loc13_ = _loc9_ < _loc2_ - 1 ? _loc9_ + 1 : 0;
                    _loc14_ = _loc4_[_loc13_];
                    this.trimVert(_loc12_, _loc14_, _loc10_);
                    _loc4_.splice(_loc13_, 0, _loc12_);
                } else {
                    _loc13_ = _loc9_ > 0 ? _loc9_ - 1 : _loc2_ - 1;
                    if (_loc8_[_loc13_]) {
                        _loc13_ = _loc9_ < _loc2_ - 1 ? _loc9_ + 1 : 0;
                    }
                    _loc14_ = _loc4_[_loc13_];
                    this.trimVert(_loc11_, _loc14_, _loc10_);
                    _loc11_.y = _loc10_;
                    _loc4_[_loc9_] = _loc11_;
                }
            }
            _loc9_++;
        }
        _loc7_ = 9408664;
        this.sprite.graphics.beginFill(_loc7_);
        _loc6_ = _loc4_[0];
        this.sprite.graphics.moveTo(_loc6_.x, _loc6_.y);
        _loc9_ = 1;
        while (_loc9_ < _loc4_.length) {
            _loc6_ = _loc4_[_loc9_];
            this.sprite.graphics.lineTo(_loc6_.x, _loc6_.y);
            _loc9_++;
        }
        _loc6_ = _loc4_[0];
        this.sprite.graphics.lineTo(_loc6_.x, _loc6_.y);
        this.sprite.graphics.endFill();
    }

    private traceArray(param1: any[]) {
        var _loc3_: b2Vec2 = null;
        var _loc2_: number = 0;
        while (_loc2_ < param1.length) {
            _loc3_ = param1[_loc2_];
            if (_loc3_) {
                trace(
                    "vert " +
                    _loc2_ +
                    " = (" +
                    _loc3_.x +
                    ", " +
                    _loc3_.y +
                    ")",
                );
            } else {
                trace("vert " + _loc2_ + " = null");
            }
            _loc2_++;
        }
    }

    private trimVert(param1: b2Vec2, param2: b2Vec2, param3: number) {
        var _loc4_: number = NaN;
        var _loc5_: number = NaN;
        if (param2.x != param1.x) {
            _loc4_ = (param2.y - param1.y) / (param2.x - param1.x);
            _loc5_ = param2.y - _loc4_ * param2.x;
            param1.x = (param3 - _loc5_) / _loc4_;
        }
        param1.y = param3;
    }

    public paint() {
        var _loc1_: b2Vec2 = this.body.GetPosition();
        this.sprite.x = _loc1_.x * this.m_physScale;
        this.sprite.y = _loc1_.y * this.m_physScale;
        this.sprite.rotation =
            (this.body.GetAngle() * BladeShard.oneEightyOverPI) % 360;
    }

    public actions() {
        var _loc1_: Session = null;
        var _loc2_: b2World = null;
        var _loc3_: ContactListener = null;
        var _loc4_: b2FilterData = null;
        var _loc5_: b2PolygonDef = null;
        var _loc6_: number = 0;
        if (this.stab) {
            this.stab = false;
            _loc1_ = this.character.session;
            _loc2_ = _loc1_.m_world;
            _loc3_ = _loc1_.contactListener;
            _loc3_.deleteListener(ContactEvent.RESULT, this.shape);
            _loc4_ = this.shape.GetFilterData().Copy();
            _loc4_.maskBits = 8;
            this.shape.SetFilterData(_loc4_);
            _loc2_.Refilter(this.shape);
            _loc5_ = new b2PolygonDef();
            _loc5_.isSensor = true;
            _loc5_.filter.categoryBits = 8;
            _loc5_.filter.maskBits = 4;
            _loc5_.vertexCount = this.shape.GetVertexCount();
            _loc5_.vertices = this.shape.GetVertices();
            this.sensor = this.body.CreateShape(_loc5_);
            _loc3_.registerListener(
                ContactListener.ADD,
                this.sensor,
                this.checkAdd,
            );
            _loc3_.registerListener(
                ContactListener.REMOVE,
                this.sensor,
                this.checkRemove,
            );
        } else {
            if (this.add) {
                _loc6_ = 0;
                while (_loc6_ < this.bodiesToAdd.length) {
                    this.createPrisJoint(
                        this.bodiesToAdd[_loc6_],
                        this.normals[_loc6_],
                    );
                    _loc6_++;
                }
                this.bodiesToAdd = new Array();
                this.normals = new Array();
                this.add = false;
            }
            if (this.remove) {
                _loc6_ = 0;
                while (_loc6_ < this.bodiesToRemove.length) {
                    this.removeJoint(this.bodiesToRemove[_loc6_]);
                    _loc6_++;
                }
                this.bodiesToRemove = new Array();
                this.remove = false;
                this.checkZeroJoints();
            }
        }
    }

    protected checkContact(param1: ContactEvent) {
        var _loc2_: any[] = null;
        var _loc3_: number = 0;
        if (param1.impulse > this.stabImpulse) {
            if (Boolean(param1.otherShape.m_material & 2) && !this.sensor) {
                this.stab = true;
                _loc2_ = this.character.bladeActions;
                _loc3_ = int(_loc2_.indexOf(this));
                if (_loc3_ < 0) {
                    this.character.bladeActions.push(this);
                }
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

    protected checkZeroJoints() {
        var _loc2_: {} = null;
        var _loc3_: Session = null;
        var _loc4_: ContactListener = null;
        var _loc5_: b2FilterData = null;
        var _loc6_: any[] = null;
        var _loc7_: number = 0;
        var _loc1_: number = 0;
        for (_loc2_ of this.bjDictionary.keys()) {
            _loc1_ += 1;
        }
        if (_loc1_ == 0) {
            _loc3_ = this.character.session;
            _loc4_ = _loc3_.contactListener;
            _loc4_.deleteListener(ContactEvent.RESULT, this.shape);
            _loc5_ = new b2FilterData();
            _loc5_.categoryBits = 8;
            this.shape.SetFilterData(_loc5_);
            _loc3_.m_world.Refilter(this.shape);
            _loc4_.registerListener(
                ContactEvent.RESULT,
                this.shape,
                this.checkContact,
            );
            _loc4_.deleteListener(ContactListener.ADD, this.sensor);
            _loc4_.deleteListener(ContactListener.REMOVE, this.sensor);
            this.body.DestroyShape(this.sensor);
            this.sensor = null;
            _loc6_ = this.character.bladeActions;
            _loc7_ = int(_loc6_.indexOf(this));
            _loc6_.splice(_loc7_, 1);
        }
    }

    protected createPrisJoint(param1: b2Body, param2: b2Vec2) {
        var _loc8_: number = 0;
        var _loc9_: CharacterB2D = null;
        var _loc10_: NPCharacter = null;
        var _loc11_: number = 0;
        if (this.bjDictionary.get(param1)) {
            _loc8_ = int(this.countDictionary.get(param1));
            this.countDictionary.set(param1, _loc8_ + 1);
            return;
        }
        var _loc3_: Session = this.character.session;
        var _loc4_: b2Shape = param1.GetShapeList();
        var _loc5_ = _loc4_.GetUserData();
        if (_loc5_ instanceof CharacterB2D) {
            _loc9_ = _loc5_ as CharacterB2D;
            _loc9_.shapeImpale(_loc4_, this.fatal);
        } else if (_loc5_ instanceof NPCharacter) {
            _loc10_ = _loc5_ as NPCharacter;
            _loc10_.shapeImpale(_loc4_, this.fatal);
        }
        var _loc6_ = new b2PrismaticJointDef();
        var _loc7_: b2Vec2 = param1.GetWorldCenter();
        _loc6_.Initialize(this.body, param1, _loc7_, param2);
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
            BladeShard.bloodParticles,
        );
        this.paintBlood(
            _loc7_.x * this.m_physScale,
            _loc7_.y * this.m_physScale,
        );
        if (!this.fleshSound) {
            _loc11_ = Math.ceil(Math.random() * 3);
            this.fleshSound = SoundController.instance.playAreaSoundInstance(
                "ImpaleSpikes" + _loc11_,
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
            this.character.session.m_world.DestroyJoint(_loc3_);
            this.bjDictionary.delete(param1);
            this.countDictionary.delete(param1);
        } else {
            this.countDictionary.set(param1, _loc2_);
        }
    }

    protected fleshSoundStopped(param1: Event) {
        this.fleshSound.removeEventListener(
            AreaSoundInstance.AREA_SOUND_STOP,
            this.fleshSoundStopped,
        );
        this.fleshSound = null;
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
        _loc3_ = this.character.session.level.background.localToGlobal(_loc3_);
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
}