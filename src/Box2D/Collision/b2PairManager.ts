import b2BroadPhase from "@/Box2D/Collision/b2BroadPhase";
import b2BufferedPair from "@/Box2D/Collision/b2BufferedPair";
import b2Pair from "@/Box2D/Collision/b2Pair";
import b2PairCallback from "@/Box2D/Collision/b2PairCallback";
import b2Proxy from "@/Box2D/Collision/b2Proxy";
import b2Settings from "@/Box2D/Common/b2Settings";

export default class b2PairManager {
    public m_broadPhase: b2BroadPhase;
    public m_callback: b2PairCallback;
    public m_pairs: any[];
    public m_freePair: number = 0;
    public m_pairCount: number = 0;
    public m_pairBuffer: any[];
    public m_pairBufferCount: number;
    public m_hashTable: any[];

    constructor() {
        var i: number;

        this.m_hashTable = new Array(b2Pair.b2_tableCapacity);
        for (i = 0; i < b2Pair.b2_tableCapacity; ++i) {
            this.m_hashTable[i] = b2Pair.b2_nullPair;
        }
        this.m_pairs = new Array(b2Settings.b2_maxPairs);
        for (i = 0; i < b2Settings.b2_maxPairs; ++i) {
            this.m_pairs[i] = new b2Pair();
        }
        this.m_pairBuffer = new Array(b2Settings.b2_maxPairs);
        for (i = 0; i < b2Settings.b2_maxPairs; ++i) {
            this.m_pairBuffer[i] = new b2BufferedPair();
        }

        for (i = 0; i < b2Settings.b2_maxPairs; ++i) {
            this.m_pairs[i].proxyId1 = b2Pair.b2_nullProxy;
            this.m_pairs[i].proxyId2 = b2Pair.b2_nullProxy;
            this.m_pairs[i].userData = null;
            this.m_pairs[i].status = 0;
            this.m_pairs[i].next = (i + 1);
        }
        this.m_pairs[int(b2Settings.b2_maxPairs - 1)].next = b2Pair.b2_nullPair;
        this.m_pairCount = 0;
        this.m_pairBufferCount = 0;
    }

    public static Hash(param1: number, param2: number): number {
        var _loc3_ = uint(((param2 << 16) & 4294901760) | param1);
        _loc3_ = uint(~_loc3_ + ((_loc3_ << 15) & 4294934528));
        _loc3_ ^= (_loc3_ >> 12) & 1048575;
        _loc3_ += (_loc3_ << 2) & 4294967292;
        _loc3_ ^= (_loc3_ >> 4) & 268435455;
        _loc3_ *= 2057;
        return uint(_loc3_ ^ ((_loc3_ >> 16) & 65535));
    }

    public static Equals(
        param1: b2Pair,
        param2: number,
        param3: number,
    ): boolean {
        return param1.proxyId1 == param2 && param1.proxyId2 == param3;
    }

    public static EqualsPair(
        param1: b2BufferedPair,
        param2: b2BufferedPair,
    ): boolean {
        return (
            param1.proxyId1 == param2.proxyId1 &&
            param1.proxyId2 == param2.proxyId2
        );
    }

    public Initialize(param1: b2BroadPhase, param2: b2PairCallback) {
        this.m_broadPhase = param1;
        this.m_callback = param2;
    }

    public AddBufferedPair(param1: number, param2: number) {
        var _loc3_: b2BufferedPair = null;
        var _loc4_: b2Pair = this.AddPair(param1, param2);
        if (_loc4_.IsBuffered() == false) {
            _loc4_.SetBuffered();
            _loc3_ = this.m_pairBuffer[this.m_pairBufferCount];
            _loc3_.proxyId1 = _loc4_.proxyId1;
            _loc3_.proxyId2 = _loc4_.proxyId2;
            ++this.m_pairBufferCount;
        }
        _loc4_.ClearRemoved();
        if (b2BroadPhase.s_validate) {
            this.ValidateBuffer();
        }
    }

    public RemoveBufferedPair(param1: number, param2: number) {
        var _loc3_: b2BufferedPair = null;
        var _loc4_: b2Pair = this.Find(param1, param2);
        if (_loc4_ == null) {
            return;
        }
        if (_loc4_.IsBuffered() == false) {
            _loc4_.SetBuffered();
            _loc3_ = this.m_pairBuffer[this.m_pairBufferCount];
            _loc3_.proxyId1 = _loc4_.proxyId1;
            _loc3_.proxyId2 = _loc4_.proxyId2;
            ++this.m_pairBufferCount;
        }
        _loc4_.SetRemoved();
        if (b2BroadPhase.s_validate) {
            this.ValidateBuffer();
        }
    }

