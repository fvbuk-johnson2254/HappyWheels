import BrowserEvent from "@/com/totaljerkface/game/events/BrowserEvent";
import NavigationEvent from "@/com/totaljerkface/game/events/NavigationEvent";
import LevelDataObject from "@/com/totaljerkface/game/menus/LevelDataObject";
import LevelListItem from "@/com/totaljerkface/game/menus/LevelListItem";
import LevelSelection from "@/com/totaljerkface/game/menus/LevelSelection";
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
export default class LevelList extends Sprite {
    public static UPDATE_SCROLLER: string;
    public static FACE_SELECTED: string = "faceselected";
    private levelSelection: LevelSelection;
    private listItemArray: any[];
    private selectedListItem: LevelListItem;
    private nextSelectedListItem: LevelListItem;
    private _selectedCharacter: number;
    private _highlightedArray: any[];
    private _tweenVal: number = 0;
    private tweenTime: number = 0.25;
    private opening: boolean;
    private closing: boolean;

    constructor(param1: any[], param2: number = -1, param3: number = -1) {
        super();
        var _loc5_: number = 0;
        var _loc8_: LevelDataObject = null;
        var _loc9_: LevelListItem = null;

        this.listItemArray = new Array();
        var _loc4_: number = 0;
        _loc5_ = LevelListItem.BG_HEIGHT;
        var _loc6_ = int(param1.length);
        var _loc7_: number = 0;
        while (_loc7_ < _loc6_) {
            _loc8_ = param1[_loc7_];
            _loc9_ = new LevelListItem(_loc8_);
            this.addChild(_loc9_);
            this.listItemArray.push(_loc9_);
            _loc9_.y = _loc4_;
            _loc4_ += _loc5_;
            if (_loc8_.id == param2) {
                this.selectedListItem = _loc9_;
            }
            _loc7_++;
        }
        if (this.selectedListItem) {
            this.selectedListItem.selected = true;
            this.openSelection();
        }
        this.selectedCharacter = param3;
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
        var _loc2_: LevelListItem = null;
        if (param1.target instanceof LevelListItem) {
            _loc2_ = param1.target as LevelListItem;
            if (!param1.buttonDown) {
                _loc2_.rollOver();
            } else {
                _loc2_.mouseDown();
            }
        }
    }

    private mouseOutHandler(param1: MouseEvent) {
        var _loc2_: LevelListItem = null;
        if (param1.target instanceof LevelListItem) {
            _loc2_ = param1.target as LevelListItem;
            _loc2_.rollOut();
        }
    }

    private mouseDownHandler(param1: MouseEvent) {
        var _loc2_: LevelListItem = null;
        if (param1.target instanceof LevelListItem) {
            _loc2_ = param1.target as LevelListItem;
            _loc2_.mouseDown();
        }
    }

