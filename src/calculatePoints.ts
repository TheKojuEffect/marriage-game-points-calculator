import {PlayerRoundStatus, Round} from "./Scores";
import {GameSettings} from "./Settings";
import {sum, sumBy} from "lodash";

export type PlayerPoints = Record<string, number>;
export type PlayerStatus = Record<string, PlayerRoundStatus>;

export const calculatePoints = (
    round: Round,
    setting: GameSettings,
    prevRoundPlayerStatus: PlayerStatus
): PlayerPoints => {
    const nonWinners = round.scores.filter(({playerId}) => playerId !== round.winnerPlayerId);
    const totalMaal =
        sumBy(round.scores, p => p.maal || 0)
        + (round.dubleeWin ? setting.dubleeWinBonusPoint : 0)

    const noOfRoundPlayers = sumBy(round.scores, p => p.status === PlayerRoundStatus.PAUSE ? 0 : 1);

    const playerPoints: PlayerPoints =
        Object.fromEntries(nonWinners.map(({playerId, maal, status}) => {
            const prevRoundPointAdjustment = prevRoundPlayerStatus[playerId] === PlayerRoundStatus.FOUL ? -setting.foulPoint : 0;
            switch (status) {
            case PlayerRoundStatus.PAUSE:
                return [playerId, prevRoundPointAdjustment];

            case PlayerRoundStatus.UNSEEN:
                return [playerId, -setting.unseenPoint - totalMaal + prevRoundPointAdjustment];

            case PlayerRoundStatus.SEEN:
                return [playerId, -setting.seenPoint - totalMaal + (maal || 0) * noOfRoundPlayers + prevRoundPointAdjustment];

            case PlayerRoundStatus.FOUL:
                return [playerId, -totalMaal + prevRoundPointAdjustment];
            }
        }));

    const winnerPlayerPoint: PlayerPoints = {[round.winnerPlayerId]: -sum(Object.values(playerPoints))};

    return {...winnerPlayerPoint, ...playerPoints};
}