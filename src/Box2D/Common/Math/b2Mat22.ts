import b2Vec2 from "@/Box2D/Common/Math/b2Vec2";

export default class b2Mat22 {
	public col1 = new b2Vec2();
	public col2 = new b2Vec2();

    constructor(
        param1: number = 0,
        param2: b2Vec2 = null,
        param3: b2Vec2 = null,
    ) {
        var _loc4_: number = NaN;
        var _loc5_: number = NaN;
        this.col1 = new b2Vec2();
        this.col2 = new b2Vec2();

        if (param2 != null && param3 != null) {
            this.col1.SetV(param2);
            this.col2.SetV(param3);
        } else {
            _loc4_ = Math.cos(param1);
            _loc5_ = Math.sin(param1);
            this.col1.x = _loc4_;
            this.col2.x = -_loc5_;
            this.col1.y = _loc5_;
            this.col2.y = _loc4_;
        }
    }

    public Set(param1: number) {
        var _loc2_: number = NaN;
        _loc2_ = Math.cos(param1);
        var _loc3_: number = Math.sin(param1);
        this.col1.x = _loc2_;
        this.col2.x = -_loc3_;
        this.col1.y = _loc3_;
        this.col2.y = _loc2_;
    }

    public SetVV(param1: b2Vec2, param2: b2Vec2) {
        this.col1.SetV(param1);
        this.col2.SetV(param2);
    }

    public Copy(): b2Mat22 {
        return new b2Mat22(0, this.col1, this.col2);
    }

    public SetM(param1: b2Mat22) {
        this.col1.SetV(param1.col1);
        this.col2.SetV(param1.col2);
    }

    public AddM(param1: b2Mat22) {
        this.col1.x += param1.col1.x;
        this.col1.y += param1.col1.y;
        this.col2.x += param1.col2.x;
        this.col2.y += param1.col2.y;
    }

    public SetIdentity() {
        this.col1.x = 1;
        this.col2.x = 0;
        this.col1.y = 0;
        this.col2.y = 1;
    }

    public SetZero() {
        this.col1.x = 0;
        this.col2.x = 0;
        this.col1.y = 0;
        this.col2.y = 0;
    }

    public GetAngle(): number {
        return Math.atan2(this.col1.y, this.col1.x);
    }

    public Invert(param1: b2Mat22): b2Mat22 {
        var _loc2_: number = NaN;
        var _loc4_: number = NaN;
        var _loc6_: number = NaN;
        _loc2_ = this.col1.x;
        var _loc3_: number = this.col2.x;
        _loc4_ = this.col1.y;
        var _loc5_: number = this.col2.y;
        _loc6_ = _loc2_ * _loc5_ - _loc3_ * _loc4_;
        if (_loc6_ == 0) {
            return null;
        }
        _loc6_ = 1 / _loc6_;
        param1.col1.x = _loc6_ * _loc5_;
        param1.col2.x = -_loc6_ * _loc3_;
        param1.col1.y = -_loc6_ * _loc4_;
        param1.col2.y = _loc6_ * _loc2_;
        return param1;
    }

    public GetDeterminant(): number {
        var _loc1_: number = this.col1.x;
        var _loc2_: number = this.col2.x;
        var _loc3_: number = this.col1.y;
        var _loc4_: number = this.col2.y;
        return _loc1_ * _loc4_ - _loc2_ * _loc3_;
    }

    public Solve(param1: b2Vec2, param2: number, param3: number): b2Vec2 {
        var _loc4_: number = this.col1.x;
        var _loc5_: number = this.col2.x;
        var _loc6_: number = this.col1.y;
        var _loc7_: number = this.col2.y;
        var _loc8_: number = _loc4_ * _loc7_ - _loc5_ * _loc6_;
        _loc8_ = 1 / _loc8_;
        param1.x = _loc8_ * (_loc7_ * param2 - _loc5_ * param3);
        param1.y = _loc8_ * (_loc4_ * param3 - _loc6_ * param2);
        return param1;
    }

    public Abs() {
        this.col1.Abs();
        this.col2.Abs();
    }
}