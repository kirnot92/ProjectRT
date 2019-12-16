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
    count: number;

    constructor(expireTime: number)
    {
        this.expireTime = expireTime
        this.count = 0;
    }

    public Handle(room: Room, args: string[]): void
    {
        this.count += 1;

        if (this.count > 4)
        {
            // 조건 만족 시 바로 만료처리
            this.expireTime = Date.now();
        }
    }

    public Update(now: number): void
    {
        // 여기서 타이머 만료를 잰다
        if (this.expireTime < now)
        {
            // interface로 가야되나?
            this.OnExpire();
        }
    }

    public CreateNextStage(): IStage
    {
        return new DummyStage(Date.now());
    }

    public OnExpire()
    {

    }
}

export default class StageManager
{
    room: Room;
    currentStage: IStage;

    constructor(room: Room)
    {
        this.room = room;
        this.currentStage = new DummyStage(Date.now() + 60000);
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