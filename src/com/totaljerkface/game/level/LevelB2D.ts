import b2CircleDef from "@/Box2D/Collision/Shapes/b2CircleDef";
import b2PolygonDef from "@/Box2D/Collision/Shapes/b2PolygonDef";
import b2Shape from "@/Box2D/Collision/Shapes/b2Shape";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2Body from "@/Box2D/Dynamics/b2Body";
import b2BodyDef from "@/Box2D/Dynamics/b2BodyDef";
import Session from "@/com/totaljerkface/game/Session";
import RefSprite from "@/com/totaljerkface/game/editor/RefSprite";
import EndBlock from "@/com/totaljerkface/game/level/EndBlock";
import LevelItem from "@/com/totaljerkface/game/level/LevelItem";
import MouseData from "@/com/totaljerkface/game/level/MouseData";
import BackDrop from "@/com/totaljerkface/game/level/visuals/BackDrop";
import { boundClass } from 'autobind-decorator';
import Bitmap from "flash/display/Bitmap";
import BitmapData from "flash/display/BitmapData";
import DisplayObject from "flash/display/DisplayObject";
import MovieClip from "flash/display/MovieClip";
import Sprite from "flash/display/Sprite";
import EventDispatcher from "flash/events/EventDispatcher";
import Rectangle from "flash/geom/Rectangle";

@boundClass
export default class LevelB2D extends EventDispatcher {
    protected static oneEightyOverPI: number;
    protected static PIOverOneEighty: number = Math.PI / 180;
    protected _levelVersion: number = 0;
    public levelData: Sprite;
    public background: Sprite;
    public characterLayer: Sprite;
    public foreground: Sprite;
    public backDrops: Vector<BackDrop>;
    public shapeGuide: Sprite;
    protected _session: Session;
    public m_physScale: number;
    public levelBody: b2Body;
    public endBlock: EndBlock;
    public paintBodyVector: Vector<b2Body>;
    public paintItemVector: Vector<LevelItem>;
    public actionsVector: Vector<LevelItem>;
    public actionsToRemove: Vector<LevelItem>;
    public singleActionVector: Vector<LevelItem>;
    public keepVector: Vector<LevelItem>;

    constructor(param1: Sprite, param2: Session) {
        super();
        this.session = param2;
        this.m_physScale = param2.m_physScale;
        this.levelData = param1;
        this._levelVersion = param2.levelVersion;
        if (param1.getChildByName("shapeGuide")) {
            this.shapeGuide = param1.getChildByName("shapeGuide") as Sprite;
            this.shapeGuide.x = 0;
            this.shapeGuide.y = 0;
        }
    }

    public get session(): Session {
        return this._session;
    }

    public set session(param1: Session) {
        this._session = param1;
    }

    public create() {
        this.paintBodyVector = new Vector<b2Body>();
        this.paintItemVector = new Vector<LevelItem>();
        this.actionsVector = new Vector<LevelItem>();
        this.actionsToRemove = new Vector<LevelItem>();
        this.singleActionVector = new Vector<LevelItem>();
        this.keepVector = new Vector<LevelItem>();
        this._session.containerSprite.addChildAt(this.shapeGuide, 0);
        this.createBackDrops();
        this.createMovieClips();
        this.createStaticShapes();
        this.createDynamicShapes();
        this.createItems();
    }

    public reset() {
        this.paintBodyVector = new Vector<b2Body>();
        this.paintItemVector = new Vector<LevelItem>();
        this.actionsVector = new Vector<LevelItem>();
        this.actionsToRemove = new Vector<LevelItem>();
        this.singleActionVector = new Vector<LevelItem>();
        this.keepVector = new Vector<LevelItem>();
        this.createStaticShapes();
        this.createDynamicShapes();
        this.createItems();
    }

    public die() {
        var _loc1_: number = 0;
        var _loc2_: LevelItem = null;
        trace("LEVEL DIE");
        if (this.endBlock) {
            this.endBlock.die();
        }
        if (this.actionsVector) {
            _loc1_ = 0;
            while (_loc1_ < this.actionsVector.length) {
                _loc2_ = this.actionsVector[_loc1_];
                _loc2_.die();
                _loc1_++;
            }
        }
        this.paintBodyVector = null;
        this.paintItemVector = null;
        this.actionsVector = null;
        this.actionsToRemove = null;
        this.singleActionVector = null;
        this.keepVector = null;
    }

