import ByteArray from "flash/utils/ByteArray";

export default interface ICipher {
    getBlockSize(): number;

    encrypt(param1: ByteArray);

    decrypt(param1: ByteArray);

    dispose();

    toString(): string;
}