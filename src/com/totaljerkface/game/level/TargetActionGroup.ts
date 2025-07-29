import b2MassData from "@/Box2D/Collision/Shapes/b2MassData";
import b2Shape from "@/Box2D/Collision/Shapes/b2Shape";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2Body from "@/Box2D/Dynamics/b2Body";
import b2World from "@/Box2D/Dynamics/b2World";
import b2JointEdge from "@/Box2D/Dynamics/Joints/b2JointEdge";
import RefSprite from "@/com/totaljerkface/game/editor/RefSprite";
import LevelB2D from "@/com/totaljerkface/game/level/LevelB2D";
import LevelItem from "@/com/totaljerkface/game/level/LevelItem";
import Settings from "@/com/totaljerkface/game/Settings";
import { boundClass } from 'autobind-decorator';
import Sprite from "flash/display/Sprite";

@boundClass
export default class TargetActionGroup extends LevelItem {
    protected _refSprite: RefSprite;
    protected _body: b2Body;
    protected _sprite: Sprite;
    protected _action: string;
    protected _properties: any[];
    protected _instant: boolean;
    protected counter: number = 0;

    constructor(
        param1: RefSprite,
        param2: b2Body,
        param3: Sprite,
        param4: string,
        param5: any[],
    ) {
        super();
        this._refSprite = param1;
        this._body = param2;
        this._sprite = param3;
        this._action = param4;
        this._instant = param4 == "change opacity" ? false : true;
        this._properties = param5;
    }

