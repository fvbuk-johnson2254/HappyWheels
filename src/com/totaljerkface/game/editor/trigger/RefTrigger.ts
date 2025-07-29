import b2Mat22 from "@/Box2D/Common/Math/b2Mat22";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import Canvas from "@/com/totaljerkface/game/editor/Canvas";
import RefSprite from "@/com/totaljerkface/game/editor/RefSprite";
import Action from "@/com/totaljerkface/game/editor/actions/Action";
import ActionDelete from "@/com/totaljerkface/game/editor/actions/ActionDelete";
import ActionTriggerAdd from "@/com/totaljerkface/game/editor/actions/ActionTriggerAdd";
import ActionTriggerRemove from "@/com/totaljerkface/game/editor/actions/ActionTriggerRemove";
import { boundClass } from 'autobind-decorator';
import BitmapData from "flash/display/BitmapData";
import BlendMode from "flash/display/BlendMode";
import Sprite from "flash/display/Sprite";
import Event from "flash/events/Event";
import AntiAliasType from "flash/text/AntiAliasType";
import TextField from "flash/text/TextField";
import TextFieldAutoSize from "flash/text/TextFieldAutoSize";
import TextFieldType from "flash/text/TextFieldType";
import TextFormat from "flash/text/TextFormat";
import TextFormatAlign from "flash/text/TextFormatAlign";

@boundClass
export default class RefTrigger extends RefSprite {
    protected static bmd: BitmapData;
    protected static bmd_disabled: BitmapData;
    public static typeArray: any[] = [
        "activate object",
        "play sound effect",
        "level victory",
    ];
    protected static minDelay: number = 0;
    protected static maxDelay: number = 30;
    protected bitmapSprite: Sprite;
    protected armSprite: Sprite;
    protected numLabel: TextField;
    protected minDimension: number = 0.05;
    protected maxDimension: number = 50;
    protected scaleXCopy: number = 1;
    protected scaleYCopy: number = 1;
    protected rotationCopy: number = 0;
    protected _triggeredBy: number = 1;
    protected _triggerDelay: number = 0;
    protected _triggerType: string = "activate object";
    protected _typeIndex: number = 1;
    protected _repeatType: number = 1;
    protected _repeatInterval: number = 1;
    protected _startDisabled: boolean;
    protected _soundEffect: string = "wg voice 1";
    protected _soundLocation: number = 1;
    protected _panning: number = 0;
    protected _volume: number = 1;
    protected _addingTargets: boolean;
    protected _targets: any[];
    protected _cloneTargets: any[];

    constructor() {
        super();
        this._triggers = new Array();
        this._triggerActions = new Dictionary();
        this._triggerActionList = ["activate trigger", "disable", "enable"];
        this._triggerActionListProperties = [null, null, null];

        this.name = "trigger";
        this._shapesUsed = 1;
        this._rotatable = true;
        this._scalable = true;
        this._joinable = false;
        this._groupable = false;
        this._targets = new Array();
        this._cloneTargets = new Array();
        this._triggerable = true;
        this._triggerString = "triggerActionsTrigger";
        this._keyedPropertyObject[this._triggerString] = this._triggerActions;
        if (!RefTrigger.bmd) {
            this.createBMD();
        }
        this.bitmapSprite = new Sprite();
        this.addChildAt(this.bitmapSprite, 0);
        this.bitmapSprite.blendMode = BlendMode.HARDLIGHT;
        this.armSprite = new Sprite();
        this.armSprite.blendMode = BlendMode.INVERT;
        this.addChild(this.armSprite);
        this.drawShape();
        this.createNumLabel();
        this.numLabel.cacheAsBitmap = true;
    }

    public override setAttributes() {
        this._attributes = [
            "x",
            "y",
            "shapeWidth",
            "shapeHeight",
            "angle",
            "triggeredBy",
            "repeatType",
        ];
        if (this._repeatType > 2) {
            this._attributes.push("repeatInterval");
        }
        this._attributes.push("triggerType");
        if (this._typeIndex == 1) {
            this._attributes.push("triggerDelay");
        } else if (this._typeIndex == 2) {
            this._attributes.push(
                "soundEffect",
                "triggerDelay",
                "soundLocation",
                "volume",
            );
            if (this.soundLocation == 1) {
                this._attributes.push("panning");
            }
        }
        this._attributes.push("startDisabled");
        this.addTriggerProperties();
    }

