import Settings from "@/com/totaljerkface/game/Settings";
import MouseHelper from "@/com/totaljerkface/game/editor/MouseHelper";
import ColorSquare from "@/com/totaljerkface/game/editor/ui/ColorSquare";
import DropperCursor from "@/com/totaljerkface/game/editor/ui/DropperCursor";
import GenericButton from "@/com/totaljerkface/game/editor/ui/GenericButton";
import LibraryButton from "@/com/totaljerkface/game/editor/ui/LibraryButton";
import ColorSpectrumRing from "@/top/ColorSpectrumRing";
import DropperButton from "@/top/DropperButton";
import HueSliderTab from "@/top/HueSliderTab";
import { boundClass } from 'autobind-decorator';
import Bitmap from "flash/display/Bitmap";
import BitmapData from "flash/display/BitmapData";
import Sprite from "flash/display/Sprite";
import Event from "flash/events/Event";
import KeyboardEvent from "flash/events/KeyboardEvent";
import MouseEvent from "flash/events/MouseEvent";
import DropShadowFilter from "flash/filters/DropShadowFilter";
import Point from "flash/geom/Point";
import AntiAliasType from "flash/text/AntiAliasType";
import TextField from "flash/text/TextField";
import TextFieldType from "flash/text/TextFieldType";
import TextFormat from "flash/text/TextFormat";
import TextFormatAlign from "flash/text/TextFormatAlign";
import Mouse from "flash/ui/Mouse";

@boundClass
export default class ColorSelector extends Sprite {
    public static swatches: any[];
    public static COLOR_SELECTED: string = "colorselected";
    public static ROLL_OUT: string = "rollout";
    private bg: Sprite;
    private bgWidth: number = 307;
    private bgHeight: number = 185;
    private _startColor: number;
    private _currentColor: number;
    private _selectedColor: number;
    private _currentHue: number = 16711680;
    private huePosition: number = 0;
    private colorSprite: Sprite;
    private colorText: TextField;
    private noColorBtn: Sprite;
    private _minusColor: boolean;
    public spectrumSprite: Sprite;
    public hueSliderSprite: Sprite;
    public hueSliderBitmap: Bitmap;
    public hueSliderTab: Sprite;
    public spectrumBitmap: Bitmap;
    public spectrumWidth: number = 128;
    public sliderHeight: number = 15;
    private ring: Sprite;
    private prevRing: Sprite;
    private bitmapData: BitmapData;
    private blocker: Sprite;
    private colorSquares: any[];
    private currentSwatch: ColorSquare;
    private swatchOutline: Sprite;
    private swatchColumnLength: number = 16;
    private swatchSize: number = 10;
    private swatchSpacer: number = 0;
    private swatchMax: number = 128;
    private swatchStartX: number;
    private swatchStartY: number;
    private swatchBeginIndex: number = 25;
    private maxSwatches: number =
        Math.floor(120 / this.swatchSize) * this.swatchColumnLength;
    private addSwatchButton: GenericButton;
    private remSwatchButton: GenericButton;
    private dropperButton: LibraryButton;
    private dropperCursor: DropperCursor;
    private tracking: boolean = false;
    private spectrumTracking: boolean = false;

    constructor(param1: number, param2: boolean) {
        super();
        this._startColor = this._currentColor = param1;
        this._minusColor = param2;
        this.addEventListener(Event.ADDED_TO_STAGE, this.addedToStageHandler);
    }

    private addedToStageHandler(param1: Event) {
        this.removeEventListener(
            Event.ADDED_TO_STAGE,
            this.addedToStageHandler,
        );
        this.init();
    }

