import ByteArray from "flash/utils/ByteArray";

export default interface IHash {
    getInputSize(): number;

    getHashSize(): number;

    hash(param1: ByteArray): ByteArray;

    toString(): string;
}