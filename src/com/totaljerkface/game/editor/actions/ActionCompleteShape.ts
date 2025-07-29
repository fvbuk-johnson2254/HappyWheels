import EdgeShape from "@/com/totaljerkface/game/editor/EdgeShape";
import Tool from "@/com/totaljerkface/game/editor/Tool";
import Action from "@/com/totaljerkface/game/editor/actions/Action";
import { boundClass } from 'autobind-decorator';

@boundClass
export default class ActionCompleteShape extends Action {
    private _edgeShape: EdgeShape;
    private _newShape: EdgeShape;
    private _tool: Tool;
    private _completeFill: boolean;

    constructor(param1: EdgeShape, param2: EdgeShape, param3: Tool) {
        super(null);
        this._edgeShape = param1;
        this._newShape = param2;
        this._tool = param3;
        this._completeFill = this._edgeShape.completeFill;
    }

    public override undo() {
        trace("COMPLETE SHAPE UNDO " + this._edgeShape.name);
        this._tool.remoteButtonPress();
        this._tool.setCurrentShape(this._edgeShape);
    }

    public override redo() {
        trace("COMPLETE SHAPE REDO " + this._edgeShape.name);
        this._edgeShape.completeFill = this._completeFill;
        this._edgeShape.editMode = false;
        this._edgeShape.mouseEnabled = true;
        this._tool.removeFrameHandler();
        this._tool.setCurrentShape(this._newShape);
    }
}