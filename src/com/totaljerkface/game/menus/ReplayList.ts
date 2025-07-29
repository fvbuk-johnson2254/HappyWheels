import BrowserEvent from "@/com/totaljerkface/game/events/BrowserEvent";
import NavigationEvent from "@/com/totaljerkface/game/events/NavigationEvent";
import ReplayDataObject from "@/com/totaljerkface/game/menus/ReplayDataObject";
import ReplayListItem from "@/com/totaljerkface/game/menus/ReplayListItem";
import ReplaySelection from "@/com/totaljerkface/game/menus/ReplaySelection";
import TweenLite from "@/gs/TweenLite";
import Strong from "@/gs/easing/Strong";
import { boundClass } from 'autobind-decorator';
import DisplayObject from "flash/display/DisplayObject";
import MovieClip from "flash/display/MovieClip";
import Sprite from "flash/display/Sprite";
import Event from "flash/events/Event";
import KeyboardEvent from "flash/events/KeyboardEvent";
import MouseEvent from "flash/events/MouseEvent";

@boundClass
export default class ReplayList extends Sprite {
    public static UPDATE_SCROLLER: string;
    public static FACE_SELECTED: string = "faceselected";
    private replaySelection: ReplaySelection;
    private listItemArray: any[];
    private selectedListItem: ReplayListItem;
    private nextSelectedListItem: ReplayListItem;
    private _selectedCharacter: number;
    private _highlightedArray: any[];
    private _inaccurateHidden: boolean;
    private _tweenVal: number = 0;
    private tweenTime: number = 0.25;
    private opening: boolean;
    private closing: boolean;

    constructor(
        param1: any[],
        param2: number = -1,
        param3: number = -1,
        param4: boolean = false,
    ) {
        super();
        var _loc9_: ReplayDataObject = null;
        var _loc10_: ReplayListItem = null;

        this.listItemArray = new Array();
        var _loc5_: number = 0;
        var _loc6_: number = ReplayListItem.BG_HEIGHT;
        var _loc7_ = int(param1.length);
        var _loc8_: number = 0;
        while (_loc8_ < _loc7_) {
            _loc9_ = param1[_loc8_];
            _loc10_ = new ReplayListItem(_loc9_);
            this.addChild(_loc10_);
            this.listItemArray.push(_loc10_);
            _loc10_.y = _loc5_;
            _loc5_ += _loc10_.height;
            if (_loc9_.id == param2) {
                this.selectedListItem = _loc10_;
            }
            _loc8_++;
        }
        if (this.selectedListItem) {
            this.selectedListItem.selected = true;
            this.openSelection();
        }
        this.selectedCharacter = param3;
        this.inaccurateHidden = param4;
        this.focusRect = false;
        this.addEventListener(MouseEvent.MOUSE_OVER, this.mouseOverHandler);
        this.addEventListener(MouseEvent.MOUSE_OUT, this.mouseOutHandler);
        this.addEventListener(MouseEvent.MOUSE_DOWN, this.mouseDownHandler);
        this.addEventListener(MouseEvent.MOUSE_UP, this.mouseUpHandler);
        this.addEventListener(KeyboardEvent.KEY_DOWN, this.keyDownHandler);
    }

    private keyDownHandler(param1: KeyboardEvent) {
        if (this.opening) {
            return;
        }
        switch (param1.keyCode) {
            case 38:
                this.selectPreviousListItem();
                break;
            case 40:
                this.selectNextListItem();
        }
    }

    private selectPreviousListItem() {
        var _loc1_ = undefined;
        if (this.selectedListItem) {
            _loc1_ = this.listItemArray.indexOf(this.selectedListItem);
            if (_loc1_ == 0) {
                return;
            }
            this.selectedListItem.selected = false;
            _loc1_--;
            this.selectedListItem = this.listItemArray[_loc1_];
            this.selectedListItem.selected = true;
            if (!this.closing) {
                this.closeSelection();
            }
        }
    }

    private selectNextListItem() {
        var _loc1_ = undefined;
        if (this.selectedListItem) {
            _loc1_ = this.listItemArray.indexOf(this.selectedListItem);
            if (_loc1_ == this.listItemArray.length - 1) {
                return;
            }
            this.selectedListItem.selected = false;
            _loc1_ += 1;
            this.selectedListItem = this.listItemArray[_loc1_];
            this.selectedListItem.selected = true;
            if (!this.closing) {
                this.closeSelection();
            }
        }
    }

    private mouseOverHandler(param1: MouseEvent) {
        var _loc2_: ReplayListItem = null;
        if (param1.target instanceof ReplayListItem) {
            _loc2_ = param1.target as ReplayListItem;
            if (!param1.buttonDown) {
                _loc2_.rollOver();
            } else {
                _loc2_.mouseDown();
            }
        }
    }

