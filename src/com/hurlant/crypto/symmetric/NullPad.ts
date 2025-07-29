import IPad from "@/com/hurlant/crypto/symmetric/IPad";
import { boundClass } from 'autobind-decorator';
import ByteArray from "flash/utils/ByteArray";

@boundClass
export default class NullPad implements IPad {

    public unpad(param1: ByteArray) { }

    public pad(param1: ByteArray) { }

    public setBlockSize(param1: number) { }
}