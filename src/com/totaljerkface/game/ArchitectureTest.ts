import b2CircleDef from "@/Box2D/Collision/Shapes/b2CircleDef";
import b2PolygonDef from "@/Box2D/Collision/Shapes/b2PolygonDef";
import b2AABB from "@/Box2D/Collision/b2AABB";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2Body from "@/Box2D/Dynamics/b2Body";
import b2BodyDef from "@/Box2D/Dynamics/b2BodyDef";
import b2DebugDraw from "@/Box2D/Dynamics/b2DebugDraw";
import b2World from "@/Box2D/Dynamics/b2World";
import Sprite from "flash/display/Sprite";
import Event from "flash/events/Event";
import Rectangle from "flash/geom/Rectangle";
import AntiAliasType from "flash/text/AntiAliasType";
import TextField from "flash/text/TextField";
import TextFieldAutoSize from "flash/text/TextFieldAutoSize";
import TextFormat from "flash/text/TextFormat";
import TextFormatAlign from "flash/text/TextFormatAlign";
import { boundClass } from 'autobind-decorator';

@boundClass
export default class ArchitectureTest extends Sprite {
    private textField: TextField;
    private m_world: b2World;
    private m_iterations: number = 10;
    private m_timeStep: number = 0.03333333333333333;
    private m_physScale: number = 62.5;
    private debug_sprite: Sprite;
    private useDebugger: boolean;
    private debugString: string;
    private totalFrames: number = 30;
    private frames: number = 0;
    private trackingBody: b2Body;
    private _result: string;

    constructor(param1: boolean = false) {
        super();
        this.useDebugger = param1;
        if (this.parent) {
            this.useDebugger = true;
            this.test();
        }
    }

    public test() {
        if (this.useDebugger) {
            this.debug_sprite = new Sprite();
            this.addChild(this.debug_sprite);
            this.useDebugger = true;
            this.createTextField();
            this.createWorld();
            this.createBodies();
            this.addEventListener(Event.ENTER_FRAME, this.run);
        } else {
            this.createWorld();
            this.createBodies();
            this.frames = 0;
            while (this.frames <= this.totalFrames) {
                this.m_world.Step(this.m_timeStep, this.m_iterations);
                ++this.frames;
            }
            this.dispatchEvent(new Event(Event.COMPLETE));
        }
    }

    public get result(): string {
        var _loc1_: string = this.trackingBody.GetPosition().x.toString();
        while (_loc1_.length < 17) {
            _loc1_ = _loc1_.concat('0');
        }
        return _loc1_.substr(_loc1_.length - 8, 8);
    }

    private createTextField() {
        var _loc1_ = new TextFormat(
            "HelveticaNeueLT Std",
            11,
            0,
            null,
            null,
            null,
            null,
            null,
            TextFormatAlign.LEFT,
        );
        this.textField = new TextField();
        this.textField.width = 390;
        this.textField.height = 10;
        this.textField.defaultTextFormat = _loc1_;
        this.textField.autoSize = TextFieldAutoSize.LEFT;
        trace(this.textField.width);
        this.textField.y = 0;
        this.textField.multiline = true;
        this.textField.selectable = true;
        this.textField.embedFonts = true;
        // @ts-expect-error
        this.textField.antiAliasType = AntiAliasType.ADVANCED;
        this.addChild(this.textField);
        this.debugString = '';
    }

    private createWorld() {
        var _loc1_ = new b2AABB();
        var _loc2_ = new Rectangle(-500, -500, 2000, 2000);
        _loc1_.lowerBound.Set(
            _loc2_.x / this.m_physScale,
            _loc2_.y / this.m_physScale,
        );
        _loc1_.upperBound.Set(
            (_loc2_.x + _loc2_.width) / this.m_physScale,
            (_loc2_.y + _loc2_.height) / this.m_physScale,
        );
        var _loc3_ = new b2Vec2(0, 10);
        var _loc4_: boolean = true;
        this.m_world = new b2World(_loc1_, _loc3_, _loc4_);
        var _loc5_ = new b2DebugDraw();
        _loc5_.m_sprite = this.debug_sprite;
        _loc5_.m_drawScale = 62.5;
        _loc5_.m_fillAlpha = 0.3;
        _loc5_.m_lineThickness = 1;
        _loc5_.m_drawFlags = b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit;
        if (this.useDebugger) {
            this.m_world.SetDebugDraw(_loc5_);
        }
    }

