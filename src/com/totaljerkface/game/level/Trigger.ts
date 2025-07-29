import b2PolygonDef from "@/Box2D/Collision/Shapes/b2PolygonDef";
import b2Shape from "@/Box2D/Collision/Shapes/b2Shape";
import b2ContactPoint from "@/Box2D/Collision/b2ContactPoint";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2Contact from "@/Box2D/Dynamics/Contacts/b2Contact";
import b2ContactEdge from "@/Box2D/Dynamics/Contacts/b2ContactEdge";
import b2PrismaticJoint from "@/Box2D/Dynamics/Joints/b2PrismaticJoint";
import b2RevoluteJoint from "@/Box2D/Dynamics/Joints/b2RevoluteJoint";
import b2Body from "@/Box2D/Dynamics/b2Body";
import ContactListener from "@/com/totaljerkface/game/ContactListener";
import Session from "@/com/totaljerkface/game/Session";
import Settings from "@/com/totaljerkface/game/Settings";
import CharacterB2D from "@/com/totaljerkface/game/character/CharacterB2D";
import RefSprite from "@/com/totaljerkface/game/editor/RefSprite";
import RefTrigger from "@/com/totaljerkface/game/editor/trigger/RefTrigger";
import LevelItem from "@/com/totaljerkface/game/level/LevelItem";
import TargetAction from "@/com/totaljerkface/game/level/TargetAction";
import TargetActionGroup from "@/com/totaljerkface/game/level/TargetActionGroup";
import TargetActionPrisJoint from "@/com/totaljerkface/game/level/TargetActionPrisJoint";
import TargetActionRevJoint from "@/com/totaljerkface/game/level/TargetActionRevJoint";
import TargetActionSpecial from "@/com/totaljerkface/game/level/TargetActionSpecial";
import TargetActionTrigger from "@/com/totaljerkface/game/level/TargetActionTrigger";
import NPCharacter from "@/com/totaljerkface/game/level/userspecials/NPCharacter";
import SoundController from "@/com/totaljerkface/game/sound/SoundController";
import SoundList from "@/com/totaljerkface/game/sound/SoundList";
import MouseClickMC from "@/top/MouseClickMC";
import { boundClass } from 'autobind-decorator';
import MovieClip from "flash/display/MovieClip";
import Sprite from "flash/display/Sprite";
import MouseEvent from "flash/events/MouseEvent";
import SoundTransform from "flash/media/SoundTransform";

@boundClass
export default class Trigger extends LevelItem {
    private sensor: b2Shape;
    private targets: Vector<LevelItem>;
    private session: Session;
    private delayFrames: number;
    private delayVector: Vector<number>;
    private counter: number = 0;
    private activationDictionary: Dictionary<any, any>;
    private triggeredBy: number;
    private _disabled: boolean;
    private triggeringBody: b2Body;
    private triggeringCount: number = 0;
    private repeatType: number;
    private repeatFrames: number;
    private repeatCount: number;
    private type: number;
    private soundEffect: string;
    private soundLocation: number = 1;
    private soundTransform: SoundTransform;
    private _x: number;
    private _y: number;
    private buttonSprite: Sprite;
    private triggerIndex: number;

    constructor(param1: RefTrigger, param2: number) {
        super();
        this.createShape(param1);
        this.triggerIndex = param2;
        this._x = param1.x;
        this._y = param1.y;
        this.session = Settings.currentSession;
        this.delayFrames = param1.triggerDelay * 30;
        this.delayVector = new Vector<number>();
        var _loc3_ = param1.repeatInterval * 30;
        this.repeatCount = param1.repeatInterval * 30;
        this.repeatFrames = _loc3_;
        this.type = param1.typeIndex;
        if (param1.typeIndex == 2) {
            this.soundEffect =
                SoundList.instance.sfxDictionary[param1.soundEffect];
            this.soundLocation = param1.soundLocation;
            this.soundTransform = new SoundTransform(
                param1.volume,
                param1.panning,
            );
        }
        this.triggeredBy = param1.triggeredBy;
        this.repeatType = param1.repeatType;
        this.activationDictionary = new Dictionary();
        this.targets = new Vector<LevelItem>();
    }

