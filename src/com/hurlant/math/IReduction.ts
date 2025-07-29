import BigInteger from "@/com/hurlant/math/BigInteger";

export default interface IReduction {
    convert(param1: BigInteger): BigInteger;

    revert(param1: BigInteger): BigInteger;

    reduce(param1: BigInteger);

    mulTo(param1: BigInteger, param2: BigInteger, param3: BigInteger);

    sqrTo(param1: BigInteger, param2: BigInteger);
}