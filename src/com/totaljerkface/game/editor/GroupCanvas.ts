import Canvas from "@/com/totaljerkface/game/editor/Canvas";
import RefGroup from "@/com/totaljerkface/game/editor/RefGroup";
import CanvasEvent from "@/com/totaljerkface/game/events/CanvasEvent";
import { boundClass } from 'autobind-decorator';
import Sprite from "flash/display/Sprite";

@boundClass
export default class GroupCanvas extends Canvas {
    private _refGroup: RefGroup;
    private _groupIndex: number;
    private centerMarker: Sprite;

    constructor(param1: RefGroup, param2: Canvas, param3: number) {
        super();
        this._refGroup = param1;
        this._groupIndex = param3;
        this._mainCanvas = param2;

        this.doubleClickEnabled = true;
    }

    protected override init() {
        Canvas._canvasWidth = 20000;
        Canvas._canvasHeight = 10000;
        this.graphics.beginFill(10066329, 0.35);
        this.graphics.drawRect(0, 0, Canvas._canvasWidth, Canvas._canvasHeight);
        this.graphics.endFill();
        this.graphics.lineStyle(0, 16777215, 1, true);
        this.graphics.moveTo(this._refGroup.x - 5, this.refGroup.y);
        this.graphics.lineTo(this._refGroup.x + 5, this.refGroup.y);
        this.graphics.moveTo(this._refGroup.x, this.refGroup.y - 5);
        this.graphics.lineTo(this._refGroup.x, this.refGroup.y + 5);
        this.shapes = new Sprite();
        this.shapes.name = "shapes";
        this.special = new Sprite();
        this.special.name = "special";
        this.addChild(this.shapes);
        this.addChild(this.special);
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

    public override get shapeCount(): number {
        return this._mainCanvas.shapeCount;
    }

    public override set shapeCount(param1: number) {
        this._mainCanvas.shapeCount = param1;
    }

    protected override setTextField() { }

    public get refGroup(): RefGroup {
        return this._refGroup;
    }

    public get groupIndex(): number {
        return this._groupIndex;
    }
}