    private mouseOutHandler(param1: MouseEvent) {
        var _loc2_: ReplayListItem = null;
        if (param1.target instanceof ReplayListItem) {
            _loc2_ = param1.target as ReplayListItem;
            _loc2_.rollOut();
        }
    }

    private mouseDownHandler(param1: MouseEvent) {
        var _loc2_: ReplayListItem = null;
        if (param1.target instanceof ReplayListItem) {
            _loc2_ = param1.target as ReplayListItem;
            _loc2_.mouseDown();
        }
    }

    private mouseUpHandler(param1: MouseEvent) {
        var _loc2_: ReplayListItem = null;
        var _loc3_: MovieClip = null;
        if (param1.target instanceof ReplayListItem) {
            _loc2_ = param1.target as ReplayListItem;
            if (this.selectedListItem) {
                if (_loc2_ != this.selectedListItem) {
                    this.selectedListItem.selected = false;
                    this.selectedListItem = _loc2_;
                    this.selectedListItem.selected = true;
                } else {
                    this.selectedListItem.selected = false;
                    this.selectedListItem = null;
                }
                if (!this.closing) {
                    this.closeSelection();
                }
            } else {
                this.selectedListItem = _loc2_;
                _loc2_.selected = true;
                if (!this.closing) {
                    this.openSelection();
                }
            }
        } else if (param1.target instanceof MovieClip) {
            _loc3_ = param1.target as MovieClip;
            if (_loc3_.name == "characterFaces") {
                trace(_loc3_.currentFrame);
                this.selectedCharacter = _loc3_.currentFrame;
                this.dispatchEvent(new Event(ReplayList.FACE_SELECTED));
            }
        }
    }

    private closeSelection() {
        this.closing = true;
        this.killReplaySelection();
        TweenLite.to(this, this.tweenTime, {
            tweenVal: 0,
            ease: Strong.easeInOut,
            onComplete: this.closingComplete,
        });
    }

    private killReplaySelection() {
        this.replaySelection.die();
        this.replaySelection.removeEventListener(
            NavigationEvent.SESSION,
            this.cloneAndDispatchEvent,
        );
        this.replaySelection.removeEventListener(
            BrowserEvent.FLAG,
            this.cloneAndDispatchEvent,
        );
    }

    public get tweenVal(): number {
        return this._tweenVal;
    }

    public set tweenVal(param1: number) {
        this._tweenVal = param1;
        this.replaySelection.maskHeight = Math.round(
            this.replaySelection.height * param1,
        );
        this.organizeList();
        this.dispatchEvent(new Event(ReplayList.UPDATE_SCROLLER));
    }

    private closingComplete() {
        this.closing = false;
        this.removeChild(this.replaySelection);
        this.replaySelection = null;
        if (this.selectedListItem) {
            this.openSelection();
        } else {
            this.organizeList();
            this.dispatchEvent(new Event(ReplayList.UPDATE_SCROLLER));
        }
    }

    private openSelection() {
        var _loc1_: number = this.getChildIndex(this.selectedListItem) + 1;
        this.replaySelection = new ReplaySelection(
            this.selectedListItem.replayDataObject,
        );
        this.replaySelection.addEventListener(
            NavigationEvent.SESSION,
            this.cloneAndDispatchEvent,
        );
        this.replaySelection.addEventListener(
            BrowserEvent.FLAG,
            this.cloneAndDispatchEvent,
        );
        this.addChildAt(this.replaySelection, _loc1_);
        this.replaySelection.maskHeight = 0;
        this.opening = true;
        TweenLite.to(this, this.tweenTime, {
            tweenVal: 1,
            ease: Strong.easeInOut,
            onComplete: this.openComplete,
        });
    }

    private openComplete() {
        this.opening = false;
    }

    private cloneAndDispatchEvent(param1: Event) {
        trace("Replay list clone event");
        var _loc2_: Event = param1.clone();
        this.dispatchEvent(_loc2_);
    }

