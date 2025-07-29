import ByteArray from "flash/utils/ByteArray";

export default interface ISymmetricKey {
    getBlockSize(): number;

    encrypt(param1: ByteArray, param2?: number);

    decrypt(param1: ByteArray, param2?: number);

    dispose();

    toString(): string;
}