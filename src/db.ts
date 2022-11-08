import Dexie, {Table} from 'dexie';
import {GameSettings} from "./Settings";
import {PlayerRoundStatus} from "./Scores";
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
    winnerPlayerId: string,
    dubleeWin: boolean
}

export interface DbScore {
    roundId: string,
    playerId: string,
    gameId: string,
    maal: number,
    status: PlayerRoundStatus,
    point: number,
}

export class AppDexie extends Dexie {
    games!: Table<DbGame>;
    settings!: Table<DbSettings>;
    players!: Table<DbPlayer>;
    rounds!: Table<DbRound>;
    scores!: Table<DbScore>;

    constructor() {
        super('marriage');
        this.version(1).stores({
            games: '&id,createdAt',
            settings: '&gameId,pointRate,seenPoint,unseenPoint,dubleeWinBonusPoint,foulPoint',
            players: '&id,gameId,index,name',
            rounds: '&id,createdAt,index,gameId,winnerPlayerId,dubleeWin',
            scores: '[roundId+playerId],gameId,maal,status',
        });
        // Do not change the schema directly once it's been in production
        // Instead, create a new version and provide upgrade plan
        // https://dexie.org/docs/Tutorial/Understanding-the-basics
    }
}

export const generateId = () => uuidV4();
export const db = new AppDexie();