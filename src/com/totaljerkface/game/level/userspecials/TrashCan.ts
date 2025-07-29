import b2ContactPoint from "@/Box2D/Collision/b2ContactPoint";
import b2CircleDef from "@/Box2D/Collision/Shapes/b2CircleDef";
import b2PolygonDef from "@/Box2D/Collision/Shapes/b2PolygonDef";
import b2Shape from "@/Box2D/Collision/Shapes/b2Shape";
import b2Math from "@/Box2D/Common/Math/b2Math";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2Body from "@/Box2D/Dynamics/b2Body";
import b2BodyDef from "@/Box2D/Dynamics/b2BodyDef";
import b2World from "@/Box2D/Dynamics/b2World";
import ContactListener from "@/com/totaljerkface/game/ContactListener";
import Special from "@/com/totaljerkface/game/editor/specials/Special";
import TrashCanRef from "@/com/totaljerkface/game/editor/specials/TrashCanRef";
import ContactEvent from "@/com/totaljerkface/game/events/ContactEvent";
import LevelB2D from "@/com/totaljerkface/game/level/LevelB2D";
import LevelItem from "@/com/totaljerkface/game/level/LevelItem";
import Trigger from "@/com/totaljerkface/game/level/Trigger";
import Settings from "@/com/totaljerkface/game/Settings";
import AreaSoundInstance from "@/com/totaljerkface/game/sound/AreaSoundInstance";
import SoundController from "@/com/totaljerkface/game/sound/SoundController";
import TrashCanMC from "@/top/TrashCanMC";
import { boundClass } from 'autobind-decorator';
import DisplayObject from "flash/display/DisplayObject";
import MovieClip from "flash/display/MovieClip";
import Sprite from "flash/display/Sprite";
import Event from "flash/events/Event";
import Point from "flash/geom/Point";

@boundClass
export default class TrashCan extends LevelItem {
    private _shape: b2Shape;
    private _leftShape: b2Shape;
    private _rightShape: b2Shape;
    private _body: b2Body;
    private _interactive: boolean;
    private _bottleType: number;
    private mc: TrashCanMC;
    private _trashSound: AreaSoundInstance;
    private _crush: boolean = false;
    private _containsTrash: boolean = true;
    private _trashSpilled: boolean = false;
    private _spillImpulse: number = 3.5;
    private _crushImpulse: number = 12;
    private _contact: ContactEvent;

    constructor(param1: Special, param2: b2Body = null, param3: Point = null) {
        super();
        this.createBody(param1);
    }

    public createBody(param1: Special) {
        var _loc4_: TrashCanRef = null;
        var _loc10_: MovieClip = null;
        var _loc2_: LevelB2D = Settings.currentSession.level;
        var _loc3_: Sprite = _loc2_.background;
        _loc4_ = param1 as TrashCanRef;
        _loc4_ = _loc4_.clone() as TrashCanRef;
        this.mc = new TrashCanMC();
        this.mc.x = param1.x;
        this.mc.y = param1.y;
        this.mc.rotation = param1.rotation;
        this.mc.gotoAndStop(1);
        this.mc.lid.visible = _loc4_.containsTrash;
        this._interactive = _loc4_.interactive;
        if (this._interactive) {
            _loc2_.foreground.addChildAt(this.mc, 0);
        } else {
            _loc2_.background.addChild(this.mc);
        }
        this.mc.shapes.visible = false;
        if (!this._interactive) {
            return;
        }
        var _loc5_ = new b2Vec2(
            _loc4_.x / this.m_physScale,
            _loc4_.y / this.m_physScale,
        );
        var _loc6_: number = _loc4_.rotation;
        var _loc7_ = new b2BodyDef();
        var _loc8_ = new b2PolygonDef();
        var _loc9_ = new b2CircleDef();
        _loc8_.density = 0.75;
        _loc8_.friction = 0.3;
        _loc8_.filter.categoryBits = 8;
        _loc8_.restitution = 0.1;
        _loc9_.density = 0.75;
        _loc9_.friction = 0.3;
        _loc9_.filter.categoryBits = 8;
        _loc9_.restitution = 0.1;
        _loc7_.position.Set(_loc5_.x, _loc5_.y);
        _loc7_.angle = (_loc6_ * Math.PI) / 180;
        _loc7_.isSleeping = _loc4_.sleeping;
        var _loc11_: b2Body = (this._body =
            Settings.currentSession.m_world.CreateBody(_loc7_));
        // @ts-expect-error
        _loc10_ = this.mc.shapes.block;
        _loc8_.SetAsBox(
            _loc10_.width / 2 / this.m_physScale,
            _loc10_.height / 2 / this.m_physScale,
        );
        this._shape = this._body.CreateShape(_loc8_);
        this._body.SetMassFromShapes();
        if (!_loc4_.containsTrash) {
            this._containsTrash = false;
            Settings.currentSession.m_world.DestroyBody(this._body);
            this.createHollowTrashCan();
            this._spillImpulse = this._crushImpulse;
            Settings.currentSession.contactListener.registerListener(
                ContactEvent.RESULT,
                this._shape,
                this.checkContact,
            );
            Settings.currentSession.contactListener.registerListener(
                ContactEvent.RESULT,
                this._leftShape,
                this.checkContact,
            );
            Settings.currentSession.contactListener.registerListener(
                ContactEvent.RESULT,
                this._rightShape,
                this.checkContact,
            );
            return;
        }
        _loc2_.paintBodyVector.push(_loc11_);
        _loc11_.SetUserData(this.mc);
        Settings.currentSession.contactListener.registerListener(
            ContactListener.RESULT,
            this._shape,
            this.checkContact,
        );
        Settings.currentSession.contactListener.registerListener(
            ContactListener.ADD,
            this._shape,
            this.checkAdd,
        );
    }

