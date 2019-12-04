import Assert from "./assert";
import List from "./collection/list";

export default class Room
{
    userIds: List<string> = new List<string>();

    public Start()
    {

    }

    public JoinPlayer(userId: string)
    {
        Assert.IsFalse(this.userIds.Contains(userId));

        this.userIds.Add(userId);
    }
}
