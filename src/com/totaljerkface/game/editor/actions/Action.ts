import RefSprite from "@/com/totaljerkface/game/editor/RefSprite";
import { boundClass } from 'autobind-decorator';

@boundClass
export default class Action {
    private _refSprite: RefSprite;
    private _prevAction: Action;
    private _nextAction: Action;
    private _resetTested: boolean;

    constructor(param1: RefSprite, param2: boolean = true) {
        this._refSprite = param1;
        this._resetTested = param2;
    }

    public get refSprite(): RefSprite {
        return this._refSprite;
    }

    public set prevAction(param1: Action) {
        this._prevAction = param1;
        if (param1.nextAction != this) {
            param1.nextAction = this;
        }
    }

    public get prevAction(): Action {
        return this._prevAction;
    }

    public set nextAction(param1: Action) {
        this._nextAction = param1;
        if (param1.prevAction != this) {
            param1.prevAction = this;
        }
    }

    public get nextAction(): Action {
        return this._nextAction;
    }

    public get firstAction(): Action {
        var _loc1_: Action = this;
        while (_loc1_.prevAction) {
            _loc1_ = _loc1_.prevAction;
        }
        return _loc1_;
    }

    public get lastAction(): Action {
        var _loc1_: Action = this;
        while (_loc1_.nextAction) {
            _loc1_ = _loc1_.nextAction;
        }
        return _loc1_;
    }

    public undo() { }

    public redo() { }

    public get resetTested(): boolean {
        return this._resetTested;
    }

    public die() {
        this._prevAction = null;
        if (this._nextAction) {
            this._nextAction.die();
        }
        this._nextAction = null;
    }
}