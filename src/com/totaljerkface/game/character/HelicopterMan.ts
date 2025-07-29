import b2CircleDef from "@/Box2D/Collision/Shapes/b2CircleDef";
import b2CircleShape from "@/Box2D/Collision/Shapes/b2CircleShape";
import b2FilterData from "@/Box2D/Collision/Shapes/b2FilterData";
import b2PolygonDef from "@/Box2D/Collision/Shapes/b2PolygonDef";
import b2PolygonShape from "@/Box2D/Collision/Shapes/b2PolygonShape";
import b2Shape from "@/Box2D/Collision/Shapes/b2Shape";
import b2AABB from "@/Box2D/Collision/b2AABB";
import b2Math from "@/Box2D/Common/Math/b2Math";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2Joint from "@/Box2D/Dynamics/Joints/b2Joint";
import b2JointEdge from "@/Box2D/Dynamics/Joints/b2JointEdge";
import b2RevoluteJoint from "@/Box2D/Dynamics/Joints/b2RevoluteJoint";
import b2RevoluteJointDef from "@/Box2D/Dynamics/Joints/b2RevoluteJointDef";
import b2RopeJoint from "@/Box2D/Dynamics/Joints/b2RopeJoint";
import b2RopeJointDef from "@/Box2D/Dynamics/Joints/b2RopeJointDef";
import b2Body from "@/Box2D/Dynamics/b2Body";
import b2BodyDef from "@/Box2D/Dynamics/b2BodyDef";
import b2World from "@/Box2D/Dynamics/b2World";
import ContactListener from "@/com/totaljerkface/game/ContactListener";
import Session from "@/com/totaljerkface/game/Session";
import CharacterB2D from "@/com/totaljerkface/game/character/CharacterB2D";
import BladeShard from "@/com/totaljerkface/game/character/heli/BladeShard";
import VPoint from "@/com/totaljerkface/game/character/heli/VPoint";
import VSpring from "@/com/totaljerkface/game/character/heli/VSpring";
import ContactEvent from "@/com/totaljerkface/game/events/ContactEvent";
import AreaSoundInstance from "@/com/totaljerkface/game/sound/AreaSoundInstance";
import AreaSoundLoop from "@/com/totaljerkface/game/sound/AreaSoundLoop";
import SoundController from "@/com/totaljerkface/game/sound/SoundController";
import { boundClass } from 'autobind-decorator';
import DisplayObject from "flash/display/DisplayObject";
import MovieClip from "flash/display/MovieClip";
import Sprite from "flash/display/Sprite";

@boundClass
export default class HelicopterMan extends CharacterB2D {
    protected ejected: boolean;
    protected helmetOn: boolean;
    protected maxTorque: number = 100000;
    protected impulseMagnitude: number = 0.5;
    protected impulseLeft: number = 1;
    protected impulseRight: number = 1;
    protected impulseOffset: number = 1;
    protected maxSpinAV: number = 3.5;
    protected helmetSmashLimit: number = 2;
    protected copterSmashLimit: number = 40;
    protected bladeSmashLimit: number = 30;
    protected ejectImpulse: number = 2;
    protected hoverState: number = 0;
    protected copterSmashed: boolean;
    protected bladeSmashed: boolean;
    private COMArray: any[];
    private currCOM: b2Vec2;
    private totalMass: number;
    private bladeLocalCenter: b2Vec2;
    private targetAng: number = 0;
    private spinAcceleration: number = 0;
    private accelStep: number = 0.025;
    private decelStep: number = 0.02;
    private maxStep: number = 0.1;
    private ropeMinLength: number;
    private ropeMaxLength: number = 3;
    private ropeSpeed: number = 0.05;
    private numRopeSegments: number = 20;
    private bladeImpactSound: AreaSoundInstance;
    private heliLoop: AreaSoundLoop;
    private isLoud: boolean = false;
    private magnetLoop: AreaSoundLoop;
    private soundDelay: number = 10;
    private soundDelayCount: number = 0;
    public copterBody: b2Body;
    public helmetBody: b2Body;
    public magnetBody: b2Body;
    public helmetShape: b2Shape;
    public backShape: b2Shape;
    public baseShape: b2Shape;
    public stemShape: b2Shape;
    public wheel1Shape: b2Shape;
    public wheel2Shape: b2Shape;
    public leg1Shape: b2Shape;
    public leg2Shape: b2Shape;
    public magnetRangeSensor: b2Shape;
    public magnetShape: b2Shape;
    public bladeShape: b2Shape;
    public copterMC: MovieClip;
    public copterFrontMC: MovieClip;
    public helmetMC: MovieClip;
    public magnetMC: MovieClip;
    public ropeSprite: Sprite;
    public copterHand1: b2RevoluteJoint;
    public copterHand2: b2RevoluteJoint;
    public copterPelvis: b2RevoluteJoint;
    public magnetJoint1: b2RopeJoint;
    public magnetJoint2: b2RopeJoint;
    public ropeSprings: any[];
    public ropePoints: any[];
    public copterAnchorPoint: b2Vec2;
    public magnetAnchorPoint: b2Vec2;
    public bladeContactArray: any[];
    public magnetContactArray: any[];
    public magnetShapeArray: any[];
    public magnetized: boolean;
    public spaceOff: boolean;
    protected bladeShards: any[];
    public bladeActions: any[];
    protected vertsBrokenCopter: any[];
    protected brokenCopterMCs: any[];

    constructor(
        param1: number,
        param2: number,
        param3: DisplayObject,
        param4: Session,
    ) {
        super(param1, param2, param3, param4, -1, "Heli");
        this.shapeRefScale = 50;
        this.COMArray = new Array();
        this.magnetContactArray = new Array();
        this.magnetShapeArray = new Array();
        this.bladeContactArray = new Array();
        this.bladeActions = new Array();
    }

    public override leftPressedActions() {
        var _loc1_: number = NaN;
        var _loc2_: number = NaN;
        var _loc3_: number = NaN;
        var _loc4_: number = NaN;
        var _loc5_: number = NaN;
        var _loc6_: b2Vec2 = null;
        if (this.ejected) {
            this.currentPose = 1;
        } else {
            if (this.spinAcceleration > 0) {
                this.spinAcceleration = -this.spinAcceleration;
            }
            this.spinAcceleration -= this.accelStep;
            if (this.spinAcceleration < -this.maxStep) {
                this.spinAcceleration = -this.maxStep;
            }
            this.targetAng += this.spinAcceleration;
            if (this.bladeSmashed) {
                _loc1_ = this.copterBody.GetAngle();
                _loc2_ = this.copterBody.GetAngularVelocity();
                _loc3_ = (_loc2_ + this.maxSpinAV) / this.maxSpinAV;
                if (_loc3_ < 0) {
                    _loc3_ = 0;
                }
                if (_loc3_ > 1) {
                    _loc3_ = 1;
                }
                _loc4_ = Math.cos(_loc1_) * this.impulseLeft * _loc3_;
                _loc5_ = Math.sin(_loc1_) * this.impulseLeft * _loc3_;
                _loc6_ = this.copterBody.GetLocalCenter();
                this.copterBody.ApplyImpulse(
                    new b2Vec2(_loc5_, -_loc4_),
                    this.copterBody.GetWorldPoint(
                        new b2Vec2(_loc6_.x + this.impulseOffset, _loc6_.y),
                    ),
                );
                this.copterBody.ApplyImpulse(
                    new b2Vec2(-_loc5_, _loc4_),
                    this.copterBody.GetWorldPoint(
                        new b2Vec2(_loc6_.x - this.impulseOffset, _loc6_.y),
                    ),
                );
            }
            this.currentPose = 7;
        }
    }

    public override rightPressedActions() {
        var _loc1_: number = NaN;
        var _loc2_: number = NaN;
        var _loc3_: number = NaN;
        var _loc4_: number = NaN;
        var _loc5_: number = NaN;
        var _loc6_: number = NaN;
        var _loc7_: b2Vec2 = null;
        if (this.ejected) {
            this.currentPose = 2;
        } else {
            if (this.spinAcceleration < 0) {
                this.spinAcceleration = -this.spinAcceleration;
            }
            this.spinAcceleration += this.accelStep;
            if (this.spinAcceleration > this.maxStep) {
                this.spinAcceleration = this.maxStep;
            }
            this.targetAng += this.spinAcceleration;
            if (this.bladeSmashed) {
                _loc1_ = this.copterBody.GetAngle();
                _loc2_ = this.copterBody.GetAngularVelocity();
                _loc3_ = (_loc2_ - this.maxSpinAV) / -this.maxSpinAV;
                if (_loc3_ < 0) {
                    _loc3_ = 0;
                }
                if (_loc3_ > 1) {
                    _loc3_ = 1;
                }
                _loc4_ = 1;
                _loc5_ = Math.cos(_loc1_) * this.impulseRight * _loc3_;
                _loc6_ = Math.sin(_loc1_) * this.impulseRight * _loc3_;
                _loc7_ = this.copterBody.GetLocalCenter();
                this.copterBody.ApplyImpulse(
                    new b2Vec2(-_loc6_, _loc5_),
                    this.copterBody.GetWorldPoint(
                        new b2Vec2(_loc7_.x + this.impulseOffset, _loc7_.y),
                    ),
                );
                this.copterBody.ApplyImpulse(
                    new b2Vec2(_loc6_, -_loc5_),
                    this.copterBody.GetWorldPoint(
                        new b2Vec2(_loc7_.x - this.impulseOffset, _loc7_.y),
                    ),
                );
            }
            this.currentPose = 8;
        }
    }

    public override leftAndRightActions() {
        if (this.ejected) {
            if (this._currentPose == 1 || this._currentPose == 2) {
                this.currentPose = 0;
            }
        } else {
            if (this.targetAng > 0) {
                this.spinAcceleration -= this.decelStep;
                if (this.spinAcceleration < -this.maxStep) {
                    this.spinAcceleration = -this.maxStep;
                }
                this.targetAng += this.spinAcceleration;
                if (this.targetAng < 0) {
                    this.targetAng = 0;
                }
            } else if (this.targetAng < 0) {
                this.spinAcceleration += this.decelStep;
                if (this.spinAcceleration > this.maxStep) {
                    this.spinAcceleration = this.maxStep;
                }
                this.targetAng += this.spinAcceleration;
                if (this.targetAng > 0) {
                    this.targetAng = 0;
                }
            }
            if (this._currentPose == 7 || this._currentPose == 8) {
                this.currentPose = 0;
            }
        }
    }

