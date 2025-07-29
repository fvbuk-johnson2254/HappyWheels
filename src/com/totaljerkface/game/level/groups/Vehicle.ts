import b2Shape from "@/Box2D/Collision/Shapes/b2Shape";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2Body from "@/Box2D/Dynamics/b2Body";
import b2Joint from "@/Box2D/Dynamics/Joints/b2Joint";
import b2PrismaticJoint from "@/Box2D/Dynamics/Joints/b2PrismaticJoint";
import b2RevoluteJoint from "@/Box2D/Dynamics/Joints/b2RevoluteJoint";
import CharacterB2D from "@/com/totaljerkface/game/character/CharacterB2D";
import RefVehicle from "@/com/totaljerkface/game/editor/RefVehicle";
import KeyDisplay from "@/com/totaljerkface/game/KeyDisplay";
import LevelItem from "@/com/totaljerkface/game/level/LevelItem";
import ArrowGun from "@/com/totaljerkface/game/level/userspecials/ArrowGun";
import Jet from "@/com/totaljerkface/game/level/userspecials/Jet";
import Settings from "@/com/totaljerkface/game/Settings";
import { boundClass } from 'autobind-decorator';

@boundClass
export default class Vehicle extends LevelItem {
    protected static oneEightyOverPI: number;
    protected maxSpinAV: number = 3.5;
    protected impulseOffset: number = 1;
    protected leanImpulse: number;
    protected _body: b2Body;
    protected acceleration: number;
    protected leaningStrength: number;
    protected spaceAction: number = 0;
    protected shiftAction: number = 0;
    protected ctrlAction: number = 0;
    protected lockJoints: boolean;
    protected _characterPose: number = 0;
    protected jets: any[];
    protected jetsFiring: boolean;
    protected arrowGuns: any[];
    protected arrowsFiring: boolean;
    protected joints: any[];
    protected jointMotorSpeeds: any[];
    protected jointAccels: any[];
    protected _arm1Joint: b2RevoluteJoint;
    protected _arm2Joint: b2RevoluteJoint;
    protected characters: any[];
    protected vehicles: any[];
    protected lastIteration: number;
    protected slowAfterEject: boolean;

    constructor(param1: RefVehicle, param2: b2Body) {
        super();
        this._body = param2;
        this.acceleration = param1.acceleration;
        this.leaningStrength = param1.leaningStrength;
        this.spaceAction = param1.spaceAction;
        this.shiftAction = param1.shiftAction;
        this.ctrlAction = param1.ctrlAction;
        this.lockJoints = param1.lockJoints;
        this._characterPose = param1.characterPose;
        this.joints = new Array();
        this.jointMotorSpeeds = new Array();
        this.jointAccels = new Array();
        this.jets = new Array();
        this.arrowGuns = new Array();
        this.characters = new Array();
        this.vehicles = new Array();
        this.lastIteration = -1;
    }

    public setShitUp() {
        var _loc1_: number = this._body.GetMass();
        this.leanImpulse = _loc1_ * (this.leaningStrength * 0.1);
    }

    public addHandle(param1: b2Shape) {
        param1.SetUserData(this);
    }

    public checkAddSpecial(param1: LevelItem) {
        var _loc2_: Jet = null;
        var _loc3_: ArrowGun = null;
        if (param1 instanceof Jet) {
            _loc2_ = param1 as Jet;
            if (this.jets.indexOf(_loc2_) < 0) {
                _loc2_.firingAllowed = false;
                this.jets.push(_loc2_);
            }
        } else if (param1 instanceof ArrowGun) {
            _loc3_ = param1 as ArrowGun;
            if (this.arrowGuns.indexOf(_loc3_) < 0) {
                _loc3_.firingAllowed = false;
                _loc3_.unlimitedArrows = true;
                this.arrowGuns.push(_loc3_);
            }
        }
    }

    public checkAddVehicle(param1: Vehicle) {
        var _loc2_ = int(this.vehicles.indexOf(param1));
        if (_loc2_ < 0) {
            this.vehicles.push(param1);
            param1.checkAddVehicle(this);
        }
    }