    public override get groupDisplayObject(): DisplayObject {
        return this.mc;
    }

    private checkContact(param1: ContactEvent) {
        if (param1.impulse > this._spillImpulse) {
            if (param1.impulse > this._crushImpulse) {
                this._crush = true;
            }
            this._spillImpulse = this._crushImpulse;
            if (this._contact) {
                if (this._contact.impulse < param1.impulse) {
                    this._contact = param1;
                }
            } else {
                this._contact = param1;
            }
            Settings.currentSession.contactListener.deleteListener(
                ContactEvent.RESULT,
                this._shape,
            );
            Settings.currentSession.level.singleActionVector.push(this);
        }
    }

    private createHollowTrashCan() {
        var _loc1_: MovieClip = null;
        var _loc13_: number = 0;
        var _loc14_: MovieClip = null;
        var _loc2_ = new b2PolygonDef();
        var _loc3_ = new b2PolygonDef();
        var _loc4_ = new b2BodyDef();
        var _loc5_: b2World = Settings.currentSession.m_world;
        var _loc6_: LevelB2D = Settings.currentSession.level;
        var _loc7_: b2Vec2 = this._body.GetPosition();
        var _loc8_: number = this._body.GetAngle();
        var _loc9_: b2Vec2 = this._body.GetLinearVelocity();
        var _loc10_: number = this._body.GetAngularVelocity();
        _loc4_.position.Set(_loc7_.x, _loc7_.y);
        _loc4_.angle = _loc8_;
        _loc2_.density = 0.75;
        _loc2_.friction = 0.3;
        _loc2_.filter.categoryBits = 8;
        _loc2_.restitution = 0.1;
        _loc2_.vertexCount = 3;
        _loc3_.density = 0.75;
        _loc3_.friction = 0.3;
        _loc3_.filter.categoryBits = 8;
        _loc3_.restitution = 0.1;
        var _loc11_: b2Body = (this._body = _loc5_.CreateBody(_loc4_));
        this._body.SetAngularVelocity(_loc10_);
        this._body.SetLinearVelocity(_loc9_);
        // @ts-expect-error
        _loc1_ = this.mc.shapes.s1;
        _loc3_.SetAsOrientedBox(
            _loc1_.width / 2 / this.m_physScale,
            _loc1_.height / 2 / this.m_physScale,
            new b2Vec2(
                _loc1_.x / this.m_physScale,
                _loc1_.y / this.m_physScale,
            ),
        );
        this._shape = _loc11_.CreateShape(_loc3_);
        var _loc12_: number = 0;
        while (_loc12_ < 3) {
            if (_loc12_ == 0 || _loc12_ == 2) {
                _loc13_ = 0;
                while (_loc13_ < 3) {
                    _loc14_ = this.mc.shapes["p" + _loc12_ + "_" + _loc13_];
                    _loc2_.vertices[_loc13_] = new b2Vec2(
                        _loc14_.x / this.m_physScale,
                        _loc14_.y / this.m_physScale,
                    );
                    _loc13_++;
                }
                if (_loc12_ == 0) {
                    this._leftShape = _loc11_.CreateShape(_loc2_);
                }
                if (_loc12_ == 2) {
                    this._rightShape = _loc11_.CreateShape(_loc2_);
                }
            }
            _loc12_++;
        }
        _loc11_.SetMassFromShapes();
        _loc6_.paintBodyVector.push(_loc11_);
        _loc11_.SetUserData(this.mc);
        this.mc.can.y -= 13;
        Settings.currentSession.contactListener.registerListener(
            ContactListener.ADD,
            this._shape,
            this.checkAdd,
        );
        Settings.currentSession.contactListener.registerListener(
            ContactListener.ADD,
            this._leftShape,
            this.checkAdd,
        );
        Settings.currentSession.contactListener.registerListener(
            ContactListener.ADD,
            this._rightShape,
            this.checkAdd,
        );
    }

