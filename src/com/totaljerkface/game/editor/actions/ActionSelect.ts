import Action from "@/com/totaljerkface/game/editor/actions/Action";
import ArrowTool from "@/com/totaljerkface/game/editor/ArrowTool";
import RefGroup from "@/com/totaljerkface/game/editor/RefGroup";
import RefJoint from "@/com/totaljerkface/game/editor/RefJoint";
import RefShape from "@/com/totaljerkface/game/editor/RefShape";
import RefSprite from "@/com/totaljerkface/game/editor/RefSprite";
import Special from "@/com/totaljerkface/game/editor/specials/Special";
import StartPlaceHolder from "@/com/totaljerkface/game/editor/specials/StartPlaceHolder";
import RefTrigger from "@/com/totaljerkface/game/editor/trigger/RefTrigger";
import { boundClass } from 'autobind-decorator';

@boundClass
export default class ActionSelect extends Action {
    private _selectionArray: any[];
    private _index: number;
    private _arrowTool: ArrowTool;

    constructor(
        param1: RefSprite,
        param2: any[],
        param3: number,
        param4: ArrowTool,
    ) {
        super(param1, false);
        this._selectionArray = param2;
        this._index = param3;
        this._arrowTool = param4;
    }

    public override undo() {
        trace("SELECT UNDO " + this.refSprite.name);
        this._selectionArray.splice(this._index, 1);
        this.refSprite.selected = false;
        if (this.refSprite instanceof RefShape) {
            --this._arrowTool.numShapesSelected;
        } else if (this.refSprite instanceof Special) {
            --this._arrowTool.numSpecialsSelected;
        } else if (this.refSprite instanceof RefGroup) {
            --this._arrowTool.numGroupsSelected;
        } else if (this.refSprite instanceof RefJoint) {
            --this._arrowTool.numJointsSelected;
        } else if (this.refSprite instanceof RefTrigger) {
            --this._arrowTool.numTriggersSelected;
        } else if (this.refSprite instanceof StartPlaceHolder) {
            --this._arrowTool.numCharSelected;
        }
    }

    public override redo() {
        trace("SELECT REDO " + this.refSprite.name);
        this._selectionArray.splice(this._index, 0, this.refSprite);
        this.refSprite.selected = true;
        if (this.refSprite instanceof RefShape) {
            this._arrowTool.numShapesSelected += 1;
        } else if (this.refSprite instanceof Special) {
            this._arrowTool.numSpecialsSelected += 1;
        } else if (this.refSprite instanceof RefGroup) {
            this._arrowTool.numGroupsSelected += 1;
        } else if (this.refSprite instanceof RefJoint) {
            this._arrowTool.numJointsSelected += 1;
        } else if (this.refSprite instanceof RefTrigger) {
            this._arrowTool.numTriggersSelected += 1;
        } else if (this.refSprite instanceof StartPlaceHolder) {
            this._arrowTool.numCharSelected += 1;
        }
    }
}