    public addJoint(param1: b2Joint) {
        var _loc3_: b2RevoluteJoint = null;
        var _loc4_: number = NaN;
        var _loc5_: Vector<LevelItem> = null;
        var _loc6_: b2PrismaticJoint = null;
        this.joints.push(param1);
        var _loc2_ = int(this.joints.length - 1);
        if (param1 instanceof b2RevoluteJoint) {
            _loc3_ = param1 as b2RevoluteJoint;
            if (_loc3_.IsMotorEnabled()) {
                _loc4_ = _loc3_.GetMotorSpeed();
                this.jointMotorSpeeds[_loc2_] = _loc4_;
                this.jointAccels[_loc2_] =
                    this.acceleration < 10
                        ? Math.abs(_loc4_ / (100 - this.acceleration * 10))
                        : Math.abs(_loc4_);
                if (this.lockJoints) {
                    this.slowAfterEject = true;
                    _loc5_ = Settings.currentSession.level.actionsVector;
                    if (_loc5_.indexOf(this) < 0) {
                        _loc5_.push(this);
                    }
                }
            } else {
                this.jointMotorSpeeds[_loc2_] = null;
            }
            _loc3_.EnableMotor(false);
        } else {
            _loc6_ = param1 as b2PrismaticJoint;
            if (_loc6_.IsMotorEnabled()) {
                _loc4_ = _loc6_.GetMotorSpeed();
                this.jointMotorSpeeds[_loc2_] = _loc4_;
                this.jointAccels[_loc2_] =
                    this.acceleration < 10
                        ? Math.abs(_loc4_ / (100 - this.acceleration * 10))
                        : Math.abs(_loc4_);
                if (this.lockJoints) {
                    this.slowAfterEject = true;
                    _loc5_ = Settings.currentSession.level.actionsVector;
                    if (_loc5_.indexOf(this) < 0) {
                        _loc5_.push(this);
                    }
                }
            } else {
                this.jointMotorSpeeds[_loc2_] = null;
            }
            _loc6_.EnableMotor(false);
        }
    }

    public set arm1Joint(param1: b2RevoluteJoint) {
        this._arm1Joint = param1;
    }

    public set arm2Joint(param1: b2RevoluteJoint) {
        this._arm2Joint = param1;
    }

    public operateKeys(
        param1: number,
        param2: boolean,
        param3: boolean,
        param4: boolean,
        param5: boolean,
        param6: boolean,
        param7: boolean,
        param8: boolean,
        param9: boolean,
    ): string {
        var _loc13_: number = 0;
        var _loc14_: Vehicle = null;
        var _loc10_ = "";
        if (param1 <= this.lastIteration) {
            return _loc10_;
        }
        this.lastIteration = param1;
        var _loc11_: any[] = [0, 0, 0, 0];
        if (param2) {
            if (param3) {
                this.leftAndRightActions();
                _loc10_ += "11";
            } else {
                this.leftPressedActions();
                _loc10_ += "10";
            }
        } else if (param3) {
            this.rightPressedActions();
            _loc10_ += "01";
        } else {
            this.leftAndRightActions();
            _loc10_ += "00";
        }
        if (param4) {
            if (param5) {
                this.upAndDownActions();
                _loc10_ += "11";
            } else {
                this.upPressedActions();
                _loc10_ += "10";
            }
        } else if (param5) {
            this.downPressedActions();
            _loc10_ += "01";
        } else {
            this.upAndDownActions();
            _loc10_ += "00";
        }
        if (param6) {
            _loc13_ = int(_loc11_[this.spaceAction]);
            _loc11_[this.spaceAction] = _loc13_ + 1;
            _loc10_ += "1";
        } else {
            _loc10_ += "0";
        }
        if (param7) {
            _loc13_ = int(_loc11_[this.shiftAction]);
            _loc11_[this.shiftAction] = _loc13_ + 1;
            _loc10_ += "1";
        } else {
            _loc10_ += "0";
        }
        if (param8) {
            _loc13_ = int(_loc11_[this.shiftAction]);
            _loc11_[this.ctrlAction] = _loc13_ + 1;
            _loc10_ += "1";
        } else {
            _loc10_ += "0";
        }
        _loc13_ = int(_loc11_[1]);
        if (_loc13_ > 0) {
            this.brake();
        }
        _loc13_ = int(_loc11_[2]);
        if (_loc13_ > 0) {
            this.fireJets();
        } else {
            this.stopJets();
        }
        _loc13_ = int(_loc11_[3]);
        if (_loc13_ > 0) {
            this.fireArrows();
        } else {
            this.stopArrows();
        }
        var _loc12_: number = 0;
        while (_loc12_ < this.vehicles.length) {
            _loc14_ = this.vehicles[_loc12_];
            _loc14_.operateKeys(
                param1,
                param2,
                param3,
                param4,
                param5,
                param6,
                param7,
                param8,
                param9,
            );
            _loc12_++;
        }
        if (param9) {
            this.zPressedActions();
            _loc10_ += "1";
        } else {
            _loc10_ += "0";
        }
        return _loc10_;
    }

