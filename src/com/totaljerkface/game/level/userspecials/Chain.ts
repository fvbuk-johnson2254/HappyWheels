import b2PolygonDef from "@/Box2D/Collision/Shapes/b2PolygonDef";
import b2PolygonShape from "@/Box2D/Collision/Shapes/b2PolygonShape";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2Body from "@/Box2D/Dynamics/b2Body";
import b2BodyDef from "@/Box2D/Dynamics/b2BodyDef";
import b2World from "@/Box2D/Dynamics/b2World";
import b2JointEdge from "@/Box2D/Dynamics/Joints/b2JointEdge";
import b2RevoluteJoint from "@/Box2D/Dynamics/Joints/b2RevoluteJoint";
import b2RevoluteJointDef from "@/Box2D/Dynamics/Joints/b2RevoluteJointDef";
import ChainRef from "@/com/totaljerkface/game/editor/specials/ChainRef";
import Special from "@/com/totaljerkface/game/editor/specials/Special";
import LevelB2D from "@/com/totaljerkface/game/level/LevelB2D";
import LevelItem from "@/com/totaljerkface/game/level/LevelItem";
import Trigger from "@/com/totaljerkface/game/level/Trigger";
import Settings from "@/com/totaljerkface/game/Settings";
import SoundController from "@/com/totaljerkface/game/sound/SoundController";
import link0MC from "@/top/link0MC";
import link1MC from "@/top/link1MC";
import { boundClass } from 'autobind-decorator';
import DisplayObject from "flash/display/DisplayObject";
import MovieClip from "flash/display/MovieClip";
import Sprite from "flash/display/Sprite";
import Point from "flash/geom/Point";

@boundClass
export default class Chain extends LevelItem {
    private static _chainCount: number;
    private _bodies: any[];
    private _points: any[];
    private _joints: any[];
    private _interactive: boolean;
    private _chainType: number;
    private mc: MovieClip;
    private refBody: b2Body;
    private _breakLimit: number = 100000;
    private _frameCounter: number = 0;
    private _checkAllJointsFrequency: number = 10;

    constructor(param1: Special, param2: b2Body = null, param3: Point = null) {
        super();
        var _loc4_: ChainRef = param1 as ChainRef;
        _loc4_ = _loc4_.clone() as ChainRef;
        this.createBodies(_loc4_);
        if (_loc4_.interactive) {
            this.createJoints(_loc4_);
        }
        var _loc5_: b2World = Settings.currentSession.m_world;
        _loc5_.DestroyBody(this.refBody);
        this._points = null;
        this.refBody = null;
    }

