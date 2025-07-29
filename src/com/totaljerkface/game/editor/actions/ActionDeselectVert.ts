import Action from "@/com/totaljerkface/game/editor/actions/Action";
import EdgeShape from "@/com/totaljerkface/game/editor/EdgeShape";
import Vert from "@/com/totaljerkface/game/editor/vertedit/Vert";
import { boundClass } from 'autobind-decorator';

@boundClass
export default class ActionDeselectVert extends Action {
    private _vertIndex: number;
    private _edgeShape: EdgeShape;
    private _selectionVector: Vector<Vert>;
    private _selectionIndex: number;

    constructor(
        param1: number,
        param2: EdgeShape,
        param3: Vector<Vert>,
        param4: number,
    ) {
        super(null);
        this._vertIndex = param1;
        this._edgeShape = param2;
        this._selectionVector = param3;
        this._selectionIndex = param4;
    }

    public override undo() {
        trace("DESELECT VERT UNDO " + this._vertIndex);
        var _loc1_: Vert = this._edgeShape.getVertAt(this._vertIndex);
        this._selectionVector.splice(this._selectionIndex, 0, _loc1_);
        _loc1_.selected = true;
    }

    public override redo() {
        trace("DESELECT VERT REDO " + this._vertIndex);
        var _loc1_: Vert = this._edgeShape.getVertAt(this._vertIndex);
        this._selectionVector.splice(this._selectionIndex, 1);
        _loc1_.selected = false;
    }
}