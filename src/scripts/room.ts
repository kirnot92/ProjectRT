import Assert from "./assert";
import {Client, User} from "discord.js";
import List from "./collection/list";
import {AnyChannel} from "./extension/typeExtension";
import String from "./extension/stringExtension";
import * as Config from "../json/config.json";
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

    public HasUser(userId: string): boolean
    {
        return this.userIds.Contains(userId);
    }

    public JoinPlayer(userId: string)
    {
        Assert.IsFalse(this.HasUser(userId));

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
        Assert.IsTrue(this.HasUser(userId));

        return await this.client.fetchUser(userId);
    }

    public HandleMessage(message: string, channel: AnyChannel)
    {
        var args = String.Slice([message.slice(Config.Prefix.length)], /\s|\n/, 2);

        switch(args[0])
        {
            // TODO
        }
    }
}
