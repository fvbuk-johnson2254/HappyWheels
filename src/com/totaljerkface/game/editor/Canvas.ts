import RefGroup from "@/com/totaljerkface/game/editor/RefGroup";
import RefJoint from "@/com/totaljerkface/game/editor/RefJoint";
import RefShape from "@/com/totaljerkface/game/editor/RefShape";
import RefSprite from "@/com/totaljerkface/game/editor/RefSprite";
import Special from "@/com/totaljerkface/game/editor/specials/Special";
import StartPlaceHolder from "@/com/totaljerkface/game/editor/specials/StartPlaceHolder";
import RefTrigger from "@/com/totaljerkface/game/editor/trigger/RefTrigger";
import CanvasEvent from "@/com/totaljerkface/game/events/CanvasEvent";
import { boundClass } from 'autobind-decorator';
import BlendMode from "flash/display/BlendMode";
import Sprite from "flash/display/Sprite";
import Event from "flash/events/Event";
import TextField from "flash/text/TextField";
import TextFieldAutoSize from "flash/text/TextFieldAutoSize";
import TextFormat from "flash/text/TextFormat";
import TextFormatAlign from "flash/text/TextFormatAlign";

@boundClass
export default class Canvas extends Sprite {
    public static SHAPE_LIMIT_STATUS: string;
    public static ART_LIMIT_STATUS: string = "artlimitstatus";
    protected static _canvasWidth: number = 20000;
    protected static _canvasHeight: number = 10000;
    protected static _backDropIndex: number = 0;
    protected static _backgroundColor: number = 16777215;
    protected static maxShapes: number = 900;
    protected static maxArt: number = 10000;
    protected _shapeCount: number;
    protected _artCount: number;
    protected _tooMuchArt: boolean;
    protected _tooManyShapes: boolean;
    protected _mainCanvas: Canvas;
    public startPlaceHolder: StartPlaceHolder;
    public shapes: Sprite;
    public joints: Sprite;
    public triggers: Sprite;
    public special: Sprite;
    public groups: Sprite;
    public char: Sprite;
    public textField: TextField;

    constructor() {
        super();
        this.init();
    }

    public static get backDropIndex(): number {
        return Canvas._backDropIndex;
    }

    public static set backDropIndex(param1: number) {
        Canvas._backDropIndex = param1;
    }

    public static get backgroundColor(): number {
        return Canvas._backgroundColor;
    }

    public static set backgroundColor(param1: number) {
        Canvas._backgroundColor = param1;
    }

    public static get canvasWidth(): number {
        return Canvas._canvasWidth;
    }

    public static get canvasHeight(): number {
        return Canvas._canvasHeight;
    }

    protected init() {
        Canvas._canvasWidth = 20000;
        Canvas._canvasHeight = 10000;
        Canvas._backDropIndex = 0;
        this._shapeCount = 0;
        this._mainCanvas = this;
        this.graphics.beginFill(16777215);
        this.graphics.drawRect(0, 0, Canvas._canvasWidth, Canvas._canvasHeight);
        this.graphics.endFill();
        this.shapes = new Sprite();
        this.shapes.name = "shapes";
        this.joints = new Sprite();
        this.joints.name = "joints";
        this.triggers = new Sprite();
        this.triggers.name = "triggers";
        this.special = new Sprite();
        this.special.name = "special";
        this.groups = new Sprite();
        this.groups.name = "groups";
        this.char = new Sprite();
        this.char.name = "char";
        this.addChild(this.shapes);
        this.addChild(this.special);
        this.addChild(this.groups);
        this.addChild(this.joints);
        this.addChild(this.triggers);
        this.addChild(this.char);
        this.startPlaceHolder = new StartPlaceHolder();
        this.char.addChild(this.startPlaceHolder);
        this.startPlaceHolder.scaleX = this.startPlaceHolder.scaleY = 0.5;
        this.startPlaceHolder.x = 300;
        this.startPlaceHolder.y = 100 + Canvas._canvasHeight / 2;
        this.addEventListener(
            CanvasEvent.ART,
            this.artStatusHandler,
            false,
            0,
            true,
        );
        this.addEventListener(
            CanvasEvent.SHAPE,
            this.shapeStatusHandler,
            false,
            0,
            true,
        );
    }

    public createTextField(param1: Sprite) {
        this.textField = new TextField();
        param1.addChild(this.textField);
        var _loc2_ = new TextFormat(
            "HelveticaNeueLT Std",
            11,
            0,
            null,
            null,
            null,
            null,
            null,
            TextFormatAlign.RIGHT,
        );
        this.textField.defaultTextFormat = _loc2_;
        this.textField.multiline = true;
        this.textField.height = 20;
        this.textField.width = 0;
        this.textField.x = 890;
        this.textField.y = 465;
        this.textField.mouseEnabled = false;
        this.textField.selectable = false;
        this.textField.embedFonts = true;
        this.textField.autoSize = TextFieldAutoSize.RIGHT;
        this.textField.wordWrap = false;
        this.textField.blendMode = BlendMode.INVERT;
        this.setTextField();
    }