    public operateReplayData(
        param1: number,
        param2: string,
        param3: KeyDisplay = null,
    ) {
        var _loc6_: number = 0;
        var _loc7_: Vehicle = null;
        if (param1 <= this.lastIteration) {
            return;
        }
        this.lastIteration = param1;
        var _loc4_: any[] = [0, 0, 0, 0];
        if (param3) {
            if (param2.charAt(0) == "1") {
                if (param2.charAt(1) == "1") {
                    this.leftAndRightActions();
                    param3.leftKeyON();
                    param3.rightKeyON();
                } else {
                    this.leftPressedActions();
                    param3.leftKeyON();
                    param3.rightKeyOFF();
                }
            } else if (param2.charAt(1) == "1") {
                this.rightPressedActions();
                param3.leftKeyOFF();
                param3.rightKeyON();
            } else {
                this.leftAndRightActions();
                param3.rightKeyOFF();
                param3.leftKeyOFF();
            }
            if (param2.charAt(2) == "1") {
                if (param2.charAt(3) == "1") {
                    this.upAndDownActions();
                    param3.upKeyON();
                    param3.downKeyON();
                } else {
                    this.upPressedActions();
                    param3.upKeyON();
                    param3.downKeyOFF();
                }
            } else if (param2.charAt(3) == "1") {
                this.downPressedActions();
                param3.upKeyOFF();
                param3.downKeyON();
            } else {
                this.upAndDownActions();
                param3.upKeyOFF();
                param3.downKeyOFF();
            }
            if (param2.charAt(4) == "1") {
                _loc6_ = int(_loc4_[this.spaceAction]);
                _loc4_[this.spaceAction] = _loc6_ + 1;
                param3.spaceKeyON();
            } else {
                param3.spaceKeyOFF();
            }
            if (param2.charAt(5) == "1") {
                _loc6_ = int(_loc4_[this.shiftAction]);
                _loc4_[this.shiftAction] = _loc6_ + 1;
                param3.shiftKeyON();
            } else {
                param3.shiftKeyOFF();
            }
            if (param2.charAt(6) == "1") {
                _loc6_ = int(_loc4_[this.shiftAction]);
                _loc4_[this.ctrlAction] = _loc6_ + 1;
                param3.ctrlKeyON();
            } else {
                param3.ctrlKeyOFF();
            }
            if (param2.charAt(7) == "1") {
                this.zPressedActions();
                param3.zKeyON();
            } else {
                param3.zKeyOFF();
            }
        } else {
            if (param2.charAt(0) == "1") {
                if (param2.charAt(1) == "1") {
                    this.leftAndRightActions();
                } else {
                    this.leftPressedActions();
                }
            } else if (param2.charAt(1) == "1") {
                this.rightPressedActions();
            } else {
                this.leftAndRightActions();
            }
            if (param2.charAt(2) == "1") {
                if (param2.charAt(3) == "1") {
                    this.upAndDownActions();
                } else {
                    this.upPressedActions();
                }
            } else if (param2.charAt(3) == "1") {
                this.downPressedActions();
            } else {
                this.upAndDownActions();
            }
            if (param2.charAt(4) == "1") {
                _loc6_ = int(_loc4_[this.spaceAction]);
                _loc4_[this.spaceAction] = _loc6_ + 1;
            }
            if (param2.charAt(5) == "1") {
                _loc6_ = int(_loc4_[this.shiftAction]);
                _loc4_[this.shiftAction] = _loc6_ + 1;
            }
            if (param2.charAt(6) == "1") {
                _loc6_ = int(_loc4_[this.shiftAction]);
                _loc4_[this.ctrlAction] = _loc6_ + 1;
            }
            if (param2.charAt(7) == "1") {
                this.zPressedActions();
            }
        }
        _loc6_ = int(_loc4_[1]);
        if (_loc6_ > 0) {
            this.brake();
        }
        _loc6_ = int(_loc4_[2]);
        if (_loc6_ > 0) {
            this.fireJets();
        } else {
            this.stopJets();
        }
        _loc6_ = int(_loc4_[3]);
        if (_loc6_ > 0) {
            this.fireArrows();
        } else {
            this.stopArrows();
        }
        var _loc5_: number = 0;
        while (_loc5_ < this.vehicles.length) {
            _loc7_ = this.vehicles[_loc5_];
            _loc7_.operateReplayData(param1, param2, param3);
            _loc5_++;
        }
    }