    public override get functions(): any[] {
        var _loc1_: any[] = null;
        if (
            !this._addingTargets &&
            (this._typeIndex == 1 || this._triggeredBy == 4)
        ) {
            _loc1_ = ["addNewTarget"];
            if (this._targets.length > 0) {
                _loc1_.push("removeTarget");
            }
            return _loc1_;
        }
        return [];
    }

    private createNumLabel() {
        var _loc1_ = new TextFormat(
            "HelveticaNeueLT Std Med",
            15,
            4032711,
            true,
            null,
            null,
            null,
            null,
            TextFormatAlign.LEFT,
        );
        this.numLabel = new TextField();
        this.numLabel.type = TextFieldType.DYNAMIC;
        this.numLabel.defaultTextFormat = _loc1_;
        this.numLabel.autoSize = TextFieldAutoSize.LEFT;
        this.numLabel.x = 3;
        this.numLabel.y = 3;
        this.numLabel.multiline = false;
        this.numLabel.selectable = false;
        this.numLabel.embedFonts = true;
        // @ts-expect-error
        this.numLabel.antiAliasType = AntiAliasType.ADVANCED;
        this.addChild(this.numLabel);
    }

    private createBMD() {
        var _loc3_ = 0;
        var _loc4_ = 0;
        var _loc1_ = new Sprite();
        var _loc2_: number = 0;
        while (_loc2_ < 2) {
            _loc1_.graphics.clear();
            _loc3_ = _loc2_ == 0 ? 16750848 : 10066329;
            _loc4_ = _loc2_ == 0 ? 16777062 : 13421772;
            _loc1_.graphics.beginFill(_loc3_, 1);
            _loc1_.graphics.moveTo(0, 0);
            _loc1_.graphics.lineTo(5, 0);
            _loc1_.graphics.lineTo(0, 5);
            _loc1_.graphics.lineTo(0, 0);
            _loc1_.graphics.endFill();
            _loc1_.graphics.beginFill(_loc4_, 1);
            _loc1_.graphics.moveTo(5, 0);
            _loc1_.graphics.lineTo(15, 0);
            _loc1_.graphics.lineTo(0, 15);
            _loc1_.graphics.lineTo(0, 5);
            _loc1_.graphics.lineTo(5, 0);
            _loc1_.graphics.endFill();
            _loc1_.graphics.beginFill(_loc3_, 1);
            _loc1_.graphics.moveTo(15, 0);
            _loc1_.graphics.lineTo(20, 0);
            _loc1_.graphics.lineTo(20, 5);
            _loc1_.graphics.lineTo(5, 20);
            _loc1_.graphics.lineTo(0, 20);
            _loc1_.graphics.lineTo(0, 15);
            _loc1_.graphics.lineTo(15, 0);
            _loc1_.graphics.endFill();
            _loc1_.graphics.beginFill(_loc4_, 1);
            _loc1_.graphics.moveTo(20, 5);
            _loc1_.graphics.lineTo(20, 15);
            _loc1_.graphics.lineTo(15, 20);
            _loc1_.graphics.lineTo(5, 20);
            _loc1_.graphics.lineTo(20, 5);
            _loc1_.graphics.endFill();
            _loc1_.graphics.beginFill(_loc3_, 1);
            _loc1_.graphics.moveTo(20, 15);
            _loc1_.graphics.lineTo(20, 20);
            _loc1_.graphics.lineTo(15, 20);
            _loc1_.graphics.lineTo(20, 15);
            _loc1_.graphics.endFill();
            if (_loc2_ == 0) {
                RefTrigger.bmd = new BitmapData(20, 20, true, 0);
                RefTrigger.bmd.draw(_loc1_);
            } else {
                RefTrigger.bmd_disabled = new BitmapData(20, 20, true, 0);
                RefTrigger.bmd_disabled.draw(_loc1_);
            }
            _loc2_++;
        }
    }