    public init() {
        var _loc2_: number = 0;
        var _loc3_: Sprite = null;
        var _loc4_: number = 0;
        this.drawBg();
        this.ring = new ColorSpectrumRing();
        this.prevRing = new ColorSpectrumRing();
        this.colorSprite = new Sprite();
        this.addChild(this.colorSprite);
        this.colorSprite.x = 7;
        this.colorSprite.y = 7;
        this.drawColorSprite();
        this.createTextField();
        if (this._minusColor) {
            this.createNoColorBtn();
        }
        var _loc1_: number = 7;
        _loc2_ = 28;
        this.refreshSpectrum();
        this.addHueSlider();
        this.spectrumSprite.x = _loc1_;
        this.spectrumSprite.y = _loc2_;
        this.hueSliderSprite.x = _loc1_;
        this.hueSliderSprite.y =
            this.spectrumSprite.y + this.spectrumSprite.height + 6;
        this.addSwatches();
        this.spectrumSprite.addChild(this.ring);
        this.spectrumSprite.addChild(this.prevRing);
        this.prevRing.alpha = 0.5;
        this.prevRing.visible = false;
        _loc3_ = new Sprite();
        _loc3_.graphics.beginFill(16711680, 0.5);
        _loc3_.graphics.drawRect(0, 0, this.spectrumWidth, this.spectrumWidth);
        _loc3_.x = this.spectrumSprite.x;
        _loc3_.y = this.spectrumSprite.y;
        this.addChild(_loc3_);
        this.spectrumSprite.mask = _loc3_;
        _loc4_ = 23;
        var _loc5_: GenericButton = (this.addSwatchButton = new GenericButton(
            "+    ",
            16777215,
            _loc4_,
            0,
        ));
        this.remSwatchButton = new GenericButton("-", 16777215, _loc4_, 0);
        this.addChild(this.addSwatchButton);
        this.addChild(this.remSwatchButton);
        this.checkIfColorIsSwatch();
        this.dropperButton = new DropperButton();
        this.addChild(this.dropperButton);
        this.remSwatchButton.x =
            this.swatchStartX +
            this.swatchColumnLength * (this.swatchSize + this.swatchSpacer) -
            this.remSwatchButton.width;
        var _loc6_ = this.bg.height - this.remSwatchButton.height - 7;
        this.dropperButton.y = this.bg.height - this.remSwatchButton.height - 7;
        this.remSwatchButton.y = this.addSwatchButton.y = _loc6_;
        this.addSwatchButton.x = this.remSwatchButton.x - (_loc4_ + 5);
        this.dropperButton.x = this.swatchStartX;
        this.showColorInUI();
        this.prevRing.x = this.ring.x;
        this.prevRing.y = this.ring.y;
        this.prevRing.visible = true;
        this.currentColor = this._currentColor;
        this.selectedColor = this._currentColor;
        this.addEventListener(MouseEvent.MOUSE_OVER, this.mouseOverHandler);
        this.addEventListener(MouseEvent.MOUSE_DOWN, this.mouseDownHandler);
        this.addEventListener(MouseEvent.MOUSE_UP, this.mouseUpHandler);
        this.addEventListener(MouseEvent.MOUSE_MOVE, this.mouseMoveHandler);
        this.addEventListener(MouseEvent.MOUSE_OUT, this.mouseOutHandler);
        this.addEventListener(MouseEvent.ROLL_OUT, this.mouseRollOutHander);
        this.colorText.addEventListener(
            KeyboardEvent.KEY_UP,
            this.keyUpHandler,
        );
        this.stage.addEventListener(
            KeyboardEvent.KEY_UP,
            this.stageKeyUpHandler,
        );
        this.refreshBitmapData();
    }

    private frameRenderedHandler(param1: Event) {
        this.removeEventListener(Event.ENTER_FRAME, this.frameRenderedHandler);
        this.refreshBitmapData();
    }

    private drawBg() {
        var _loc1_: DropShadowFilter = null;
        if (!this.bg) {
            this.bg = new Sprite();
            this.addChild(this.bg);
            _loc1_ = new DropShadowFilter(7, 90, 0, 1, 7, 7, 0.2, 3);
            this.bg.filters = [_loc1_];
        }
        this.bg.graphics.beginFill(10066329);
        this.bg.graphics.drawRect(0, 0, this.bgWidth, this.bgHeight);
        this.bg.graphics.endFill();
        this.bg.graphics.beginFill(13421772);
        this.bg.graphics.drawRect(2, 2, this.bgWidth - 4, this.bgHeight - 4);
        this.bg.graphics.endFill();
    }

    private createTextField() {
        var _loc1_ = new TextFormat(
            "HelveticaNeueLT Std",
            11,
            4032711,
            null,
            null,
            null,
            null,
            null,
            TextFormatAlign.LEFT,
        );
        this.colorText = new TextField();
        this.colorText.defaultTextFormat = _loc1_;
        this.colorText.maxChars = 6;
        this.colorText.type = TextFieldType.INPUT;
        this.colorText.width = 70;
        this.colorText.height = 20;
        this.colorText.x = this.colorSprite.x + this.colorSprite.width + 5;
        this.colorText.y = this.colorSprite.y;
        this.colorText.multiline = false;
        this.colorText.selectable = true;
        this.colorText.embedFonts = true;
        // @ts-expect-error
        this.colorText.antiAliasType = AntiAliasType.ADVANCED;
        this.colorText.restrict = "1234567890ABCDEF";
        this.addChild(this.colorText);
    }

    private createNoColorBtn() {
        this.noColorBtn = new Sprite();
        this.noColorBtn.buttonMode = true;
        this.noColorBtn.tabEnabled = false;
        this.addChild(this.noColorBtn);
        this.noColorBtn.x = this.bgWidth - 23;
        this.noColorBtn.y = 7;
        this.noColorBtn.graphics.beginFill(16777215);
        this.noColorBtn.graphics.drawRect(0, 0, 16, 16);
        this.noColorBtn.graphics.endFill();
        this.noColorBtn.graphics.beginFill(16711680);
        this.noColorBtn.graphics.moveTo(13.5, 0);
        this.noColorBtn.graphics.lineTo(16, 0);
        this.noColorBtn.graphics.lineTo(16, 2.5);
        this.noColorBtn.graphics.lineTo(2.5, 16);
        this.noColorBtn.graphics.lineTo(0, 16);
        this.noColorBtn.graphics.lineTo(0, 13.5);
        this.noColorBtn.graphics.lineTo(13.5, 0);
        this.noColorBtn.graphics.endFill();
    }

