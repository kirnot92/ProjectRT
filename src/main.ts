import {Client, Message as MessageContainer, User} from "discord.js";
import {AnyChannel} from "./scripts/extension/typeExtension";
import String from "./scripts/extension/stringExtension";
import * as Secret from "./json/secret.json";
import * as Config from "./json/config.json";

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

        // if (!userRoomMap.Contains(author.Id)) { return; }
        // option: user.send("게임에 참가중이지 않습니다"); 

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

        switch(args[0])
        {
            case "공대모집":
                // if(waitForStartRoomMap.Contains(channelId)) { send("이미 모집중임"); return; }
                // var room = CreateRoom();
                // var inviteMsg = sendMessage
                // onEmojiReponse.Add -> if(emoji.msg == inviteMsg) waitForStartRoomMap[channelId].JoinUser(userId)
                // onEmojiReponse.Remove -> if(emoji.msg == inviteMsg) waitForStartRoomMap[channelId].QuitUser(userId)
                break;
            case "공대출발":
                // var room = waitForStartRoomMap[channelId];
                // room.Start();
                // => foreach(var userId in users) GetUser(userId).Send(SystemMessage.GameStartMessage);
                // waitForStartRoomMap.Remove(channelId);
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