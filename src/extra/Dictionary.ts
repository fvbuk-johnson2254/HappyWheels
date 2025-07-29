// @ts-nocheck
import { boundClass } from 'autobind-decorator';

@boundClass
export default class Dictionary<K, V> extends Map<K, V> {
    constructor(weakKeys = false) {
        super();
    }

    get length() {
        return super.size;
    }

    get(key: K): V | undefined {
        // console.log('get', { key });
        return super.get(key);
    }

    set(key: K, value: V): V {
        // console.log('set', { key, value });
        super.set(key, value);
        return value;
    }

    keys(): K[] {
        return [...super.keys()];
    }

    values(): V[] {
        return [...super.values()];
    }
}