    private drawColorSprite() {
        this.colorSprite.graphics.clear();
        this.colorSprite.graphics.beginFill(this._currentColor);
        this.colorSprite.graphics.drawRect(0, 0, 36, 16);
        this.colorSprite.graphics.endFill();
    }

    private refreshSpectrum() {
        var _loc3_: number = NaN;
        var _loc4_: number = NaN;
        var _loc5_: number = 0;
        var _loc6_ = 0;
        var _loc8_: number = 0;
        if (!this.spectrumSprite) {
            this.spectrumSprite = new Sprite();
            this.spectrumBitmap = new Bitmap();
            this.spectrumSprite.addChild(this.spectrumBitmap);
            this.spectrumSprite.mouseChildren = false;
            this.addChild(this.spectrumSprite);
        }
        var _loc1_: number = 16777215;
        var _loc2_ = new BitmapData(
            this.spectrumWidth,
            this.spectrumWidth,
            false,
        );
        var _loc7_: number = 0;
        while (_loc7_ < this.spectrumWidth) {
            _loc3_ = _loc7_ / this.spectrumWidth;
            _loc5_ = int(
                this.interpolateColor(_loc1_, this._currentHue, _loc3_),
            );
            _loc8_ = 0;
            while (_loc8_ < this.spectrumWidth) {
                _loc4_ = _loc8_ / this.spectrumWidth;
                _loc6_ = this.interpolateColor(_loc5_, 0, _loc4_);
                _loc2_.setPixel(_loc7_, _loc8_, _loc6_);
                _loc8_++;
            }
            _loc7_++;
        }
        this.spectrumBitmap.bitmapData = _loc2_;
    }

    private addHueSlider() {
        var _loc4_: number = 0;
        var _loc1_: any[] = this.createSpectrum(this.spectrumWidth);
        this.hueSliderSprite = new Sprite();
        this.hueSliderSprite.mouseChildren = false;
        this.addChild(this.hueSliderSprite);
        var _loc2_ = new BitmapData(
            this.spectrumWidth,
            this.sliderHeight,
            false,
        );
        var _loc3_: number = 0;
        while (_loc3_ < _loc1_.length) {
            _loc4_ = 0;
            while (_loc4_ < this.sliderHeight) {
                _loc2_.setPixel(_loc3_, _loc4_, _loc1_[_loc3_]);
                _loc4_++;
            }
            _loc3_++;
        }
        this.hueSliderBitmap = new Bitmap(_loc2_);
        this.hueSliderSprite.addChild(this.hueSliderBitmap);
        this.hueSliderTab = new HueSliderTab() as Sprite;
        this.hueSliderSprite.addChild(this.hueSliderTab);
    }

    private addSwatches() {
        var _loc5_ = 0;
        var _loc1_: number = (this.swatchStartX =
            this.spectrumSprite.x + this.spectrumSprite.width + 5);
        var _loc2_: number = (this.swatchStartY = this.spectrumSprite.y);
        if (Settings.sharedObject.data["colorSwatches"]) {
            ColorSelector.swatches =
                Settings.sharedObject.data["colorSwatches"];
        } else {
            ColorSelector.swatches = new Array();
            _loc5_ = 0;
            while (_loc5_ <= 16777215) {
                ColorSelector.swatches.push(_loc5_);
                _loc5_ += 1118481;
            }
            ColorSelector.swatches.push(16711680);
            ColorSelector.swatches.push(16776960);
            ColorSelector.swatches.push(65280);
            ColorSelector.swatches.push(65535);
            ColorSelector.swatches.push(255);
            ColorSelector.swatches.push(16711935);
            ColorSelector.swatches.push(4032711);
            ColorSelector.swatches.push(16777062);
            ColorSelector.swatches.push(16613761);
            Settings.sharedObject.data["colorSwatches"] =
                ColorSelector.swatches;
        }
        var _loc3_ = new TextFormat(
            "HelveticaNeueLT Std",
            11,
            16777215,
            null,
            null,
            null,
            null,
            null,
            TextFormatAlign.LEFT,
        );
        var _loc4_ = new TextField();
        _loc4_.defaultTextFormat = _loc3_;
        _loc4_.width = 70;
        _loc4_.height = 20;
        _loc4_.x = this.colorSprite.x + this.colorSprite.width + 5;
        _loc4_.y = this.colorSprite.y;
        _loc4_.multiline = false;
        _loc4_.selectable = false;
        _loc4_.embedFonts = true;
        // @ts-expect-error
        _loc4_.antiAliasType = AntiAliasType.ADVANCED;
        _loc4_.text = "Saved Colors";
        _loc4_.x = this.spectrumSprite.x + this.spectrumWidth + 5;
        _loc4_.y = this.colorText.y;
        this.addChild(_loc4_);
        this.refreshSwatches();
        this.swatchOutline = new Sprite();
        this.swatchOutline.graphics.lineStyle(1, 16777215);
        this.swatchOutline.graphics.drawRect(
            0,
            0,
            this.swatchSize,
            this.swatchSize,
        );
        this.swatchOutline.visible = false;
        this.swatchOutline.mouseEnabled = false;
        this.addChild(this.swatchOutline);
    }

