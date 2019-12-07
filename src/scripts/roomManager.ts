import Room from "./room";
import Dictionary from "./collection/dictionary";
import Assert from "./assert";
import {Client} from "discord.js";

export default class RoomManager
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

    public CreateRoom(channelId: string, client: Client)
    {
        Assert.IsFalse(this.IsWaiting(channelId));

        var room =  new Room(client);
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
