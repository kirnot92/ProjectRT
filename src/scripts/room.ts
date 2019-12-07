import Assert from "./assert";
import {Client, User} from "discord.js";
import List from "./collection/list";

export default class Room
{
    userIds: List<string> = new List<string>();
    client: Client;

    constructor(client: Client)
    {
        this.client = client;
    }

    public async Start()
    {
        var userIdArray = this.GetUserIds();

        for (var i=0; i < userIdArray.length; ++i)
        {
            await this.SendDM(userIdArray[i], "게임시작뎀");
        }
    }

    public JoinPlayer(userId: string)
    {
        Assert.IsFalse(this.userIds.Contains(userId));

        this.userIds.Add(userId);
    }

    public GetUserIds(): Array<string>
    {
        return this.userIds.ToArray();
    }

    public async SendDM(userId: string, message: string)
    {
        var user = await this.GetUser(userId);

        user.send(message);
    }

    async GetUser(userId: string): Promise<User>
    {
        var user = await this.client.fetchUser(userId);

        return user;
    }
}