    public get startPoint(): b2Vec2 {
        return new b2Vec2(400, 100);
    }

    public createStaticShapes() {
        var _loc6_: number = NaN;
        var _loc8_: DisplayObject = null;
        var _loc9_: number = NaN;
        var _loc10_: number = NaN;
        var _loc11_: b2BodyDef = null;
        var _loc12_: b2Body = null;
        var _loc13_: b2PolygonDef = null;
        var _loc14_: number = 0;
        var _loc15_: b2Vec2 = null;
        var _loc16_: number = NaN;
        var _loc17_: number = NaN;
        var _loc1_ = new b2BodyDef();
        this.levelBody = this._session.m_world.CreateBody(_loc1_);
        var _loc2_ = new b2PolygonDef();
        var _loc3_ = new b2CircleDef();
        var _loc4_ = new b2PolygonDef();
        _loc2_.friction = 1;
        _loc2_.restitution = 0.1;
        _loc2_.filter.categoryBits = 8;
        _loc2_.filter.groupIndex = -10;
        _loc3_.friction = 1;
        _loc3_.restitution = 0.1;
        _loc3_.filter.categoryBits = 8;
        _loc3_.filter.groupIndex = -10;
        _loc4_.friction = 1;
        _loc4_.restitution = 0.1;
        _loc4_.filter.categoryBits = 8;
        _loc4_.vertexCount = 3;
        _loc4_.filter.groupIndex = -10;
        var _loc5_ = new b2Vec2();
        var _loc7_: number = 0;
        while (_loc7_ < this.shapeGuide.numChildren) {
            _loc8_ = this.shapeGuide.getChildAt(_loc7_);
            _loc8_.visible = false;
            _loc6_ = (_loc8_.rotation * Math.PI) / 180;
            _loc5_.Set(
                _loc8_.x / this.m_physScale,
                _loc8_.y / this.m_physScale,
            );
            switch (_loc8_.name) {
                case "rp":
                    _loc2_.SetAsOrientedBox(
                        (_loc8_.scaleX * 5) / this.m_physScale,
                        (_loc8_.scaleY * 5) / this.m_physScale,
                        _loc5_,
                        _loc6_,
                    );
                    this.levelBody.CreateShape(_loc2_);
                    break;
                case "cp":
                    _loc3_.localPosition.Set(_loc5_.x, _loc5_.y);
                    _loc3_.radius = (_loc8_.scaleX * 5) / this.m_physScale;
                    this.levelBody.CreateShape(_loc3_);
                    break;
                case "tp":
                    _loc9_ = (_loc8_.scaleX * 5) / this.m_physScale;
                    _loc10_ = (_loc8_.scaleY * 10) / this.m_physScale;
                    _loc4_.vertices[0] = new b2Vec2(0, _loc10_ * -2);
                    _loc4_.vertices[1] = new b2Vec2(_loc9_, _loc10_);
                    _loc4_.vertices[2] = new b2Vec2(-_loc9_, _loc10_);
                    _loc14_ = 0;
                    while (_loc14_ < 3) {
                        _loc15_ = _loc4_.vertices[_loc14_];
                        _loc16_ =
                            Math.cos(_loc6_) * _loc15_.x -
                            Math.sin(_loc6_) * _loc15_.y;
                        _loc17_ =
                            Math.cos(_loc6_) * _loc15_.y +
                            Math.sin(_loc6_) * _loc15_.x;
                        _loc4_.vertices[_loc14_] = new b2Vec2(
                            _loc5_.x + _loc16_,
                            _loc5_.y + _loc17_,
                        );
                        _loc14_++;
                    }
                    this.levelBody.CreateShape(_loc4_);
                    break;
                case "rpd":
                    _loc11_ = new b2BodyDef();
                    _loc11_.isSleeping = true;
                    _loc12_ = this._session.m_world.CreateBody(_loc11_);
                    _loc13_ = new b2PolygonDef();
                    _loc13_.density = 1;
                    _loc13_.friction = 1;
                    _loc13_.restitution = 0.1;
                    _loc13_.filter.categoryBits = 8;
                    _loc13_.SetAsOrientedBox(
                        (_loc8_.scaleX * 5) / this.m_physScale,
                        (_loc8_.scaleY * 5) / this.m_physScale,
                        _loc5_,
                        _loc6_,
                    );
                    _loc12_.CreateShape(_loc13_);
                    _loc12_.SetMassFromShapes();
                    break;
                case "cb":
                    break;
                case "tb":
                    break;
            }
            _loc7_++;
        }
    }

