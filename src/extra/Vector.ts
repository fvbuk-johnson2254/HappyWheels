// TODO: implement this
import { boundClass } from 'autobind-decorator';
import OpenFlVector from 'flash/Vector';

@boundClass
export default class Vector<T> extends OpenFlVector<T> {
    override push(...values: T[]) {
        for (const value of values) super.push(value);
        return 0;
    }

    override splice(pos: number, len: number, ...items: any[]): Vector<T> {
        console.error('not implemented');
        return new Vector();
    }
}