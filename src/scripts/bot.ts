import {Client, Message as MessageContainer, User} from "discord.js";
import {AnyChannel} from "./extension/typeExtension";
import String from "./extension/stringExtension";
import * as Secret from "../json/secret.json";
import * as Config from "../json/config.json";

export default class DiscordBot
{
    private bot : Client

    constructor()
    {
        this.bot = new Client();
        this.bot.on("ready", async () => await this.OnReady());
        this.bot.on("message", async (msg) => await this.OnMessage(msg));
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
        try
        {
            this.HandleMessage(container.content, container.channel, container.author);
        }
        catch (e)
        {
            container.channel.send("Exception 발생: " + e);
        }
    }

    async HandleMessage(message: string, channel: AnyChannel, author: User)
    {
        if (message.startsWith(Config.Prefix) && !author.bot)
        {
            var args = String.Slice([message.slice(Config.Prefix.length)], /\s|\n/, 2);
            // var behavior = await BehaviorFactory.Create(args, author.id, channel.id, this.bot);
            // var result = await behavior.IsValid() ? await behavior.Result() : behavior.OnFail();
            // await channel.send(result.Message, result.Options);
        }
    }
}