    public createDynamicShapes() {
        var _loc2_: number = NaN;
        var _loc5_: DisplayObject = null;
        var _loc6_: any[] = null;
        var _loc7_: MovieClip = null;
        var _loc8_: b2BodyDef = null;
        var _loc9_: b2Body = null;
        var _loc10_: b2PolygonDef = null;
        var _loc1_ = new b2Vec2();
        var _loc3_ = "com.totaljerkface.game.level::LevelRectMC";
        var _loc4_: number = 0;
        while (_loc4_ < this.shapeGuide.numChildren) {
            _loc5_ = this.shapeGuide.getChildAt(_loc4_);
            _loc2_ = (_loc5_.rotation * Math.PI) / 180;
            _loc1_.Set(
                _loc5_.x / this.m_physScale,
                _loc5_.y / this.m_physScale,
            );
            if (getQualifiedClassName(_loc5_) == _loc3_) {
                _loc5_.visible = false;
                _loc6_ = _loc5_.name.split("_");
                _loc7_ = this.background[_loc6_[0] + "mc"];
                _loc8_ = new b2BodyDef();
                if (_loc6_[2] == "sleep") {
                    _loc8_.isSleeping = true;
                }
                _loc9_ = this._session.m_world.CreateBody(_loc8_);
                _loc9_.m_userData = _loc7_;
                _loc10_ = new b2PolygonDef();
                _loc10_.density = Number(_loc6_[1]);
                _loc10_.friction = 1;
                _loc10_.restitution = 0.1;
                _loc10_.filter.categoryBits = 8;
                _loc10_.SetAsOrientedBox(
                    (_loc5_.scaleX * 5) / this.m_physScale,
                    (_loc5_.scaleY * 5) / this.m_physScale,
                    _loc1_,
                    _loc2_,
                );
                _loc9_.CreateShape(_loc10_);
                _loc9_.SetMassFromShapes();
                this.paintBodyVector.push(_loc9_);
            }
            _loc4_++;
        }
    }

    public createBackDrops() {
        this.backDrops = new Vector<BackDrop>();
    }

    public insertBackDrops() {
        var _loc3_: BackDrop = null;
        var _loc1_ = int(this.backDrops.length);
        var _loc2_: number = 0;
        while (_loc2_ < _loc1_) {
            _loc3_ = this.backDrops[_loc2_];
            this._session.addChildAt(_loc3_, 0);
            _loc2_++;
        }
    }

    public createMovieClips() {
        this.foreground = this.levelData.getChildByName("foreGround") as Sprite;
        this._session.containerSprite.addChild(this.foreground);
        this._session.particleController.placeBloodBitmap();
        this.background = this.levelData.getChildByName("backGround") as Sprite;
        this._session.containerSprite.addChildAt(this.background, 1);
        this.convertBackground();
    }

    public convertBackground() {
        var _loc2_: DisplayObject = null;
        var _loc3_: Bitmap = null;
        var _loc1_: number = 0;
        while (_loc1_ < this.background.numChildren) {
            _loc2_ = this.background.getChildAt(_loc1_);
            if (_loc2_.name == "bm") {
                _loc3_ = this.createBitmap(_loc2_);
                this.background.addChildAt(_loc3_, _loc1_);
                _loc3_.x = _loc2_.x;
                _loc3_.y = _loc2_.y;
                this.background.removeChild(_loc2_);
            }
            _loc1_++;
        }
    }

    public createBitmap(param1: DisplayObject): Bitmap {
        var _loc2_ = new BitmapData(
            param1.width,
            param1.height,
            true,
            16777215,
        );
        _loc2_.draw(param1);
        return new Bitmap(_loc2_);
    }

    public createItems() {
        this.endBlock = new EndBlock();
    }

