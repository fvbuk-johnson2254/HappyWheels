import ByteArray from "flash/utils/ByteArray";

export default interface IPad {
    pad(param1: ByteArray);

    unpad(param1: ByteArray);

    setBlockSize(param1: number);
}