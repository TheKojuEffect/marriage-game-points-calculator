import {sampleGameData} from "./sampleGameData";
import {decode, encode} from "../src/codec";

test('encode and decode should give same result', () => {
    const encoded = encode(sampleGameData);
    const decoded = decode(encoded);

    const fullDataLength = JSON.stringify(sampleGameData).length;
    const encodedLength = encoded.length;
    const compression = encodedLength / fullDataLength * 100;
    console.log({fullDataLength, encodedLength, compression})

    expect(decoded)
        .toEqual(expect.objectContaining(sampleGameData))
});