    public override upPressedActions() {
        if (this.ejected) {
            this.currentPose = 3;
        } else if (!this.bladeSmashed) {
            this.hoverState = 1;
            if (!this.isLoud) {
                this.isLoud = true;
                this.heliLoop.fadeTo(0.75, 0.25);
            }
        }
    }

    public override downPressedActions() {
        if (this.ejected) {
            this.currentPose = 4;
        } else if (!this.bladeSmashed) {
            this.hoverState = -1;
            if (!this.isLoud) {
                this.isLoud = true;
                this.heliLoop.fadeTo(0.75, 0.25);
            }
        }
    }

    public override upAndDownActions() {
        if (this.ejected) {
            if (this._currentPose == 3 || this._currentPose == 4) {
                this.currentPose = 0;
            }
        } else if (!this.bladeSmashed) {
            this.hoverState = 0;
            if (this.isLoud) {
                this.isLoud = false;
                this.heliLoop.fadeTo(0.5, 0.25);
            }
        }
    }

    public override spacePressedActions() {
        if (this.ejected) {
            this.startGrab();
        } else if (this.spaceOff) {
            this.spaceOff = false;
            this.magnetized = !this.magnetized;
            if (this.magnetized) {
                this.magnetMC.play();
                // @ts-expect-error
                this.magnetMC.lights.visible = true;
                this.magnetLoop = SoundController.instance.playAreaSoundLoop(
                    "MagnetBuzz",
                    this.magnetBody,
                    0,
                );
                this.magnetLoop.fadeIn(0.25);
            } else {
                this.magnetMC.stop();
                // @ts-expect-error
                this.magnetMC.lights.visible = false;
                if (this.magnetLoop) {
                    this.magnetLoop.fadeOut(0.25);
                }
            }
        }
    }

    public override spaceNullActions() {
        if (this.ejected) {
            this.releaseGrip();
        } else {
            this.spaceOff = true;
        }
    }

    public override shiftPressedActions() {
        var _loc1_: number = NaN;
        if (this.ejected) {
            this.currentPose = 7;
        } else {
            _loc1_ = this.magnetJoint1.m_maxLength;
            this.magnetJoint1.m_maxLength -= this.ropeSpeed;
            this.magnetJoint2.m_maxLength -= this.ropeSpeed;
            if (this.magnetJoint1.m_maxLength < this.ropeMinLength) {
                this.magnetJoint1.m_maxLength = this.magnetJoint2.m_maxLength =
                    this.ropeMinLength;
            }
            if (_loc1_ != this.magnetJoint1.m_maxLength) {
                this.resizeRope();
            }
        }
    }

    public override shiftNullActions() {
        if (this.ejected) {
            if (this._currentPose == 7) {
                this.currentPose = 0;
            }
        }
    }

    public override ctrlPressedActions() {
        var _loc1_: number = NaN;
        if (this.ejected) {
            this.currentPose = 8;
        } else {
            _loc1_ = this.magnetJoint1.m_maxLength;
            this.magnetJoint1.m_maxLength += this.ropeSpeed;
            this.magnetJoint2.m_maxLength += this.ropeSpeed;
            if (this.magnetJoint1.m_maxLength > this.ropeMaxLength) {
                this.magnetJoint1.m_maxLength = this.magnetJoint2.m_maxLength =
                    this.ropeMaxLength;
            }
            if (_loc1_ != this.magnetJoint1.m_maxLength) {
                this.resizeRope();
            }
        }
    }

    private resizeRope() {
        var _loc4_: VSpring = null;
        var _loc1_: number = this.magnetJoint1.m_maxLength;
        var _loc2_: number = (0.8 * _loc1_) / this.numRopeSegments;
        var _loc3_: number = 0;
        while (_loc3_ < this.numRopeSegments) {
            _loc4_ = this.ropeSprings[_loc3_];
            _loc4_.length = _loc2_;
            _loc3_++;
        }
    }

    public override ctrlNullActions() {
        if (this.ejected) {
            if (this._currentPose == 8) {
                this.currentPose = 0;
            }
        }
    }

    public override zPressedActions() {
        this.eject();
    }

    public override preActions() {
        this.currCOM = this.getCenterOfMass();
    }

    public override actions() {
        super.actions();
        if (!this.bladeSmashed) {
            this.balanceCopter();
            this.hoverCopter();
        }
        if (this.bladeImpactSound) {
            this.soundDelayCount += 1;
            if (this.soundDelayCount >= this.soundDelay) {
                this.bladeImpactSound = null;
                this.soundDelayCount = 0;
                this.soundDelay = Math.round(Math.random() * 20) + 5;
            }
        }
    }

    protected balanceCopter() {
        var _loc1_: number = this.copterBody.GetAngularVelocity();
        while (this.targetAng > Math.PI) {
            this.targetAng -= Math.PI * 2;
        }
        while (this.targetAng < -Math.PI) {
            this.targetAng += Math.PI * 2;
        }
        var _loc2_: number = this.copterBody.GetAngle();
        while (_loc2_ > Math.PI) {
            _loc2_ -= Math.PI * 2;
        }
        while (_loc2_ < -Math.PI) {
            _loc2_ += Math.PI * 2;
        }
        var _loc3_: number = -Math.sin(_loc2_ - this.targetAng) * 3;
        var _loc4_: number = _loc1_ - _loc3_;
        this.copterBody.m_angularVelocity -= _loc4_;
    }

    protected hoverCopter() {
        var _loc8_: number = NaN;
        var _loc1_: number = this.copterBody.GetAngle();
        var _loc2_ = new b2Vec2(Math.sin(_loc1_), -Math.cos(_loc1_));
        var _loc3_: b2Vec2 = this.copterBody.GetLinearVelocityFromWorldPoint(
            this.currCOM,
        );
        var _loc4_: number = b2Math.b2Dot(_loc3_, _loc2_);
        var _loc5_: number = 10;
        var _loc6_: number = this.totalMass * 0.3333333333333333;
        var _loc7_: number = this.totalMass * 0.31;
        _loc4_ =
            _loc4_ > 0 ? Math.min(_loc4_, _loc5_) : Math.max(_loc4_, -_loc5_);
        if (this.hoverState >= 0) {
            this.copterBody.ApplyImpulse(
                new b2Vec2(_loc2_.x * _loc6_, _loc2_.y * _loc6_),
                this.currCOM,
            );
            if (this.hoverState == 0) {
                return;
            }
            _loc8_ = _loc7_ - (_loc7_ * _loc4_) / _loc5_;
        } else {
            _loc8_ = -0.5 - (_loc7_ + (_loc7_ * _loc4_) / _loc5_);
        }
        this.copterBody.ApplyImpulse(
            new b2Vec2(_loc2_.x * _loc8_, _loc2_.y * _loc8_),
            this.currCOM,
        );
    }

    protected override checkPose() {
        switch (this._currentPose) {
            case 1:
                this.archPose();
                break;
            case 2:
                this.pushupPose();
                break;
            case 3:
                this.supermanPose();
                break;
            case 4:
                this.tuckPose();
                break;
            case 5:
                break;
            case 6:
                this.lungePoseLeft();
                break;
            case 7:
                this.leanBackPose();
                break;
            case 8:
                this.leanForwardPose();
                break;
            case 10:
                this.armsForwardPose();
                break;
            case 11:
                this.armsOverheadPose();
                break;
            case 12:
                this.holdPositionPose();
        }
    }

    public override reset() {
        super.reset();
        this.targetAng = 0;
        this.spinAcceleration = 0;
        this.hoverState = 0;
        this.isLoud = false;
        this.helmetOn = true;
        this.copterSmashed = false;
        this.bladeSmashed = false;
        this.magnetized = false;
        this.ejected = false;
        this.bladeShards = null;
        this.magnetContactArray = new Array();
        this.magnetShapeArray = new Array();
        this.bladeContactArray = new Array();
        this.bladeActions = new Array();
    }

    public override die() {
        super.die();
        this.helmetBody = null;
        if (this.heliLoop) {
            this.heliLoop.stopSound();
            this.heliLoop = null;
        }
        if (this.magnetLoop) {
            this.magnetLoop.stopSound();
            this.magnetLoop = null;
        }
    }

    public override paint() {
        var _loc2_: number = 0;
        var _loc5_: b2Vec2 = null;
        var _loc6_: BladeShard = null;
        var _loc7_: number = 0;
        var _loc8_: VSpring = null;
        super.paint();
        this.copterFrontMC.x = this.copterMC.x;
        this.copterFrontMC.y = this.copterMC.y;
        this.copterFrontMC.rotation = this.copterMC.rotation;
        if (this.bladeShards) {
            _loc2_ = 0;
            while (_loc2_ < 4) {
                _loc6_ = this.bladeShards[_loc2_];
                _loc6_.paint();
                _loc2_++;
            }
        }
        var _loc1_: VPoint = this.ropePoints[0];
        if (!this.copterSmashed) {
            _loc1_.setPosition(
                this.copterBody.GetWorldPoint(this.copterAnchorPoint),
            );
        }
        _loc1_ = this.ropePoints[this.numRopeSegments];
        _loc1_.setPosition(
            this.magnetBody.GetWorldPoint(this.magnetAnchorPoint),
        );
        _loc2_ = 0;
        while (_loc2_ < this.numRopeSegments + 1) {
            _loc1_ = this.ropePoints[_loc2_];
            _loc1_.step();
            _loc2_++;
        }
        var _loc3_: number = 20;
        _loc2_ = 0;
        while (_loc2_ < _loc3_) {
            _loc7_ = 0;
            while (_loc7_ < this.numRopeSegments) {
                _loc8_ = this.ropeSprings[_loc7_] as VSpring;
                _loc8_.resolve();
                _loc7_++;
            }
            _loc2_++;
        }
        this.ropeSprite.graphics.clear();
        this.ropeSprite.graphics.lineStyle(1, 3355443);
        _loc8_ = this.ropeSprings[0] as VSpring;
        var _loc4_: b2Vec2 = _loc8_.p1.currPos;
        _loc5_ = _loc8_.p2.currPos;
        this.ropeSprite.graphics.moveTo(
            _loc4_.x * this.m_physScale,
            _loc4_.y * this.m_physScale,
        );
        this.ropeSprite.graphics.lineTo(
            _loc5_.x * this.m_physScale,
            _loc5_.y * this.m_physScale,
        );
        _loc2_ = 1;
        while (_loc2_ < this.numRopeSegments) {
            _loc8_ = this.ropeSprings[_loc2_];
            _loc5_ = _loc8_.p2.currPos;
            this.ropeSprite.graphics.lineTo(
                _loc5_.x * this.m_physScale,
                _loc5_.y * this.m_physScale,
            );
            _loc2_++;
        }
    }