    private drawShape() {
        this.bitmapSprite.graphics.clear();
        this.bitmapSprite.graphics.lineStyle(5, 6710886, 1, true);
        var _loc1_: BitmapData = this._startDisabled
            ? RefTrigger.bmd_disabled
            : RefTrigger.bmd;
        this.bitmapSprite.graphics.beginBitmapFill(_loc1_, null, true);
        var _loc2_ = new b2Mat22((this.rotationCopy * Math.PI) / 180);
        var _loc3_: number = 50 * this.scaleXCopy;
        var _loc4_: number = 50 * this.scaleYCopy;
        var _loc5_ = new b2Vec2(-_loc3_, -_loc4_);
        _loc5_.MulM(_loc2_);
        this.bitmapSprite.graphics.moveTo(_loc5_.x, _loc5_.y);
        _loc5_ = new b2Vec2(_loc3_, -_loc4_);
        _loc5_.MulM(_loc2_);
        this.bitmapSprite.graphics.lineTo(_loc5_.x, _loc5_.y);
        _loc5_ = new b2Vec2(_loc3_, _loc4_);
        _loc5_.MulM(_loc2_);
        this.bitmapSprite.graphics.lineTo(_loc5_.x, _loc5_.y);
        _loc5_ = new b2Vec2(-_loc3_, _loc4_);
        _loc5_.MulM(_loc2_);
        this.bitmapSprite.graphics.lineTo(_loc5_.x, _loc5_.y);
        _loc5_ = new b2Vec2(-_loc3_, -_loc4_);
        _loc5_.MulM(_loc2_);
        this.bitmapSprite.graphics.lineTo(_loc5_.x, _loc5_.y);
        this.bitmapSprite.graphics.endFill();
        this.drawArms();
    }

    public drawArms() {
        var _loc4_: RefSprite = null;
        var _loc5_: number = NaN;
        var _loc6_: number = NaN;
        var _loc7_: number = NaN;
        var _loc8_: number = NaN;
        var _loc9_: number = NaN;
        var _loc10_: b2Mat22 = null;
        var _loc11_: number = NaN;
        var _loc12_: number = NaN;
        var _loc13_: number = 0;
        var _loc14_: number = NaN;
        var _loc15_: number = NaN;
        var _loc16_: b2Vec2 = null;
        var _loc17_: Vector<b2Vec2> = null;
        var _loc18_: number = 0;
        var _loc19_: number = 0;
        this.armSprite.graphics.clear();
        var _loc1_: Vector<b2Vec2> = new Vector<b2Vec2>();
        _loc1_.push(new b2Vec2(5, 0), new b2Vec2(-5, 0), new b2Vec2(0, 10));
        var _loc2_ = int(this._targets.length);
        var _loc3_: number = 0;
        while (_loc3_ < _loc2_) {
            _loc4_ = this._targets[_loc3_];
            _loc5_ = _loc4_.x - this.x;
            _loc6_ = _loc4_.y - this.y;
            this.armSprite.graphics.lineStyle(3, 6710886, 1, false);
            this.armSprite.graphics.moveTo(0, 0);
            this.armSprite.graphics.lineTo(_loc5_, _loc6_);
            if (_loc4_ instanceof RefTrigger) {
                _loc7_ = 0;
                _loc8_ = 0;
                _loc9_ = Math.atan2(_loc6_, _loc5_);
                _loc10_ = new b2Mat22(_loc9_ - Math.PI * 0.5);
                _loc11_ =
                    Math.sqrt(Math.pow(_loc6_, 2) + Math.pow(_loc5_, 2)) - 10;
                _loc12_ = 50;
                _loc13_ = Math.floor(_loc11_ / _loc12_);
                _loc14_ = _loc12_ * Math.cos(_loc9_);
                _loc15_ = _loc12_ * Math.sin(_loc9_);
                _loc16_ = _loc1_[0];
                _loc17_ = new Vector<b2Vec2>();
                _loc18_ = 0;
                while (_loc18_ < 3) {
                    _loc16_ = _loc1_[_loc18_];
                    _loc16_ = _loc16_.Copy();
                    _loc16_.MulM(_loc10_);
                    _loc17_.push(_loc16_);
                    _loc18_++;
                }
                _loc18_ = 1;
                while (_loc18_ <= _loc13_) {
                    _loc7_ += _loc14_;
                    _loc8_ += _loc15_;
                    _loc16_ = _loc17_[2];
                    this.armSprite.graphics.lineStyle(null);
                    this.armSprite.graphics.beginFill(6710886);
                    this.armSprite.graphics.moveTo(
                        _loc16_.x + _loc7_,
                        _loc16_.y + _loc8_,
                    );
                    _loc19_ = 0;
                    while (_loc19_ < 3) {
                        _loc16_ = _loc17_[_loc19_];
                        this.armSprite.graphics.lineTo(
                            _loc16_.x + _loc7_,
                            _loc16_.y + _loc8_,
                        );
                        _loc19_++;
                    }
                    this.armSprite.graphics.endFill();
                    _loc18_++;
                }
            }
            _loc3_++;
        }
        if (this.selected) {
            this.drawBoundingBox();
        }
    }

