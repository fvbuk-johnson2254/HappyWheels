import b2Settings from "@/Box2D/Common/b2Settings";

export default class b2Pair {
    public static b2_nullPair = b2Settings.USHRT_MAX;
    public static b2_nullProxy = b2Settings.USHRT_MAX;
    public static b2_tableCapacity = b2Settings.b2_maxPairs;
    public static b2_tableMask = b2Pair.b2_tableCapacity - 1;
    public static e_pairBuffered = 1;
    public static e_pairRemoved = 2;
    public static e_pairFinal = 4;
    public userData = null;
    public proxyId1: number;
    public proxyId2: number;
    public next: number;
    public status: number;

    public SetBuffered() {
        this.status |= b2Pair.e_pairBuffered;
    }

    public ClearBuffered() {
        this.status &= ~b2Pair.e_pairBuffered;
    }

    public IsBuffered(): boolean {
        return (this.status & b2Pair.e_pairBuffered) == b2Pair.e_pairBuffered;
    }

    public SetRemoved() {
        this.status |= b2Pair.e_pairRemoved;
    }

    public ClearRemoved() {
        this.status &= ~b2Pair.e_pairRemoved;
    }

    public IsRemoved(): boolean {
        return (this.status & b2Pair.e_pairRemoved) == b2Pair.e_pairRemoved;
    }

    public SetFinal() {
        this.status |= b2Pair.e_pairFinal;
    }

    public IsFinal(): boolean {
        return (this.status & b2Pair.e_pairFinal) == b2Pair.e_pairFinal;
    }
}