    private mouseUpHandler(param1: MouseEvent) {
        var _loc2_: LevelListItem = null;
        var _loc3_: MovieClip = null;
        trace(param1.target instanceof LevelListItem);
        if (param1.target instanceof LevelListItem) {
            _loc2_ = param1.target as LevelListItem;
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
                this.dispatchEvent(new Event(LevelList.FACE_SELECTED));
            }
        }
    }

    public closeSelection(param1: boolean = false) {
        if (param1 && Boolean(this.selectedListItem)) {
            this.selectedListItem.selected = false;
            this.selectedListItem = null;
        }
        this.closing = true;
        this.killLevelSelection();
        TweenLite.to(this, this.tweenTime, {
            tweenVal: 0,
            ease: Strong.easeInOut,
            onComplete: this.closingComplete,
        });
    }

    private killLevelSelection() {
        this.levelSelection.die();
        this.levelSelection.removeEventListener(
            NavigationEvent.SESSION,
            this.cloneAndDispatchEvent,
        );
        this.levelSelection.removeEventListener(
            NavigationEvent.EDITOR,
            this.cloneAndDispatchEvent,
        );
        this.levelSelection.removeEventListener(
            NavigationEvent.REPLAY_BROWSER,
            this.cloneAndDispatchEvent,
        );
        this.levelSelection.removeEventListener(
            BrowserEvent.USER,
            this.cloneAndDispatchEvent,
        );
        this.levelSelection.removeEventListener(
            BrowserEvent.FLAG,
            this.cloneAndDispatchEvent,
        );
        this.levelSelection.removeEventListener(
            BrowserEvent.ADD_TO_FAVORITES,
            this.cloneAndDispatchEvent,
        );
        this.levelSelection.removeEventListener(
            BrowserEvent.REMOVE_FROM_FAVORITES,
            this.cloneAndDispatchEvent,
        );
    }

    public get tweenVal(): number {
        return this._tweenVal;
    }

    public set tweenVal(param1: number) {
        this._tweenVal = param1;
        this.levelSelection.maskHeight = Math.round(
            this.levelSelection.fullHeight * param1,
        );
        this.organizeList();
        this.dispatchEvent(new Event(LevelList.UPDATE_SCROLLER));
    }

    private closingComplete() {
        this.closing = false;
        this.removeChild(this.levelSelection);
        this.levelSelection = null;
        if (this.selectedListItem) {
            this.openSelection();
        } else {
            this.organizeList();
            this.dispatchEvent(new Event(LevelList.UPDATE_SCROLLER));
        }
    }

    private openSelection() {
        var _loc1_: number = this.getChildIndex(this.selectedListItem) + 1;
        this.levelSelection = new LevelSelection(
            this.selectedListItem.levelDataObject,
        );
        this.levelSelection.addEventListener(
            NavigationEvent.SESSION,
            this.cloneAndDispatchEvent,
        );
        this.levelSelection.addEventListener(
            NavigationEvent.EDITOR,
            this.cloneAndDispatchEvent,
        );
        this.levelSelection.addEventListener(
            NavigationEvent.REPLAY_BROWSER,
            this.cloneAndDispatchEvent,
        );
        this.levelSelection.addEventListener(
            BrowserEvent.USER,
            this.cloneAndDispatchEvent,
        );
        this.levelSelection.addEventListener(
            BrowserEvent.FLAG,
            this.cloneAndDispatchEvent,
        );
        this.levelSelection.addEventListener(
            BrowserEvent.ADD_TO_FAVORITES,
            this.cloneAndDispatchEvent,
        );
        this.levelSelection.addEventListener(
            BrowserEvent.REMOVE_FROM_FAVORITES,
            this.cloneAndDispatchEvent,
        );
        this.addChildAt(this.levelSelection, _loc1_);
        this.levelSelection.maskHeight = 0;
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
            if (_loc3_ instanceof LevelListItem) {
                _loc5_ = LevelListItem.BG_HEIGHT;
            } else if (_loc3_ instanceof LevelSelection) {
                _loc5_ = (_loc3_ as LevelSelection).maskHeight;
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
        if (Boolean(this.levelSelection) && this.opening) {
            _loc8_ = this.levelSelection.y + this.levelSelection.maskHeight;
            _loc7_ = 352 - this.y - _loc8_;
            if (_loc7_ < 0) {
                this.y += _loc7_;
            }
        }
    }

    // @ts-expect-error
    public override get height(): number {
        var _loc1_: number = this.numChildren * LevelListItem.BG_HEIGHT;
        if (this.levelSelection) {
            _loc1_ += this.levelSelection.maskHeight - LevelListItem.BG_HEIGHT;
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
        var _loc4_: LevelListItem = null;
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
            this.dispatchEvent(new Event(LevelList.FACE_SELECTED));
        }
    }

    public get highlightedArray(): any[] {
        return this._highlightedArray;
    }

    public die() {
        this.removeEventListener(MouseEvent.MOUSE_OVER, this.mouseOverHandler);
        this.removeEventListener(MouseEvent.MOUSE_OUT, this.mouseOutHandler);
        this.removeEventListener(MouseEvent.MOUSE_DOWN, this.mouseDownHandler);
        this.removeEventListener(MouseEvent.MOUSE_UP, this.mouseUpHandler);
        this.removeEventListener(KeyboardEvent.KEY_DOWN, this.keyDownHandler);
        if (this.levelSelection) {
            this.killLevelSelection();
        }
    }
}