    public refreshSwatches() {
        var _loc1_: ColorSquare = null;
        var _loc4_: number = 0;
        var _loc5_: ColorSquare = null;
        if (this.colorSquares) {
            while (_loc4_ < this.colorSquares.length) {
                _loc5_ = this.colorSquares[_loc4_];
                this.removeChild(_loc5_);
                _loc4_++;
            }
        }
        this.colorSquares = new Array();
        ColorSquare.squareWidth = this.swatchSize;
        var _loc2_: number = this.swatchStartX;
        var _loc3_: number = this.swatchStartY;
        _loc4_ = 0;
        while (_loc4_ < ColorSelector.swatches.length) {
            _loc1_ = new ColorSquare(ColorSelector.swatches[_loc4_]);
            _loc1_.x =
                _loc2_ +
                (_loc4_ % this.swatchColumnLength) *
                (this.swatchSize + this.swatchSpacer);
            _loc1_.y =
                _loc3_ +
                Math.floor(_loc4_ / this.swatchColumnLength) *
                (this.swatchSize + this.swatchSpacer);
            this.colorSquares.push(_loc1_);
            this.addChild(_loc1_);
            _loc4_++;
        }
        if (this.swatchOutline) {
            this.removeChild(this.swatchOutline);
            this.addChild(this.swatchOutline);
        }
        Settings.sharedObject.data["colorSwatches"] = ColorSelector.swatches;
        this.refreshBitmapData();
    }

    public set currentHue(param1: number) {
        this._currentHue = param1;
        this.refreshSpectrum();
    }

    public get selectedColor(): number {
        return this._selectedColor;
    }

    public set selectedColor(param1: number) {
        this._selectedColor = param1;
        this.showColorInUI();
        this.commitColor();
    }

    private checkIfColorIsSwatch() {
        var _loc2_: number = NaN;
        var _loc3_: number = NaN;
        var _loc1_ = int(ColorSelector.swatches.indexOf(this.currentColor));
        if (_loc1_ > -1) {
            this.addSwatchButton.disabled = true;
            if (_loc1_ >= this.swatchBeginIndex && this.currentColor != -1) {
                this.remSwatchButton.disabled = false;
            } else {
                this.remSwatchButton.disabled = true;
            }
            _loc2_ =
                this.swatchStartX +
                (_loc1_ % this.swatchColumnLength) *
                (this.swatchSize + this.swatchSpacer);
            _loc3_ =
                this.swatchStartY +
                Math.floor(_loc1_ / this.swatchColumnLength) *
                (this.swatchSize + this.swatchSpacer);
            this.swatchOutline.visible = true;
            this.swatchOutline.x = _loc2_;
            this.swatchOutline.y = _loc3_;
        } else {
            this.swatchOutline.visible = false;
            this.addSwatchButton.disabled = false;
            this.remSwatchButton.disabled = true;
        }
    }

    public get currentColor(): number {
        return this._currentColor;
    }

    public set currentColor(param1: number) {
        var _loc2_: string = null;
        this._currentColor = param1;
        this.drawColorSprite();
        if (this._currentColor < 0) {
            this.colorText.text = "";
        } else {
            _loc2_ = this._currentColor.toString(16).toUpperCase();
            while (_loc2_.length < 6) {
                _loc2_ = "0" + _loc2_;
            }
            this.colorText.text = _loc2_;
        }
        this.checkIfColorIsSwatch();
    }

