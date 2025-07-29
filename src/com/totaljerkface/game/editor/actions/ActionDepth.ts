import Action from "@/com/totaljerkface/game/editor/actions/Action";
import RefSprite from "@/com/totaljerkface/game/editor/RefSprite";
import { boundClass } from 'autobind-decorator';
import DisplayObjectContainer from "flash/display/DisplayObjectContainer";

@boundClass
export default class ActionDepth extends Action {
    private _newIndex: number;
    private _oldIndex: number;
    private _parent: DisplayObjectContainer;

    constructor(
        param1: RefSprite,
        param2: DisplayObjectContainer,
        param3: number,
        param4: number,
    ) {
        super(param1);
        this._parent = param2;
        this._newIndex = param3;
        this._oldIndex = param4;
    }

    public override undo() {
        trace("DEPTH UNDO " + this.refSprite.name);
        this._parent.addChildAt(this.refSprite, this._oldIndex);
    }

    public override redo() {
        trace("DEPTH REDO " + this.refSprite.name);
        this._parent.addChildAt(this.refSprite, this._newIndex);
    }
}