    private createBodies() {
        var _loc9_: number = 0;
        var _loc1_ = new b2BodyDef();
        var _loc2_ = new b2PolygonDef();
        var _loc3_ = new b2CircleDef();
        _loc2_.friction = _loc3_.friction = 1;
        _loc2_.restitution = _loc3_.restitution = 0.3;
        _loc2_.density = 1;
        var _loc4_: b2Body = this.m_world.CreateBody(_loc1_);
        _loc2_.SetAsOrientedBox(
            275 / this.m_physScale,
            50 / this.m_physScale,
            new b2Vec2(275 / this.m_physScale, 400 / this.m_physScale),
        );
        _loc4_.CreateShape(_loc2_);
        _loc2_.SetAsOrientedBox(
            275 / this.m_physScale,
            50 / this.m_physScale,
            new b2Vec2(275 / this.m_physScale, 0 / this.m_physScale),
        );
        _loc4_.CreateShape(_loc2_);
        _loc2_.SetAsOrientedBox(
            50 / this.m_physScale,
            200 / this.m_physScale,
            new b2Vec2(550 / this.m_physScale, 200 / this.m_physScale),
        );
        _loc4_.CreateShape(_loc2_);
        _loc2_.SetAsOrientedBox(
            50 / this.m_physScale,
            200 / this.m_physScale,
            new b2Vec2(0 / this.m_physScale, 200 / this.m_physScale),
        );
        _loc4_.CreateShape(_loc2_);
        var _loc5_: number = 5;
        _loc2_.SetAsOrientedBox(
            5 / this.m_physScale,
            5 / this.m_physScale,
            new b2Vec2(0, 0),
        );
        var _loc6_: number = 255;
        var _loc7_: number = 345;
        var _loc8_: number = 0;
        while (_loc8_ < _loc5_) {
            _loc9_ = 0;
            while (_loc9_ < _loc5_) {
                _loc1_.position.Set(
                    _loc6_ / this.m_physScale,
                    _loc7_ / this.m_physScale,
                );
                _loc4_ = this.m_world.CreateBody(_loc1_);
                _loc4_.CreateShape(_loc2_);
                _loc4_.SetMassFromShapes();
                if (_loc8_ == 0 && _loc9_ == 4) {
                    this.trackingBody = _loc4_;
                }
                _loc6_ += 10;
                _loc9_++;
            }
            _loc6_ = 255;
            _loc7_ -= 10;
            _loc8_++;
        }
        _loc1_.position.Set(85 / this.m_physScale, 315 / this.m_physScale);
        _loc4_ = this.m_world.CreateBody(_loc1_);
        _loc3_.radius = 25 / this.m_physScale;
        _loc3_.density = 3;
        _loc4_.CreateShape(_loc3_);
        _loc4_.SetMassFromShapes();
        _loc4_.SetLinearVelocity(new b2Vec2(20, 0));
    }

    private run(param1: Event) {
        if (this.frames == this.totalFrames) {
            this.removeEventListener(Event.ENTER_FRAME, this.run);
            this.textField.htmlText = this.debugString;
        }
        this.m_world.Step(this.m_timeStep, this.m_iterations);
        var _loc2_ = "frame " +
            this.frames +
            " = " +
            this.trackingBody.GetPosition().x +
            "<br>";
        this.debugString = this.debugString.concat(_loc2_);
        this.frames += 1;
    }
}