    public showColorInUI() {
        var _loc16_ = undefined;
        var _loc17_: number = NaN;
        var _loc18_: number = NaN;
        var _loc19_: number = NaN;
        var _loc1_: string = this.currentColor.toString(16).toUpperCase();
        if (_loc1_.length < 6) {
            _loc1_ = "0" + _loc1_;
        }
        var _loc2_ = this.getColorObject();
        var _loc3_: number = _loc2_.red / 255;
        var _loc4_: number = _loc2_.green / 255;
        var _loc5_: number = _loc2_.blue / 255;
        var _loc6_: number = Math.max(_loc3_, _loc4_, _loc5_);
        var _loc7_: number = Math.min(_loc3_, _loc4_, _loc5_);
        var _loc8_: number = _loc6_;
        if (_loc6_ < 1) {
            _loc16_ = 1 / _loc6_;
            _loc17_ = _loc2_.red * _loc16_;
            _loc18_ = _loc2_.green * _loc16_;
            _loc19_ = _loc2_.blue * _loc16_;
        } else {
            _loc17_ = Number(_loc2_.red);
            _loc18_ = Number(_loc2_.green);
            _loc19_ = Number(_loc2_.blue);
        }
        var _loc9_: number = Math.min(_loc17_, _loc18_, _loc19_);
        var _loc10_: number = (255 - _loc9_) / 255;
        if (_loc9_ > 0) {
            _loc16_ = 255 / (255 - _loc9_);
            _loc17_ = (_loc17_ - _loc9_) * _loc16_;
            _loc18_ = (_loc18_ - _loc9_) * _loc16_;
            _loc19_ = (_loc19_ - _loc9_) * _loc16_;
        }
        var _loc11_: number = Math.atan2(
            Math.sqrt(3) * (_loc18_ - _loc19_),
            2 * _loc17_ - _loc18_ - _loc19_,
        );
        if (isNaN(_loc11_)) {
            _loc11_ = 0;
        }
        if (_loc11_ < 0) {
            _loc11_ += Math.PI * 2;
        }
        var _loc12_: number = (_loc11_ * 180) / Math.PI;
        this.currentHue = this.intForHueValue(_loc12_);
        this.ring.x = Math.round(this.spectrumWidth * _loc10_);
        this.ring.y = Math.round(this.spectrumWidth * (1 - _loc8_));
        this.prevRing.x = this.ring.x;
        this.prevRing.y = this.ring.y;
        var _loc13_: number = (_loc11_ / (Math.PI * 2)) * this.spectrumWidth;
        this.hueSliderTab.x = _loc13_;
        var _loc14_: number = _loc13_ / this.spectrumWidth;
        var _loc15_: number = Math.round(_loc14_ * 360);
        this.huePosition = _loc15_;
    }

    protected getColorObject() {
        var _loc1_: any = {};
        var _loc2_: string = this.currentColor.toString(16);
        while (_loc2_.length < 6) {
            _loc2_ = "0" + _loc2_;
        }
        _loc1_.red = uint("0x" + _loc2_.substring(0, 2));
        _loc1_.green = uint("0x" + _loc2_.substr(2, 2));
        _loc1_.blue = uint("0x" + _loc2_.substr(4, 2));
        return _loc1_ as { red: number, green: number, blue: number };
    }

    private refreshBitmapData() {
        trace("refresh bitmap data");
        this.bitmapData = new BitmapData(
            this.stage.stageWidth,
            this.stage.stageHeight,
        );
        this.bitmapData.draw(this.stage);
    }

    private commitColor(param1: Point = null) {
        Mouse.show();
        this.dispatchEvent(new Event(ColorSelector.COLOR_SELECTED));
    }

    private mouseOverHandler(param1: MouseEvent) {
        if (this.tracking) {
            return;
        }
        if (this.spectrumTracking) {
            if (param1.target != this.blocker) {
                if (param1.target instanceof ColorSquare) {
                }
            }
            return;
        }
        if (param1.target instanceof ColorSquare) {
            this.moveSwatchOutline(param1);
        } else if (param1.target == this.addSwatchButton) {
            MouseHelper.instance.show("save color", this.addSwatchButton);
        } else if (param1.target == this.remSwatchButton) {
            MouseHelper.instance.show(
                "remove saved color",
                this.remSwatchButton,
            );
        }
    }

    private mouseMoveHandler(param1: MouseEvent) {
        if (this.spectrumTracking) {
            if (!(param1.target instanceof ColorSquare)) {
                if (param1.target == this.blocker) {
                }
            }
            return;
        }
    }

    private moveSwatchOutline(param1: MouseEvent) {
        var _loc2_: ColorSquare = param1.target as ColorSquare;
        this.currentColor = _loc2_.color;
        this.swatchOutline.visible = true;
        this.swatchOutline.x = _loc2_.x;
        this.swatchOutline.y = _loc2_.y;
    }

    private mouseDownHandler(param1: MouseEvent) {
        switch (param1.target) {
            case this.spectrumSprite:
                Mouse.hide();
                this.colorText.mouseEnabled = false;
                this.spectrumTracking = true;
                this.stage.addEventListener(
                    MouseEvent.MOUSE_UP,
                    this.mouseUpHandler,
                );
                this.stage.addEventListener(
                    MouseEvent.MOUSE_MOVE,
                    this.spectrumMouseTrack,
                );
                this.spectrumMouseTrack(param1);
                break;
            case this.hueSliderSprite:
                this.tracking = true;
                this.stage.addEventListener(
                    MouseEvent.MOUSE_UP,
                    this.mouseUpHandler,
                );
                this.stage.addEventListener(
                    MouseEvent.MOUSE_MOVE,
                    this.mouseTrack,
                );
                this.mouseTrack(param1);
        }
    }

