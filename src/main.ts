import {Client, Message as MessageContainer, User} from "discord.js";
import {AnyChannel} from "./scripts/extension/typeExtension";
import String from "./scripts/extension/stringExtension";
import * as Secret from "./json/secret.json";
import * as Config from "./json/config.json";
import RoomManager from "./scripts/roomManager";
import BackgroundJob from "./scripts/backgroundJob";

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

        BackgroundJob.Run(()=>
        {
            roomManager.Update();
        }, BackgroundJob.SecondInterval);
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

        var userId = author.id;

        if (!roomManager.IsPlaying(userId))
        {
            channel.send("게임에 참가중이지 않습니다.")
        }

        var room = roomManager.FindPlayingRoom(userId);
        room.HandleMessage(message, channel);
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
                    await channel.send("모집중아님");
                    return;
                }

                roomManager.JoinPlayer(channelId, userId);
                break;
            case "공대모집":
                if (roomManager.IsWaiting(channelId))
                {
                    await channel.send("모집중임");
                    return;
                }

                roomManager.CreateRoom(channelId, this.bot);
                await channel.send("모집시작");
                break;
            case "공대출발":
                var room = roomManager.FindWaitingRoom(channelId);
                room.Start();

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