    public Commit() {
        var _loc1_: b2BufferedPair = null;
        var _loc2_: number = 0;
        var _loc5_: b2Pair = null;
        var _loc6_: b2Proxy = null;
        var _loc7_: b2Proxy = null;
        var _loc3_: number = 0;
        var _loc4_: any[] = this.m_broadPhase.m_proxyPool;
        _loc2_ = 0;
        while (_loc2_ < this.m_pairBufferCount) {
            _loc1_ = this.m_pairBuffer[_loc2_];
            _loc5_ = this.Find(_loc1_.proxyId1, _loc1_.proxyId2);
            _loc5_.ClearBuffered();
            _loc6_ = _loc4_[_loc5_.proxyId1];
            _loc7_ = _loc4_[_loc5_.proxyId2];
            if (_loc5_.IsRemoved()) {
                if (_loc5_.IsFinal() == true) {
                    this.m_callback.PairRemoved(
                        _loc6_.userData,
                        _loc7_.userData,
                        _loc5_.userData,
                    );
                }
                _loc1_ = this.m_pairBuffer[_loc3_];
                _loc1_.proxyId1 = _loc5_.proxyId1;
                _loc1_.proxyId2 = _loc5_.proxyId2;
                _loc3_++;
            } else if (_loc5_.IsFinal() == false) {
                _loc5_.userData = this.m_callback.PairAdded(
                    _loc6_.userData,
                    _loc7_.userData,
                );
                _loc5_.SetFinal();
            }
            _loc2_++;
        }
        _loc2_ = 0;
        while (_loc2_ < _loc3_) {
            _loc1_ = this.m_pairBuffer[_loc2_];
            this.RemovePair(_loc1_.proxyId1, _loc1_.proxyId2);
            _loc2_++;
        }
        this.m_pairBufferCount = 0;
        if (b2BroadPhase.s_validate) {
            this.ValidateTable();
        }
    }

    // Add a pair and return the new pair. If the pair already exists,
    // no new pair is created and the old one is returned.
    private AddPair(proxyId1: number, proxyId2: number) {
        if (proxyId1 > proxyId2) {
            var temp: number = proxyId1;
            proxyId1 = proxyId2;
            proxyId2 = temp;
            //b2Math.b2Swap(p1, p2);
        }

        var hash: number = b2PairManager.Hash(proxyId1, proxyId2) & b2Pair.b2_tableMask;

        //var pairIndex:int = FindHash(proxyId1, proxyId2, hash);
        var pair: b2Pair = pair = this.FindHash(proxyId1, proxyId2, hash);

        if (pair != null) {
            return pair;
        }

        var pIndex = this.m_freePair;
        pair = this.m_pairs[pIndex];
        this.m_freePair = pair.next;

        pair.proxyId1 = proxyId1;
        pair.proxyId2 = proxyId2;
        pair.status = 0;
        pair.userData = null;
        pair.next = this.m_hashTable[hash];

        this.m_hashTable[hash] = pIndex;

        ++this.m_pairCount;

        return pair;
    }

    private RemovePair(param1: number, param2: number) {
        var _loc3_: b2Pair = null;
        var _loc7_ = 0;
        var _loc8_ = 0;
        var _loc9_ = undefined;
        if (param1 > param2) {
            _loc7_ = param1;
            param1 = param2;
            param2 = _loc7_;
        }
        var _loc4_ = uint(
            b2PairManager.Hash(param1, param2) & b2Pair.b2_tableMask,
        );
        var _loc5_ = uint(this.m_hashTable[_loc4_]);
        var _loc6_: b2Pair = null;
        while (_loc5_ != b2Pair.b2_nullPair) {
            if (b2PairManager.Equals(this.m_pairs[_loc5_], param1, param2)) {
                _loc8_ = _loc5_;
                _loc3_ = this.m_pairs[_loc5_];
                if (_loc6_) {
                    _loc6_.next = _loc3_.next;
                } else {
                    this.m_hashTable[_loc4_] = _loc3_.next;
                }
                _loc3_ = this.m_pairs[_loc8_];
                _loc9_ = _loc3_.userData;
                _loc3_.next = this.m_freePair;
                _loc3_.proxyId1 = b2Pair.b2_nullProxy;
                _loc3_.proxyId2 = b2Pair.b2_nullProxy;
                _loc3_.userData = null;
                _loc3_.status = 0;
                this.m_freePair = _loc8_;
                --this.m_pairCount;
                return _loc9_;
            }
            _loc6_ = this.m_pairs[_loc5_];
            _loc5_ = _loc6_.next;
        }
        return null;
    }

    private Find(param1: number, param2: number): b2Pair {
        var _loc4_ = 0;
        if (param1 > param2) {
            _loc4_ = param1;
            param1 = param2;
            param2 = _loc4_;
        }
        var _loc3_ = uint(
            b2PairManager.Hash(param1, param2) & b2Pair.b2_tableMask,
        );
        return this.FindHash(param1, param2, _loc3_);
    }

    private FindHash(param1: number, param2: number, param3: number): b2Pair {
        var _loc4_: b2Pair = null;
        var _loc5_ = uint(this.m_hashTable[param3]);
        _loc4_ = this.m_pairs[_loc5_];
        while (
            _loc5_ != b2Pair.b2_nullPair &&
            b2PairManager.Equals(_loc4_, param1, param2) == false
        ) {
            _loc5_ = _loc4_.next;
            _loc4_ = this.m_pairs[_loc5_];
        }
        if (_loc5_ == b2Pair.b2_nullPair) {
            return null;
        }
        return _loc4_;
    }

    private ValidateBuffer() { }

    private ValidateTable() { }
}