    private setColorForSpectrumPosition(param1: Point = null) {
        var _loc2_: Point = null;
        if (param1) {
            _loc2_ = this.spectrumSprite.globalToLocal(param1);
        } else {
            _loc2_ = this.spectrumSprite.globalToLocal(
                new Point(this.stage.mouseX, this.stage.mouseY),
            );
            this.ring.x = Math.max(0, Math.min(_loc2_.x, this.spectrumWidth));
            this.ring.y = Math.max(0, Math.min(_loc2_.y, this.spectrumWidth));
        }
        var _loc3_: number = this.ring.x / this.spectrumWidth;
        var _loc4_: number = 1 - this.ring.y / this.spectrumWidth;
        var _loc9_ = _loc5_[0] * 255;
        var _loc5_: any[] = this.HSVtoRGB(this.huePosition, _loc3_, _loc4_);
        _loc5_[0] = _loc5_[0] * 255;
        var _loc6_: number = _loc9_;
        _loc9_ = _loc5_[1] * 255;
        _loc5_[1] *= 255;
        var _loc7_: number = _loc9_;
        _loc9_ = _loc5_[2] * 255;
        _loc5_[2] *= 255;
        var _loc8_: number = _loc9_;
        this.currentColor = (_loc6_ << 16) | (_loc7_ << 8) | _loc8_;
    }

    private mouseRollOutHander(param1: MouseEvent) {
        this.dispatchEvent(new Event(ColorSelector.ROLL_OUT));
    }

    private mouseOutHandler(param1: MouseEvent) {
        var _loc2_: ColorSquare = null;
        if (param1.target instanceof ColorSquare) {
            if (!this.spectrumTracking) {
                _loc2_ = param1.target as ColorSquare;
                this.currentColor = this.selectedColor;
            }
        } else if (param1.target == this.spectrumSprite) {
            Mouse.show();
        } else if (param1.target != this.blocker) {
            if (param1.target == this.bg) {
            }
        }
    }

    private mouseUpHandler(param1: MouseEvent) {
        var _loc2_: ColorSquare = null;
        this.colorText.mouseEnabled = true;
        if (this.tracking) {
            this.tracking = false;
            this.stage.removeEventListener(
                MouseEvent.MOUSE_UP,
                this.mouseUpHandler,
            );
            this.stage.removeEventListener(
                MouseEvent.MOUSE_MOVE,
                this.mouseTrack,
            );
            return;
        }
        if (this.spectrumTracking) {
            this.spectrumTracking = false;
            this.stage.removeEventListener(
                MouseEvent.MOUSE_MOVE,
                this.spectrumMouseTrack,
            );
            this.stage.removeEventListener(
                MouseEvent.MOUSE_UP,
                this.mouseUpHandler,
            );
            if (param1.target != this.blocker) {
                if (param1.target instanceof ColorSquare) {
                    _loc2_ = param1.target as ColorSquare;
                    this.currentSwatch = _loc2_;
                    this.currentColor = _loc2_.color;
                }
            }
            this.selectedColor = this.currentColor;
            Mouse.show();
            return;
        }
        if (param1.target == this.spectrumSprite) {
            this.setColorForSpectrumPosition();
            this.commitColor();
        } else if (param1.target == this.addSwatchButton) {
            this.addSwatchToSwatches(this.currentColor);
            this.addSwatchButton.disabled = true;
        } else if (param1.target == this.remSwatchButton) {
            this.removeSwatchFromSwatches(this.currentColor);
            this.addSwatchButton.disabled = false;
            this.remSwatchButton.disabled = true;
        } else if (param1.target instanceof ColorSquare) {
            _loc2_ = param1.target as ColorSquare;
            this.currentSwatch = _loc2_;
            this.currentColor = _loc2_.color;
            this.selectedColor = this.currentColor;
        } else if (param1.target == this.colorSprite) {
            this.dispatchEvent(new Event(ColorSelector.ROLL_OUT));
        } else if (param1.target == this.noColorBtn) {
            this._currentColor = -1;
            this.dispatchEvent(new Event(ColorSelector.ROLL_OUT));
        } else if (param1.target == this.dropperButton) {
            this.removeEventListener(
                MouseEvent.ROLL_OUT,
                this.mouseRollOutHander,
            );
            this.removeEventListener(
                MouseEvent.MOUSE_OVER,
                this.mouseOverHandler,
            );
            this.removeEventListener(
                MouseEvent.MOUSE_DOWN,
                this.mouseDownHandler,
            );
            this.removeEventListener(MouseEvent.MOUSE_UP, this.mouseUpHandler);
            this.removeEventListener(
                MouseEvent.MOUSE_MOVE,
                this.mouseMoveHandler,
            );
            this.removeEventListener(
                MouseEvent.MOUSE_OUT,
                this.mouseOutHandler,
            );
            this.stage.removeEventListener(
                MouseEvent.MOUSE_UP,
                this.mouseUpHandler,
            );
            this.stage.removeEventListener(
                MouseEvent.MOUSE_MOVE,
                this.mouseTrack,
            );
            this.stage.removeEventListener(
                MouseEvent.MOUSE_MOVE,
                this.spectrumMouseTrack,
            );
            this.colorText.removeEventListener(
                KeyboardEvent.KEY_UP,
                this.keyUpHandler,
            );
            this.refreshBitmapData();
            this.dropperCursor = new DropperCursor();
            this.stage.addChild(this.dropperCursor);
            Mouse.hide();
            this.blocker = new Sprite();
            this.stage.addChild(this.blocker);
            this.blocker.graphics.beginFill(0, 0);
            this.blocker.graphics.drawRect(
                0,
                0,
                this.stage.stageWidth,
                this.stage.stageHeight,
            );
            this.addEventListener(Event.ENTER_FRAME, this.setDropper);
            this.blocker.addEventListener(
                MouseEvent.MOUSE_UP,
                this.blockerUpHandler,
            );
        }
    }