    private leftPressedActions() {
        var _loc1_: number = NaN;
        var _loc2_: number = NaN;
        var _loc3_: number = NaN;
        var _loc4_: number = NaN;
        var _loc5_: number = NaN;
        var _loc6_: b2Vec2 = null;
        if (this.leaningStrength > 0) {
            _loc1_ = this._body.GetAngle();
            _loc2_ = this._body.GetAngularVelocity();
            _loc3_ = (_loc2_ + this.maxSpinAV) / this.maxSpinAV;
            if (_loc3_ < 0) {
                _loc3_ = 0;
            }
            if (_loc3_ > 1) {
                _loc3_ = 1;
            }
            _loc4_ = Math.cos(_loc1_) * this.leanImpulse * _loc3_;
            _loc5_ = Math.sin(_loc1_) * this.leanImpulse * _loc3_;
            _loc6_ = this._body.GetLocalCenter();
            this._body.ApplyImpulse(
                new b2Vec2(_loc5_, -_loc4_),
                this._body.GetWorldPoint(
                    new b2Vec2(_loc6_.x + this.impulseOffset, _loc6_.y),
                ),
            );
            this._body.ApplyImpulse(
                new b2Vec2(-_loc5_, _loc4_),
                this._body.GetWorldPoint(
                    new b2Vec2(_loc6_.x - this.impulseOffset, _loc6_.y),
                ),
            );
        }
    }

    private rightPressedActions() {
        var _loc1_: number = NaN;
        var _loc2_: number = NaN;
        var _loc3_: number = NaN;
        var _loc4_: number = NaN;
        var _loc5_: number = NaN;
        var _loc6_: b2Vec2 = null;
        if (this.leaningStrength > 0) {
            _loc1_ = this._body.GetAngle();
            _loc2_ = this._body.GetAngularVelocity();
            _loc3_ = (_loc2_ - this.maxSpinAV) / -this.maxSpinAV;
            if (_loc3_ < 0) {
                _loc3_ = 0;
            }
            if (_loc3_ > 1) {
                _loc3_ = 1;
            }
            _loc4_ = Math.cos(_loc1_) * this.leanImpulse * _loc3_;
            _loc5_ = Math.sin(_loc1_) * this.leanImpulse * _loc3_;
            _loc6_ = this._body.GetLocalCenter();
            this._body.ApplyImpulse(
                new b2Vec2(-_loc5_, _loc4_),
                this._body.GetWorldPoint(
                    new b2Vec2(_loc6_.x + this.impulseOffset, _loc6_.y),
                ),
            );
            this._body.ApplyImpulse(
                new b2Vec2(_loc5_, -_loc4_),
                this._body.GetWorldPoint(
                    new b2Vec2(_loc6_.x - this.impulseOffset, _loc6_.y),
                ),
            );
        }
    }

    private leftAndRightActions() { }

