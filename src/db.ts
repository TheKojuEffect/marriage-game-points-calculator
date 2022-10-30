import Dexie, {Table} from 'dexie';
import {GameSettings} from "./Settings";

export interface Game extends GameSettings {
    createdAt: Date;
    id: string;
}

export interface Player {
    id: string,
    gameId: string,
    name: string,
    index: number,
}

export class AppDexie extends Dexie {

    games!: Table<Game>;
    players!: Table<Player>;

    constructor() {
        super('marriage');
        this.version(1).stores({
            games: '&id,createdAt,pointRate,seenPoint,unseenPoint,dubleeWinBonusPoint,foulPoint',
            players: '&id,[gameId+index],name'
        })
    }
}

export const db = new AppDexie();