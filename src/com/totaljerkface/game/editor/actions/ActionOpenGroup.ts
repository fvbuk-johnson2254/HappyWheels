import Action from "@/com/totaljerkface/game/editor/actions/Action";
import ArrowTool from "@/com/totaljerkface/game/editor/ArrowTool";
import GroupCanvas from "@/com/totaljerkface/game/editor/GroupCanvas";
import { boundClass } from 'autobind-decorator';
import DisplayObjectContainer from "flash/display/DisplayObjectContainer";

@boundClass
export default class ActionOpenGroup extends Action {
    private _groupCanvas: GroupCanvas;
    private _canvasHolder: DisplayObjectContainer;
    private _arrowTool: ArrowTool;

    constructor(
        param1: GroupCanvas,
        param2: DisplayObjectContainer,
        param3: ArrowTool,
    ) {
        super(null);
        this._groupCanvas = param1;
        this._canvasHolder = param2;
        this._arrowTool = param3;
    }

    public override undo() {
        trace("OPENGROUP UNDO " + this._groupCanvas.name);
        this._canvasHolder.removeChild(this._groupCanvas);
        this._arrowTool.currentCanvas = this._arrowTool.canvas;
    }

    public override redo() {
        trace("OPENGROUP REDO " + this._groupCanvas.name);
        this._canvasHolder.addChild(this._groupCanvas);
        this._arrowTool.currentCanvas = this._groupCanvas;
    }

    public override die() {
        super.die();
        this._arrowTool = null;
    }
}