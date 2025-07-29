import SpecialExpandItem from "@/com/totaljerkface/game/editor/ui/SpecialExpandItem";
import SpecialListItem from "@/com/totaljerkface/game/editor/ui/SpecialListItem";
import SpecialListScroller from "@/com/totaljerkface/game/editor/ui/SpecialListScroller";
import SoundController from "@/com/totaljerkface/game/sound/SoundController";
import SoundList from "@/com/totaljerkface/game/sound/SoundList";
import ListPlayButton from "@/top/ListPlayButton";
import { boundClass } from 'autobind-decorator';
import DisplayObject from "flash/display/DisplayObject";
import DisplayObjectContainer from "flash/display/DisplayObjectContainer";
import Sprite from "flash/display/Sprite";
import Event from "flash/events/Event";
import MouseEvent from "flash/events/MouseEvent";
import Sound from "flash/media/Sound";
import SoundChannel from "flash/media/SoundChannel";

@boundClass
export default class ListMenu extends Sprite {
    public static ITEM_SELECTED: string;
    private _selectedItem: SpecialListItem;
    private lastRolledItem: SpecialListItem;
    private mouseItem: SpecialListItem;
    private holder: Sprite;
    private listMask: Sprite;
    private list: Sprite;
    private scroller: SpecialListScroller;
    private entryList: any[];
    private initialEntry: string;
    private playSound: boolean;
    private playSprite: Sprite;
    private soundChannel: SoundChannel;
    private maxHeight: number = 220;
    private maskHeight: number = 220;
    private totalHeight: number = 224;
    private totalWidth: number = 154;
    private itemWidth: number = 150;
    private scrollable: boolean;

    constructor(
        param1: any[],
        param2: string,
        param3: boolean = false,
        param4: boolean = false,
    ) {
        super();
        this.entryList = param1;
        if (!param4) {
            this.initialEntry = param2;
        }
        this.playSound = param3;
        this.init();
    }

    private init() {
        this.createList();
        this.list.addEventListener(MouseEvent.MOUSE_UP, this.mouseUpHandler);
        this.list.addEventListener(
            MouseEvent.MOUSE_OVER,
            this.mouseOverHandler,
        );
        if (this.scrollable) {
            this.holder.addEventListener(
                Event.ENTER_FRAME,
                this.enterFrameHandler,
            );
        }
    }

    private createList() {
        var _loc3_: {} = null;
        var _loc4_: SpecialListItem = null;
        var _loc5_: SpecialExpandItem = null;
        var _loc6_: number = NaN;
        var _loc7_: number = NaN;
        var _loc8_: number = NaN;
        var _loc9_: DisplayObjectContainer = null;
        var _loc10_: DisplayObject = null;
        var _loc11_: number = 0;
        this.holder = new Sprite();
        this.holder.y = 2;
        this.holder.x = 2;
        this.addChild(this.holder);
        this.listMask = new Sprite();
        this.listMask.graphics.beginFill(0);
        this.listMask.graphics.drawRect(0, 0, this.itemWidth, this.maskHeight);
        this.listMask.graphics.endFill();
        this.holder.addChild(this.listMask);
        this.list = new Sprite();
        this.holder.addChildAt(this.list, 0);
        this.list.mask = this.listMask;
        var _loc1_: number = 0;
        var _loc2_: number = 0;
        while (_loc2_ < this.entryList.length) {
            _loc3_ = this.entryList[_loc2_];
            _loc4_ = this.createItem(_loc3_, 0);
            this.list.addChild(_loc4_);
            _loc1_ += _loc4_.height;
            _loc2_++;
        }
        if (_loc1_ >= this.maxHeight) {
            this.scrollable = true;
            this.maskHeight = this.maxHeight;
        } else {
            this.maskHeight = _loc1_;
        }
        this.totalHeight = this.maskHeight + 4;
        this.graphics.beginFill(10066329);
        this.graphics.drawRect(0, 0, this.totalWidth, this.totalHeight);
        this.graphics.endFill();
        if (this._selectedItem) {
            if (this._selectedItem.parentItem) {
                _loc5_ = this._selectedItem.parentItem;
                while (_loc5_) {
                    _loc5_.expanded = true;
                    _loc5_ = _loc5_.parentItem;
                }
            }
            this.organizeList();
            if (this.scrollable) {
                _loc6_ = this.list.height;
                _loc7_ = Math.round(this.maskHeight * 0.5);
                _loc8_ = 0;
                _loc9_ = this._selectedItem.parent;
                _loc10_ = this._selectedItem;
                while (_loc10_ != this.list) {
                    _loc8_ += _loc10_.y;
                    _loc10_ = _loc9_;
                    _loc9_ = _loc10_.parent;
                }
                _loc11_ = _loc7_ - _loc8_;
                this.list.y = _loc11_ - 11;
            }
        } else {
            this.organizeList();
        }
    }

