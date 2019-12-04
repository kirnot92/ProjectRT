
export default class List<T>
{
    arr: Array<T> = new Array<T>();

    public Add(value: T)
    {
        this.arr.push(value);
    }

    public Remove(value: T)
    {
        var index = this.IndexOf(value);
        if (index != -1)
        {
            this.arr.splice(index, 1);
        }
    }

    public Contains(value: T): boolean
    {
        return this.IndexOf(value) >= 0;
    }

    IndexOf(value: T): number
    {
        for(var i = 0; i < this.arr.length; ++i)
        {
            if (this.arr[i] ==  value)
            {
                return i;
            }
        }
        return -1;
    }

    public ToArray(): Array<T>
    {
        return this.arr;
    }
}