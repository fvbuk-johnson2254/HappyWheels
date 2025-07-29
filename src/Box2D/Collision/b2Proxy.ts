import b2BroadPhase from "@/Box2D/Collision/b2BroadPhase";

export default class b2Proxy {
    public lowerBounds: any[] = [uint(0), uint(0)];
    public upperBounds: any[] = [uint(0), uint(0)];
    public overlapCount: number;
    public timeStamp: number;
    public userData = null;

    public GetNext(): number {
        return this.lowerBounds[0];
    }

    public SetNext(param1: number) {
        this.lowerBounds[0] = param1 & 65535;
    }

    public IsValid(): boolean {
        return this.overlapCount != b2BroadPhase.b2_invalid;
    }
}