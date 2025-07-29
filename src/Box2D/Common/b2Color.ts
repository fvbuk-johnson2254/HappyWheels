import b2Math from "@/Box2D/Common/Math/b2Math";

export default class b2Color {
    private _r: number = 0;
    private _g: number = 0;
    private _b: number = 0;

    constructor(param1: number, param2: number, param3: number) {
        this._r = uint(255 * b2Math.b2Clamp(param1, 0, 1));
        this._g = uint(255 * b2Math.b2Clamp(param2, 0, 1));
        this._b = uint(255 * b2Math.b2Clamp(param3, 0, 1));
    }

    public Set(param1: number, param2: number, param3: number) {
        this._r = uint(255 * b2Math.b2Clamp(param1, 0, 1));
        this._g = uint(255 * b2Math.b2Clamp(param2, 0, 1));
        this._b = uint(255 * b2Math.b2Clamp(param3, 0, 1));
    }

    public set r(param1: number) {
        this._r = uint(255 * b2Math.b2Clamp(param1, 0, 1));
    }

    public set g(param1: number) {
        this._g = uint(255 * b2Math.b2Clamp(param1, 0, 1));
    }

    public set b(param1: number) {
        this._b = uint(255 * b2Math.b2Clamp(param1, 0, 1));
    }

    public get color(): number {
        return this._r | (this._g << 8) | (this._b << 16);
    }
}