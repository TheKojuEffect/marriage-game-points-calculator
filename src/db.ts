import Dexie, {Table} from 'dexie';
import {GameSettings} from "./Settings";

export interface Game extends GameSettings {
    createdAt: Date;
    id: string;
}

export class AppDexie extends Dexie {

    games!: Table<Game>;

    constructor() {
        super('marriage');
        this.version(1).stores({
            games: '&id,createdAt,pointRate,seenPoint,unseenPoint,dubleeWinBonusPoint,foulPoint'
        })
    }
}

export const db = new AppDexie();