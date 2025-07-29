import b2Shape from "@/Box2D/Collision/Shapes/b2Shape";
import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";
import { boundClass } from 'autobind-decorator';
import Event from "flash/events/Event";

@boundClass
export default class ContactEvent extends Event {
    public static ADD: string;
    public static REMOVE: string = "remove";
    public static PERSIST: string = "persist";
    public static RESULT: string = "result";
    private _impulse: number;
    private _normal: b2Vec2;
    private _shape: b2Shape;
    private _otherShape: b2Shape;
    private _position: b2Vec2;

    constructor(
        param1: string,
        param2: b2Shape,
        param3: number,
        param4: b2Vec2,
        param5: b2Shape,
        param6: b2Vec2,
    ) {
        super(param1);
        this._shape = param2;
        this._impulse = param3;
        this._normal = param4;
        this._otherShape = param5;
        this._position = param6;
    }

    public get impulse(): number {
        return this._impulse;
    }

    public get normal(): b2Vec2 {
        return this._normal;
    }

    public get shape(): b2Shape {
        return this._shape;
    }

    public get otherShape(): b2Shape {
        return this._otherShape;
    }

    public get position(): b2Vec2 {
        return this._position;
    }
}