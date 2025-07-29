import ArrowTool from "@/com/totaljerkface/game/editor/ArrowTool";
import EdgeShape from "@/com/totaljerkface/game/editor/EdgeShape";
import RefSprite from "@/com/totaljerkface/game/editor/RefSprite";
import Action from "@/com/totaljerkface/game/editor/actions/Action";
import { boundClass } from 'autobind-decorator';

@boundClass
export default class ActionCloseVertEdit extends Action {
    private _arrowTool: ArrowTool;

    constructor(param1: RefSprite, param2: ArrowTool) {
        super(param1);
        this._arrowTool = param2;
    }

    public override undo() {
        trace("CLOSEVERTEDIT UNDO " + this.refSprite.name);
        this._arrowTool.openVertEdit(this.refSprite as EdgeShape, false);
    }

    public override redo() {
        trace("CLOSEVERTEDIT REDO " + this.refSprite.name);
        this._arrowTool.closeVertEdit(null, false);
    }

    public override die() {
        super.die();
        this._arrowTool = null;
    }
}