    private targetMoved(param1: Event) {
        this.drawArms();
    }

    public override set x(param1: number) {
        this.armSprite.graphics.clear();
        super.x = param1;
        this.drawArms();
    }

    public override set y(param1: number) {
        this.armSprite.graphics.clear();
        super.y = param1;
        this.drawArms();
    }

    public setPositionOld(param1: number, param2: number) {
        super.x = param1;
        super.y = param2;
    }

    public override get scaleX(): number {
        return this.scaleXCopy;
    }

    public override set scaleX(param1: number) {
        if (param1 < this.minDimension) {
            param1 = this.minDimension;
        }
        if (param1 > this.maxDimension) {
            param1 = this.maxDimension;
        }
        this.scaleXCopy = param1;
        this.drawShape();
        this.x = this.x;
        this.y = this.y;
    }

    public override get scaleY(): number {
        return this.scaleYCopy;
    }

    public override set scaleY(param1: number) {
        if (param1 < this.minDimension) {
            param1 = this.minDimension;
        }
        if (param1 > this.maxDimension) {
            param1 = this.maxDimension;
        }
        this.scaleYCopy = param1;
        this.drawShape();
        this.x = this.x;
        this.y = this.y;
    }

    public override get angle(): number {
        return this.rotationCopy;
    }

    public override set angle(param1: number) {
        if (param1 > 180) {
            param1 -= 360;
        }
        if (param1 < -180) {
            param1 += 360;
        }
        this.rotationCopy = param1;
        this.drawShape();
        this.x = this.x;
        this.y = this.y;
    }

    public get triggerType(): string {
        return this._triggerType;
    }

    public set triggerType(param1: string) {
        var _loc4_: RefSprite = null;
        this._triggerType = param1;
        var _loc2_ = int(RefTrigger.typeArray.indexOf(param1));
        if (_loc2_ < 0) {
            throw new Error("TRIGGER TYPE NOT IN TYPE ARRAY");
        }
        this._typeIndex = _loc2_ + 1;
        if (this._typeIndex == 1) {
            this.addChildAt(this.armSprite, 1);
            if (this._selected) {
                this.drawBoundingBox();
            }
        } else if (this._triggeredBy != 4) {
            if (this.armSprite.parent) {
                this.removeChild(this.armSprite);
                if (this._selected) {
                    this.drawBoundingBox();
                }
            }
        }
        this.setAttributes();
        var _loc3_: number = 0;
        while (_loc3_ < this._targets.length) {
            _loc4_ = this._targets[_loc3_];
            _loc4_.setAttributes();
            _loc3_++;
        }
    }

    public get triggerDelay(): number {
        return this._triggerDelay;
    }