    private upPressedActions() {
        var _loc2_: b2Joint = null;
        var _loc3_: b2RevoluteJoint = null;
        var _loc4_: number = NaN;
        var _loc5_: number = NaN;
        var _loc6_: number = NaN;
        var _loc7_: b2PrismaticJoint = null;
        var _loc8_: number = NaN;
        var _loc1_: number = 0;
        while (_loc1_ < this.joints.length) {
            _loc2_ = this.joints[_loc1_];
            if (_loc2_ instanceof b2RevoluteJoint) {
                _loc3_ = _loc2_ as b2RevoluteJoint;
                if (this.jointMotorSpeeds[_loc1_]) {
                    _loc4_ = Number(this.jointMotorSpeeds[_loc1_]);
                    if (_loc4_ >= 0) {
                        _loc5_ = this.handlePositiveSpeed(
                            _loc3_,
                            _loc4_,
                            _loc1_,
                        );
                    } else {
                        _loc5_ = this.handleNegativeSpeed(
                            _loc3_,
                            _loc4_,
                            _loc1_,
                        );
                    }
                    if (_loc3_.IsLimitEnabled()) {
                        _loc6_ = _loc3_.GetJointAngle();
                        if (_loc6_ > _loc3_.m_upperAngle && _loc5_ > 0) {
                            _loc3_.SetMotorSpeed(0);
                        }
                        if (_loc6_ < _loc3_.m_lowerAngle && _loc5_ < 0) {
                            _loc3_.SetMotorSpeed(0);
                        }
                    }
                }
            } else {
                _loc7_ = _loc2_ as b2PrismaticJoint;
                if (this.jointMotorSpeeds[_loc1_]) {
                    _loc4_ = Number(this.jointMotorSpeeds[_loc1_]);
                    if (_loc4_ >= 0) {
                        _loc5_ = this.handlePositiveSpeedPris(
                            _loc7_,
                            _loc4_,
                            _loc1_,
                        );
                    } else {
                        _loc5_ = this.handleNegativeSpeedPris(
                            _loc7_,
                            _loc4_,
                            _loc1_,
                        );
                    }
                    if (_loc7_.IsLimitEnabled()) {
                        _loc8_ = _loc7_.GetJointTranslation();
                        if (_loc8_ > _loc7_.m_upperTranslation && _loc5_ > 0) {
                            _loc7_.SetMotorSpeed(0);
                        }
                        if (_loc8_ < _loc7_.m_lowerTranslation && _loc5_ < 0) {
                            _loc7_.SetMotorSpeed(0);
                        }
                    }
                }
            }
            _loc1_++;
        }
    }

    private downPressedActions() {
        var _loc1_: number = 0;
        var _loc2_: b2Joint = null;
        var _loc3_: b2RevoluteJoint = null;
        var _loc4_: number = NaN;
        var _loc5_: number = NaN;
        var _loc6_: number = NaN;
        var _loc7_: b2PrismaticJoint = null;
        var _loc8_: number = NaN;
        while (_loc1_ < this.joints.length) {
            _loc2_ = this.joints[_loc1_];
            if (_loc2_ instanceof b2RevoluteJoint) {
                _loc3_ = _loc2_ as b2RevoluteJoint;
                if (this.jointMotorSpeeds[_loc1_]) {
                    _loc4_ = -this.jointMotorSpeeds[_loc1_];
                    if (_loc4_ >= 0) {
                        _loc5_ = this.handlePositiveSpeed(
                            _loc3_,
                            _loc4_,
                            _loc1_,
                        );
                    } else {
                        _loc5_ = this.handleNegativeSpeed(
                            _loc3_,
                            _loc4_,
                            _loc1_,
                        );
                    }
                    if (_loc3_.IsLimitEnabled()) {
                        _loc6_ = _loc3_.GetJointAngle();
                        if (_loc6_ > _loc3_.m_upperAngle && _loc5_ > 0) {
                            _loc3_.SetMotorSpeed(0);
                        }
                        if (_loc6_ < _loc3_.m_lowerAngle && _loc5_ < 0) {
                            _loc3_.SetMotorSpeed(0);
                        }
                    }
                }
            } else {
                _loc7_ = _loc2_ as b2PrismaticJoint;
                if (this.jointMotorSpeeds[_loc1_]) {
                    _loc4_ = -this.jointMotorSpeeds[_loc1_];
                    if (_loc4_ >= 0) {
                        _loc5_ = this.handlePositiveSpeedPris(
                            _loc7_,
                            _loc4_,
                            _loc1_,
                        );
                    } else {
                        _loc5_ = this.handleNegativeSpeedPris(
                            _loc7_,
                            _loc4_,
                            _loc1_,
                        );
                    }
                    if (_loc7_.IsLimitEnabled()) {
                        _loc8_ = _loc7_.GetJointTranslation();
                        if (_loc8_ > _loc7_.m_upperTranslation && _loc5_ > 0) {
                            _loc7_.SetMotorSpeed(0);
                        }
                        if (_loc8_ < _loc7_.m_lowerTranslation && _loc5_ < 0) {
                            _loc7_.SetMotorSpeed(0);
                        }
                    }
                }
            }
            _loc1_++;
        }
    }