    public addListeners() { }

    public removeFromPaintBodyVector(param1: b2Body) {
        var _loc2_ = int(this.paintBodyVector.indexOf(param1));
        if (_loc2_ > -1) {
            this.paintBodyVector.splice(_loc2_, 1);
        }
    }

    public removeFromPaintItemVector(param1: LevelItem) {
        var _loc2_ = int(this.paintItemVector.indexOf(param1));
        if (_loc2_ > -1) {
            this.paintItemVector.splice(_loc2_, 1);
        }
    }

    public removeFromActionsVector(param1: LevelItem) {
        this.actionsToRemove.push(param1);
    }

    public paint() {
        var _loc3_: b2Body = null;
        var _loc4_: b2Vec2 = null;
        var _loc5_: LevelItem = null;
        var _loc1_ = int(this.paintBodyVector.length);
        var _loc2_: number = 0;
        while (_loc2_ < _loc1_) {
            _loc3_ = this.paintBodyVector[_loc2_];
            _loc4_ = _loc3_.GetWorldCenter();
            _loc3_.m_userData.x = _loc4_.x * this.m_physScale;
            _loc3_.m_userData.y = _loc4_.y * this.m_physScale;
            _loc3_.m_userData.rotation =
                (_loc3_.GetAngle() * LevelB2D.oneEightyOverPI) % 360;
            _loc2_++;
        }
        _loc1_ = int(this.paintItemVector.length);
        _loc2_ = 0;
        while (_loc2_ < _loc1_) {
            _loc5_ = this.paintItemVector[_loc2_];
            _loc5_.paint();
            _loc2_++;
        }
    }

    public actions() {
        var _loc3_: LevelItem = null;
        var _loc4_: number = 0;
        var _loc1_ = int(this.singleActionVector.length);
        var _loc2_: number = 0;
        while (_loc2_ < _loc1_) {
            _loc3_ = this.singleActionVector[_loc2_];
            _loc3_.singleAction();
            _loc2_++;
        }
        this.singleActionVector = new Vector<LevelItem>();
        _loc1_ = int(this.actionsVector.length);
        _loc2_ = 0;
        while (_loc2_ < _loc1_) {
            _loc3_ = this.actionsVector[_loc2_];
            _loc3_.actions();
            _loc2_++;
        }
        _loc1_ = int(this.actionsToRemove.length);
        _loc2_ = 0;
        while (_loc2_ < _loc1_) {
            _loc3_ = this.actionsToRemove[_loc2_];
            _loc4_ = int(this.actionsVector.indexOf(_loc3_));
            if (_loc4_ > -1) {
                this.actionsVector.splice(_loc4_, 1);
            }
            _loc2_++;
        }
        this.actionsToRemove = new Vector<LevelItem>();
    }

    public get cameraBounds(): Rectangle {
        var _loc1_: Sprite = this.shapeGuide.getChildByName(
            "camUpper",
        ) as Sprite;
        var _loc2_: Sprite = this.shapeGuide.getChildByName(
            "camLower",
        ) as Sprite;
        return new Rectangle(
            _loc2_.x,
            _loc2_.y,
            _loc1_.x - _loc2_.x,
            _loc1_.y - _loc2_.y,
        );
    }

    public get worldBounds(): Rectangle {
        var _loc1_: Sprite = this.shapeGuide.getChildByName("upper") as Sprite;
        var _loc2_: Sprite = this.shapeGuide.getChildByName("lower") as Sprite;
        return new Rectangle(
            _loc2_.x,
            _loc2_.y,
            _loc1_.x - _loc2_.x,
            _loc1_.y - _loc2_.y,
        );
    }

    public registerShapeSound(param1: b2Shape, param2: b2Body) { }

    public updateTargetActionsFor(
        param1: RefSprite,
        param2: b2Shape,
        param3: Sprite,
        param4: number,
        param5: boolean = false,
    ) { }

    public updateTargetActionGroupsFor(
        param1: RefSprite,
        param2: b2Body,
        param3: Sprite,
    ) { }

    public get levelVersion(): number {
        return this._levelVersion;
    }

    public set levelVersion(param1: number) {
        this._levelVersion = param1;
    }

    public mouseClickTrigger(param1: MouseData) { }
}