    private createShape(param1: RefTrigger) {
        var _loc6_: Sprite = null;
        var _loc7_: Sprite = null;
        if (param1.triggeredBy == 5) {
            return;
        }
        if (param1.triggeredBy == 6) {
            this.buttonSprite = new Sprite();
            _loc6_ = new Sprite();
            _loc6_.graphics.beginFill(0, 1);
            _loc6_.graphics.drawRect(-50, -50, 100, 100);
            _loc6_.x = param1.x;
            _loc6_.y = param1.y;
            _loc6_.scaleX = param1.scaleX;
            _loc6_.scaleY = param1.scaleY;
            _loc6_.mouseEnabled = false;
            _loc6_.visible = false;
            this.buttonSprite.hitArea = _loc6_;
            this.buttonSprite.buttonMode = true;
            this.buttonSprite.addEventListener(
                MouseEvent.MOUSE_UP,
                this.mouseUpHandler,
                false,
                0,
                true,
            );
            _loc7_ = Settings.currentSession.buttonContainer;
            _loc7_.addChild(this.buttonSprite);
            _loc7_.addChild(_loc6_);
        }
        var _loc2_ = new b2PolygonDef();
        _loc2_.filter.categoryBits = 24;
        _loc2_.filter.groupIndex = -20;
        _loc2_.isSensor = true;
        var _loc3_: number = Settings.currentSession.level.m_physScale;
        var _loc4_ = new b2Vec2(param1.x / _loc3_, param1.y / _loc3_);
        var _loc5_: number = (param1.angle * Math.PI) / 180;
        _loc2_.SetAsOrientedBox(
            (param1.scaleX * 50) / _loc3_,
            (param1.scaleY * 50) / _loc3_,
            new b2Vec2(_loc4_.x, _loc4_.y),
            _loc5_,
        );
        this.sensor =
            Settings.currentSession.level.levelBody.CreateShape(_loc2_);
        if (param1.triggeredBy == 1) {
            Settings.currentSession.contactListener.registerListener(
                ContactListener.ADD,
                this.sensor,
                this.checkAdd1,
            );
        } else if (param1.triggeredBy == 2) {
            Settings.currentSession.contactListener.registerListener(
                ContactListener.ADD,
                this.sensor,
                this.checkAdd2,
            );
        } else if (param1.triggeredBy == 3) {
            Settings.currentSession.contactListener.registerListener(
                ContactListener.ADD,
                this.sensor,
                this.checkAdd3,
            );
        } else if (param1.triggeredBy == 4) {
            Settings.currentSession.contactListener.registerListener(
                ContactListener.ADD,
                this.sensor,
                this.checkAdd4,
            );
        }
    }

    public addActivationBody(param1: any[]) {
        var _loc2_: number = 0;
        var _loc3_: b2Body = null;
        if (this.triggeredBy == 4 && Boolean(this.activationDictionary)) {
            _loc2_ = 0;
            while (_loc2_ < param1.length) {
                _loc3_ = param1[_loc2_];
                this.activationDictionary.set(_loc3_, 1);
                _loc2_++;
            }
        }
    }

    public mouseUpHandler(param1: MouseEvent = null) {
        var _loc2_: MovieClip = null;
        var _loc3_: Vector<LevelItem> = null;
        var _loc4_: number = 0;
        if (param1 == null) {
            _loc2_ = new MouseClickMC();
            _loc2_.mouseEnabled = false;
            _loc2_.x = this._x;
            _loc2_.y = this._y;
            this.session.containerSprite.addChild(_loc2_);
        }
        if (this.repeatType > 2) {
            _loc3_ = this.session.level.actionsVector;
            _loc4_ = int(_loc3_.indexOf(this));
            if (_loc4_ < 0) {
                if (!this.session.isReplay) {
                    this.session.replayData.addMouseEntry(
                        this.session.iteration,
                        this.triggerIndex,
                    );
                }
                _loc3_.push(this);
                this.triggeringBody = this.session.level.levelBody;
                if (this.repeatType == 3) {
                    this.buttonSprite.addEventListener(
                        MouseEvent.ROLL_OUT,
                        this.mouseOutHandler,
                        false,
                        0,
                        true,
                    );
                }
            }
        } else {
            if (this.repeatType == 1) {
                this.buttonSprite.removeEventListener(
                    MouseEvent.MOUSE_UP,
                    this.mouseUpHandler,
                );
                if (this.buttonSprite.parent) {
                    this.buttonSprite.parent.removeChild(this.buttonSprite);
                }
            }
            if (this.delayFrames == 0) {
                _loc3_ = this.session.level.singleActionVector;
                _loc4_ = int(_loc3_.indexOf(this));
                if (_loc4_ < 0) {
                    if (!this.session.isReplay) {
                        this.session.replayData.addMouseEntry(
                            this.session.iteration,
                            this.triggerIndex,
                        );
                    }
                    _loc3_.push(this);
                }
            } else {
                _loc3_ = this.session.level.actionsVector;
                _loc4_ = int(_loc3_.indexOf(this));
                this.delayVector.push(0);
                if (_loc4_ < 0) {
                    if (!this.session.isReplay) {
                        this.session.replayData.addMouseEntry(
                            this.session.iteration,
                            this.triggerIndex,
                        );
                    }
                    _loc3_.push(this);
                }
            }
        }
    }