    public override createBodies() {
        var _loc1_: b2PolygonDef = null;
        var _loc10_: MovieClip = null;
        var _loc11_: any[] = null;
        var _loc12_ = undefined;
        super.createBodies();
        _loc1_ = new b2PolygonDef();
        var _loc2_ = new b2CircleDef();
        var _loc3_ = new b2BodyDef();
        var _loc4_ = new b2BodyDef();
        _loc1_.density = 1;
        _loc1_.friction = 0.3;
        _loc1_.restitution = 0.1;
        _loc1_.filter = this.defaultFilter;
        this.paintVector.splice(this.paintVector.indexOf(this.chestBody), 1);
        this.paintVector.splice(this.paintVector.indexOf(this.pelvisBody), 1);
        this._session.m_world.DestroyBody(this.chestBody);
        this._session.m_world.DestroyBody(this.pelvisBody);
        var _loc5_: MovieClip = this.shapeGuide["chestShape"];
        _loc3_.position.Set(
            this._startX + _loc5_.x / this.character_scale,
            this._startY + _loc5_.y / this.character_scale,
        );
        _loc3_.angle = _loc5_.rotation / (180 / Math.PI);
        this.chestBody = this._session.m_world.CreateBody(_loc3_);
        _loc1_.vertexCount = 6;
        var _loc6_: number = 0;
        while (_loc6_ < 6) {
            _loc10_ = this.shapeGuide["chestVert" + [_loc6_]];
            _loc1_.vertices[_loc6_] = new b2Vec2(
                _loc10_.x / this.character_scale,
                _loc10_.y / this.character_scale,
            );
            _loc6_++;
        }
        this.chestShape = this.chestBody.CreateShape(_loc1_);
        this.chestShape.SetMaterial(2);
        this.chestShape.SetUserData(this);
        this._session.contactListener.registerListener(
            ContactListener.RESULT,
            this.chestShape,
            this.contactResultHandler,
        );
        this._session.contactListener.registerListener(
            ContactListener.ADD,
            this.chestShape,
            this.contactAddHandler,
        );
        this.chestBody.SetMassFromShapes();
        this.chestBody.AllowSleeping(false);
        this.paintVector.push(this.chestBody);
        this.cameraFocus = this.chestBody;
        _loc5_ = this.shapeGuide["pelvisShape"];
        _loc4_.position.Set(
            this._startX + _loc5_.x / this.character_scale,
            this._startY + _loc5_.y / this.character_scale,
        );
        _loc4_.angle = _loc5_.rotation / (180 / Math.PI);
        this.pelvisBody = this._session.m_world.CreateBody(_loc4_);
        _loc1_.vertexCount = 5;
        _loc6_ = 0;
        while (_loc6_ < 5) {
            _loc10_ = this.shapeGuide["pelvisVert" + [_loc6_]];
            _loc1_.vertices[_loc6_] = new b2Vec2(
                _loc10_.x / this.character_scale,
                _loc10_.y / this.character_scale,
            );
            _loc6_++;
        }
        this.pelvisShape = this.pelvisBody.CreateShape(_loc1_);
        this.pelvisShape.SetMaterial(2);
        this.pelvisShape.SetUserData(this);
        this._session.contactListener.registerListener(
            ContactListener.RESULT,
            this.pelvisShape,
            this.contactResultHandler,
        );
        this._session.contactListener.registerListener(
            ContactListener.ADD,
            this.pelvisShape,
            this.contactAddHandler,
        );
        this.pelvisBody.SetMassFromShapes();
        this.pelvisBody.AllowSleeping(false);
        this.paintVector.push(this.pelvisBody);
        trace(this.chestBody.GetWorldCenter().y);
        var _loc7_ = new b2BodyDef();
        _loc7_.linearDamping = 0.4;
        this.copterBody = this._session.m_world.CreateBody(_loc7_);
        this.paintVector.push(this.copterBody);
        _loc1_.density = 3;
        _loc1_.friction = 0.3;
        _loc1_.restitution = 0.1;
        _loc1_.filter = this.zeroFilter;
        _loc5_ = this.shapeGuide["bladeShape"];
        var _loc8_ = new b2Vec2(
            this._startX + _loc5_.x / this.character_scale,
            this._startY + _loc5_.y / this.character_scale,
        );
        var _loc9_: number = _loc5_.rotation / CharacterB2D.oneEightyOverPI;
        _loc1_.SetAsOrientedBox(
            (_loc5_.scaleX * this.shapeRefScale) / this.character_scale,
            (_loc5_.scaleY * this.shapeRefScale) / this.character_scale,
            _loc8_,
            _loc9_,
        );
        this.bladeShape = this.copterBody.CreateShape(_loc1_);
        this._session.contactListener.registerListener(
            ContactListener.RESULT,
            this.bladeShape,
            this.bladeContactResultHandler,
        );
        this.bladeLocalCenter = _loc8_.Copy();
        _loc5_ = this.shapeGuide["stemShape"];
        _loc8_ = new b2Vec2(
            this._startX + _loc5_.x / this.character_scale,
            this._startY + _loc5_.y / this.character_scale,
        );
        _loc9_ = _loc5_.rotation / CharacterB2D.oneEightyOverPI;
        _loc1_.SetAsOrientedBox(
            (_loc5_.scaleX * this.shapeRefScale) / this.character_scale,
            (_loc5_.scaleY * this.shapeRefScale) / this.character_scale,
            _loc8_,
            _loc9_,
        );
        this.stemShape = this.copterBody.CreateShape(_loc1_);
        _loc5_ = this.shapeGuide["handleShape"];
        _loc8_ = new b2Vec2(
            this._startX + _loc5_.x / this.character_scale,
            this._startY + _loc5_.y / this.character_scale,
        );
        _loc9_ = _loc5_.rotation / CharacterB2D.oneEightyOverPI;
        _loc1_.SetAsOrientedBox(
            (_loc5_.scaleX * this.shapeRefScale) / this.character_scale,
            (_loc5_.scaleY * this.shapeRefScale) / this.character_scale,
            _loc8_,
            _loc9_,
        );
        _loc1_.vertexCount = 4;
        _loc6_ = 0;
        while (_loc6_ < 4) {
            _loc5_ = this.shapeGuide["baseVert" + [_loc6_]];
            _loc1_.vertices[_loc6_] = new b2Vec2(
                this._startX + _loc5_.x / this.character_scale,
                this._startY + _loc5_.y / this.character_scale,
            );
            _loc6_++;
        }
        this.baseShape = this.copterBody.CreateShape(_loc1_) as b2PolygonShape;
        this._session.contactListener.registerListener(
            ContactListener.ADD,
            this.baseShape,
            this.contactAddHandler,
        );
        this._session.contactListener.registerListener(
            ContactListener.RESULT,
            this.baseShape,
            this.contactCopterResultHandler,
        );
        _loc1_.vertexCount = 5;
        _loc6_ = 0;
        while (_loc6_ < 5) {
            _loc5_ = this.shapeGuide["backVert" + [_loc6_]];
            _loc1_.vertices[_loc6_] = new b2Vec2(
                this._startX + _loc5_.x / this.character_scale,
                this._startY + _loc5_.y / this.character_scale,
            );
            _loc6_++;
        }
        this.backShape = this.copterBody.CreateShape(_loc1_) as b2PolygonShape;
        this._session.contactListener.registerListener(
            ContactListener.ADD,
            this.backShape,
            this.contactAddHandler,
        );
        this._session.contactListener.registerListener(
            ContactListener.RESULT,
            this.backShape,
            this.contactCopterResultHandler,
        );
        _loc5_ = this.shapeGuide["magnetShape"];
        _loc7_.linearDamping = 0;
        _loc1_.filter = new b2FilterData();
        _loc1_.filter.categoryBits = this.zeroFilter.categoryBits;
        _loc1_.filter.maskBits = this.zeroFilter.maskBits;
        _loc7_.angularDamping = 1;
        _loc7_.position.Set(
            this._startX + _loc5_.x / this.character_scale,
            this._startY + _loc5_.y / this.character_scale,
        );
        this.magnetBody = this._session.m_world.CreateBody(_loc7_);
        this.paintVector.push(this.magnetBody);
        _loc1_.SetAsBox(
            (_loc5_.scaleX * this.shapeRefScale) / this.character_scale,
            (_loc5_.scaleY * this.shapeRefScale) / this.character_scale,
        );
        this.magnetShape = this.magnetBody.CreateShape(_loc1_);
        this.magnetBody.SetMassFromShapes();
        this._session.contactListener.registerListener(
            ContactListener.RESULT,
            this.magnetShape,
            this.magnetContactResult,
        );
        _loc7_.angularDamping = 0;
        this.cameraSecondFocus = this.magnetBody;
        _loc1_.filter = this.defaultFilter;
        _loc5_ = this.shapeGuide["leg1Shape"];
        _loc8_ = new b2Vec2(
            this._startX + _loc5_.x / this.character_scale,
            this._startY + _loc5_.y / this.character_scale,
        );
        _loc9_ = _loc5_.rotation / CharacterB2D.oneEightyOverPI;
        _loc1_.SetAsOrientedBox(
            (_loc5_.scaleX * this.shapeRefScale) / this.character_scale,
            (_loc5_.scaleY * this.shapeRefScale) / this.character_scale,
            _loc8_,
            _loc9_,
        );
        this.leg1Shape = this.copterBody.CreateShape(_loc1_);
        _loc5_ = this.shapeGuide["leg2Shape"];
        _loc8_ = new b2Vec2(
            this._startX + _loc5_.x / this.character_scale,
            this._startY + _loc5_.y / this.character_scale,
        );
        _loc9_ = _loc5_.rotation / CharacterB2D.oneEightyOverPI;
        _loc1_.SetAsOrientedBox(
            (_loc5_.scaleX * this.shapeRefScale) / this.character_scale,
            (_loc5_.scaleY * this.shapeRefScale) / this.character_scale,
            _loc8_,
            _loc9_,
        );
        this.leg2Shape = this.copterBody.CreateShape(_loc1_);
        _loc2_.density = 3;
        _loc2_.friction = 0;
        _loc2_.restitution = 0.3;
        _loc2_.filter = this.zeroFilter;
        _loc5_ = this.shapeGuide["wheel1Shape"];
        _loc2_.radius = (_loc5_.width * 0.5) / this.character_scale;
        _loc2_.localPosition = new b2Vec2(
            this._startX + _loc5_.x / this.character_scale,
            this._startY + _loc5_.y / this.character_scale,
        );
        this.wheel1Shape = this.copterBody.CreateShape(_loc2_) as b2CircleShape;
        this._session.contactListener.registerListener(
            ContactListener.ADD,
            this.wheel1Shape,
            this.contactAddHandler,
        );
        this._session.contactListener.registerListener(
            ContactListener.RESULT,
            this.wheel1Shape,
            this.contactResultHandler,
        );
        _loc5_ = this.shapeGuide["wheel2Shape"];
        _loc2_.radius = (_loc5_.width * 0.5) / this.character_scale;
        _loc2_.localPosition = new b2Vec2(
            this._startX + _loc5_.x / this.character_scale,
            this._startY + _loc5_.y / this.character_scale,
        );
        this.wheel2Shape = this.copterBody.CreateShape(_loc2_) as b2CircleShape;
        this._session.contactListener.registerListener(
            ContactListener.ADD,
            this.wheel2Shape,
            this.contactAddHandler,
        );
        this._session.contactListener.registerListener(
            ContactListener.RESULT,
            this.wheel2Shape,
            this.contactResultHandler,
        );
        this.copterBody.SetMassFromShapes();
        _loc1_.vertexCount = 4;
        _loc1_.density = 0;
        _loc1_.isSensor = true;
        _loc6_ = 0;
        while (_loc6_ < 4) {
            _loc5_ = this.shapeGuide["magnetVert" + [_loc6_]];
            _loc1_.vertices[_loc6_] = new b2Vec2(
                _loc5_.x / this.character_scale,
                _loc5_.y / this.character_scale,
            );
            _loc6_++;
        }
        this.magnetRangeSensor = this.magnetBody.CreateShape(_loc1_);
        this.magnetBody.SetMassFromShapes();
        this.magnetBody.DestroyShape(this.magnetRangeSensor);
        this.vertsBrokenCopter = new Array();
        _loc6_ = 0;
        while (_loc6_ < 7) {
            _loc11_ = new Array();
            _loc12_ = 0;
            while (_loc12_ < 6) {
                _loc5_ =
                    this.shapeGuide[
                    "broken_" + (_loc6_ + 1) + "_" + (_loc12_ + 1)
                    ];
                if (_loc5_) {
                    _loc11_.push(
                        new b2Vec2(
                            this._startX + _loc5_.x / this.character_scale,
                            this._startY + _loc5_.y / this.character_scale,
                        ),
                    );
                }
                _loc12_++;
            }
            this.vertsBrokenCopter.push(_loc11_);
            _loc6_++;
        }
        this.COMArray = [
            this.copterBody,
            this.head1Body,
            this.chestBody,
            this.pelvisBody,
            this.upperArm1Body,
            this.lowerArm1Body,
            this.upperArm2Body,
            this.lowerArm2Body,
            this.upperLeg1Body,
            this.lowerLeg1Body,
            this.upperLeg2Body,
            this.lowerLeg2Body,
        ];
        this.vertsBrokenCopter = new Array();
        _loc6_ = 1;
        while (_loc6_ < 8) {
            _loc11_ = new Array();
            _loc12_ = 0;
            while (_loc12_ < 4) {
                _loc5_ = this.shapeGuide["broken" + _loc6_ + "Vert" + _loc12_];
                if (_loc5_) {
                    _loc11_.push(
                        new b2Vec2(
                            this._startX + _loc5_.x / this.character_scale,
                            this._startY + _loc5_.y / this.character_scale,
                        ),
                    );
                }
                _loc12_++;
            }
            this.vertsBrokenCopter.push(_loc11_);
            _loc6_++;
        }
        this.heliLoop = SoundController.instance.playAreaSoundLoop(
            "HeliLoop",
            this.copterBody,
            0,
        );
        this.heliLoop.fadeTo(0.5, 1);
    }

