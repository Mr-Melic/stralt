import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  clientCharacterShapeDriftsFromMotoko,
  clientCharacterShapeSnapshot,
  motokoCharacterShapeSnapshot,
} from "./characterClientShapeEvolve.ts";

describe("characterClientShapeEvolve", () => {
  it("flags gameTypes Character drift vs Motoko", () => {
    const client = clientCharacterShapeSnapshot();
    const motoko = motokoCharacterShapeSnapshot();
    assert.equal(client.hasDokaBalanceField, true);
    assert.equal(motoko.hasDokaBalanceField, false);
    assert.equal(clientCharacterShapeDriftsFromMotoko(client, motoko), true);
  });
});