    public mouseOutHandler(param1: MouseEvent = null) {
        this.buttonSprite.removeEventListener(
            MouseEvent.ROLL_OUT,
            this.mouseOutHandler,
        );
        this.triggeringBody = null;
        if (!this.session.isReplay) {
            this.session.replayData.addMouseEntry(
                this.session.iteration,
                this.triggerIndex,
                1,
            );
        }
    }

    public addTargetActionShape(
        param1: RefSprite,
        param2: b2Shape,
        param3: Sprite,
        param4: string,
        param5: any[],
    ): TargetAction {
        var _loc6_ = new TargetAction(param1, param2, param3, param4, param5);
        this.targets.push(_loc6_);
        return _loc6_;
    }

    public addTargetActionGroup(
        param1: RefSprite,
        param2: b2Body,
        param3: Sprite,
        param4: string,
        param5: any[],
    ): TargetActionGroup {
        var _loc6_ = new TargetActionGroup(
            param1,
            param2,
            param3,
            param4,
            param5,
        );
        this.targets.push(_loc6_);
        return _loc6_;
    }

    public addTargetItemSpecial(
        param1: LevelItem,
        param2: RefSprite,
        param3: string,
        param4: any[],
    ): TargetActionSpecial {
        var _loc5_ = new TargetActionSpecial(
            param2,
            this,
            param1,
            param3,
            param4,
        );
        this.targets.push(_loc5_);
        return _loc5_;
    }

    public addTargetActionRevJoint(
        param1: RefSprite,
        param2: b2RevoluteJoint,
        param3: string,
        param4: any[],
    ): TargetActionRevJoint {
        var _loc5_ = new TargetActionRevJoint(param1, param2, param3, param4);
        this.targets.push(_loc5_);
        return _loc5_;
    }

    public addTargetActionPrisJoint(
        param1: RefSprite,
        param2: b2PrismaticJoint,
        param3: string,
        param4: any[],
    ): TargetActionPrisJoint {
        var _loc5_ = new TargetActionPrisJoint(param1, param2, param3, param4);
        this.targets.push(_loc5_);
        return _loc5_;
    }

    public addTargetActionTrigger(
        param1: RefSprite,
        param2: Trigger,
        param3: Trigger,
        param4: string,
        param5: any[],
    ): TargetActionTrigger {
        var _loc6_ = new TargetActionTrigger(
            param1,
            param2,
            param3,
            param4,
            param5,
        );
        this.targets.push(_loc6_);
        return _loc6_;
    }

