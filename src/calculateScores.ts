import {PlayerRoundStatus, Round} from "./Results";
import {GameSettings} from "./Settings";
import {sumBy} from "lodash";

export interface Score {
    playerId: string;
    point: number;
    nextRoundPointAdjustment: number;
}

const createScore =
    (playerId: string, point: number, nextRoundPointAdjustment: number = 0): Score => ({playerId, point, nextRoundPointAdjustment})

export const calculateScores = (round: Round, setting: GameSettings): Score[] => {
    const nonWinners = round.results.filter(({playerId}) => playerId !== round.winnerPlayerId);
    const totalMaal =
        sumBy(round.results, p => p.maal || 0)
        + (round.dubleeWin ? setting.dubleeWinBonusPoint : 0)

    const noOfRoundPlayers = sumBy(round.results, p => p.status === PlayerRoundStatus.PAUSE ? 0 : 1);

    const playerPoints: Score[] = nonWinners.map(({playerId, maal, status}) => {
        switch (status) {
            // Get Previous Round foul points
        case PlayerRoundStatus.PAUSE:
            return createScore(playerId, 0);

        case PlayerRoundStatus.UNSEEN:
            return createScore(playerId, -setting.unseenPoint - totalMaal);

        case PlayerRoundStatus.SEEN:
            return createScore(playerId, -setting.seenPoint - totalMaal + (maal || 0) * noOfRoundPlayers);

        case PlayerRoundStatus.FOUL:
            return createScore(playerId, -totalMaal, -setting.foulPoint);
        }
    });

    const winnerPlayerPoint = createScore(round.winnerPlayerId, -sumBy(playerPoints, pp => pp.point));

    return [winnerPlayerPoint, ...playerPoints];
}