    private handlePositiveSpeed(
        param1: b2RevoluteJoint,
        param2: number,
        param3: number,
    ): number {
        var _loc5_: number = NaN;
        var _loc6_: number = NaN;
        if (param1.IsMotorEnabled() == false) {
            param1.EnableMotor(true);
        }
        var _loc4_: number = param1.GetJointSpeed();
        if (_loc4_ < 0) {
            _loc6_ = 0;
        } else {
            _loc5_ = Number(this.jointAccels[param3]);
            _loc6_ =
                _loc4_ < param2 ? Math.min(_loc4_ + _loc5_, param2) : _loc4_;
        }
        param1.SetMotorSpeed(_loc6_);
        return _loc6_;
    }

    private handleNegativeSpeed(
        param1: b2RevoluteJoint,
        param2: number,
        param3: number,
    ): number {
        var _loc5_: number = NaN;
        var _loc6_: number = NaN;
        if (param1.IsMotorEnabled() == false) {
            param1.EnableMotor(true);
        }
        var _loc4_: number = param1.GetJointSpeed();
        if (_loc4_ > 0) {
            _loc6_ = 0;
        } else {
            _loc5_ = Number(this.jointAccels[param3]);
            _loc6_ =
                _loc4_ > param2 ? Math.max(_loc4_ - _loc5_, param2) : _loc4_;
        }
        param1.SetMotorSpeed(_loc6_);
        return _loc6_;
    }

    private handlePositiveSpeedPris(
        param1: b2PrismaticJoint,
        param2: number,
        param3: number,
    ): number {
        var _loc5_: number = NaN;
        var _loc6_: number = NaN;
        if (param1.IsMotorEnabled() == false) {
            param1.EnableMotor(true);
        }
        var _loc4_: number = param1.GetJointSpeed();
        if (_loc4_ < 0) {
            _loc6_ = 0;
        } else {
            _loc5_ = Number(this.jointAccels[param3]);
            _loc6_ =
                _loc4_ < param2 ? Math.min(_loc4_ + _loc5_, param2) : _loc4_;
        }
        param1.SetMotorSpeed(_loc6_);
        return _loc6_;
    }

    private handleNegativeSpeedPris(
        param1: b2PrismaticJoint,
        param2: number,
        param3: number,
    ): number {
        var _loc5_: number = NaN;
        var _loc6_: number = NaN;
        if (param1.IsMotorEnabled() == false) {
            param1.EnableMotor(true);
        }
        var _loc4_: number = param1.GetJointSpeed();
        if (_loc4_ > 0) {
            _loc6_ = 0;
        } else {
            _loc5_ = Number(this.jointAccels[param3]);
            _loc6_ =
                _loc4_ > param2 ? Math.max(_loc4_ - _loc5_, param2) : _loc4_;
        }
        param1.SetMotorSpeed(_loc6_);
        return _loc6_;
    }

    private upAndDownActions() {
        var _loc1_: number = 0;
        var _loc2_: b2Joint = null;
        var _loc3_: b2RevoluteJoint = null;
        var _loc4_: number = NaN;
        var _loc5_: number = NaN;
        var _loc6_: number = NaN;
        var _loc7_: b2PrismaticJoint = null;
        if (this.lockJoints) {
            while (_loc1_ < this.joints.length) {
                _loc2_ = this.joints[_loc1_];
                if (_loc2_ instanceof b2RevoluteJoint) {
                    _loc3_ = _loc2_ as b2RevoluteJoint;
                    if (this.jointMotorSpeeds[_loc1_]) {
                        if (_loc3_.IsMotorEnabled() == false) {
                            _loc3_.EnableMotor(true);
                        }
                        _loc4_ = _loc3_.GetJointSpeed();
                        _loc5_ = Number(this.jointAccels[_loc1_]);
                        _loc6_ = 0;
                        if (_loc4_ > 0) {
                            _loc6_ = _loc4_ - _loc5_;
                            _loc6_ = _loc6_ > 0 ? _loc6_ : 0;
                        } else if (_loc4_ < 0) {
                            _loc6_ = _loc4_ + _loc5_;
                            _loc6_ = _loc6_ < 0 ? _loc6_ : 0;
                        }
                        _loc3_.SetMotorSpeed(_loc6_);
                    }
                } else {
                    _loc7_ = _loc2_ as b2PrismaticJoint;
                    if (this.jointMotorSpeeds[_loc1_]) {
                        if (_loc7_.IsMotorEnabled() == false) {
                            _loc7_.EnableMotor(true);
                        }
                        _loc4_ = _loc7_.GetJointSpeed();
                        _loc5_ = Number(this.jointAccels[_loc1_]);
                        _loc6_ = 0;
                        if (_loc4_ > 0) {
                            _loc6_ = _loc4_ - _loc5_;
                            _loc6_ = _loc6_ > 0 ? _loc6_ : 0;
                        } else if (_loc4_ < 0) {
                            _loc6_ = _loc4_ + _loc5_;
                            _loc6_ = _loc6_ < 0 ? _loc6_ : 0;
                        }
                        _loc7_.SetMotorSpeed(_loc6_);
                    }
                }
                _loc1_++;
            }
        } else {
            while (_loc1_ < this.joints.length) {
                _loc2_ = this.joints[_loc1_];
                if (_loc2_ instanceof b2RevoluteJoint) {
                    _loc3_ = _loc2_ as b2RevoluteJoint;
                    if (this.jointMotorSpeeds[_loc1_]) {
                        if (_loc3_.IsMotorEnabled() == true) {
                            _loc3_.EnableMotor(false);
                        }
                    }
                } else {
                    _loc7_ = _loc2_ as b2PrismaticJoint;
                    if (this.jointMotorSpeeds[_loc1_]) {
                        if (_loc7_.IsMotorEnabled() == true) {
                            _loc7_.EnableMotor(false);
                        }
                    }
                }
                _loc1_++;
            }
        }
    }

