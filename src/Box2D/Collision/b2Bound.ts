export default class b2Bound {
    public value: number;
    public proxyId: number;
    public stabbingCount: number;

    public IsLower(): boolean {
        return (this.value & 1) == 0;
    }

    public IsUpper(): boolean {
        return (this.value & 1) == 1;
    }

    public Swap(param1: b2Bound) {
        var _loc2_: number = this.value;
        var _loc3_: number = this.proxyId;
        var _loc4_: number = this.stabbingCount;
        this.value = param1.value;
        this.proxyId = param1.proxyId;
        this.stabbingCount = param1.stabbingCount;
        param1.value = _loc2_;
        param1.proxyId = _loc3_;
        param1.stabbingCount = _loc4_;
    }
}