import Action from "@/com/totaljerkface/game/editor/actions/Action";
import RefGroup from "@/com/totaljerkface/game/editor/RefGroup";
import RefSprite from "@/com/totaljerkface/game/editor/RefSprite";
import { boundClass } from 'autobind-decorator';
import DisplayObjectContainer from "flash/display/DisplayObjectContainer";

@boundClass
export default class ActionUngroup extends Action {
    private _prevGroup: RefGroup;
    private _newGroup: RefGroup;
    private _groupParent: DisplayObjectContainer;
    private _groupIndex: number;

    constructor(
        param1: RefSprite,
        param2: RefGroup,
        param3: RefGroup,
        param4: DisplayObjectContainer,
        param5: number,
    ) {
        super(param1);
        this._prevGroup = param2;
        this._newGroup = param3;
        this._groupParent = param4;
        this._groupIndex = param5;
    }

    public override undo() {
        trace("UNGROUP UNDO " + this.refSprite.name);
        this._groupParent.addChildAt(this.refSprite, this._groupIndex);
        this.refSprite.group = this._newGroup;
    }

    public override redo() {
        trace("UNGROUP REDO " + this.refSprite.name);
        this._groupParent.removeChild(this.refSprite);
        this.refSprite.group = this._prevGroup;
    }
}