    private zPressedActions() {
        var _loc2_: CharacterB2D = null;
        var _loc1_: number = 0;
        while (_loc1_ < this.characters.length) {
            _loc2_ = this.characters[_loc1_];
            _loc2_.userVehicleEject();
            _loc1_++;
        }
    }

    private brake() {
        var _loc2_: b2Joint = null;
        var _loc3_: b2RevoluteJoint = null;
        var _loc4_: b2PrismaticJoint = null;
        var _loc1_: number = 0;
        while (_loc1_ < this.joints.length) {
            _loc2_ = this.joints[_loc1_];
            if (_loc2_ instanceof b2RevoluteJoint) {
                _loc3_ = _loc2_ as b2RevoluteJoint;
                if (this.jointMotorSpeeds[_loc1_]) {
                    if (!_loc3_.IsMotorEnabled()) {
                        _loc3_.EnableMotor(true);
                    }
                    _loc3_.SetMotorSpeed(0);
                }
            } else {
                _loc4_ = _loc2_ as b2PrismaticJoint;
                if (this.jointMotorSpeeds[_loc1_]) {
                    if (!_loc4_.IsMotorEnabled()) {
                        _loc4_.EnableMotor(true);
                    }
                    _loc4_.SetMotorSpeed(0);
                }
            }
            _loc1_++;
        }
    }

    private fireJets() {
        var _loc1_: number = 0;
        var _loc2_: Jet = null;
        if (!this.jetsFiring) {
            this.jetsFiring = true;
            _loc1_ = 0;
            while (_loc1_ < this.jets.length) {
                _loc2_ = this.jets[_loc1_];
                _loc2_.firingAllowed = true;
                _loc1_++;
            }
        }
    }

    private stopJets() {
        var _loc1_: number = 0;
        var _loc2_: Jet = null;
        if (this.jetsFiring) {
            this.jetsFiring = false;
            _loc1_ = 0;
            while (_loc1_ < this.jets.length) {
                _loc2_ = this.jets[_loc1_];
                _loc2_.firingAllowed = false;
                _loc1_++;
            }
        }
    }

    private fireArrows() {
        var _loc1_: number = 0;
        var _loc2_: ArrowGun = null;
        if (!this.arrowsFiring) {
            this.arrowsFiring = true;
            _loc1_ = 0;
            while (_loc1_ < this.arrowGuns.length) {
                _loc2_ = this.arrowGuns[_loc1_];
                _loc2_.firingAllowed = true;
                _loc1_++;
            }
        }
    }

    private stopArrows() {
        var _loc1_: number = 0;
        var _loc2_: ArrowGun = null;
        if (this.arrowsFiring) {
            this.arrowsFiring = false;
            _loc1_ = 0;
            while (_loc1_ < this.arrowGuns.length) {
                _loc2_ = this.arrowGuns[_loc1_];
                _loc2_.firingAllowed = false;
                _loc1_++;
            }
        }
    }

    public get characterPose(): number {
        return this._characterPose;
    }

