import { boundClass } from 'autobind-decorator';

@boundClass
export default class MemoryTest {
    private static _instance: MemoryTest;
    private _dictionary: Dictionary<any, any>;
    private counter: number = 0;

    constructor() {
        if (MemoryTest._instance) {
            throw new Error("MemoryTest already exists");
        }
        MemoryTest._instance = this;
        this.init();
    }

    public static get instance(): MemoryTest {
        return MemoryTest._instance;
    }

    private init() {
        this._dictionary = new Dictionary(true);
    }

    public get dictionary(): Dictionary<any, any> {
        return this._dictionary;
    }

    public addEntry(value: string, key: {}) {
        if (this._dictionary.get(key)) {
            trace(value + " already in dictionary");
            return;
        }
        this._dictionary.set(key, "" + value + this.counter);
        ++this.counter;
    }

    public traceContents() {
        var _loc1_ = null;
        trace("_dictionary:");
        for (_loc1_ of this._dictionary.keys()) {
            trace(_loc1_ + " = " + this._dictionary.get(_loc1_));
        }
    }
}