    public set triggerDelay(param1: number) {
        if (param1 < RefTrigger.minDelay) {
            param1 = RefTrigger.minDelay;
        }
        if (param1 > RefTrigger.maxDelay) {
            param1 = RefTrigger.maxDelay;
        }
        this._triggerDelay = param1;
    }

    public get typeIndex(): number {
        return this._typeIndex;
    }

    public set typeIndex(param1: number) {
        this._typeIndex = param1;
        if (
            this._typeIndex > RefTrigger.typeArray.length ||
            this.typeIndex < 1
        ) {
            throw new Error("TYPE INDEX OUT OF TYPEARRAY RANGE");
        }
        this.triggerType = RefTrigger.typeArray[this._typeIndex - 1];
    }

    public get soundEffect(): string {
        return this._soundEffect;
    }

    public set soundEffect(param1: string) {
        this._soundEffect = param1;
    }

    public get panning(): number {
        return this._panning;
    }

    public set panning(param1: number) {
        if (param1 < -1) {
            param1 = -1;
        }
        if (param1 > 1) {
            param1 = 1;
        }
        this._panning = param1;
    }

    public get volume(): number {
        return this._volume;
    }

    public set volume(param1: number) {
        if (param1 < 0) {
            param1 = 0;
        }
        if (param1 > 1) {
            param1 = 1;
        }
        this._volume = param1;
    }

    public get soundLocation(): number {
        return this._soundLocation;
    }

    public set soundLocation(param1: number) {
        if (param1 < 1) {
            param1 = 1;
        }
        if (param1 > 2) {
            param1 = 2;
        }
        this._soundLocation = param1;
        this.setAttributes();
    }

    public get triggeredBy(): number {
        return this._triggeredBy;
    }

    public set triggeredBy(param1: number) {
        if (param1 < 1) {
            param1 = 1;
        }
        if (param1 > 6) {
            param1 = 6;
        }
        this._triggeredBy = param1;
        if (this._triggeredBy == 4) {
            this.addChildAt(this.armSprite, 1);
            if (this._selected) {
                this.drawBoundingBox();
            }
        } else if (this._typeIndex != 1) {
            if (this.armSprite.parent) {
                this.removeChild(this.armSprite);
                if (this._selected) {
                    this.drawBoundingBox();
                }
            }
        }
    }

    public get repeatType(): number {
        return this._repeatType;
    }

    public set repeatType(param1: number) {
        if (param1 < 1) {
            param1 = 1;
        }
        if (param1 > 4) {
            param1 = 4;
        }
        this._repeatType = param1;
        this.setAttributes();
    }

    public get repeatInterval(): number {
        return this._repeatInterval;
    }

    public set repeatInterval(param1: number) {
        if (param1 < 0.1) {
            param1 = 0.1;
        }
        if (param1 > 30) {
            param1 = 30;
        }
        this._repeatInterval = param1;
    }

    public get startDisabled(): boolean {
        return this._startDisabled;
    }

    public set startDisabled(param1: boolean) {
        if (param1 == this._startDisabled) {
            return;
        }
        this._startDisabled = param1;
        this.drawShape();
    }

    public get addingTargets(): boolean {
        return this._addingTargets;
    }

    public set addingTargets(param1: boolean) {
        this._addingTargets = param1;
    }

    public get targets(): any[] {
        return this._targets;
    }

    public get cloneTargets(): any[] {
        return this._cloneTargets;
    }

    public override clone(): RefSprite {
        var _loc1_: RefTrigger = null;
        _loc1_ = new RefTrigger();
        _loc1_.x = this.x;
        _loc1_.y = this.y;
        _loc1_.angle = this.angle;
        _loc1_.scaleX = this.scaleX;
        _loc1_.scaleY = this.scaleY;
        _loc1_.triggerDelay = this.triggerDelay;
        _loc1_.repeatInterval = this.repeatInterval;
        _loc1_.typeIndex = this.typeIndex;
        _loc1_.triggeredBy = this.triggeredBy;
        _loc1_.repeatType = this.repeatType;
        _loc1_.soundEffect = this.soundEffect;
        _loc1_.panning = this.panning;
        _loc1_.volume = this.volume;
        _loc1_.soundLocation = this.soundLocation;
        _loc1_.startDisabled = this.startDisabled;
        this.transferKeyedProperties(_loc1_);
        return _loc1_;
    }