    private setDropper(param1: Event) {
        this.dropperCursor.x = this.stage.mouseX;
        this.dropperCursor.y = this.stage.mouseY;
        this.dropperCursor.color = this.bitmapData.getPixel(
            this.stage.mouseX,
            this.stage.mouseY,
        );
    }

    private blockerUpHandler(param1: MouseEvent) {
        this.removeEventListener(Event.ENTER_FRAME, this.setDropper);
        this.blocker.removeEventListener(
            MouseEvent.MOUSE_UP,
            this.blockerUpHandler,
        );
        this.currentColor = this.bitmapData.getPixel(
            this.stage.mouseX,
            this.stage.mouseY,
        );
        this.commitColor();
        this.dispatchEvent(new Event(ColorSelector.ROLL_OUT));
    }

    private addSwatchToSwatches(param1: number) {
        if (ColorSelector.swatches.length == this.maxSwatches) {
            ColorSelector.swatches.splice(this.swatchBeginIndex, 1);
            ColorSelector.swatches.push(param1);
        } else {
            ColorSelector.swatches.push(param1);
        }
        this.refreshSwatches();
    }

    private removeSwatchFromSwatches(param1: number) {
        var _loc2_ = int(ColorSelector.swatches.indexOf(param1));
        if (_loc2_ > -1) {
            this.swatchOutline.visible = false;
            ColorSelector.swatches.splice(_loc2_, 1);
            this.refreshSwatches();
        } else {
            trace("ERROR REMOVING SWATCH: swatch was not found in array");
        }
    }

    private ringTrack() { }

    private mouseTrack(param1: MouseEvent) {
        var _loc2_: number = this.hueSliderSprite.globalToLocal(
            new Point(this.stage.mouseX, this.stage.mouseY),
        ).x;
        var _loc3_: number = Math.max(
            0,
            Math.min(_loc2_ / this.spectrumWidth, 1),
        );
        this.moveTab(_loc3_);
        var _loc4_: number = Math.round(_loc3_ * 360);
        this.huePosition = _loc4_;
        this.currentHue = this.intForHueValue(_loc4_);
        this.setColorForSpectrumPosition(new Point(this.ring.x, this.ring.y));
    }

    private spectrumMouseTrack(param1: MouseEvent) {
        this.setColorForSpectrumPosition();
    }

    private moveTab(param1: number) {
        this.hueSliderTab.x = Math.floor(param1 * this.spectrumWidth);
    }

    private stageKeyUpHandler(param1: KeyboardEvent) {
        trace("charCode: " + param1.charCode + " keyCode: " + param1.keyCode);
        if (param1.keyCode == 27) {
            this.currentColor = this._startColor;
            this.commitColor();
            this.dispatchEvent(new Event(ColorSelector.ROLL_OUT));
        } else {
            this.refreshBitmapData();
        }
    }

    private keyUpHandler(param1: KeyboardEvent) {
        trace(param1.charCode);
        this.refreshBitmapData();
        this._currentColor = int("0x" + this.colorText.text);
        this.drawColorSprite();
        if (param1.keyCode == 13) {
            this.commitColor();
            this.showColorInUI();
        }
    }

    public die() {
        trace("color selector die");
        if (this.dropperCursor) {
            this.removeEventListener(Event.ENTER_FRAME, this.setDropper);
            this.stage.removeChild(this.dropperCursor);
            this.dropperCursor = null;
        }
        if (this.blocker) {
            this.blocker.removeEventListener(
                MouseEvent.MOUSE_UP,
                this.blockerUpHandler,
            );
            this.stage.removeChild(this.blocker);
        }
        this.removeEventListener(MouseEvent.ROLL_OUT, this.mouseRollOutHander);
        this.removeEventListener(MouseEvent.MOUSE_OVER, this.mouseOverHandler);
        this.removeEventListener(MouseEvent.MOUSE_DOWN, this.mouseDownHandler);
        this.removeEventListener(MouseEvent.MOUSE_UP, this.mouseUpHandler);
        this.removeEventListener(MouseEvent.MOUSE_MOVE, this.mouseMoveHandler);
        this.removeEventListener(MouseEvent.MOUSE_OUT, this.mouseOutHandler);
        this.stage.removeEventListener(
            MouseEvent.MOUSE_UP,
            this.mouseUpHandler,
        );
        this.stage.removeEventListener(MouseEvent.MOUSE_MOVE, this.mouseTrack);
        this.stage.removeEventListener(
            MouseEvent.MOUSE_MOVE,
            this.spectrumMouseTrack,
        );
        this.stage.removeEventListener(
            KeyboardEvent.KEY_UP,
            this.stageKeyUpHandler,
        );
        this.colorText.removeEventListener(
            KeyboardEvent.KEY_UP,
            this.keyUpHandler,
        );
        this.stage.focus = this.stage;
    }