    public override singleAction() {
        var _loc2_: number = 0;
        var _loc3_: number = NaN;
        var _loc4_: number = NaN;
        var _loc5_: number = NaN;
        var _loc6_: number = NaN;
        var _loc7_: number = NaN;
        var _loc8_: b2Vec2 = null;
        var _loc9_: b2MassData = null;
        var _loc10_: LevelB2D = null;
        var _loc11_: b2JointEdge = null;
        var _loc12_: b2World = null;
        var _loc13_: boolean = false;
        var _loc14_: b2Shape = null;
        trace("ACTION GROUP " + this._action);
        var _loc1_: number = Settings.currentSession.levelVersion;
        switch (this._action) {
            case "wake from sleep":
                if (this._body) {
                    this._body.WakeUp();
                }
                break;
            case "apply impulse":
                if (this._body) {
                    _loc3_ = this._body.m_mass;
                    if (_loc3_ > 0) {
                        _loc4_ = Number(this._properties[0]);
                        _loc5_ = Number(this._properties[1]);
                        trace("impulse " + _loc4_ + ", " + _loc5_);
                        _loc6_ = Number(this._properties[2]);
                        this._body.ApplyImpulse(
                            new b2Vec2(_loc4_ * _loc3_, _loc5_ * _loc3_),
                            this._body.GetWorldCenter(),
                        );
                        if (_loc6_) {
                            _loc7_ = this._body.GetAngularVelocity();
                            this._body.SetAngularVelocity(_loc7_ + _loc6_);
                        }
                    }
                }
                break;
            case "set to fixed":
                if (this._body) {
                    if (this._body.m_mass > 0) {
                        _loc8_ = this._body.GetWorldCenter();
                        trace("center " + _loc8_.x + ", " + _loc8_.y);
                        this._body.m_userData.x = _loc8_.x * this.m_physScale;
                        this._body.m_userData.y = _loc8_.y * this.m_physScale;
                        this._body.m_userData.rotation =
                            (this._body.GetAngle() * (180 / Math.PI)) % 360;
                        _loc9_ = new b2MassData();
                        _loc9_.center = new b2Vec2();
                        _loc9_.mass = 0;
                        _loc9_.I = 0;
                        this._body.SetMass(_loc9_);
                        this._body.SetLinearVelocity(new b2Vec2());
                        this._body.SetAngularVelocity(0);
                        _loc10_ = Settings.currentSession.level;
                        _loc10_.removeFromPaintBodyVector(this._body);
                        if (_loc1_ > 1.84) {
                            _loc12_ = Settings.currentSession.m_world;
                            _loc14_ = this._body.GetShapeList();
                            while (_loc14_) {
                                if (_loc14_.m_material == 8) {
                                    if (_loc14_.m_filter.categoryBits == 8) {
                                        _loc14_.m_filter.categoryBits = 24;
                                        if (_loc14_.m_filter.maskBits == 8) {
                                            _loc14_.m_filter.maskBits = 56;
                                        } else if (
                                            _loc14_.m_filter.groupIndex == 0
                                        ) {
                                            _loc14_.m_filter.groupIndex = -10;
                                        }
                                    } else if (
                                        _loc14_.m_filter.categoryBits == 16
                                    ) {
                                        _loc14_.m_filter.maskBits = 48;
                                        _loc14_.m_filter.groupIndex = 0;
                                    } else if (
                                        _loc14_.m_filter.categoryBits == 32
                                    ) {
                                        _loc14_.m_filter.categoryBits = 48;
                                    }
                                    _loc12_.Refilter(_loc14_);
                                }
                                _loc14_ = _loc14_.m_next;
                            }
                        }
                        _loc11_ = this._body.GetJointList();
                        while (_loc11_) {
                            if (
                                _loc11_.other.m_I == 0 &&
                                _loc11_.other.m_mass != 0
                            ) {
                                _loc12_.DestroyJoint(_loc11_.joint);
                            }
                            _loc11_ = _loc11_.next;
                        }
                    }
                }
                break;
            case "set to non fixed":
                if (this._body) {
                    if (this._body.m_mass == 0) {
                        this._body.SetMassFromShapes();
                        this._body.WakeUp();
                        _loc10_ = Settings.currentSession.level;
                        _loc10_.paintBodyVector.push(this._body);
                        if (_loc1_ > 1.84) {
                            _loc12_ = Settings.currentSession.m_world;
                            _loc14_ = this._body.GetShapeList();
                            while (_loc14_) {
                                if (_loc14_.m_filter.categoryBits == 24) {
                                    _loc14_.m_filter.categoryBits = 8;
                                    if (_loc14_.m_filter.maskBits == 56) {
                                        _loc14_.m_filter.maskBits = 8;
                                    } else if (
                                        _loc14_.m_filter.groupIndex == -10
                                    ) {
                                        _loc14_.m_filter.groupIndex = 0;
                                    }
                                } else if (
                                    _loc14_.m_filter.categoryBits == 16
                                ) {
                                    _loc14_.m_filter.maskBits = 16;
                                    _loc14_.m_filter.groupIndex = -322;
                                } else if (
                                    _loc14_.m_filter.categoryBits == 48
                                ) {
                                    _loc14_.m_filter.categoryBits = 32;
                                }
                                _loc12_.Refilter(_loc14_);
                                _loc14_ = _loc14_.m_next;
                            }
                        }
                    }
                }
                break;
            case "delete shapes":
                if (this._body) {
                    _loc10_ = Settings.currentSession.level;
                    _loc12_ = Settings.currentSession.m_world;
                    _loc12_.DestroyBody(this._body);
                    _loc10_.removeFromPaintBodyVector(this._body);
                    this._body = null;
                    _loc10_.updateTargetActionGroupsFor(
                        this._refSprite,
                        this._body,
                        this._sprite,
                    );
                }
                break;
            case "delete self":
                _loc10_ = Settings.currentSession.level;
                if (this._body) {
                    _loc12_ = Settings.currentSession.m_world;
                    _loc12_.DestroyBody(this._body);
                    _loc10_.removeFromPaintBodyVector(this._body);
                    this._body = null;
                    _loc10_.updateTargetActionGroupsFor(
                        this._refSprite,
                        this._body,
                        this._sprite,
                    );
                }
                if (this._sprite.parent) {
                    this._sprite.parent.removeChild(this._sprite);
                }
                _loc10_.updateTargetActionGroupsFor(
                    this._refSprite,
                    this._body,
                    this._sprite,
                );
                break;
            case "change collision":
                _loc10_ = Settings.currentSession.level;
                _loc2_ = int(this._properties[0]);
                if (this._body) {
                    _loc13_ = this._body.m_mass == 0 ? true : false;
                    _loc14_ = this._body.GetShapeList();
                    while (_loc14_) {
                        if (_loc14_.m_material == 8) {
                            if (_loc2_ == 2) {
                                _loc14_.m_filter.categoryBits = 8;
                                _loc14_.m_filter.maskBits = 8;
                                _loc14_.m_filter.groupIndex = 0;
                                if (_loc1_ > 1.84 && _loc13_) {
                                    _loc14_.m_filter.categoryBits = 24;
                                    _loc14_.m_filter.maskBits = 56;
                                }
                            } else if (_loc2_ == 3) {
                                if (_loc1_ < 1.82) {
                                    _loc14_.m_filter.categoryBits = 1;
                                    _loc14_.m_filter.maskBits = 1;
                                    _loc14_.m_filter.groupIndex = -10;
                                } else {
                                    _loc14_.m_filter.categoryBits = 0;
                                    _loc14_.m_filter.maskBits = 0;
                                    _loc14_.m_filter.groupIndex = 0;
                                }
                            } else if (_loc2_ == 4) {
                                _loc14_.m_filter.categoryBits = 8;
                                _loc14_.m_filter.maskBits = 65535;
                                _loc14_.m_filter.groupIndex = -321;
                                if (_loc1_ > 1.84 && _loc13_) {
                                    _loc14_.m_filter.categoryBits = 24;
                                }
                            } else if (_loc2_ == 5) {
                                _loc14_.m_filter.categoryBits = 16;
                                _loc14_.m_filter.maskBits = 16;
                                _loc14_.m_filter.groupIndex = -322;
                                if (_loc1_ > 1.84 && _loc13_) {
                                    _loc14_.m_filter.maskBits = 48;
                                    _loc14_.m_filter.groupIndex = 0;
                                }
                            } else if (_loc2_ == 6) {
                                _loc14_.m_filter.categoryBits = 16;
                                _loc14_.m_filter.maskBits = 16;
                                _loc14_.m_filter.groupIndex = 0;
                                if (_loc1_ > 1.84) {
                                    _loc14_.m_filter.categoryBits = _loc13_
                                        ? 48
                                        : 32;
                                    _loc14_.m_filter.maskBits = 48;
                                }
                            } else if (_loc2_ == 7) {
                                _loc14_.m_filter.categoryBits = 15;
                                _loc14_.m_filter.maskBits = 3840;
                                _loc14_.m_filter.groupIndex = 0;
                            } else {
                                _loc14_.m_filter.categoryBits = 8;
                                _loc14_.m_filter.maskBits = 65535;
                                if (_loc13_) {
                                    _loc14_.m_filter.categoryBits = 24;
                                    _loc14_.m_filter.groupIndex = -10;
                                }
                            }
                            _loc14_.m_isSensor =
                                _loc2_ == 3 && _loc1_ < 1.82 ? true : false;
                            Settings.currentSession.m_world.Refilter(_loc14_);
                        }
                        _loc14_ = _loc14_.m_next;
                    }
                    _loc10_.updateTargetActionGroupsFor(
                        this._refSprite,
                        this._body,
                        this._sprite,
                    );
                }
        }
    }