    public override singleAction() {
        var _loc11_: MovieClip = null;
        var _loc12_: b2Body = null;
        var _loc14_: b2Vec2 = null;
        var _loc15_: number = NaN;
        var _loc16_: number = 0;
        var _loc17_: boolean = false;
        var _loc18_: MovieClip = null;
        var _loc19_ = null;
        var _loc20_: b2Vec2 = null;
        var _loc21_: number = NaN;
        var _loc1_: LevelB2D = Settings.currentSession.level;
        var _loc2_: Sprite = _loc1_.background;
        var _loc3_: b2World = Settings.currentSession.m_world;
        var _loc4_: b2Vec2 = this._body.GetPosition();
        var _loc5_: number = this._body.GetAngle();
        var _loc6_: b2Vec2 = this._body.GetLinearVelocity();
        var _loc7_: number = this._body.GetAngularVelocity();
        var _loc8_ = new b2BodyDef();
        var _loc9_ = new b2PolygonDef();
        var _loc10_ = new b2CircleDef();
        _loc9_.density = 0.75;
        _loc9_.friction = 0.3;
        _loc9_.filter.categoryBits = 8;
        _loc9_.restitution = 0.1;
        _loc10_.density = 0.75;
        _loc10_.friction = 0.3;
        _loc10_.filter.categoryBits = 8;
        _loc10_.restitution = 0.1;
        _loc8_.position.Set(_loc4_.x, _loc4_.y);
        _loc8_.angle = _loc5_;
        _loc3_.DestroyBody(this._body);
        Settings.currentSession.contactListener.deleteListener(
            ContactListener.ADD,
            this._shape,
        );
        this.mc.lid.visible = false;
        if (this._crush) {
            Settings.currentSession.contactListener.deleteListener(
                ContactEvent.RESULT,
                this._shape,
            );
            Settings.currentSession.contactListener.deleteListener(
                ContactEvent.RESULT,
                this._leftShape,
            );
            Settings.currentSession.contactListener.deleteListener(
                ContactEvent.RESULT,
                this._rightShape,
            );
            Settings.currentSession.contactListener.deleteListener(
                ContactListener.ADD,
                this._leftShape,
            );
            Settings.currentSession.contactListener.deleteListener(
                ContactListener.ADD,
                this._rightShape,
            );
            Settings.currentSession.contactListener.deleteListener(
                ContactListener.ADD,
                this._shape,
            );
            _loc14_ = this._contact.normal;
            _loc15_ = Math.atan2(_loc14_.y, _loc14_.x) - this._body.GetAngle();
            _loc17_ =
                Math.abs(Math.round(Math.sin(_loc15_))) == 1 ? false : true;
            if (_loc17_) {
                _loc16_ = 2;
                // @ts-expect-error
                _loc11_ = this.mc.shapes.crushH;
            } else {
                _loc16_ = 3;
                // @ts-expect-error
                _loc11_ = this.mc.shapes.crushV;
            }
            this._body = _loc3_.CreateBody(_loc8_);
            this._body.SetAngularVelocity(_loc7_);
            this._body.SetLinearVelocity(_loc6_);
            this.mc.gotoAndStop(_loc16_);
            _loc1_.background.addChild(this.mc);
            _loc9_.SetAsBox(
                _loc11_.width / 2 / this.m_physScale,
                _loc11_.height / 2 / this.m_physScale,
            );
            this._shape = this._body.CreateShape(_loc9_);
            this._body.SetUserData(this.mc);
            this._body.SetMassFromShapes();
            _loc1_.paintBodyVector.push(this._body);
            Settings.currentSession.contactListener.registerListener(
                ContactListener.ADD,
                this._shape,
                this.checkAdd,
            );
        } else {
            this.createHollowTrashCan();
            Settings.currentSession.contactListener.registerListener(
                ContactEvent.RESULT,
                this._shape,
                this.checkContact,
            );
            Settings.currentSession.contactListener.registerListener(
                ContactEvent.RESULT,
                this._leftShape,
                this.checkContact,
            );
            Settings.currentSession.contactListener.registerListener(
                ContactEvent.RESULT,
                this._rightShape,
                this.checkContact,
            );
        }
        if (!this._trashSpilled && this._containsTrash) {
            this._trashSpilled = true;
            _loc21_ = 0;
            while (_loc21_ < 3) {
                _loc11_ = this.mc.shapes["c" + _loc21_];
                _loc19_ = getDefinitionByName("CircleTrashItem" + _loc21_);
                _loc18_ = new _loc19_();
                _loc18_.gotoAndStop(
                    Math.ceil(Math.random() * _loc18_.totalFrames),
                );
                _loc2_.addChild(_loc18_);
                _loc20_ = this._body.GetWorldPoint(
                    new b2Vec2(
                        _loc11_.x / this.m_physScale,
                        _loc11_.y / this.m_physScale,
                    ),
                );
                _loc8_.position.Set(_loc20_.x, _loc20_.y);
                _loc8_.angle =
                    this._body.GetAngle() + (_loc11_.rotation * Math.PI) / 180;
                _loc12_ = Settings.currentSession.m_world.CreateBody(_loc8_);
                _loc10_.radius = _loc11_.width / 2 / this.m_physScale;
                _loc12_.CreateShape(_loc10_);
                _loc12_.SetMassFromShapes();
                _loc1_.paintBodyVector.push(_loc12_);
                _loc12_.SetUserData(_loc18_);
                _loc12_.SetAngularVelocity(_loc7_);
                _loc12_.SetLinearVelocity(_loc6_);
                _loc21_++;
            }
            _loc21_ = 0;
            while (_loc21_ < 7) {
                _loc11_ = this.mc.shapes["r" + _loc21_];
                _loc11_.gotoAndStop(
                    Math.ceil(Math.random() * _loc11_.totalFrames),
                );
                _loc19_ = getDefinitionByName("RectTrashItem" + _loc21_);
                _loc18_ = new _loc19_();
                _loc18_.gotoAndStop(
                    Math.ceil(Math.random() * _loc18_.totalFrames),
                );
                _loc2_.addChild(_loc18_);
                _loc20_ = this._body.GetWorldPoint(
                    new b2Vec2(
                        _loc11_.x / this.m_physScale,
                        _loc11_.y / this.m_physScale,
                    ),
                );
                _loc8_.position.Set(_loc20_.x, _loc20_.y);
                _loc8_.angle =
                    this._body.GetAngle() + (_loc11_.rotation * Math.PI) / 180;
                _loc12_ = Settings.currentSession.m_world.CreateBody(_loc8_);
                _loc9_.SetAsBox(
                    _loc11_.width / 2 / this.m_physScale,
                    _loc11_.height / 2 / this.m_physScale,
                );
                _loc12_.CreateShape(_loc9_);
                _loc12_.SetMassFromShapes();
                _loc1_.paintBodyVector.push(_loc12_);
                _loc12_.SetUserData(_loc18_);
                _loc12_.SetAngularVelocity(_loc7_);
                _loc12_.SetLinearVelocity(_loc6_);
                _loc21_++;
            }
            if (!this._crush) {
                // @ts-expect-error
                _loc11_ = this.mc.shapes.blocker;
                _loc9_.density = 0;
                _loc9_.friction = 0;
                _loc9_.filter.categoryBits = 2;
                _loc9_.filter.maskBits = 2;
                _loc9_.SetAsBox(
                    _loc11_.width / 2 / this.m_physScale,
                    _loc11_.height / 2 / this.m_physScale,
                );
                this._body.CreateShape(_loc9_);
            }
        }
        var _loc13_: number = Math.ceil(Math.random() * 2);
        SoundController.instance.playAreaSoundInstance(
            "TrashCanSpill" + _loc13_,
            this._body,
        );
    }

    private checkAdd(param1: b2ContactPoint) {
        var _loc4_: number = NaN;
        if (param1.shape2.m_isSensor) {
            return;
        }
        if (this._trashSound) {
            return;
        }
        var _loc2_: number = param1.shape2.m_body.m_mass;
        if (_loc2_ != 0 && _loc2_ < this._body.m_mass) {
            return;
        }
        var _loc3_: number = b2Math.b2Dot(param1.velocity, param1.normal);
        _loc3_ = Math.abs(_loc3_);
        if (_loc3_ > 4) {
            _loc4_ = Math.ceil(Math.random() * 2);
            this._trashSound = SoundController.instance.playAreaSoundInstance(
                "TrashCanHit" + _loc4_,
                this._body,
            );
            if (this._trashSound) {
                this._trashSound.addEventListener(
                    AreaSoundInstance.AREA_SOUND_STOP,
                    this.soundComplete,
                    false,
                    0,
                    true,
                );
            }
        }
    }

    private soundComplete(param1: Event) {
        this._trashSound.removeEventListener(
            AreaSoundInstance.AREA_SOUND_STOP,
            this.soundComplete,
        );
        this._trashSound = null;
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