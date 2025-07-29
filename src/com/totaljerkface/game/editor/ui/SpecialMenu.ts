import Settings from "@/com/totaljerkface/game/Settings";
import Special from "@/com/totaljerkface/game/editor/specials/Special";
import ConcaveSquare from "@/com/totaljerkface/game/editor/ui/ConcaveSquare";
import SpecialExpandItem from "@/com/totaljerkface/game/editor/ui/SpecialExpandItem";
import SpecialListItem from "@/com/totaljerkface/game/editor/ui/SpecialListItem";
import SpecialListScroller from "@/com/totaljerkface/game/editor/ui/SpecialListScroller";
import { boundClass } from 'autobind-decorator';
import DisplayObject from "flash/display/DisplayObject";
import Sprite from "flash/display/Sprite";
import Event from "flash/events/Event";
import MouseEvent from "flash/events/MouseEvent";

@boundClass
export default class SpecialMenu extends Sprite {
    public static SPECIAL_CHOSEN: string;
    private static specialList: any[] = [
        ["building blocks", "IBeamRef", "LogRef", "RailRef"],
        [
            "hazards",
            "ArrowGunRef",
            "HarpoonGunRef",
            "HomingMineRef",
            "MineRef",
            "SpikesRef",
            "WreckingBallRef",
        ],
        [
            "movement",
            "CannonRef",
            "BoostRef",
            "FanRef",
            "JetRef",
            "SpringBoxRef",
            "PaddleRef",
        ],
        ["characters", "NPCharacterRef"],
        ["buildings", "Building1Ref", "Building2Ref"],
        [
            "miscellaneous",
            "BladeWeaponRef",
            "FoodItemRef",
            "ChainRef",
            "GlassRef",
            "MeteorRef",
            "TableRef",
            "ChairRef",
            "BottleRef",
            "TVRef",
            "BoomboxRef",
            "SoccerBallRef",
            "VanRef",
            "SignPostRef",
            "TrashCanRef",
            "ToiletRef",
        ],
        "TokenRef",
        "FinishLineRef",
    ];
    private _selectedItem: SpecialListItem;
    private lastRolledItem: SpecialListItem;
    private holder: Sprite;
    private listMask: Sprite;
    private list: Sprite;
    private scroller: SpecialListScroller;
    private bgSquare: ConcaveSquare;
    private listHeight: number = 220;
    private totalHeight: number = 224;
    private totalWidth: number = 154;
    private itemWidth: number = 150;

    constructor() {
        super();
        this.init();
    }

    private init() {
        this.createList();
        this.list.addEventListener(MouseEvent.MOUSE_UP, this.mouseUpHandler);
        this.list.addEventListener(
            MouseEvent.MOUSE_OVER,
            this.mouseOverHandler,
        );
    }

    private createList() {
        var _loc2_: {} = null;
        var _loc3_: SpecialListItem = null;
        this.bgSquare = new ConcaveSquare(
            this.totalWidth,
            this.listHeight + 4,
            10066329,
        );
        this.bgSquare.y = this.totalHeight - (this.listHeight + 4);
        this.addChild(this.bgSquare);
        this.holder = new Sprite();
        this.holder.y = this.bgSquare.y + 2;
        this.holder.x = 2;
        this.addChild(this.holder);
        this.listMask = new Sprite();
        this.listMask.graphics.beginFill(0);
        this.listMask.graphics.drawRect(0, 0, this.itemWidth, this.listHeight);
        this.listMask.graphics.endFill();
        this.holder.addChild(this.listMask);
        this.list = new Sprite();
        this.holder.addChildAt(this.list, 0);
        this.list.mask = this.listMask;
        var _loc1_: number = 0;
        while (_loc1_ < SpecialMenu.specialList.length) {
            _loc2_ = SpecialMenu.specialList[_loc1_];
            _loc3_ = this.createItem(_loc2_, 0);
            this.list.addChild(_loc3_);
            _loc1_++;
        }
        this.organizeList();
        this.scroller = new SpecialListScroller(this.list, this.listMask, 22);
        this.holder.addChild(this.scroller);
        this.scroller.x = this.itemWidth - 12;
    }

    private createItem(param1: {}, param2: number): SpecialListItem {
        var _loc3_: any[] = null;
        var _loc4_: SpecialExpandItem = null;
        var _loc5_: number = 0;
        var _loc6_: {} = null;
        var _loc7_: string = null;
        var _loc8_ = null;
        var _loc9_: Special = null;
        var _loc10_: SpecialListItem = null;
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
        _loc8_ = getDefinitionByName(Settings.specialClassPath + _loc7_);
        _loc9_ = new _loc8_();
        _loc10_ = new SpecialListItem(
            _loc9_.name,
            _loc7_,
            param2,
            this.itemWidth,
        );
        if (!this._selectedItem) {
            this._selectedItem = _loc10_;
            this._selectedItem.selected = true;
        }
        return _loc10_;
    }

    private organizeList() {
        var _loc1_: number = 0;
        var _loc3_: DisplayObject = null;
        _loc1_ = 0;
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
        if (param1.target instanceof SpecialExpandItem) {
            _loc2_ = param1.target as SpecialExpandItem;
            _loc2_.expanded = !_loc2_.expanded;
            this.organizeList();
            this.scroller.updateScrollTab();
        } else if (param1.target instanceof SpecialListItem) {
            if (this._selectedItem) {
                if (this._selectedItem == param1.target) {
                    return;
                }
                this._selectedItem.selected = false;
            }
            this._selectedItem = param1.target as SpecialListItem;
            this._selectedItem.selected = true;
            this.dispatchEvent(new Event(SpecialMenu.SPECIAL_CHOSEN));
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
        }
    }

    public get selectedClassName(): string {
        return this._selectedItem.value;
    }

    // @ts-expect-error
    public override get height(): number {
        return this.totalHeight;
    }

    // @ts-expect-error
    public override get width(): number {
        return this.totalWidth;
    }

    public die() {
        this.list.removeEventListener(MouseEvent.MOUSE_UP, this.mouseUpHandler);
        this.list.removeEventListener(
            MouseEvent.MOUSE_OVER,
            this.mouseOverHandler,
        );
        this.scroller.die();
    }
}