    public override singleAction() {
        var _loc1_: number = 0;
        var _loc2_: number = 0;
        var _loc3_: TargetAction = null;
        var _loc4_: TargetActionSpecial = null;
        var _loc5_: TargetActionGroup = null;
        var _loc6_: TargetActionRevJoint = null;
        var _loc7_: TargetActionPrisJoint = null;
        var _loc8_: TargetActionTrigger = null;
        var _loc9_: number = NaN;
        var _loc10_: b2Vec2 = null;
        var _loc11_: Session = null;
        if (this.type == 1) {
            _loc1_ = int(this.targets.length);
            _loc2_ = 0;
            while (_loc2_ < _loc1_) {
                if (this.targets[_loc2_] instanceof TargetAction) {
                    _loc3_ = this.targets[_loc2_] as TargetAction;
                    if (_loc3_.instant) {
                        _loc3_.singleAction();
                    } else {
                        Settings.currentSession.level.actionsVector.push(
                            _loc3_,
                        );
                    }
                } else if (
                    this.targets[_loc2_] instanceof TargetActionSpecial
                ) {
                    _loc4_ = this.targets[_loc2_] as TargetActionSpecial;
                    if (_loc4_.instant) {
                        _loc4_.singleAction();
                    } else {
                        Settings.currentSession.level.actionsVector.push(
                            _loc4_,
                        );
                    }
                } else if (this.targets[_loc2_] instanceof TargetActionGroup) {
                    _loc5_ = this.targets[_loc2_] as TargetActionGroup;
                    if (_loc5_.instant) {
                        _loc5_.singleAction();
                    } else {
                        Settings.currentSession.level.actionsVector.push(
                            _loc5_,
                        );
                    }
                } else if (
                    this.targets[_loc2_] instanceof TargetActionRevJoint
                ) {
                    _loc6_ = this.targets[_loc2_] as TargetActionRevJoint;
                    if (_loc6_.instant) {
                        _loc6_.singleAction();
                    } else {
                        Settings.currentSession.level.actionsVector.push(
                            _loc6_,
                        );
                    }
                } else if (
                    this.targets[_loc2_] instanceof TargetActionPrisJoint
                ) {
                    _loc7_ = this.targets[_loc2_] as TargetActionPrisJoint;
                    if (_loc7_.instant) {
                        _loc7_.singleAction();
                    } else {
                        Settings.currentSession.level.actionsVector.push(
                            _loc7_,
                        );
                    }
                } else if (
                    this.targets[_loc2_] instanceof TargetActionTrigger
                ) {
                    _loc8_ = this.targets[_loc2_] as TargetActionTrigger;
                    _loc8_.singleAction();
                }
                _loc2_++;
            }
        } else if (this.type == 2) {
            if (this.soundLocation == 1) {
                SoundController.instance.playSoundInstance(
                    this.soundEffect,
                    0,
                    0,
                    this.soundTransform,
                );
            } else {
                _loc9_ = Settings.currentSession.level.m_physScale;
                _loc10_ = new b2Vec2(this._x / _loc9_, this._y / _loc9_);
                SoundController.instance.playPointSoundInstance(
                    this.soundEffect,
                    _loc10_,
                    this.soundTransform.volume,
                );
            }
        } else if (this.type == 3) {
            _loc11_ = Settings.currentSession;
            if (!_loc11_.isReplay) {
                _loc11_.levelComplete();
            }
            SoundController.instance.playSoundItem("Victory");
        }
        if (this.repeatType == 1 && Boolean(this.sensor)) {
            Settings.currentSession.level.levelBody.DestroyShape(this.sensor);
            this.sensor = null;
        }
    }

    public override actions() {
        var _loc1_: boolean = false;
        var _loc2_: boolean = false;
        var _loc4_: number = 0;
        var _loc5_: number = 0;
        var _loc3_ = int(this.delayVector.length);
        if (_loc3_ > 0) {
            _loc4_ = int(this.delayVector.length - 1);
            while (_loc4_ > -1) {
                _loc5_ = this.delayVector[_loc4_];
                if (_loc5_ == this.delayFrames) {
                    this.singleAction();
                    this.delayVector.splice(_loc4_, 1);
                } else {
                    this.delayVector[_loc4_] = _loc5_ + 1;
                }
                _loc4_--;
            }
            if (this.delayVector.length == 0) {
                _loc1_ = true;
            }
        } else {
            _loc1_ = true;
        }
        if (this.repeatType > 2) {
            if (this.triggeringBody) {
                if (this.repeatCount == this.repeatFrames) {
                    if (this.delayFrames == 0) {
                        this.singleAction();
                    } else {
                        this.delayVector.push(0);
                    }
                    this.repeatCount = 0;
                } else {
                    ++this.repeatCount;
                }
            } else {
                _loc2_ = true;
            }
        } else {
            _loc2_ = true;
        }
        if (_loc1_ && _loc2_) {
            this.session.level.removeFromActionsVector(this);
        }
    }

