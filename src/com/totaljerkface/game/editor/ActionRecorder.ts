import Action from "@/com/totaljerkface/game/editor/actions/Action";
import { boundClass } from 'autobind-decorator';
import Sprite from "flash/display/Sprite";
import Event from "flash/events/Event";
import EventDispatcher from "flash/events/EventDispatcher";

@boundClass
export default class ActionRecorder extends EventDispatcher {
    public static UNDO: string;
    public static REDO: string = "redo";
    private actionArray: any[];
    private index: number;
    public dictionary: Dictionary<any, any>;
    public counter: number = 0;
    private testSprite: Sprite;

    constructor() {
        super();
        this.actionArray = new Array();
        this.index = -1;
        this.dictionary = new Dictionary(true);
        this.testSprite = new Sprite();
        this.dictionary.set(this.testSprite, 1);
        this.testSprite = null;
    }

    public pushAction(param1: Action) {
        var _loc5_: Action = null;
        this.index += 1;
        var _loc2_: number = this.actionArray.length - this.index;
        this.dictionary.set(param1, this.counter);
        this.counter += 1;
        var _loc3_: any[] = this.actionArray.splice(this.index, _loc2_, param1);
        var _loc4_: number = 0;
        while (_loc4_ < _loc3_.length) {
            _loc5_ = _loc3_[_loc4_];
            _loc5_ = _loc5_.firstAction;
            _loc5_.die();
            _loc4_++;
        }
    }

    public undo() {
        trace("start undo");
        if (this.index < 0) {
            return;
        }
        var _loc1_: Action = this.actionArray[this.index];
        _loc1_ = _loc1_.lastAction;
        while (_loc1_) {
            _loc1_.undo();
            _loc1_ = _loc1_.prevAction;
        }
        --this.index;
        this.dispatchEvent(new Event(ActionRecorder.UNDO));
    }

    public redo() {
        trace("start redo");
        if (this.index == this.actionArray.length - 1) {
            return;
        }
        var _loc1_: Action = this.actionArray[this.index + 1];
        _loc1_ = _loc1_.firstAction;
        while (_loc1_) {
            _loc1_.redo();
            _loc1_ = _loc1_.nextAction;
        }
        this.index += 1;
        this.dispatchEvent(new Event(ActionRecorder.REDO));
    }

    public clearActions() {
        var _loc2_: Action = null;
        var _loc1_: number = 0;
        while (_loc1_ < this.actionArray.length) {
            _loc2_ = this.actionArray[_loc1_];
            _loc2_ = _loc2_.firstAction;
            _loc2_.die();
            _loc1_++;
        }
        this.actionArray = new Array();
        this.index = -1;
    }

    public die() {
        var _loc2_: Action = null;
        var _loc1_: number = 0;
        while (_loc1_ < this.actionArray.length) {
            _loc2_ = this.actionArray[_loc1_];
            _loc2_ = _loc2_.firstAction;
            _loc2_.die();
            _loc1_++;
        }
    }
}