    public override createJoints() {
        var _loc1_: number = NaN;
        var _loc2_: number = NaN;
        var _loc3_: number = NaN;
        var _loc16_: VPoint = null;
        var _loc19_: VSpring = null;
        super.createJoints();
        var _loc4_: number = 180 / Math.PI;
        _loc1_ = this.head1Body.GetAngle() - this.chestBody.GetAngle();
        _loc2_ = -10 / _loc4_ - _loc1_;
        _loc3_ = 10 / _loc4_ - _loc1_;
        this.neckJoint.SetLimits(_loc2_, _loc3_);
        var _loc5_ = new b2RevoluteJointDef();
        _loc5_.maxMotorTorque = this.maxTorque;
        _loc5_.enableLimit = false;
        _loc5_.lowerAngle = 0;
        _loc5_.upperAngle = 0;
        var _loc6_ = new b2Vec2();
        var _loc7_: MovieClip = this.shapeGuide["seatAnchor"];
        _loc6_.Set(
            this._startX + _loc7_.x / this.character_scale,
            this._startY + _loc7_.y / this.character_scale,
        );
        _loc5_.Initialize(this.copterBody, this.pelvisBody, _loc6_);
        this.copterPelvis = this._session.m_world.CreateJoint(
            _loc5_,
        ) as b2RevoluteJoint;
        _loc7_ = this.shapeGuide["handleAnchor"];
        _loc6_.Set(
            this._startX + _loc7_.x / this.character_scale,
            this._startY + _loc7_.y / this.character_scale,
        );
        _loc5_.Initialize(this.copterBody, this.lowerArm1Body, _loc6_);
        this.copterHand1 = this._session.m_world.CreateJoint(
            _loc5_,
        ) as b2RevoluteJoint;
        _loc5_.Initialize(this.copterBody, this.lowerArm2Body, _loc6_);
        this.copterHand2 = this._session.m_world.CreateJoint(
            _loc5_,
        ) as b2RevoluteJoint;
        var _loc8_: b2Vec2 = this.getCenterOfMass();
        this.magnetBody.SetXForm(
            new b2Vec2(_loc8_.x, this.magnetBody.GetWorldCenter().y),
            0,
        );
        this.COMArray.push(this.magnetBody);
        _loc7_ = this.shapeGuide["magnetAnchor"];
        _loc6_.Set(
            this._startX + _loc7_.x / this.character_scale,
            this._startY + _loc7_.y / this.character_scale,
        );
        _loc6_.x = _loc8_.x;
        var _loc9_: b2Vec2 = this.magnetBody.GetWorldCenter();
        _loc9_.y -= 20 / this.character_scale;
        this.copterAnchorPoint = this.copterBody.GetLocalPoint(_loc6_);
        this.magnetAnchorPoint = this.magnetBody.GetLocalPoint(_loc9_);
        var _loc10_ = new b2RopeJointDef();
        _loc10_.Initialize(this.copterBody, this.magnetBody, _loc6_, _loc9_);
        _loc10_.collideConnected = true;
        this.magnetJoint1 = this._session.m_world.CreateJoint(
            _loc10_,
        ) as b2RopeJoint;
        _loc10_.localAnchor1.x -= 84 / this.character_scale;
        _loc10_.localAnchor2.x -= 84 / this.character_scale;
        this.magnetJoint2 = this._session.m_world.CreateJoint(
            _loc10_,
        ) as b2RopeJoint;
        this._session.m_world.DestroyJoint(this.magnetJoint2);
        this.ropeMinLength = this.magnetJoint1.m_maxLength;
        trace("Length " + this.magnetJoint1.m_maxLength);
        this.ropeSprings = new Array();
        this.ropePoints = new Array();
        var _loc11_: b2Vec2 = _loc6_.Copy();
        var _loc12_: b2Vec2 = _loc9_.Copy();
        var _loc13_: number = (_loc12_.x - _loc11_.x) / this.numRopeSegments;
        var _loc14_: number = (_loc12_.y - _loc11_.y) / this.numRopeSegments;
        var _loc15_ = new VPoint(_loc11_, true);
        this.ropePoints.push(_loc15_);
        var _loc17_: number = 0;
        var _loc18_: number = 0;
        while (_loc18_ < this.numRopeSegments) {
            if (_loc18_ < this.numRopeSegments - 1) {
                _loc16_ = new VPoint(
                    new b2Vec2(
                        _loc11_.x + _loc13_ * (_loc18_ + 1),
                        _loc11_.y + _loc14_ * (_loc18_ + 1),
                    ),
                    false,
                );
            } else {
                _loc16_ = new VPoint(_loc12_, true);
            }
            this.ropePoints.push(_loc16_);
            _loc19_ = new VSpring(_loc15_, _loc16_);
            this.ropeSprings.push(_loc19_);
            _loc17_ += _loc19_.length;
            _loc15_ = _loc16_;
            _loc18_++;
        }
        this.resizeRope();
        trace("totalLength " + _loc17_);
    }

