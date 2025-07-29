// import LocalConnection from "flash/net/LocalConnection";
import { boundClass } from 'autobind-decorator';
import System from "flash/system/System";

@boundClass
export default class Memory {

    public static gc() {
        // try {
        //     new LocalConnection().connect("foo");
        //     new LocalConnection().connect("foo");
        // } catch (e) {}
    }

    public static get used(): number {
        return System.totalMemory;
    }
}