    private createBodies(param1: ChainRef) {
        var _loc2_: boolean = false;
        var _loc15_: number = NaN;
        var _loc16_: number = NaN;
        var _loc20_: number = NaN;
        var _loc24_: number = NaN;
        var _loc25_: number = NaN;
        var _loc26_: MovieClip = null;
        var _loc27_: number = NaN;
        var _loc28_: number = NaN;
        var _loc29_: b2BodyDef = null;
        var _loc30_: b2PolygonDef = null;
        var _loc31_: b2Vec2 = null;
        var _loc32_: b2Body = null;
        _loc2_ = param1.interactive;
        this._bodies = [];
        var _loc3_: number = 90;
        var _loc4_: number = 15;
        var _loc5_: number = 3;
        var _loc6_: LevelB2D = Settings.currentSession.level;
        var _loc7_: Sprite = _loc6_.background;
        var _loc8_: b2World = Settings.currentSession.m_world;
        var _loc9_: ChainRef = param1;
        this._frameCounter = Math.round(_loc9_.x + _loc9_.y) % 10;
        var _loc10_: number = 1 + ((_loc9_.linkScale - 1) / 9) * 2;
        var _loc11_: number = -(
            (_loc9_.linkAngle / 10) *
            (360 / (_loc9_.linkCount * 2))
        );
        var _loc12_: number = 180 / Math.PI;
        var _loc13_: number = _loc3_ / _loc12_;
        var _loc14_: number = _loc11_ / _loc12_;
        var _loc17_: any[] = [0, 0];
        this._points = [_loc17_];
        var _loc18_: number = (_loc4_ - _loc5_ * 2) * _loc10_;
        var _loc19_: number = _loc7_.numChildren;
        var _loc21_ = new b2BodyDef();
        _loc21_.position = new b2Vec2(
            _loc9_.x / this.m_physScale,
            _loc9_.y / this.m_physScale,
        );
        _loc21_.angle = _loc9_.rotation / _loc12_;
        this.refBody = _loc8_.CreateBody(_loc21_);
        var _loc22_: number = 0;
        while (_loc22_ < _loc9_.linkCount) {
            _loc15_ = _loc13_ + ((_loc22_ + 1) * _loc14_ - _loc14_ * 0.5);
            _loc16_ = _loc15_ * _loc12_;
            _loc24_ = Math.cos(_loc15_) * _loc18_;
            _loc25_ = Math.sin(_loc15_) * _loc18_;
            if (_loc22_ % 2 == 0) {
                _loc26_ = new link0MC();
                _loc7_.addChildAt(_loc26_, Math.max(0, _loc19_));
            } else {
                _loc26_ = new link1MC();
                _loc7_.addChildAt(_loc26_, _loc19_ + 1);
            }
            _loc27_ = (_loc10_ * _loc26_.height * 0.5) / this.m_physScale;
            _loc28_ = (_loc10_ * _loc26_.width * 0.5) / this.m_physScale;
            _loc26_.scaleX = _loc26_.scaleY = _loc10_;
            _loc19_ = _loc26_.parent.getChildIndex(_loc26_);
            _loc29_ = new b2BodyDef();
            if (_loc9_.sleeping) {
                _loc29_.isSleeping = true;
            }
            _loc30_ = new b2PolygonDef();
            _loc30_.density = 17;
            _loc30_.friction = 0.3;
            _loc30_.filter.categoryBits = 8;
            _loc30_.restitution = 0.1;
            _loc31_ = this.refBody.GetWorldPoint(
                new b2Vec2(
                    (_loc17_[0] + _loc24_ / 2) / this.m_physScale,
                    (_loc17_[1] + _loc25_ / 2) / this.m_physScale,
                ),
            );
            _loc29_.position = _loc31_;
            _loc29_.angle = this.refBody.GetAngle() + _loc15_ - 90 / _loc12_;
            _loc26_.rotation = _loc29_.angle * _loc12_;
            _loc26_.x = _loc31_.x * this.m_physScale;
            _loc26_.y = _loc31_.y * this.m_physScale;
            if (_loc2_) {
                _loc30_.SetAsBox(_loc28_, _loc27_);
                _loc32_ = _loc8_.CreateBody(_loc29_);
                this._bodies.push(_loc32_);
                _loc32_.CreateShape(_loc30_) as b2PolygonShape;
                _loc32_.SetMassFromShapes();
                if (_loc22_ == 0) {
                    _loc20_ = _loc32_.m_mass;
                } else {
                    _loc32_.m_mass = _loc20_;
                }
                _loc6_.paintBodyVector.push(_loc32_);
                _loc17_[0] += _loc24_;
                _loc17_[1] += _loc25_;
                this._points.push([_loc17_[0], _loc17_[1]]);
                _loc32_.SetUserData(_loc26_);
            } else {
                _loc17_[0] += _loc24_;
                _loc17_[1] += _loc25_;
            }
            _loc22_++;
        }
        if (!_loc2_) {
            return;
        }
        var _loc23_: number = _loc20_ / 0.5875199999999999;
        this._breakLimit *= _loc23_ * _loc23_;
        Settings.currentSession.level.actionsVector.push(this);
    }

    private createJoints(param1: ChainRef) {
        var _loc3_: b2Body = null;
        var _loc4_: b2Body = null;
        var _loc5_: any[] = null;
        var _loc6_: b2Vec2 = null;
        var _loc7_: b2Vec2 = null;
        var _loc8_: b2Vec2 = null;
        var _loc9_: b2RevoluteJointDef = null;
        var _loc10_: b2RevoluteJoint = null;
        this._joints = new Array();
        var _loc2_: number = 1;
        while (_loc2_ < this._bodies.length) {
            _loc3_ = this._bodies[_loc2_ - 1];
            _loc4_ = this._bodies[_loc2_];
            _loc5_ = this._points[_loc2_];
            _loc6_ = this.refBody.GetWorldPoint(
                new b2Vec2(
                    _loc5_[0] / this.m_physScale,
                    _loc5_[1] / this.m_physScale,
                ),
            );
            _loc7_ = _loc3_.GetLocalPoint(_loc6_);
            _loc8_ = _loc4_.GetLocalPoint(_loc6_);
            _loc9_ = new b2RevoluteJointDef();
            _loc9_.body1 = _loc3_;
            _loc9_.body2 = _loc4_;
            _loc9_.localAnchor1 = _loc7_;
            _loc9_.localAnchor2 = _loc8_;
            _loc10_ = Settings.currentSession.m_world.CreateJoint(
                _loc9_,
            ) as b2RevoluteJoint;
            this._joints.push(_loc10_);
            _loc2_++;
        }
    }

