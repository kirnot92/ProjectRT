import {Client, Message as MessageContainer, User} from "discord.js";
import {AnyChannel} from "./scripts/extension/typeExtension";
import String from "./scripts/extension/stringExtension";
import * as Secret from "./json/secret.json";
import * as Config from "./json/config.json";
import Dictionary from "./scripts/collection/dictionary";
import Assert from "./scripts/assert";
import Room from "./scripts/room";

class RoomManager
{
    // RoomManager 내부에서는 room 관련 function을 부르지 않도록 함 
    // 부르기 시작하면 room 관련 모든 함수가 wrapping 될 것

    waitForStartRoomMap: Dictionary<string, Room>
    userIdRoomMap: Dictionary<string, Room>

    constructor()
    {
        this.waitForStartRoomMap = new Dictionary<string, Room>();
        this.userIdRoomMap = new Dictionary<string, Room>();
    }

    public CreateRoom(channelId: string)
    {
        Assert.IsFalse(this.IsWaiting(channelId));

        var room =  new Room();
        this.waitForStartRoomMap.Add(channelId, room);
    }

    public FindWaitingRoom(channelId: string): Room
    {
        if (this.IsWaiting(channelId))
        {
            return this.waitForStartRoomMap.MustGet(channelId);
        }
        return null;
    }

    public MustGetWaitingRoom(channelId: string): Room
    {
        var room = this.FindWaitingRoom(channelId);
        Assert.NotNull(room);

        return room;
    }

    public JoinPlayer(channelId: string, userId: string)
    {
        var room = this.FindWaitingRoom(channelId);
        if (room == null) { return; }

        Assert.IsFalse(this.userIdRoomMap.ContainsKey(userId));

        this.userIdRoomMap.Add(userId, room);
        room.JoinPlayer(userId);
    }

    public EndWaiting(channelId: string)
    {
        this.waitForStartRoomMap.Remove(channelId);
    }

    public IsWaiting(channelId: string): boolean
    {
        return this.waitForStartRoomMap.ContainsKey(channelId);
    }

    public IsPlaying(userId: string)
    {
        return this.userIdRoomMap.ContainsKey(userId);
    }
}

let roomManager = new RoomManager();


class DiscordBot
{
    private bot : Client

    constructor()
    {
        this.bot = new Client();
        this.bot.on("message", async (msg) => await this.OnMessage(msg));
        this.bot.on("ready", async () => await this.OnReady());
    }

    public async Login()
    {
        await this.bot.login(Secret.Token);
    }

    public async SendDM(userId: string, message: string)
    {
        var user = await this.GetUser(userId);

        user.send(message);
    }

    async GetUser(userId: string): Promise<User>
    {
        var user = await this.bot.fetchUser(userId);

        return user;
    }

    async OnReady()
    {
        console.log("Bot Ready");
    }

    async OnMessage(container: MessageContainer)
    {
        if (this.IsDM(container))
        {
            await this.HandleDirectMessage(container.content, container.channel, container.author);
        }
        else
        {
            await this.HandleChannelMessage(container.content, container.channel, container.author);
        }
    }

    async HandleDirectMessage(message: string, channel: AnyChannel, author: User)
    {
        if (!message.startsWith(Config.Prefix) || author.bot) { return; }
        if (!roomManager.IsPlaying(author.id))
        {
            channel.send("게임에 참가중이지 않습니다.")
        }

        var args = String.Slice([message.slice(Config.Prefix.length)], /\s|\n/, 2);

        // var room = userIdRoomMap[userId];
        // room.HandleMessage(msg, channel);
        // 메세지를 받을 수 있거나 없거나 안쪽에서 알아서 판단
        // room mainLoop 디자인해야 함(backgroundJob?)
    }

    async HandleChannelMessage(message: string, channel: AnyChannel, author: User)
    {
        if (!message.startsWith(Config.Prefix) || author.bot) { return; }

        var args = String.Slice([message.slice(Config.Prefix.length)], /\s|\n/, 2);
        var channelId = channel.id;        
        var userId = author.id;

        switch(args[0])
        {
            case "공대참가":
                if (!roomManager.IsWaiting(channelId))
                {
                    channel.send("모집중아님");
                    return;
                }
                
                roomManager.JoinPlayer(channelId, userId);
                break;
            case "공대모집":
                if (roomManager.IsWaiting(channelId))
                {
                    channel.send("모집중아님");
                    return;
                }

                roomManager.CreateRoom(channelId);
                channel.send("모집시작");
                break;
            case "공대출발":

                var room = roomManager.FindWaitingRoom(channelId);
                room.Start();

                var userIds = room.GetUserIds();

                // room이 bot을 들고있어야 할듯?
                for (var i=0; i<userIds.length; ++i)
                {
                    var user = await this.GetUser(userIds[i]);
                    await user.send("게임시작뎀");
                }

                roomManager.EndWaiting(channelId);
                break;
        }
    }

    IsDM(container: MessageContainer): boolean
    {
        return container.channel.type == "dm";
    }
}

var discordBot = new DiscordBot()
discordBot.Login()