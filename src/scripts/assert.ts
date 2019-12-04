export default class Assert
{
    public static IsTrue(condition: boolean, msg: string = "조건은 참이어야 합니다."): void
    {
        if (condition)
        {
            throw new Error(msg);
        }
    }

    public static IsFalse(condition: boolean, msg: string = "조건은 거짓이어야 합니다."): void
    {
        if (condition)
        {
            throw new Error(msg);
        }
    }


    public static NotNull(object: any, msg: string = "null이 아니어야 합니다."): void
    {
        if (object == null)
        {
            throw new Error(msg);
        }
    }
}