    public setNumLabel(param1: number) {
        this.numLabel.text = param1.toString();
        this.addChild(this.numLabel);
    }

    public addTarget(param1: RefSprite): Action {
        this._targets.push(param1);
        param1.addEventListener(
            RefSprite.COORDINATE_CHANGE,
            this.targetMoved,
            false,
            0,
            true,
        );
        param1.addTrigger(this);
        var _loc2_ = new ActionTriggerAdd(
            this,
            param1,
            this._targets.length - 1,
        );
        this.drawArms();
        return _loc2_;
    }

    public addMoveListener(param1: RefSprite) {
        param1.addEventListener(
            RefSprite.COORDINATE_CHANGE,
            this.targetMoved,
            false,
            0,
            true,
        );
    }

    public removeTarget(param1: RefSprite): Action {
        var _loc3_: RefSprite = null;
        var _loc4_: ActionTriggerRemove = null;
        var _loc2_ = int(this._targets.indexOf(param1));
        if (_loc2_ > -1) {
            _loc3_ = this._targets[_loc2_];
            _loc3_.removeEventListener(
                RefSprite.COORDINATE_CHANGE,
                this.targetMoved,
            );
            _loc4_ = new ActionTriggerRemove(this, param1, _loc2_);
            this._targets.splice(_loc2_, 1);
            this.drawArms();
            return _loc4_;
        }
        throw new Error("target not contained in this trigger");
    }

    public removeLastTarget(): Action {
        var _loc1_ = int(this._targets.length - 1);
        var _loc2_: RefSprite = this._targets[_loc1_];
        _loc2_.removeEventListener(
            RefSprite.COORDINATE_CHANGE,
            this.targetMoved,
        );
        var _loc3_ = new ActionTriggerRemove(this, _loc2_, _loc1_);
        this._targets.splice(_loc1_, 1);
        _loc2_.removeTrigger(this);
        this.drawArms();
        return _loc3_;
    }

    public removeMoveListener(param1: RefSprite) {
        param1.removeEventListener(
            RefSprite.COORDINATE_CHANGE,
            this.targetMoved,
        );
    }

    public override deleteSelf(param1: Canvas): Action {
        var _loc2_: Action = null;
        var _loc3_: Action = null;
        var _loc5_: RefSprite = null;
        var _loc6_: RefTrigger = null;
        var _loc4_ = 0;
        while (_loc4_ < this._targets.length) {
            _loc5_ = this._targets[_loc4_];
            this._targets.splice(_loc4_, 1);
            _loc5_.removeEventListener(
                RefSprite.COORDINATE_CHANGE,
                this.targetMoved,
            );
            _loc5_.removeTrigger(this);
            _loc2_ = new ActionTriggerRemove(this, _loc5_, _loc4_);
            if (_loc3_) {
                _loc3_.nextAction = _loc2_;
            }
            _loc3_ = _loc2_;
            _loc4_ = --_loc4_ + 1;
        }
        _loc4_ = 0;
        while (_loc4_ < this._triggers.length) {
            _loc6_ = this._triggers[_loc4_];
            _loc2_ = _loc6_.removeTarget(this);
            if (_loc3_) {
                _loc3_.nextAction = _loc2_.firstAction;
            }
            _loc3_ = _loc2_;
            this.removeTrigger(_loc6_);
            _loc4_ = --_loc4_ + 1;
        }
        if (this.parent) {
            _loc2_ = new ActionDelete(
                this,
                param1,
                this.parent.getChildIndex(this),
            );
            if (_loc3_) {
                _loc3_.nextAction = _loc2_;
            }
            param1.removeRefSprite(this);
            return _loc2_;
        }
        return null;
    }
}