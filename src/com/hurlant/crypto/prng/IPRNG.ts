import ByteArray from "flash/utils/ByteArray";

export default interface IPRNG {
    getPoolSize(): number;

    init(param1: ByteArray);

    next(): number;

    dispose();

    toString(): string;
}