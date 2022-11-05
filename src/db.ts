import Dexie, {Table} from 'dexie';
import {GameSettings} from "./Settings";
import {PlayerRoundStatus} from "./Results";
import {v4 as uuidV4} from "uuid";

export interface DbGame {
    id: string;
    createdAt: Date;
}

export interface DbSettings extends GameSettings {
    gameId: string
}

export interface DbPlayer {
    id: string,
    gameId: string,
    name: string,
    index: number,
}

export interface DbRound {
    id: string,
    createdAt: Date,
    gameId: string,
    index: number;
    winnerPlayerId: string,
    dubleeWin: boolean
}

export interface DbResult {
    roundId: string,
    playerId: string,
    maal: number,
    status: PlayerRoundStatus,
}

export interface DbScore {
    roundId: string,
    playerId: string,
    point: number,
    nextRoundPointAdjustment: number,
}

export class AppDexie extends Dexie {
    games!: Table<DbGame>;
    settings!: Table<DbSettings>;
    players!: Table<DbPlayer>;
    rounds!: Table<DbRound>;
    results!: Table<DbResult>;
    scores!: Table<DbScore>;

    constructor() {
        super('marriage');
        this.version(1).stores({
            games: '&id,createdAt',
            settings: '&gameId,pointRate,seenPoint,unseenPoint,dubleeWinBonusPoint,foulPoint',
            players: '&id,gameId,index,name',
            rounds: '&id,createdAt,index,gameId,winnerPlayerId,dubleeWin',
            results: '[roundId+playerId],maal,status',
            scores: '[roundId+playerId],point,nextRoundPointAdjustment',
        });
        // Do not change the schema directly once it's been in production
        // Instead, create a new version and provide upgrade plan
        // https://dexie.org/docs/Tutorial/Understanding-the-basics
    }
}

export const generateId = () => uuidV4();
export const db = new AppDexie();