    public override createMovieClips() {
        var _loc3_: MovieClip = null;
        super.createMovieClips();
        this._session.containerSprite.addChildAt(
            this.pelvisMC,
            this._session.containerSprite.getChildIndex(this.chestMC),
        );
        var _loc1_: MovieClip = this.sourceObject["copterShards"];
        this._session.particleController.createBMDArray("copterShards", _loc1_);
        this.copterMC = this.sourceObject["copter"];
        var _loc5_ = 1 / this.mc_scale;
        this.copterMC.scaleY = 1 / this.mc_scale;
        this.copterMC.scaleX = _loc5_;
        this.copterFrontMC = this.sourceObject["copterFront"];
        _loc5_ = 1 / this.mc_scale;
        this.copterFrontMC.scaleY = 1 / this.mc_scale;
        this.copterFrontMC.scaleX = _loc5_;
        this.magnetMC = this.sourceObject["magnet"];
        // @ts-expect-error
        this.magnetMC.lights.visible = false;
        _loc5_ = 1 / this.mc_scale;
        this.magnetMC.scaleY = 1 / this.mc_scale;
        this.magnetMC.scaleX = _loc5_;
        this.helmetMC = this.sourceObject["helmet"];
        _loc5_ = 1 / this.mc_scale;
        this.helmetMC.scaleY = 1 / this.mc_scale;
        this.helmetMC.scaleX = _loc5_;
        this.helmetMC.visible = false;
        var _loc2_: b2Vec2 = this.copterBody.GetLocalCenter();
        _loc2_ = new b2Vec2(
            (this._startX - _loc2_.x) * this.character_scale,
            (this._startY - _loc2_.y) * this.character_scale,
        );
        // @ts-expect-error
        this.copterMC.inner.x = this.copterFrontMC.inner.x = _loc2_.x;
        // @ts-expect-error
        this.copterMC.inner.y = this.copterFrontMC.inner.y = _loc2_.y;
        this.copterBody.SetUserData(this.copterMC);
        this.magnetBody.SetUserData(this.magnetMC);
        this.ropeSprite = new Sprite();
        this._session.containerSprite.addChildAt(
            this.helmetMC,
            this._session.containerSprite.getChildIndex(this.chestMC),
        );
        this._session.containerSprite.addChildAt(
            this.magnetMC,
            this._session.containerSprite.getChildIndex(this.head1MC),
        );
        this._session.containerSprite.addChildAt(
            this.ropeSprite,
            this._session.containerSprite.getChildIndex(this.head1MC),
        );
        this._session.containerSprite.addChildAt(
            this.copterMC,
            this._session.containerSprite.getChildIndex(this.head1MC),
        );
        this._session.containerSprite.addChildAt(
            this.copterFrontMC,
            this._session.containerSprite.getChildIndex(this.upperArm1MC),
        );
        // @ts-expect-error
        this.copterMC.inner.propeller.play();
        // @ts-expect-error
        this.copterMC.inner.brokenPropeller.visible = false;
        this.brokenCopterMCs = new Array();
        var _loc4_: number = 1;
        while (_loc4_ < 8) {
            _loc3_ = this.sourceObject["broken" + _loc4_];
            _loc5_ = 1 / this.mc_scale;
            _loc3_.scaleY = 1 / this.mc_scale;
            _loc3_.scaleX = _loc5_;
            _loc3_.visible = false;
            this.brokenCopterMCs.push(_loc3_);
            this._session.containerSprite.addChild(_loc3_);
            _loc4_++;
        }
    }

    public override resetMovieClips() {
        var _loc3_: MovieClip = null;
        super.resetMovieClips();
        this.helmetMC.visible = false;
        // @ts-expect-error
        this.head1MC.helmet.visible = true;
        // @ts-expect-error
        this.copterFrontMC.inner.leg1.visible = true;
        // @ts-expect-error
        this.copterFrontMC.inner.leg2.visible = true;
        this.copterFrontMC.visible = true;
        this.copterMC.visible = true;
        // @ts-expect-error
        this.copterMC.inner.propeller.visible = true;
        // @ts-expect-error
        this.copterMC.inner.brokenPropeller.visible = false;
        var _loc1_: number = 0;
        while (_loc1_ < 7) {
            _loc3_ = this.brokenCopterMCs[_loc1_];
            _loc3_.visible = false;
            _loc1_++;
        }
        this.copterBody.SetUserData(this.copterMC);
        this.magnetBody.SetUserData(this.magnetMC);
        this.magnetMC.gotoAndStop(0);
        // @ts-expect-error
        this.magnetMC.lights.visible = false;
        this.ropeSprite.graphics.clear();
        var _loc2_: MovieClip = this.sourceObject["copterShards"];
        this._session.particleController.createBMDArray("copterShards", _loc2_);
    }

    public override createDictionaries() {
        super.createDictionaries();
        this.helmetShape = this.head1Shape;
        this.contactImpulseDict.set(this.helmetShape, this.helmetSmashLimit);
        this.contactImpulseDict.set(this.backShape, this.copterSmashLimit);
        this.contactImpulseDict.set(this.bladeShape, this.bladeSmashLimit);
        this.contactImpulseDict.set(this.wheel1Shape, this.copterSmashLimit);
        this.contactImpulseDict.set(this.wheel2Shape, this.copterSmashLimit);
        this.contactAddSounds.set(this.wheel1Shape, "CarTire1");
        this.contactAddSounds.set(this.wheel2Shape, "CarTire1");
        this.contactAddSounds.set(this.backShape, "BikeHit3");
        this.contactAddSounds.set(this.baseShape, "BikeHit1");
    }

    protected contactCopterResultHandler(param1: ContactEvent) {
        var _loc2_: number = param1.impulse;
        if (_loc2_ > this.contactImpulseDict.get(this.backShape)) {
            if (this.contactResultBuffer.get(this.backShape)) {
                if (
                    _loc2_ >
                    this.contactResultBuffer.get(this.backShape).impulse
                ) {
                    this.contactResultBuffer.set(this.backShape, param1);
                }
            } else {
                this.contactResultBuffer.set(this.backShape, param1);
            }
        }
    }

    private bladeContactResultHandler(param1: ContactEvent) {
        var _loc2_: number = param1.impulse;
        var _loc3_: b2Shape = param1.otherShape;
        this.bladeContactArray.push(param1);
        if (_loc2_ > this.contactImpulseDict.get(this.bladeShape)) {
            if (this.contactResultBuffer.get(this.bladeShape)) {
                if (
                    _loc2_ >
                    this.contactResultBuffer.get(this.bladeShape).impulse
                ) {
                    this.contactResultBuffer.set(this.bladeShape, param1);
                }
            } else {
                this.contactResultBuffer.set(this.bladeShape, param1);
            }
        }
    }

    protected override handleContactResults() {
        var _loc1_: ContactEvent = null;
        var _loc3_: BladeShard = null;
        if (this.contactResultBuffer.get(this.helmetShape)) {
            _loc1_ = this.contactResultBuffer.get(this.helmetShape);
            this.helmetSmash(_loc1_.impulse);
            this.contactResultBuffer.delete(this.head1Shape);
            this.contactAddBuffer.delete(this.head1Shape);
        }
        super.handleContactResults();
        this.handleBladeContacts();
        if (this.contactResultBuffer.get(this.backShape)) {
            _loc1_ = this.contactResultBuffer.get(this.backShape);
            this.copterSmash(_loc1_);
            this.contactResultBuffer.delete(this.backShape);
            this.contactAddBuffer.delete(this.backShape);
            this.contactAddBuffer.delete(this.baseShape);
            this.contactAddBuffer.delete(this.wheel1Shape);
            this.contactAddBuffer.delete(this.wheel2Shape);
            this.contactResultBuffer.delete(this.bladeShape);
            this.contactResultBuffer.delete(this.wheel1Shape);
            this.contactResultBuffer.delete(this.wheel2Shape);
        }
        if (this.contactResultBuffer.get(this.bladeShape)) {
            _loc1_ = this.contactResultBuffer.get(this.bladeShape);
            this.bladeSmash(_loc1_);
            this.contactResultBuffer.delete(this.bladeShape);
        }
        if (this.contactResultBuffer.get(this.wheel1Shape)) {
            _loc1_ = this.contactResultBuffer.get(this.wheel1Shape);
            this.copterLegSmash(this.wheel1Shape, _loc1_);
            this.contactResultBuffer.delete(this.wheel1Shape);
            this.contactAddBuffer.delete(this.wheel1Shape);
        }
        if (this.contactResultBuffer.get(this.wheel2Shape)) {
            _loc1_ = this.contactResultBuffer.get(this.wheel2Shape);
            this.copterLegSmash(this.wheel2Shape, _loc1_);
            this.contactResultBuffer.delete(this.wheel2Shape);
            this.contactAddBuffer.delete(this.wheel2Shape);
        }
        this.handleMagnetContacts();
        var _loc2_: number = 0;
        while (_loc2_ < this.bladeActions.length) {
            _loc3_ = this.bladeActions[_loc2_];
            _loc3_.actions();
            _loc2_++;
        }
    }

