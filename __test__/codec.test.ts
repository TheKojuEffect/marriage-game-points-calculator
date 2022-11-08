import {sampleGameData, sampleWithOnlyPlayers} from "./sampleGameData";
import {decodeGameData, encodeGameData} from "../src/codec";

const samples = [sampleGameData, sampleWithOnlyPlayers];

describe('Game Data codec', () => {
    samples.forEach((sample, index) => {
        test(`encode and decode should give same result for ${index}`, () => {
            const encoded = encodeGameData(sample);
            const decoded = decodeGameData(encoded);

            expect(decoded.game).toEqual(expect.objectContaining(sample.game));
            expect(decoded.settings).toEqual(expect.objectContaining(sample.settings));
            expect(decoded.players).toEqual(expect.arrayContaining(sample.players));
            expect(decoded.rounds).toEqual(expect.arrayContaining(sample.rounds));
            expect(decoded.scores).toEqual(expect.arrayContaining(sample.scores));
        });
    })
});
