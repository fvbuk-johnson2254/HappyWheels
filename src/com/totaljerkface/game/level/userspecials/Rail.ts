import b2PolygonDef from "@/Box2D/Collision/Shapes/b2PolygonDef";
import b2Shape from "@/Box2D/Collision/Shapes/b2Shape";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import b2Body from "@/Box2D/Dynamics/b2Body";
import b2BodyDef from "@/Box2D/Dynamics/b2BodyDef";
import b2World from "@/Box2D/Dynamics/b2World";
import ContactListener from "@/com/totaljerkface/game/ContactListener";
import Settings from "@/com/totaljerkface/game/Settings";
import RailRef from "@/com/totaljerkface/game/editor/specials/RailRef";
import Special from "@/com/totaljerkface/game/editor/specials/Special";
import LevelItem from "@/com/totaljerkface/game/level/LevelItem";
import RailMC from "@/top/RailMC";
import { boundClass } from 'autobind-decorator';
import Sprite from "flash/display/Sprite";
import Point from "flash/geom/Point";

@boundClass
export default class Rail extends LevelItem {
    private static idCounter: number;
    private maxSounds: number = 2;
    private mc: RailMC;
    private segmentCount: number = 0;
    private segmentWidth: number = 0;
    public height: number = 18;
    private body: b2Body;
    private sensor: b2Shape;
    private baseShape: b2Shape;
    private angle: number;
    private add: boolean;
    private remove: boolean;
    private bodiesToAdd: any[];
    private bodiesToRemove: any[];
    private bjDictionary: Dictionary<any, any>;
    private countDictionary: Dictionary<any, any>;
    private halfWidth: number;
    private soundCounter: number = 0;

    constructor(param1: Special, param2: b2Body = null, param3: Point = null) {
        super();
        var _loc4_: RailRef = null;
        var _loc5_: Sprite = null;
        var _loc6_: b2World = null;

        _loc4_ = param1 as RailRef;
        _loc5_ = Settings.currentSession.level.background;
        _loc6_ = Settings.currentSession.m_world;
        var _loc7_: ContactListener = Settings.currentSession.contactListener;
        this.mc = new RailMC();
        this.mc.x = _loc4_.x;
        this.mc.y = _loc4_.y;
        this.mc.width = _loc4_.shapeWidth;
        this.mc.rotation = _loc4_.rotation;
        _loc5_.addChild(this.mc);
        var _loc8_ = new b2PolygonDef();
        _loc8_.friction = 0.3;
        _loc8_.restitution = 0.1;
        _loc8_.filter.categoryBits = 8;
        var _loc9_: number = _loc4_.shapeWidth;
        var _loc10_: number = this.height;
        _loc8_.SetAsOrientedBox(
            _loc9_ / 2 / this.m_physScale,
            _loc10_ / 4 / this.m_physScale,
            new b2Vec2(0, -_loc10_ / 4 / this.m_physScale),
        );
        var _loc11_ = new b2BodyDef();
        _loc11_.angle = (_loc4_.rotation * Math.PI) / 180;
        _loc11_.position = new b2Vec2(
            _loc4_.x / this.m_physScale,
            _loc4_.y / this.m_physScale,
        );
        var _loc12_: b2Body = _loc6_.CreateBody(_loc11_);
        var _loc13_: b2Shape = _loc12_.CreateShape(_loc8_);
        _loc13_.SetMaterial(4);
        _loc8_.SetAsOrientedBox(
            _loc9_ / 2 / this.m_physScale,
            _loc10_ / 4 / this.m_physScale,
            new b2Vec2(0, _loc10_ / 4 / this.m_physScale),
        );
        _loc12_.CreateShape(_loc8_);
    }
}