    private HSVtoRGB(param1: number, param2: number, param3: number): any[] {
        var _loc4_: number = 0;
        var _loc5_: number = NaN;
        var _loc6_: number = NaN;
        var _loc7_: number = NaN;
        var _loc8_: number = NaN;
        var _loc9_: number = NaN;
        var _loc10_: number = NaN;
        var _loc11_: number = NaN;
        param1 %= 360;
        if (param2 == 0) {
            _loc9_ = _loc10_ = _loc11_ = param3;
            return [_loc9_, _loc10_, _loc11_];
        }
        param1 /= 60;
        _loc4_ = Math.floor(param1);
        _loc5_ = param1 - _loc4_;
        _loc6_ = param3 * (1 - param2);
        _loc7_ = param3 * (1 - param2 * _loc5_);
        _loc8_ = param3 * (1 - param2 * (1 - _loc5_));
        switch (_loc4_) {
            case 0:
                _loc9_ = param3;
                _loc10_ = _loc8_;
                _loc11_ = _loc6_;
                break;
            case 1:
                _loc9_ = _loc7_;
                _loc10_ = param3;
                _loc11_ = _loc6_;
                break;
            case 2:
                _loc9_ = _loc6_;
                _loc10_ = param3;
                _loc11_ = _loc8_;
                break;
            case 3:
                _loc9_ = _loc6_;
                _loc10_ = _loc7_;
                _loc11_ = param3;
                break;
            case 4:
                _loc9_ = _loc8_;
                _loc10_ = _loc6_;
                _loc11_ = param3;
                break;
            default:
                _loc9_ = param3;
                _loc10_ = _loc6_;
                _loc11_ = _loc7_;
        }
        return [_loc9_, _loc10_, _loc11_];
    }

    private interpolateColor(
        param1: number,
        param2: number,
        param3: number,
    ): number {
        var _loc4_: number = 1 - param3;
        var _loc5_ = uint((param1 >> 24) & 255);
        var _loc6_ = uint((param1 >> 16) & 255);
        var _loc7_ = uint((param1 >> 8) & 255);
        var _loc8_ = uint(param1 & 255);
        var _loc9_ = uint((param2 >> 24) & 255);
        var _loc10_ = uint((param2 >> 16) & 255);
        var _loc11_ = uint((param2 >> 8) & 255);
        var _loc12_ = uint(param2 & 255);
        var _loc13_: number = _loc5_ * _loc4_ + _loc9_ * param3;
        var _loc14_: number = _loc6_ * _loc4_ + _loc10_ * param3;
        var _loc15_: number = _loc7_ * _loc4_ + _loc11_ * param3;
        var _loc16_: number = _loc8_ * _loc4_ + _loc12_ * param3;
        return uint(
            (_loc13_ << 24) | (_loc14_ << 16) | (_loc15_ << 8) | _loc16_,
        );
    }

    private intForHueValue(param1: number, param2: number = 360): number {
        var _loc3_ = 0;
        var _loc4_ = 0;
        var _loc5_ = 0;
        var _loc6_ = 0;
        _loc6_ = Math.floor(param1 % param2);
        if (_loc6_ <= (param2 * 1) / 6) {
            _loc3_ = 255;
            _loc4_ = this.I(param1, param2);
            _loc5_ = 0;
        }
        if (_loc6_ >= (param2 * 1) / 6 && _loc6_ <= (param2 * 2) / 6) {
            _loc3_ = 255 - this.I(param1, param2);
            _loc4_ = 255;
            _loc5_ = 0;
        }
        if (_loc6_ >= (param2 * 2) / 6 && _loc6_ <= (param2 * 3) / 6) {
            _loc3_ = 0;
            _loc4_ = 255;
            _loc5_ = this.I(param1, param2);
        }
        if (_loc6_ >= (param2 * 3) / 6 && _loc6_ <= (param2 * 4) / 6) {
            _loc3_ = 0;
            _loc4_ = 255 - this.I(param1, param2);
            _loc5_ = 255;
        }
        if (_loc6_ >= (param2 * 4) / 6 && _loc6_ <= (param2 * 5) / 6) {
            _loc3_ = this.I(param1, param2);
            _loc4_ = 0;
            _loc5_ = 255;
        }
        if (_loc6_ >= (param2 * 5) / 6) {
            _loc3_ = 255;
            _loc4_ = 0;
            _loc5_ = 255 - this.I(param1, param2);
        }
        return (_loc3_ << 16) | (_loc4_ << 8) | _loc5_;
    }

    private createSpectrum(param1: number = 100): any[] {
        var _loc2_ = new Array();
        var _loc3_: number = 0;
        while (_loc3_ < param1) {
            _loc2_.push(this.intForHueValue(_loc3_, param1));
            _loc3_++;
        }
        return _loc2_;
    }

    private I(param1: number, param2: number): number {
        return (((param1 % param2) / ((param2 * 1) / 6)) * 255) % 255;
    }
}