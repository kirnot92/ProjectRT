import Room from "./room";
import { threadId } from "worker_threads";

interface IStage
{
    Handle(room: Room, args: string[]): void

    Update(now: number): void

    CreateNextStage(): IStage
}

class DummyStage implements IStage
{
    expireTime: number;

    constructor(expireTime: number)
    {
        this.expireTime = expireTime
    }

    public Handle(room: Room, args: string[]): void
    {

    }

    public Update(now: number): void
    {
        if (this.expireTime < now)
        {
            // 여기서 타이머 만료를 잰다
        }
    }

    public CreateNextStage(): IStage
    {
        return new DummyStage(Date.now());
    }
}

export default class StageManager
{
    room: Room;
    currentStage: IStage;

    constructor(room: Room)
    {
        this.room = room;
        this.currentStage = new DummyStage(Date.now());
    }

    public GetCurrent(): IStage
    {
        return this.currentStage;
    }

    public Update(now: number)
    {
        this.currentStage.Update(now);
    }
}