    private createItem(param1: {}, param2: number): SpecialListItem {
        var _loc3_: any[] = null;
        var _loc4_: SpecialExpandItem = null;
        var _loc5_: number = 0;
        var _loc6_: {} = null;
        var _loc7_: string = null;
        var _loc8_: SpecialListItem = null;
        if (Array.isArray(param1)) {
            _loc3_ = param1 as any[];
            _loc4_ = new SpecialExpandItem(
                _loc3_[0] as string,
                param2,
                this.itemWidth,
            );
            _loc5_ = 1;
            while (_loc5_ < _loc3_.length) {
                _loc6_ = _loc3_[_loc5_];
                _loc4_.addChildItem(this.createItem(_loc6_, param2 + 1));
                _loc5_++;
            }
            return _loc4_;
        }
        _loc7_ = param1 as string;
        _loc8_ = new SpecialListItem(_loc7_, _loc7_, param2, this.itemWidth);
        if (_loc7_ == this.initialEntry) {
            this._selectedItem = _loc8_;
            this._selectedItem.selected = true;
        }
        return _loc8_;
    }

    private organizeList() {
        var _loc3_: DisplayObject = null;
        var _loc1_: number = 0;
        var _loc2_: number = 0;
        while (_loc2_ < this.list.numChildren) {
            _loc3_ = this.list.getChildAt(_loc2_);
            _loc3_.y = _loc1_;
            _loc1_ += _loc3_.height;
            if (_loc3_ instanceof SpecialExpandItem) {
                (_loc3_ as SpecialExpandItem).organizeChildren();
            }
            _loc2_++;
        }
    }

    private mouseUpHandler(param1: MouseEvent) {
        var _loc2_: SpecialExpandItem = null;
        var _loc3_: string = null;
        var _loc4_: string = null;
        var _loc5_ = null;
        var _loc6_: Sound = null;
        if (param1.target instanceof SpecialExpandItem) {
            _loc2_ = param1.target as SpecialExpandItem;
            _loc2_.expanded = !_loc2_.expanded;
            this.organizeList();
        } else if (param1.target instanceof SpecialListItem) {
            if (this._selectedItem) {
                if (this._selectedItem == param1.target) {
                    return;
                }
                this._selectedItem.selected = false;
            }
            this._selectedItem = param1.target as SpecialListItem;
            this._selectedItem.selected = true;
            this.dispatchEvent(new Event(ListMenu.ITEM_SELECTED));
        } else if (param1.target == this.playSprite && this.playSound) {
            _loc3_ = this.mouseItem.value;
            _loc4_ = SoundList.instance.sfxDictionary[_loc3_];
            _loc5_ = getDefinitionByName(SoundController.SOUND_PATH + _loc4_);
            _loc6_ = new _loc5_();
            if (this.soundChannel) {
                this.soundChannel.stop();
            }
            this.soundChannel = _loc6_.play();
        }
    }

    private mouseOverHandler(param1: MouseEvent) {
        var _loc2_: SpecialListItem = null;
        if (param1.target instanceof SpecialListItem) {
            _loc2_ = param1.target as SpecialListItem;
            if (this.lastRolledItem) {
                this.lastRolledItem.rollOut();
            }
            this.lastRolledItem = _loc2_;
            this.lastRolledItem.rollOver();
            if (_loc2_ instanceof SpecialExpandItem || !this.playSound) {
                return;
            }
            if (!this.playSprite) {
                this.playSprite = new ListPlayButton();
                this.playSprite.buttonMode = true;
                this.playSprite.x = 135;
                this.playSprite.y = 11;
            }
            this.mouseItem = param1.target as SpecialListItem;
            this.mouseItem.addChild(this.playSprite);
        }
    }

    private enterFrameHandler(param1: Event) {
        var _loc7_: number = NaN;
        var _loc2_: number = this.maskHeight * 0.5;
        var _loc3_: number = 30;
        var _loc4_: number = _loc2_ - _loc3_;
        var _loc5_: number = _loc2_ + _loc3_;
        if (this.holder.mouseY < _loc4_) {
            _loc7_ = this.holder.mouseY - _loc4_;
        } else if (this.holder.mouseY > _loc5_) {
            _loc7_ = this.holder.mouseY - _loc5_;
        } else {
            _loc7_ = 0;
        }
        var _loc6_: number = 10 * (_loc7_ / _loc4_);
        this.list.y -= _loc6_;
        if (this.list.y > 0) {
            this.list.y = 0;
        }
        if (this.list.y < this.maskHeight - this.list.height) {
            this.list.y = this.maskHeight - this.list.height;
        }
    }

    public get selectedEntry(): string {
        return this._selectedItem.value;
    }

    // @ts-expect-error
    public override get height(): number {
        return this.totalHeight;
    }

    public die() {
        if (this.soundChannel) {
            this.soundChannel.stop();
        }
        this.list.removeEventListener(MouseEvent.MOUSE_UP, this.mouseUpHandler);
        this.list.removeEventListener(
            MouseEvent.MOUSE_OVER,
            this.mouseOverHandler,
        );
        this.holder.removeEventListener(
            Event.ENTER_FRAME,
            this.enterFrameHandler,
        );
    }
}