    private handleMagnetContacts() {
        var _loc1_: number = 0;
        var _loc2_: b2AABB = null;
        var _loc3_: number = 0;
        var _loc4_: Dictionary<any, any> = null;
        var _loc5_: b2JointEdge = null;
        var _loc6_: b2Joint = null;
        var _loc7_: ContactEvent = null;
        var _loc8_: b2Shape = null;
        var _loc9_: b2Body = null;
        var _loc10_: b2Vec2 = null;
        var _loc11_: number = NaN;
        var _loc12_: b2AABB = null;
        var _loc13_: number = 0;
        var _loc14_: b2Vec2 = null;
        var _loc15_: b2RevoluteJointDef = null;
        var _loc16_: any[] = null;
        if (this.magnetized) {
            _loc1_ = int(this.magnetContactArray.length);
            if (_loc1_ > 0) {
                _loc4_ = new Dictionary();
                _loc5_ = this.magnetBody.GetJointList();
                while (_loc5_) {
                    _loc6_ = _loc5_.joint;
                    if (_loc6_ instanceof b2RevoluteJoint) {
                        _loc4_.set(_loc6_.m_body2, _loc6_);
                    }
                    _loc5_ = _loc5_.next;
                }
            }
            _loc2_ = new b2AABB();
            this.magnetRangeSensor.ComputeAABB(_loc2_, this.magnetBody.m_xf);
            _loc3_ = 0;
            while (_loc3_ < _loc1_) {
                _loc7_ = this.magnetContactArray[_loc3_];
                _loc8_ = _loc7_.otherShape;
                _loc9_ = _loc8_.GetBody();
                if (_loc9_ != null) {
                    _loc10_ = _loc7_.position;
                    _loc11_ = _loc9_.GetMass();
                    _loc12_ = new b2AABB();
                    _loc8_.ComputeAABB(_loc12_, _loc9_.m_xf);
                    if (
                        !(
                            _loc12_.lowerBound.x > _loc2_.upperBound.x ||
                            _loc12_.upperBound.x < _loc2_.lowerBound.x
                        )
                    ) {
                        if (
                            !(
                                _loc12_.lowerBound.y > _loc2_.upperBound.y ||
                                _loc12_.upperBound.y < _loc2_.lowerBound.y
                            )
                        ) {
                            _loc13_ = int(this.COMArray.indexOf(_loc9_));
                            _loc14_ = this.magnetBody.GetLocalPoint(_loc10_);
                            if (
                                _loc14_.y > 0 &&
                                _loc11_ > 0 &&
                                _loc13_ < 0 &&
                                !_loc4_.get(_loc9_)
                            ) {
                                _loc15_ = new b2RevoluteJointDef();
                                _loc15_.collideConnected = true;
                                _loc15_.enableLimit = true;
                                _loc15_.upperAngle = (3 * Math.PI) / 180;
                                _loc15_.lowerAngle = (-3 * Math.PI) / 180;
                                _loc15_.Initialize(
                                    this.magnetBody,
                                    _loc9_,
                                    _loc10_,
                                );
                                this._session.m_world.CreateJoint(_loc15_);
                            }
                        }
                    }
                }
                _loc3_++;
            }
        } else {
            _loc16_ = new Array();
            _loc5_ = this.magnetBody.GetJointList();
            while (_loc5_) {
                _loc6_ = _loc5_.joint;
                if (
                    _loc6_ != this.magnetJoint1 &&
                    _loc6_ != this.magnetJoint2
                ) {
                    _loc16_.push(_loc6_);
                }
                _loc5_ = _loc5_.next;
            }
            _loc1_ = int(_loc16_.length);
            _loc3_ = 0;
            while (_loc3_ < _loc1_) {
                _loc6_ = _loc16_[_loc3_];
                this._session.m_world.DestroyJoint(_loc6_);
                _loc3_++;
            }
        }
        this.magnetContactArray = new Array();
        this.magnetShapeArray = new Array();
    }

    private handleBladeContacts() {
        var _loc4_: ContactEvent = null;
        var _loc5_: b2Shape = null;
        var _loc6_: b2Body = null;
        var _loc7_: b2Vec2 = null;
        var _loc8_: number = NaN;
        var _loc9_: b2Vec2 = null;
        var _loc10_: b2Vec2 = null;
        var _loc11_: number = NaN;
        var _loc12_: number = NaN;
        var _loc13_: number = NaN;
        var _loc14_: number = NaN;
        var _loc15_ = undefined;
        var _loc16_: b2Vec2 = null;
        var _loc17_: string = null;
        var _loc18_: number = 0;
        var _loc19_: string = null;
        var _loc20_: b2Vec2 = null;
        if (this.bladeSmashed) {
            return;
        }
        var _loc1_ = int(this.bladeContactArray.length);
        var _loc2_: number = this.copterBody.m_mass;
        var _loc3_: number = 0;
        while (_loc3_ < _loc1_) {
            _loc4_ = this.bladeContactArray[_loc3_];
            _loc5_ = _loc4_.otherShape;
            _loc6_ = _loc5_.GetBody();
            _loc7_ = _loc4_.position;
            _loc8_ = _loc6_.GetMass();
            _loc9_ = this.copterBody.GetLocalPoint(_loc7_);
            _loc10_ = new b2Vec2(
                _loc9_.x - this.bladeLocalCenter.x,
                _loc9_.y - this.bladeLocalCenter.y,
            );
            _loc10_.Normalize();
            _loc10_.MulM(this.copterBody.m_xf.R);
            _loc11_ = 3;
            if (_loc8_ > 0) {
                _loc12_ = _loc6_.m_invMass + this.copterBody.m_invMass;
                _loc13_ = (_loc11_ * _loc6_.m_invMass) / _loc12_;
                _loc14_ = (_loc11_ * this.copterBody.m_invMass) / _loc12_;
                _loc15_ = new b2Vec2(_loc10_.x * _loc13_, _loc10_.y * _loc13_);
                _loc16_ = new b2Vec2(_loc10_.x * _loc14_, _loc10_.y * _loc14_);
                _loc6_.ApplyImpulse(_loc15_, _loc7_);
                this.copterBody.ApplyImpulse(_loc16_.Negative(), _loc7_);
                if (_loc5_.m_material & 7) {
                    _loc17_ = _loc7_.x.toString();
                    _loc18_ = int(_loc17_.charAt(_loc17_.length - 1));
                    if (_loc18_ < 7) {
                        _loc19_ = "BladeFlesh" + Math.ceil(Math.random() * 3);
                        SoundController.instance.playAreaSoundInstance(
                            _loc19_,
                            _loc6_,
                        );
                    } else if (!this.bladeImpactSound) {
                        _loc19_ = "MetalRicochet" + Math.ceil(Math.random() * 3);
                        this.bladeImpactSound =
                            SoundController.instance.playAreaSoundInstance(
                                _loc19_,
                                _loc6_,
                            );
                        this.session.particleController.createSparkBurstPoint(
                            _loc7_,
                            new b2Vec2(_loc15_.x * 5, _loc15_.y * 5),
                            5,
                            50,
                            20,
                        );
                    }
                } else if (!this.bladeImpactSound) {
                    _loc19_ = "MetalRicochet" + Math.ceil(Math.random() * 3);
                    this.bladeImpactSound =
                        SoundController.instance.playAreaSoundInstance(
                            _loc19_,
                            _loc6_,
                        );
                    this.session.particleController.createSparkBurstPoint(
                        _loc7_,
                        new b2Vec2(_loc15_.x * 5, _loc15_.y * 5),
                        5,
                        50,
                        20,
                    );
                }
            } else {
                _loc20_ = new b2Vec2(_loc10_.x * _loc11_, _loc10_.y * _loc11_);
                this.copterBody.ApplyImpulse(_loc20_.Negative(), _loc7_);
                if (!this.bladeImpactSound) {
                    _loc19_ = "MetalRicochet" + Math.ceil(Math.random() * 3);
                    this.bladeImpactSound =
                        SoundController.instance.playAreaSoundInstance(
                            _loc19_,
                            this.copterBody,
                            0.4,
                        );
                    this.session.particleController.createSparkBurstPoint(
                        _loc7_,
                        new b2Vec2(_loc20_.x * 5, _loc20_.y * 5),
                        5,
                        50,
                        20,
                    );
                }
            }
            _loc3_++;
        }
        this.bladeContactArray = new Array();
    }

    public override eject() {
        if (this.ejected) {
            return;
        }
        trace("EJECT");
        this.ejected = true;
        this.resetJointLimits();
        var _loc1_: b2World = this._session.m_world;
        if (this.copterPelvis) {
            _loc1_.DestroyJoint(this.copterPelvis);
            this.copterPelvis = null;
        }
        if (this.copterHand1) {
            _loc1_.DestroyJoint(this.copterHand1);
            this.copterHand1 = null;
        }
        if (this.copterHand2) {
            _loc1_.DestroyJoint(this.copterHand2);
            this.copterHand2 = null;
        }
        var _loc2_: b2Shape = this.copterBody.GetShapeList();
        while (_loc2_) {
            if (_loc2_ != this.bladeShape) {
                _loc2_.SetFilterData(this.zeroFilter);
                _loc1_.Refilter(_loc2_);
            }
            _loc2_ = _loc2_.m_next;
        }
        // @ts-expect-error
        this.lowerArm1MC.hand.gotoAndStop(2);
        // @ts-expect-error
        this.lowerArm2MC.hand.gotoAndStop(2);
        var _loc3_: number = this.copterBody.GetAngle();
        var _loc4_: number = Math.cos(_loc3_) * this.ejectImpulse;
        var _loc5_: number = Math.sin(_loc3_) * this.ejectImpulse;
        this.chestBody.ApplyImpulse(
            new b2Vec2(_loc4_, _loc5_),
            this.chestBody.GetWorldCenter(),
        );
        this.pelvisBody.ApplyImpulse(
            new b2Vec2(_loc4_, _loc5_),
            this.pelvisBody.GetWorldCenter(),
        );
        this.COMArray = [this.copterBody, this.magnetBody];
        this.targetAng = 0;
        this._session.camera.removeSecondFocus();
    }

    public override set dead(param1: boolean) {
        this._dead = param1;
        if (this._dead) {
            this.targetAng = 0;
            this.userVehicleEject();
            this.currentPose = 0;
            this.releaseGrip();
            if (this.voiceSound) {
                this.voiceSound.stopSound();
                this.voiceSound = null;
            }
        }
    }

    public override grabAction(
        param1: b2Body,
        param2: b2Shape,
        param3: b2Body,
    ) {
        if (param2 == this.bladeShape) {
            return;
        }
        super.grabAction(param1, param2, param3);
    }

    private magnetContactResult(param1: ContactEvent) {
        var _loc5_: ContactEvent = null;
        var _loc2_: number = param1.impulse;
        var _loc3_: b2Shape = param1.otherShape;
        var _loc4_ = int(this.magnetShapeArray.indexOf(_loc3_));
        if (_loc4_ > -1) {
            _loc5_ = this.magnetContactArray[_loc4_];
            if (param1.impulse > _loc5_.impulse) {
                this.magnetContactArray[_loc4_] = param1;
            }
        } else {
            this.magnetShapeArray.push(_loc3_);
            this.magnetContactArray.push(param1);
        }
    }

    protected getCenterOfMass(): b2Vec2 {
        var _loc4_: b2Body = null;
        var _loc5_: b2Vec2 = null;
        var _loc6_: number = NaN;
        var _loc1_ = new b2Vec2();
        this.totalMass = 0;
        var _loc2_ = int(this.COMArray.length);
        var _loc3_: number = 0;
        while (_loc3_ < _loc2_) {
            _loc4_ = this.COMArray[_loc3_];
            _loc5_ = _loc4_.GetWorldCenter();
            _loc6_ = _loc4_.GetMass();
            _loc1_.x += _loc5_.x * _loc6_;
            _loc1_.y += _loc5_.y * _loc6_;
            this.totalMass += _loc6_;
            _loc3_++;
        }
        _loc1_.Multiply(1 / this.totalMass);
        return _loc1_;
    }