    private addTriggeringBody(param1: b2Body) {
        var _loc2_: number = 0;
        var _loc3_: b2ContactEdge = null;
        var _loc4_: b2Contact = null;
        var _loc5_: Vector<LevelItem> = null;
        var _loc6_: number = 0;
        if (this.triggeringBody) {
            if (param1 == this.triggeringBody) {
                this.triggeringCount += 1;
            }
        } else {
            _loc2_ = 0;
            _loc3_ = param1.m_contactList;
            while (_loc3_) {
                _loc4_ = _loc3_.contact;
                if (_loc4_.m_shape1 == this.sensor) {
                    if (!_loc4_.m_shape2.m_isSensor) {
                        _loc2_ += _loc4_.m_manifoldCount;
                    }
                } else if (_loc4_.m_shape2 == this.sensor) {
                    if (!_loc4_.m_shape1.m_isSensor) {
                        _loc2_ += _loc4_.m_manifoldCount;
                    }
                }
                _loc3_ = _loc3_.next;
            }
            if (_loc2_ > 0) {
                return;
            }
            this.triggeringBody = param1;
            this.triggeringCount += 1;
            if (this.repeatType > 2) {
                _loc5_ = this.session.level.actionsVector;
                _loc6_ = int(_loc5_.indexOf(this));
                if (_loc6_ < 0) {
                    _loc5_.push(this);
                    if (this.repeatType == 3) {
                        Settings.currentSession.contactListener.registerListener(
                            ContactListener.REMOVE,
                            this.sensor,
                            this.checkRemove1,
                        );
                    }
                }
            } else {
                if (this.repeatType == 1) {
                    Settings.currentSession.contactListener.deleteListener(
                        ContactListener.ADD,
                        this.sensor,
                    );
                    this.activationDictionary = null;
                } else {
                    Settings.currentSession.contactListener.registerListener(
                        ContactListener.REMOVE,
                        this.sensor,
                        this.checkRemove1,
                    );
                }
                if (this.delayFrames == 0) {
                    _loc5_ = this.session.level.singleActionVector;
                    _loc6_ = int(_loc5_.indexOf(this));
                    if (_loc6_ < 0) {
                        _loc5_.push(this);
                    }
                } else {
                    _loc5_ = this.session.level.actionsVector;
                    _loc6_ = int(_loc5_.indexOf(this));
                    this.delayVector.push(0);
                    if (_loc6_ < 0) {
                        _loc5_.push(this);
                    }
                }
            }
        }
    }

    public activateByTrigger() {
        var _loc1_: Vector<LevelItem> = null;
        var _loc2_: number = 0;
        if (!this._disabled) {
            if (this.repeatType == 1) {
                if (!this.activationDictionary) {
                    return;
                }
                if (this.delayFrames == 0) {
                    _loc1_ = this.session.level.singleActionVector;
                    _loc2_ = int(_loc1_.indexOf(this));
                    if (_loc2_ < 0) {
                        Settings.currentSession.contactListener.deleteListener(
                            ContactListener.ADD,
                            this.sensor,
                        );
                        this.activationDictionary = null;
                        this.singleAction();
                    }
                } else {
                    _loc1_ = this.session.level.actionsVector;
                    _loc2_ = int(_loc1_.indexOf(this));
                    if (_loc2_ < 0) {
                        Settings.currentSession.contactListener.deleteListener(
                            ContactListener.ADD,
                            this.sensor,
                        );
                        this.activationDictionary = null;
                        _loc1_.push(this);
                        this.delayVector.push(0);
                    }
                }
            } else if (this.repeatType == 2) {
                if (this.delayFrames == 0) {
                    _loc1_ = this.session.level.singleActionVector;
                    _loc2_ = int(_loc1_.indexOf(this));
                    if (_loc2_ < 0) {
                        this.singleAction();
                    }
                } else {
                    _loc1_ = this.session.level.actionsVector;
                    _loc2_ = int(_loc1_.indexOf(this));
                    if (_loc2_ < 0) {
                        _loc1_.push(this);
                        this.delayVector.push(0);
                    } else {
                        this.delayVector.push(0);
                    }
                }
            } else if (this.repeatType == 3) {
                if (this.triggeringBody) {
                    return;
                }
                if (this.delayFrames == 0) {
                    _loc1_ = this.session.level.singleActionVector;
                    _loc2_ = int(_loc1_.indexOf(this));
                    if (_loc2_ < 0) {
                        this.singleAction();
                    }
                } else {
                    _loc1_ = this.session.level.actionsVector;
                    _loc2_ = int(_loc1_.indexOf(this));
                    if (_loc2_ < 0) {
                        _loc1_.push(this);
                        this.delayVector.push(0);
                    }
                }
            } else if (this.repeatType == 4) {
                if (this.triggeringBody) {
                    return;
                }
                this.triggeringBody = this.session.level.levelBody;
                _loc1_ = this.session.level.actionsVector;
                _loc2_ = int(_loc1_.indexOf(this));
                if (_loc2_ < 0) {
                    _loc1_.push(this);
                }
            }
        }
    }

    private checkRemove1(param1: b2ContactPoint) {
        var _loc2_: b2Body = param1.shape2.GetBody();
        if (
            _loc2_ == this.triggeringBody &&
            param1.shape2.m_isSensor == false
        ) {
            --this.triggeringCount;
            if (this.triggeringCount < 1 && _loc2_.m_mass > 0) {
                this.triggeringCount = 0;
                this.triggeringBody = null;
            }
        }
    }