    public override actions() {
        var _loc1_: number = NaN;
        var _loc2_: number = NaN;
        var _loc3_: number = NaN;
        var _loc4_: number = NaN;
        switch (this._action) {
            case "change opacity":
                _loc1_ = Number(this._properties[0]);
                _loc2_ = Number(this._properties[1]);
                _loc1_ *= 0.01;
                _loc2_ = Math.round(_loc2_ * 30);
                if (this.counter == _loc2_) {
                    if (Settings.currentSession.levelVersion > 1.8) {
                        this.counter = 0;
                    }
                    this._sprite.visible = _loc1_ == 0 ? false : true;
                    this._sprite.alpha = _loc1_;
                    Settings.currentSession.level.removeFromActionsVector(this);
                    return;
                }
                _loc3_ = this._sprite.alpha;
                _loc4_ = _loc1_ - _loc3_;
                this._sprite.alpha = _loc3_ + _loc4_ / (_loc2_ - this.counter);
                this._sprite.visible = this._sprite.alpha == 0 ? false : true;
                break;
        }
        this.counter += 1;
    }

    public get body(): b2Body {
        return this._body;
    }

    public set body(param1: b2Body) {
        this._body = param1;
    }

    public get sprite(): Sprite {
        return this._sprite;
    }

    public set sprite(param1: Sprite) {
        this._sprite = param1;
    }

    public get instant(): boolean {
        return this._instant;
    }
}