    protected removeFromCOMArray(param1: b2Body) {
        var _loc2_ = int(this.COMArray.indexOf(param1));
        if (_loc2_ > -1) {
            this.COMArray.splice(_loc2_, 1);
        }
    }

    public copterSmash(param1: ContactEvent) {
        var _loc3_: b2Vec2 = null;
        var _loc14_: b2Body = null;
        var _loc15_: any[] = null;
        var _loc16_: Sprite = null;
        trace(
            "copter impulse " +
            param1.impulse +
            " -> " +
            this._session.iteration,
        );
        this.contactImpulseDict.delete(this.backShape);
        var _loc2_: ContactListener = this._session.contactListener;
        _loc2_.deleteListener(ContactListener.RESULT, this.backShape);
        _loc2_.deleteListener(ContactListener.RESULT, this.baseShape);
        _loc2_.deleteListener(ContactListener.RESULT, this.wheel1Shape);
        _loc2_.deleteListener(ContactListener.RESULT, this.wheel2Shape);
        _loc2_.deleteListener(ContactListener.ADD, this.backShape);
        _loc2_.deleteListener(ContactListener.ADD, this.baseShape);
        _loc2_.deleteListener(ContactListener.ADD, this.wheel1Shape);
        _loc2_.deleteListener(ContactListener.ADD, this.wheel2Shape);
        this.copterSmashed = true;
        if (!this.bladeSmashed) {
            this.bladeSmash(param1);
        }
        // @ts-expect-error
        if (this.copterFrontMC.inner.leg1.visible == true) {
            this.copterLegSmash(this.wheel1Shape, param1, false);
        }
        // @ts-expect-error
        if (this.copterFrontMC.inner.leg2.visible == true) {
            this.copterLegSmash(this.wheel2Shape, param1, false);
        }
        _loc3_ = this.copterBody.GetLocalCenter();
        this.eject();
        var _loc4_: b2World = this._session.m_world;
        var _loc5_: b2Vec2 = this.copterBody.GetPosition();
        var _loc6_: number = this.copterBody.GetAngle();
        var _loc7_: b2Vec2 = this.copterBody.GetLinearVelocity();
        var _loc8_: number = this.copterBody.GetAngularVelocity();
        _loc4_.DestroyBody(this.copterBody);
        this.copterMC.visible = this.copterFrontMC.visible = false;
        var _loc9_ = new b2BodyDef();
        _loc9_.position = _loc5_;
        _loc9_.angle = _loc6_;
        var _loc10_ = new b2PolygonDef();
        _loc10_.density = 3;
        _loc10_.friction = 0.3;
        _loc10_.restitution = 0.3;
        _loc10_.filter = this.zeroFilter;
        var _loc11_: number = 5;
        var _loc12_: number = 0;
        while (_loc12_ < _loc11_) {
            _loc14_ = _loc4_.CreateBody(_loc9_);
            _loc15_ = this.vertsBrokenCopter[_loc12_];
            _loc16_ = this.brokenCopterMCs[_loc12_];
            _loc10_.vertexCount = _loc15_.length;
            _loc10_.vertices = _loc15_;
            _loc14_.CreateShape(_loc10_);
            _loc14_.SetMassFromShapes();
            _loc14_.SetAngularVelocity(_loc8_);
            _loc14_.SetLinearVelocity(
                this.copterBody.GetLinearVelocityFromLocalPoint(
                    _loc14_.GetLocalCenter(),
                ),
            );
            _loc14_.SetUserData(_loc16_);
            _loc16_.visible = true;
            this.paintVector.push(_loc14_);
            _loc12_++;
        }
        var _loc13_: VPoint = this.ropePoints[0];
        _loc13_.fixed = false;
        _loc3_ = this.copterBody.GetWorldCenter();
        this._session.particleController.createPointBurst(
            "copterShards",
            _loc3_.x * this.m_physScale,
            _loc3_.y * this.m_physScale,
            30,
            30,
            70,
        );
        SoundController.instance.playAreaSoundInstance(
            "MetalSmashHeavy2",
            this.copterBody,
        );
    }

    public bladeSmash(param1: ContactEvent) {
        var _loc12_: any[] = null;
        var _loc13_: any[] = null;
        var _loc18_: b2Vec2 = null;
        var _loc19_ = false;
        var _loc20_: number = NaN;
        var _loc21_: number = NaN;
        var _loc22_: b2Body = null;
        var _loc23_: b2PolygonShape = null;
        var _loc24_: b2Vec2 = null;
        var _loc25_: b2Vec2 = null;
        var _loc26_: BladeShard = null;
        trace("blade smash impulse " + param1.impulse);
        this.contactImpulseDict.delete(this.bladeShape);
        this._session.contactListener.deleteListener(
            ContactListener.RESULT,
            this.bladeShape,
        );
        this.bladeSmashed = true;
        var _loc2_: b2Vec2 = this.copterBody.GetLocalPoint(param1.position);
        _loc2_.Subtract(this.bladeLocalCenter);
        var _loc3_: number = 20 / this.character_scale;
        var _loc4_: number = -5 / this.character_scale;
        var _loc5_: number = 5 / this.character_scale;
        var _loc6_: number = 235 / this.character_scale;
        if (_loc2_.x < 0) {
            _loc19_ = false;
            _loc20_ = -200 / this.character_scale;
            _loc21_ = -35 / this.character_scale;
        } else {
            _loc19_ = true;
            _loc20_ = 35 / this.character_scale;
            _loc21_ = 200 / this.character_scale;
            _loc6_ = -_loc6_;
        }
        var _loc7_ = new b2Vec2(_loc20_, _loc4_);
        var _loc8_ = new b2Vec2(_loc21_, _loc4_);
        var _loc9_ = new b2Vec2(_loc21_, _loc5_);
        var _loc10_ = new b2Vec2(_loc20_, _loc5_);
        var _loc11_ = new b2Vec2(0, 0);
        if (_loc2_.x < _loc20_ + _loc3_) {
            _loc11_.x = _loc21_ - _loc3_;
            _loc13_ = [_loc11_, _loc10_, _loc7_];
            if (_loc2_.y > 0) {
                _loc11_.y = _loc4_;
                _loc12_ = [_loc11_, _loc8_, _loc9_, _loc10_];
            } else {
                _loc11_.y = _loc5_;
                _loc12_ = [_loc11_, _loc7_, _loc8_, _loc9_];
            }
        } else if (_loc2_.x > _loc21_ - _loc3_) {
            _loc11_.x = _loc20_ + _loc3_;
            _loc13_ = [_loc11_, _loc8_, _loc9_];
            if (_loc2_.y > 0) {
                _loc11_.y = _loc4_;
                _loc12_ = [_loc11_, _loc9_, _loc10_, _loc7_];
            } else {
                _loc11_.y = _loc5_;
                _loc12_ = [_loc11_, _loc10_, _loc7_, _loc8_];
            }
        } else {
            _loc11_.x = _loc2_.x;
            _loc13_ = [_loc11_, _loc8_, _loc9_];
            if (_loc2_.y > 0) {
                _loc11_.y = _loc5_;
                _loc12_ = [_loc11_, _loc10_, _loc7_, _loc8_];
            } else {
                _loc11_.y = _loc4_;
                _loc12_ = [_loc11_, _loc9_, _loc10_, _loc7_];
            }
        }
        this.bladeShards = new Array();
        var _loc14_ = new b2BodyDef();
        _loc14_.position = this.copterBody.GetWorldPoint(this.bladeLocalCenter);
        _loc14_.angle = this.copterBody.GetAngle();
        var _loc15_ = new b2PolygonDef();
        _loc15_.density = 3;
        _loc15_.friction = 0.3;
        _loc15_.restitution = 0.1;
        _loc15_.filter = this.zeroFilter;
        var _loc16_: number = 50;
        var _loc17_: number = 0;
        while (_loc17_ < 2) {
            if (_loc17_ == 1) {
                _loc7_.x += _loc6_;
                _loc8_.x += _loc6_;
                _loc9_.x += _loc6_;
                _loc10_.x += _loc6_;
                _loc11_.x += _loc6_;
                _loc19_ = !_loc19_;
            }
            _loc22_ = this._session.m_world.CreateBody(_loc14_);
            _loc15_.vertexCount = 4;
            _loc15_.vertices = _loc12_;
            _loc23_ = _loc22_.CreateShape(_loc15_) as b2PolygonShape;
            _loc22_.SetMassFromShapes();
            _loc18_ = _loc22_.GetWorldCenter();
            _loc24_ = this.copterBody.GetLinearVelocityFromWorldPoint(_loc18_);
            _loc25_ = new b2Vec2(
                _loc18_.x - _loc22_.GetPosition().x,
                _loc18_.y - _loc22_.GetPosition().y,
            );
            _loc25_.Multiply(_loc16_);
            _loc24_.Add(_loc25_);
            _loc22_.SetLinearVelocity(_loc24_);
            _loc26_ = new BladeShard(_loc22_, _loc19_, this);
            this.bladeShards.push(_loc26_);
            _loc15_.vertexCount = 3;
            _loc15_.vertices = _loc13_;
            _loc22_ = this._session.m_world.CreateBody(_loc14_);
            _loc23_ = _loc22_.CreateShape(_loc15_) as b2PolygonShape;
            _loc22_.SetMassFromShapes();
            _loc24_ = this.copterBody.GetLinearVelocityFromWorldPoint(
                _loc22_.GetWorldCenter(),
            );
            _loc25_ = new b2Vec2(
                _loc18_.x - _loc22_.GetPosition().x,
                _loc18_.y - _loc22_.GetPosition().y,
            );
            _loc25_.Multiply(_loc16_);
            _loc24_.Add(_loc25_);
            _loc22_.SetLinearVelocity(_loc24_);
            _loc26_ = new BladeShard(_loc22_, _loc19_, this);
            this.bladeShards.push(_loc26_);
            _loc17_++;
        }
        _loc18_ = this.copterBody.GetWorldPoint(this.bladeLocalCenter);
        this._session.particleController.createPointBurst(
            "copterShards",
            _loc18_.x * this.m_physScale,
            _loc18_.y * this.m_physScale,
            30,
            60,
            70,
        );
        this.copterBody.DestroyShape(this.bladeShape);
        // @ts-expect-error
        this.copterMC.inner.propeller.visible = false;
        // @ts-expect-error
        this.copterMC.inner.brokenPropeller.visible = true;
        this.heliLoop.stopSound();
        this.heliLoop = null;
        SoundController.instance.playAreaSoundInstance(
            "MetalSmashHeavy4",
            this.copterBody,
        );
        this.addVocals("Help", 4);
    }

