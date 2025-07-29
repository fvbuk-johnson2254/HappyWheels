import Canvas from "@/com/totaljerkface/game/editor/Canvas";
import GroupCanvas from "@/com/totaljerkface/game/editor/GroupCanvas";
import RefGroup from "@/com/totaljerkface/game/editor/RefGroup";
import RefSprite from "@/com/totaljerkface/game/editor/RefSprite";
import Action from "@/com/totaljerkface/game/editor/actions/Action";
import { boundClass } from 'autobind-decorator';

@boundClass
export default class ActionAdd extends Action {
    private _canvas: Canvas;
    private _childIndex: number;
    private _group: RefGroup;

    constructor(param1: RefSprite, param2: Canvas, param3: number) {
        super(param1);
        var _loc4_: GroupCanvas = null;
        this._canvas = param2;
        this._childIndex = param3;
        if (this._canvas instanceof GroupCanvas) {
            _loc4_ = this._canvas as GroupCanvas;
            this._group = _loc4_.refGroup;
        }
    }

    public override undo() {
        trace("ADD UNDO " + this.refSprite.name);
        this._canvas.removeRefSprite(this.refSprite);
        if (this._group) {
            this.refSprite.inGroup = false;
            this.refSprite.group = null;
        }
    }

    public override redo() {
        trace("ADD REDO " + this.refSprite.name);
        this._canvas.addRefSpriteAt(this.refSprite, this._childIndex);
        if (this._group) {
            this.refSprite.inGroup = true;
            this.refSprite.group = this._group;
        }
    }
}