    public addCharacter(param1: CharacterB2D) {
        var _loc2_: number = 0;
        var _loc3_: Vector<LevelItem> = null;
        _loc2_ = int(this.characters.indexOf(param1));
        if (_loc2_ < 0) {
            this.characters.push(param1);
            _loc3_ = Settings.currentSession.level.actionsVector;
            _loc2_ = int(_loc3_.indexOf(this));
            if (_loc2_ > -1) {
                _loc3_.splice(_loc2_, 1);
            }
        }
    }

    public removeCharacter(param1: CharacterB2D) {
        var _loc3_: Vector<LevelItem> = null;
        var _loc4_: number = 0;
        var _loc5_: b2Joint = null;
        var _loc6_: b2RevoluteJoint = null;
        var _loc7_: b2PrismaticJoint = null;
        var _loc2_ = int(this.characters.indexOf(param1));
        if (_loc2_ > -1) {
            this.characters.splice(_loc2_, 1);
            if (this.characters.length < 1) {
                if (this.slowAfterEject) {
                    _loc3_ = Settings.currentSession.level.actionsVector;
                    if (_loc3_.indexOf(this) < 0) {
                        _loc3_.push(this);
                    }
                } else {
                    _loc4_ = 0;
                    while (_loc4_ < this.joints.length) {
                        _loc5_ = this.joints[_loc4_];
                        if (_loc5_ instanceof b2RevoluteJoint) {
                            _loc6_ = _loc5_ as b2RevoluteJoint;
                            if (this.jointMotorSpeeds[_loc4_]) {
                                if (_loc6_.IsMotorEnabled() == true) {
                                    _loc6_.EnableMotor(false);
                                }
                            }
                        } else {
                            _loc7_ = _loc5_ as b2PrismaticJoint;
                            if (this.jointMotorSpeeds[_loc4_]) {
                                if (_loc7_.IsMotorEnabled() == true) {
                                    _loc7_.EnableMotor(false);
                                }
                            }
                        }
                        _loc4_++;
                    }
                }
                this.stopArrows();
            }
        }
    }

    public override actions() {
        var _loc2_: number = 0;
        var _loc3_: b2Joint = null;
        var _loc4_: b2RevoluteJoint = null;
        var _loc5_: number = NaN;
        var _loc6_: number = NaN;
        var _loc7_: number = NaN;
        var _loc8_: b2PrismaticJoint = null;
        var _loc1_: number = 0;
        while (_loc2_ < this.joints.length) {
            _loc3_ = this.joints[_loc2_];
            if (_loc3_ instanceof b2RevoluteJoint) {
                _loc4_ = this.joints[_loc2_];
                if (this.jointMotorSpeeds[_loc2_]) {
                    if (_loc4_.IsMotorEnabled() == false) {
                        _loc4_.EnableMotor(true);
                    }
                    _loc5_ = _loc4_.GetJointSpeed();
                    _loc6_ = Number(this.jointAccels[_loc2_]);
                    _loc7_ = 0;
                    if (_loc5_ > 0) {
                        _loc7_ = _loc5_ - _loc6_;
                        _loc7_ = _loc7_ > 0 ? _loc7_ : 0;
                    } else if (_loc5_ < 0) {
                        _loc7_ = _loc5_ + _loc6_;
                        _loc7_ = _loc7_ < 0 ? _loc7_ : 0;
                    }
                    _loc4_.SetMotorSpeed(_loc7_);
                    _loc1_ += Math.abs(_loc7_);
                }
            } else {
                _loc8_ = this.joints[_loc2_];
                if (this.jointMotorSpeeds[_loc2_]) {
                    if (_loc8_.IsMotorEnabled() == false) {
                        _loc8_.EnableMotor(true);
                    }
                    _loc5_ = _loc8_.GetJointSpeed();
                    _loc6_ = Number(this.jointAccels[_loc2_]);
                    _loc7_ = 0;
                    if (_loc5_ > 0) {
                        _loc7_ = _loc5_ - _loc6_;
                        _loc7_ = _loc7_ > 0 ? _loc7_ : 0;
                    } else if (_loc5_ < 0) {
                        _loc7_ = _loc5_ + _loc6_;
                        _loc7_ = _loc7_ < 0 ? _loc7_ : 0;
                    }
                    _loc8_.SetMotorSpeed(_loc7_);
                    _loc1_ += Math.abs(_loc7_);
                }
            }
            _loc2_++;
        }
        if (_loc1_ == 0) {
            Settings.currentSession.level.removeFromActionsVector(this);
        }
    }
}