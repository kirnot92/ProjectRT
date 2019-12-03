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

    async OnReady()
    {
        console.log("Bot Ready");
    }

    async OnMessage(container: MessageContainer)
    {
        if (this.IsDM(container))
        {
            // TODO
        }
        else
        {
            await this.HandleMessage(container.content, container.channel, container.author);
        }
    }

    async HandleMessage(message: string, channel: AnyChannel, author: User)
    {
        if (message.startsWith(Config.Prefix) && !author.bot)
        {
            // var args = String.Slice([message.slice(Config.Prefix.length)], /\s|\n/, 2);
            // var behavior = await BehaviorFactory.Create(args, author.id, channel.id, this.bot);
            // var result = await behavior.IsValid() ? await behavior.Result() : behavior.OnFail();
            // await channel.send(result.Message, result.Options);
        }
    }

    IsDM(container: MessageContainer): boolean
    {
        return container.channel.type == "dm";
    }
}

var discordBot = new DiscordBot()
discordBot.Login()