    private organizeList() {
        var _loc1_: number = NaN;
        var _loc3_: DisplayObject = null;
        var _loc5_: number = 0;
        var _loc7_: number = NaN;
        var _loc8_: number = NaN;
        if (this.selectedListItem) {
            _loc1_ = this.selectedListItem.y;
        }
        var _loc2_: number = this.numChildren;
        var _loc4_: number = 0;
        var _loc6_: number = 0;
        while (_loc6_ < _loc2_) {
            _loc3_ = this.getChildAt(_loc6_);
            _loc3_.y = _loc4_;
            if (_loc3_ instanceof ReplayListItem) {
                _loc5_ = (_loc3_ as ReplayListItem).height;
            } else if (_loc3_ instanceof ReplaySelection) {
                _loc5_ = (_loc3_ as ReplaySelection).maskHeight;
            } else {
                _loc5_ = _loc3_.height;
            }
            _loc4_ += _loc5_;
            _loc6_++;
        }
        if (this.selectedListItem) {
            _loc7_ = _loc1_ - this.selectedListItem.y;
            this.y += _loc7_;
            _loc7_ = this.y + this.selectedListItem.y;
            if (_loc7_ < 0) {
                this.y -= _loc7_;
            }
        }
        if (Boolean(this.replaySelection) && this.opening) {
            _loc8_ = this.replaySelection.y + this.replaySelection.maskHeight;
            _loc7_ = 352 - this.y - _loc8_;
            if (_loc7_ < 0) {
                this.y += _loc7_;
            }
        }
    }

    // @ts-expect-error
    public override get height(): number {
        var _loc4_: ReplayListItem = null;
        var _loc1_: number = 0;
        var _loc2_ = int(this.listItemArray.length);
        var _loc3_: number = 0;
        while (_loc3_ < _loc2_) {
            _loc4_ = this.listItemArray[_loc3_];
            _loc1_ += _loc4_.height;
            _loc3_++;
        }
        if (this.replaySelection) {
            _loc1_ += this.replaySelection.maskHeight;
        }
        return _loc1_;
    }

    public override set height(param1: number) {
        throw new Error("cannot set list height manually");
    }

    public get selectedCharacter(): number {
        return this._selectedCharacter;
    }

    public set selectedCharacter(param1: number) {
        var _loc2_: number = 0;
        var _loc3_: number = 0;
        var _loc4_: ReplayListItem = null;
        var _loc5_: number = 0;
        if (param1 > 0 && this._selectedCharacter != param1) {
            this._highlightedArray = new Array();
            _loc2_ = int(this.listItemArray.length);
            _loc3_ = 0;
            while (_loc3_ < _loc2_) {
                _loc4_ = this.listItemArray[_loc3_];
                _loc5_ = _loc4_.characterFaces.currentFrame;
                if (_loc5_ == param1) {
                    _loc4_.faded = false;
                    this._highlightedArray.push(_loc4_);
                } else {
                    _loc4_.faded = true;
                }
                _loc3_++;
            }
            this._selectedCharacter = param1;
        } else {
            this._highlightedArray = null;
            _loc2_ = int(this.listItemArray.length);
            _loc3_ = 0;
            while (_loc3_ < _loc2_) {
                _loc4_ = this.listItemArray[_loc3_];
                _loc5_ = _loc4_.characterFaces.currentFrame;
                _loc4_.faded = false;
                _loc3_++;
            }
            this._selectedCharacter = -1;
            this.dispatchEvent(new Event(ReplayList.FACE_SELECTED));
        }
    }

    public get highlightedArray(): any[] {
        return this._highlightedArray;
    }

    public get inaccurateHidden(): boolean {
        return this._inaccurateHidden;
    }

    public set inaccurateHidden(param1: boolean) {
        var _loc3_: number = 0;
        var _loc4_: ReplayListItem = null;
        var _loc2_ = int(this.listItemArray.length);
        trace("INNACURATE HIDDEN " + param1);
        if (param1) {
            _loc3_ = 0;
            while (_loc3_ < _loc2_) {
                _loc4_ = this.listItemArray[_loc3_];
                _loc4_.hidden = !_loc4_.accurate;
                if (_loc4_.hidden) {
                    if (this.selectedListItem) {
                        if (_loc4_ == this.selectedListItem) {
                            this.selectedListItem.selected = false;
                            this.selectedListItem = null;
                            if (this.replaySelection) {
                                this.closeSelection();
                            }
                        }
                    }
                }
                _loc3_++;
            }
        } else {
            _loc3_ = 0;
            while (_loc3_ < _loc2_) {
                _loc4_ = this.listItemArray[_loc3_];
                _loc4_.hidden = false;
                _loc3_++;
            }
        }
        this._inaccurateHidden = param1;
        this.organizeList();
        this.dispatchEvent(new Event(ReplayList.UPDATE_SCROLLER));
    }

    public die() {
        this.removeEventListener(MouseEvent.MOUSE_OVER, this.mouseOverHandler);
        this.removeEventListener(MouseEvent.MOUSE_OUT, this.mouseOutHandler);
        this.removeEventListener(MouseEvent.MOUSE_DOWN, this.mouseDownHandler);
        this.removeEventListener(MouseEvent.MOUSE_UP, this.mouseUpHandler);
        this.removeEventListener(KeyboardEvent.KEY_DOWN, this.keyDownHandler);
        if (this.replaySelection) {
            this.killReplaySelection();
        }
    }
}