    public addRefSprite(param1: RefSprite): RefSprite {
        if (!(param1 instanceof RefSprite)) {
            throw new Error("attempted to add non-refsprite to canvas");
        }
        if (param1 instanceof RefShape) {
            this.shapes.addChild(param1);
        } else if (param1 instanceof Special) {
            this.special.addChild(param1);
        } else if (param1 instanceof RefJoint) {
            this.joints.addChild(param1);
        } else if (param1 instanceof RefTrigger) {
            this.triggers.addChild(param1);
        } else {
            if (!(param1 instanceof RefGroup)) {
                throw new Error("what the fuck is this");
            }
            this.groups.addChild(param1);
        }
        this.shapeCount = this._mainCanvas.shapeCount + param1.shapesUsed;
        this.tooManyShapes =
            this._mainCanvas.shapeCount > Canvas.maxShapes ? true : false;
        this.artCount = this._artCount + param1.artUsed;
        this.tooMuchArt = this._artCount > Canvas.maxArt ? true : false;
        return param1;
    }

    public addRefSpriteAt(param1: RefSprite, param2: number): RefSprite {
        if (!(param1 instanceof RefSprite)) {
            throw new Error("attempted to add non-refsprite to canvas");
        }
        if (param1 instanceof RefShape) {
            this.shapes.addChildAt(param1, param2);
        } else if (param1 instanceof Special) {
            this.special.addChildAt(param1, param2);
        } else if (param1 instanceof RefJoint) {
            this.joints.addChildAt(param1, param2);
        } else if (param1 instanceof RefTrigger) {
            this.triggers.addChildAt(param1, param2);
        } else {
            if (!(param1 instanceof RefGroup)) {
                throw new Error("what the fuck is this");
            }
            this.groups.addChildAt(param1, param2);
        }
        this.shapeCount = this._mainCanvas.shapeCount + param1.shapesUsed;
        this.tooManyShapes =
            this._mainCanvas.shapeCount > Canvas.maxShapes ? true : false;
        this.artCount = this._artCount + param1.artUsed;
        this.tooMuchArt = this._artCount > Canvas.maxArt ? true : false;
        return param1;
    }

    public removeRefSprite(param1: RefSprite): RefSprite {
        if (!(param1 instanceof RefSprite)) {
            throw new Error("attempted to remove non-refsprite from canvas");
        }
        var _loc2_: RefSprite = param1 as RefSprite;
        if (_loc2_ instanceof RefShape) {
            this.shapes.removeChild(_loc2_);
        } else if (_loc2_ instanceof Special) {
            this.special.removeChild(_loc2_);
        } else if (_loc2_ instanceof RefJoint) {
            this.joints.removeChild(_loc2_);
        } else if (_loc2_ instanceof RefTrigger) {
            this.triggers.removeChild(_loc2_);
        } else {
            if (!(_loc2_ instanceof RefGroup)) {
                throw new Error("what the fuck is this");
            }
            this.groups.removeChild(_loc2_);
        }
        this.shapeCount = this._mainCanvas.shapeCount - param1.shapesUsed;
        this.tooManyShapes =
            this._mainCanvas.shapeCount > Canvas.maxShapes ? true : false;
        this.artCount = this._artCount - param1.artUsed;
        this.tooMuchArt = this._artCount > Canvas.maxArt ? true : false;
        return param1;
    }

    public get shapeCount(): number {
        return this._shapeCount;
    }

    public set shapeCount(param1: number) {
        this._shapeCount = param1;
        this.setTextField();
    }

    public get artCount(): number {
        return this._artCount;
    }

    public set artCount(param1: number) {
        this._artCount = param1;
        this.setTextField();
    }

    protected setTextField() {
        this.textField.htmlText = "shapes left: " +
            (Canvas.maxShapes - this.shapeCount) +
            "<br>art left: " +
            (Canvas.maxArt - this.artCount);
    }

    public get tooManyShapes(): boolean {
        return this._tooManyShapes;
    }

    public set tooManyShapes(param1: boolean) {
        if (param1 == this._tooManyShapes) {
            return;
        }
        this._tooManyShapes = param1;
        this.dispatchEvent(new Event(Canvas.SHAPE_LIMIT_STATUS));
    }

    public get tooMuchArt(): boolean {
        return this._tooMuchArt;
    }

    public set tooMuchArt(param1: boolean) {
        if (param1 == this._tooMuchArt) {
            return;
        }
        this._tooMuchArt = param1;
        this.dispatchEvent(new Event(Canvas.ART_LIMIT_STATUS));
    }

    protected shapeStatusHandler(param1: CanvasEvent) {
        trace("shape status handler");
        var _loc2_: RefSprite = param1.target as RefSprite;
        if (_loc2_.parent == this.shapes || _loc2_.parent == this.special) {
            this.shapeCount = this._mainCanvas.shapeCount + param1.value;
            this.tooManyShapes =
                this._mainCanvas.shapeCount > Canvas.maxShapes ? true : false;
        }
        trace("shapecount = " + this._mainCanvas.shapeCount);
    }

    protected artStatusHandler(param1: CanvasEvent) {
        trace("art status handler");
        var _loc2_: RefSprite = param1.target as RefSprite;
        if (_loc2_.parent == this.shapes || _loc2_.parent == this.special) {
            this.artCount = this._artCount + param1.value;
            this.tooMuchArt = this._artCount > Canvas.maxArt ? true : false;
        }
        trace("artcount = " + this._artCount);
    }

    public relabelTriggers() {
        var _loc2_: RefTrigger = null;
        var _loc1_: number = 0;
        while (_loc1_ < this.triggers.numChildren) {
            _loc2_ = this.triggers.getChildAt(_loc1_) as RefTrigger;
            _loc2_.setNumLabel(_loc1_ + 1);
            _loc1_++;
        }
    }
}