    public copterLegSmash(
        param1: b2Shape,
        param2: ContactEvent,
        param3: boolean = true,
    ) {
        var _loc14_: number = 0;
        trace("copterleg smash impulse " + param2.impulse);
        this.contactImpulseDict.delete(param1);
        this._session.contactListener.deleteListener(
            ContactListener.RESULT,
            param1,
        );
        this._session.contactListener.deleteListener(
            ContactListener.ADD,
            param1,
        );
        var _loc4_: b2World = this._session.m_world;
        var _loc5_: b2Vec2 = this.copterBody.GetPosition();
        var _loc6_: number = this.copterBody.GetAngle();
        var _loc7_: b2Vec2 = this.copterBody.GetLinearVelocity();
        var _loc8_: number = this.copterBody.GetAngularVelocity();
        var _loc9_ = new b2BodyDef();
        _loc9_.position = _loc5_;
        _loc9_.angle = _loc6_;
        var _loc10_ = new b2PolygonDef();
        _loc10_.density = 3;
        _loc10_.friction = 0.3;
        _loc10_.restitution = 0.3;
        _loc10_.filter = this.zeroFilter;
        if (param1 == this.wheel1Shape) {
            _loc14_ = 5;
            // @ts-expect-error
            this.copterFrontMC.inner.leg1.visible = false;
            this.copterBody.DestroyShape(this.leg1Shape);
        } else {
            _loc14_ = 6;
            // @ts-expect-error
            this.copterFrontMC.inner.leg2.visible = false;
            this.copterBody.DestroyShape(this.leg2Shape);
        }
        var _loc11_: b2Body = _loc4_.CreateBody(_loc9_);
        var _loc12_: any[] = this.vertsBrokenCopter[_loc14_];
        var _loc13_: Sprite = this.brokenCopterMCs[_loc14_];
        _loc10_.vertexCount = _loc12_.length;
        _loc10_.vertices = _loc12_;
        _loc11_.CreateShape(_loc10_);
        _loc11_.SetMassFromShapes();
        _loc11_.SetAngularVelocity(_loc8_);
        _loc11_.SetLinearVelocity(
            this.copterBody.GetLinearVelocityFromLocalPoint(
                _loc11_.GetLocalCenter(),
            ),
        );
        _loc11_.SetUserData(_loc13_);
        _loc13_.visible = true;
        this.paintVector.push(_loc11_);
        this.copterBody.DestroyShape(param1);
        if (param3) {
            SoundController.instance.playAreaSoundInstance(
                "StemSnap",
                this.copterBody,
            );
        }
    }

    public helmetSmash(param1: number) {
        var _loc6_: MovieClip = null;
        trace("helmet impulse " + param1 + " -> " + this._session.iteration);
        this.contactImpulseDict.delete(this.helmetShape);
        this.head1Shape = this.helmetShape;
        this.contactImpulseDict.set(this.head1Shape, this.headSmashLimit);
        this.helmetShape = null;
        this.helmetOn = false;
        var _loc2_ = new b2PolygonDef();
        var _loc3_ = new b2BodyDef();
        _loc2_.density = 1;
        _loc2_.friction = 0.3;
        _loc2_.restitution = 0.1;
        _loc2_.filter = this.zeroFilter;
        var _loc4_: b2Vec2 = this.head1Body.GetPosition();
        _loc3_.position = _loc4_;
        _loc3_.angle = this.head1Body.GetAngle();
        _loc3_.userData = this.helmetMC;
        this.helmetMC.visible = true;
        // @ts-expect-error
        this.head1MC.helmet.visible = false;
        _loc2_.vertexCount = 4;
        var _loc5_: number = 0;
        while (_loc5_ < 4) {
            _loc6_ = this.shapeGuide["helmetVert" + [_loc5_ + 1]];
            _loc2_.vertices[_loc5_] = new b2Vec2(
                _loc6_.x / this.character_scale,
                _loc6_.y / this.character_scale,
            );
            _loc5_++;
        }
        this.helmetBody = this._session.m_world.CreateBody(_loc3_);
        this.helmetBody.CreateShape(_loc2_);
        this.helmetBody.SetMassFromShapes();
        this.helmetBody.SetLinearVelocity(this.head1Body.GetLinearVelocity());
        this.helmetBody.SetAngularVelocity(this.head1Body.GetAngularVelocity());
        this.paintVector.push(this.helmetBody);
    }

    public override chestSmash(param1: number) {
        super.chestSmash(param1);
        this.eject();
    }

    public override pelvisSmash(param1: number) {
        super.pelvisSmash(param1);
        this.eject();
    }

    public override torsoBreak(
        param1: number,
        param2: boolean = true,
        param3: boolean = true,
    ) {
        super.torsoBreak(param1, param2, param3);
        this.eject();
    }

    public checkEject() {
        if (!this.copterHand1 && !this.copterHand2) {
            this.eject();
        }
    }

    public override shoulderBreak1(param1: number, param2: boolean = true) {
        super.shoulderBreak1(param1, param2);
        if (this.ejected) {
            return;
        }
        this.removeFromCOMArray(this.upperArm1Body);
        this.removeFromCOMArray(this.lowerArm1Body);
        if (this.upperArm3Body) {
            this.COMArray.push(this.upperArm3Body);
        }
        if (this.copterHand1) {
            this._session.m_world.DestroyJoint(this.copterHand1);
            this.copterHand1 = null;
            this.checkEject();
        }
    }

    public override shoulderBreak2(param1: number, param2: boolean = true) {
        super.shoulderBreak2(param1, param2);
        if (this.ejected) {
            return;
        }
        this.removeFromCOMArray(this.upperArm2Body);
        this.removeFromCOMArray(this.lowerArm2Body);
        if (this.upperArm4Body) {
            this.COMArray.push(this.upperArm4Body);
        }
        if (this.copterHand2) {
            this._session.m_world.DestroyJoint(this.copterHand2);
            this.copterHand2 = null;
            this.checkEject();
        }
    }

    public override elbowBreak1(param1: number) {
        super.elbowBreak1(param1);
        if (this.ejected) {
            return;
        }
        this.removeFromCOMArray(this.lowerArm1Body);
        if (this.copterHand1) {
            this._session.m_world.DestroyJoint(this.copterHand1);
            this.copterHand1 = null;
            this.checkEject();
        }
    }

    public override elbowBreak2(param1: number) {
        super.elbowBreak2(param1);
        if (this.ejected) {
            return;
        }
        this.removeFromCOMArray(this.lowerArm2Body);
        if (this.copterHand2) {
            this._session.m_world.DestroyJoint(this.copterHand2);
            this.copterHand2 = null;
            this.checkEject();
        }
    }

    public override hipBreak1(param1: number, param2: boolean = true) {
        super.hipBreak1(param1, param2);
        if (this.ejected) {
            return;
        }
        this.removeFromCOMArray(this.upperLeg1Body);
        this.removeFromCOMArray(this.lowerLeg1Body);
        if (this.upperLeg3Body) {
            this.COMArray.push(this.upperLeg3Body);
        }
    }

    public override hipBreak2(param1: number, param2: boolean = true) {
        super.hipBreak2(param1, param2);
        if (this.ejected) {
            return;
        }
        this.removeFromCOMArray(this.upperLeg2Body);
        this.removeFromCOMArray(this.lowerLeg2Body);
        if (this.upperLeg4Body) {
            this.COMArray.push(this.upperLeg4Body);
        }
    }

    public override kneeBreak1(param1: number) {
        super.kneeBreak1(param1);
        if (this.ejected) {
            return;
        }
        this.removeFromCOMArray(this.lowerLeg1Body);
    }

    public override kneeBreak2(param1: number) {
        super.kneeBreak2(param1);
        if (this.ejected) {
            return;
        }
        this.removeFromCOMArray(this.lowerLeg2Body);
    }

    public leanBackPose() {
        this.setJoint(this.neckJoint, 0, 10);
        this.setJoint(this.elbowJoint1, 2, 5);
        this.setJoint(this.elbowJoint2, 2, 5);
    }

    public leanForwardPose() {
        this.setJoint(this.neckJoint, 0.4, 10);
        this.setJoint(this.elbowJoint1, 0.5, 5);
        this.setJoint(this.elbowJoint2, 0.5, 5);
    }

    public lungePoseLeft() {
        this.setJoint(this.neckJoint, 0.5, 2);
        this.setJoint(this.hipJoint1, 3.5, 2);
        this.setJoint(this.hipJoint2, 0, 2);
        this.setJoint(this.kneeJoint1, 0, 10);
        this.setJoint(this.kneeJoint2, 2, 10);
        this.setJoint(this.shoulderJoint1, 3, 20);
        this.setJoint(this.shoulderJoint2, 1, 20);
        this.setJoint(this.elbowJoint1, 1.5, 15);
        this.setJoint(this.elbowJoint2, 3, 15);
    }

    public lungePoseRight() {
        this.setJoint(this.neckJoint, 0.5, 2);
        this.setJoint(this.hipJoint1, 0, 2);
        this.setJoint(this.hipJoint2, 3.5, 2);
        this.setJoint(this.kneeJoint1, 2, 10);
        this.setJoint(this.kneeJoint2, 0, 10);
        this.setJoint(this.shoulderJoint1, 1, 20);
        this.setJoint(this.shoulderJoint2, 3, 20);
        this.setJoint(this.elbowJoint1, 3, 15);
        this.setJoint(this.elbowJoint2, 1.5, 15);
    }
}