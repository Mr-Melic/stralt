import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  shouldCountGeneralChatUnread,
  shouldTickChatPoll,
} from "./chatPollActivity.ts";

describe("chatPollActivity", () => {
  it("counts unread while folded or while another channel is open", () => {
    assert.equal(shouldCountGeneralChatUnread(true, "general"), true);
    assert.equal(shouldCountGeneralChatUnread(false, "battlelog"), true);
    assert.equal(shouldCountGeneralChatUnread(false, "general"), false);
  });

  it("skips the poll tick in battle and while the tab is hidden", () => {
    assert.equal(shouldTickChatPoll(false, true), true);
    assert.equal(shouldTickChatPoll(true, true), false);
    assert.equal(shouldTickChatPoll(false, false), false);
  });
});