    private checkAdd1(param1: b2ContactPoint) {
        var _loc2_: b2Body = param1.shape2.GetBody();
        if (_loc2_ == this.session.character.centralBody) {
            this.addTriggeringBody(_loc2_);
        }
    }

    private checkAdd2(param1: b2ContactPoint) {
        var _loc4_: NPCharacter = null;
        var _loc5_: CharacterB2D = null;
        var _loc2_: b2Body = param1.shape2.GetBody();
        var _loc3_: b2Shape = param1.shape2;
        if (_loc3_.m_userData instanceof NPCharacter) {
            _loc4_ = _loc3_.m_userData as NPCharacter;
            if (_loc2_ == _loc4_.centralBody) {
                this.addTriggeringBody(_loc2_);
            }
        } else if (_loc3_.m_userData instanceof CharacterB2D) {
            _loc5_ = _loc3_.m_userData as CharacterB2D;
            if (_loc2_ == _loc5_.centralBody) {
                this.addTriggeringBody(_loc2_);
            }
        }
    }

    private checkAdd3(param1: b2ContactPoint) {
        var _loc2_: b2Body = param1.shape2.GetBody();
        if (_loc2_.m_mass > 0 && param1.shape2.m_isSensor == false) {
            this.addTriggeringBody(_loc2_);
        }
    }

    private checkAdd4(param1: b2ContactPoint) {
        var _loc2_: b2Body = param1.shape2.GetBody();
        if (_loc2_.m_mass > 0 && param1.shape2.m_isSensor == false) {
            if (this.activationDictionary.get(_loc2_)) {
                this.addTriggeringBody(_loc2_);
            }
        }
    }

    public get disabled(): boolean {
        return this._disabled;
    }

    public set disabled(param1: boolean) {
        var _loc2_: Session = null;
        var _loc3_: Vector<LevelItem> = null;
        var _loc4_: number = 0;
        if (!this._disabled) {
            if (param1) {
                _loc2_ = Settings.currentSession;
                if (this.sensor) {
                    _loc2_.contactListener.deleteListener(
                        ContactListener.ADD,
                        this.sensor,
                    );
                    _loc2_.contactListener.deleteListener(
                        ContactListener.REMOVE,
                        this.sensor,
                    );
                }
                this.triggeringBody = null;
                this.triggeringCount = 0;
                this.repeatCount = this.repeatFrames;
                this.delayVector = new Vector<number>();
                _loc3_ = _loc2_.level.singleActionVector;
                _loc4_ = int(_loc3_.indexOf(this));
                if (_loc4_ > -1) {
                    _loc3_.splice(_loc4_, 1);
                }
                _loc3_ = _loc2_.level.actionsVector;
                _loc4_ = int(_loc3_.indexOf(this));
                if (_loc4_ > -1) {
                    _loc3_.splice(_loc4_, 1);
                }
                if (this.triggeredBy == 6) {
                    this.buttonSprite.mouseEnabled = false;
                    this.buttonSprite.removeEventListener(
                        MouseEvent.MOUSE_UP,
                        this.mouseUpHandler,
                    );
                }
            }
        } else if (!param1) {
            if (this.activationDictionary) {
                _loc2_ = Settings.currentSession;
                if (this.triggeredBy == 1) {
                    Settings.currentSession.contactListener.registerListener(
                        ContactListener.ADD,
                        this.sensor,
                        this.checkAdd1,
                    );
                } else if (this.triggeredBy == 2) {
                    Settings.currentSession.contactListener.registerListener(
                        ContactListener.ADD,
                        this.sensor,
                        this.checkAdd2,
                    );
                } else if (this.triggeredBy == 3) {
                    Settings.currentSession.contactListener.registerListener(
                        ContactListener.ADD,
                        this.sensor,
                        this.checkAdd3,
                    );
                } else if (this.triggeredBy == 4) {
                    Settings.currentSession.contactListener.registerListener(
                        ContactListener.ADD,
                        this.sensor,
                        this.checkAdd4,
                    );
                } else if (this.triggeredBy == 6) {
                    this.buttonSprite.mouseEnabled = true;
                    this.buttonSprite.addEventListener(
                        MouseEvent.MOUSE_UP,
                        this.mouseUpHandler,
                        false,
                        0,
                        true,
                    );
                }
                if (this.sensor) {
                    _loc2_.m_world.Refilter(this.sensor);
                }
            }
        }
        this._disabled = param1;
    }

    public get x(): number {
        return this._x;
    }

    public get y(): number {
        return this._y;
    }
}