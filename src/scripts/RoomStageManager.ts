import Room from "./room";

interface IStage
{
    Handle(room: Room, args: string[]): void
}

class DummyStage implements IStage
{
    public Handle(room: Room, args: string[]): void
    {

    }
}

export default class RoomStageManager
{
    room: Room;

    constructor(room: Room)
    {
        this.room = room;
    }

    public GetCurrent(): IStage
    {
        return new DummyStage();
    }
}