    private breakJoint(param1: b2RevoluteJoint) {
        var _loc2_: MovieClip = param1.GetBody1().GetUserData() as MovieClip;
        var _loc3_: MovieClip = param1.GetBody2().GetUserData() as MovieClip;
        var _loc4_: b2Body = param1.GetBody1();
        var _loc5_: b2Body = param1.GetBody2();
        var _loc6_: b2Vec2 = _loc4_.GetLocalPoint(param1.GetAnchor1());
        var _loc7_: b2Vec2 = _loc5_.GetLocalPoint(param1.GetAnchor2());
        this.showBrokenLink(_loc6_, _loc2_);
        this.showBrokenLink(_loc7_, _loc3_);
        param1.broken = true;
        Settings.currentSession.m_world.DestroyJoint(param1);
        var _loc8_: number = Math.ceil(Math.random() * 3);
        SoundController.instance.playAreaSoundInstance(
            "ChainBreak" + _loc8_,
            _loc4_,
        );
    }

    private showBrokenLink(param1: b2Vec2, param2: MovieClip) {
        if (param1.y > 0) {
            param2.scaleY *= -1;
        }
        var _loc3_: number = 1 + Math.ceil(Math.random() * 3);
        param2.gotoAndStop(_loc3_);
    }

    public override actions() {
        var _loc2_: number = 0;
        var _loc3_: b2RevoluteJoint = null;
        var _loc4_: b2Vec2 = null;
        var _loc5_: number = NaN;
        var _loc6_ = undefined;
        var _loc7_ = undefined;
        var _loc8_: number = NaN;
        var _loc9_: number = NaN;
        var _loc10_: number = NaN;
        var _loc1_: number = this._breakLimit;
        if (++this._frameCounter > this._checkAllJointsFrequency) {
            this._frameCounter = 0;
            _loc2_ = 0;
            while (_loc2_ < this._joints.length) {
                _loc3_ = this._joints[_loc2_];
                if (!_loc3_.broken) {
                    _loc4_ = _loc3_.GetReactionForce();
                    _loc5_ = _loc4_.LengthSquared();
                    if (_loc5_ > _loc1_) {
                        this.breakJoint(_loc3_);
                        return;
                    }
                    _loc6_ = _loc3_.GetAnchor1();
                    _loc7_ = _loc3_.GetAnchor2();
                    _loc8_ = _loc7_.x - _loc6_.x;
                    _loc9_ = _loc7_.y - _loc6_.y;
                    _loc10_ = _loc8_ * _loc8_ + _loc9_ * _loc9_;
                    if (_loc10_ > 0.15) {
                        this.breakJoint(_loc3_);
                    }
                }
                _loc2_++;
            }
        }
    }

    public override die() {
        super.die();
    }

    public override get groupDisplayObject(): DisplayObject {
        return this.mc;
    }

    public override getJointBody(param1: b2Vec2 = null): b2Body {
        var _loc3_: b2Body = null;
        var _loc5_: b2Body = null;
        var _loc6_: b2Vec2 = null;
        var _loc7_: b2Vec2 = null;
        var _loc8_ = undefined;
        var _loc9_: number = 0;
        var _loc10_: b2JointEdge = null;
        var _loc2_: number = 10000000;
        var _loc4_: number = 0;
        while (_loc4_ < this._bodies.length) {
            _loc5_ = this._bodies[_loc4_];
            _loc6_ = _loc5_.GetWorldCenter();
            _loc7_ = new b2Vec2(param1.x - _loc6_.x, param1.y - _loc6_.y);
            _loc8_ = _loc7_.x * _loc7_.x + _loc7_.y * _loc7_.y;
            if (_loc8_ < _loc2_) {
                _loc9_ = 0;
                _loc10_ = _loc5_.m_jointList;
                while (_loc10_) {
                    _loc9_ += 1;
                    _loc10_ = _loc10_.next;
                }
                _loc2_ = _loc8_;
                _loc3_ = _loc5_;
            }
            _loc4_++;
        }
        return _loc3_;
    }

    public override triggerSingleActivation(
        param1: Trigger,
        param2: string,
        param3: any[],
    ) {
        var _loc4_: b2Body = null;
        var _loc5_: number = NaN;
        var _loc6_: number = NaN;
        var _loc7_: number = 0;
        var _loc8_: number = 0;
        var _loc9_: number = NaN;
        if (param2 == "wake from sleep") {
            if (this._bodies[0]) {
                _loc4_ = this._bodies[0];
                _loc4_.WakeUp();
            }
        } else if (param2 == "apply impulse") {
            _loc5_ = Number(param3[0]);
            _loc6_ = Number(param3[1]);
            if (this._bodies[0]) {
                _loc7_ = int(this._bodies.length);
                _loc8_ = 0;
                while (_loc8_ < _loc7_) {
                    _loc4_ = this._bodies[_loc8_];
                    _loc9_ = _loc4_.GetMass();
                    _loc4_.ApplyImpulse(
                        new b2Vec2(_loc5_ * _loc9_, _loc6_ * _loc9_),
                        _loc4_.GetWorldCenter(),
                    );
                    _loc8_++;
                }
            }
        }
    }

    public override get bodyList(): any[] {
        return this._bodies;
    }
}