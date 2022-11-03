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
            players: '&id,gameId,index,name'
        });
        // Do not change the schema directly once it's been in production
        // Instead, create a new version and provide upgrade plan
        // https://dexie.org/docs/Tutorial/Understanding-the-basics
    }
}

export const db = new AppDexie();