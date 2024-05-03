import {
  CURSORLESS_COMMAND_ID,
  CommandLatest,
  CommandResponse,
  CommandServerApi,
  CursorlessCommandId,
  clientSupportsFallback,
} from "@cursorless/common";

import { CommandApi } from "@cursorless/cursorless-engine";
import {
  NeovimIDE,
  modeSwitchNormalTerminal,
  modeSwitchTerminal,
  updateTextEditor,
} from "@cursorless/neovim-common";
import { getNeovimRegistry } from "@cursorless/neovim-registry";
import type { NeovimClient } from "neovim";
// TODO - we need to fix that import as we should not be allowed to import it afaict?
//import { ensureCommandShape } from "../../cursorless-engine/src/core/commandVersionUpgrades/ensureCommandShape";
// TODO: move this to common
import { ensureCommandShape } from "../../cursorless-engine/src/core/commandVersionUpgrades/ensureCommandShape";

export async function registerCommands(
  client: NeovimClient,
  neovimIDE: NeovimIDE,
  commandApi: CommandApi,
  commandServerApi: CommandServerApi,
): Promise<void> {
  const commands: Record<CursorlessCommandId, (...args: any[]) => any> = {
    // The core Cursorless command
    [CURSORLESS_COMMAND_ID]: async (...args: unknown[]) => {
      const originalMode = await client.mode;
      if (originalMode.mode === "t") {
        // Switch to "nt" so we can easily call lua functions without any problems
        modeSwitchNormalTerminal(client);
      }

      try {
        await updateTextEditor(client, neovimIDE);
        const result = await commandApi.runCommandSafe(...args);

        const command = ensureCommandShape(args);
        const focusedElementType =
          await commandServerApi.getFocusedElementType();
        if (
          focusedElementType === "terminal" &&
          clientSupportsFallback(command)
        ) {
          const commandResponse = result as CommandResponse;
          if (
            "fallback" in commandResponse &&
            commandResponse.fallback.action === "insert"
          ) {
            // if user runs a terminal, and a "bring" command was requested, switch back to "t" mode
            // so the fallback can do its magic
            modeSwitchTerminal(client);
          }
        }

        return result;
      } catch (e) {
        if (neovimIDE.runMode !== "test") {
          const err = e as Error;
          console.error(err.stack);
          neovimIDE.handleCommandError(err);
        }
        throw e;
      }
    },

    // Cheatsheet commands
    ["cursorless.showCheatsheet"]: dummyCommandHandler,
    ["cursorless.internal.updateCheatsheetDefaults"]: dummyCommandHandler,

    // Testcase recorder commands
    ["cursorless.recordTestCase"]: dummyCommandHandler,
    ["cursorless.recordOneTestCaseThenPause"]: dummyCommandHandler,
    ["cursorless.pauseRecording"]: dummyCommandHandler,
    ["cursorless.resumeRecording"]: dummyCommandHandler,
    ["cursorless.takeSnapshot"]: dummyCommandHandler,

    // Other commands
    ["cursorless.showQuickPick"]: dummyCommandHandler,
    ["cursorless.showDocumentation"]: dummyCommandHandler,
    ["cursorless.private.logQuickActions"]: dummyCommandHandler,

    // Hats
    ["cursorless.toggleDecorations"]: dummyCommandHandler,
    ["cursorless.recomputeDecorationStyles"]: dummyCommandHandler,

    // Scope visualizer
    ["cursorless.showScopeVisualizer"]: dummyCommandHandler,
    ["cursorless.hideScopeVisualizer"]: dummyCommandHandler,

    // Command history
    ["cursorless.analyzeCommandHistory"]: dummyCommandHandler,

    // General keyboard commands
    ["cursorless.keyboard.escape"]: dummyCommandHandler,

    // Targeted keyboard commands
    ["cursorless.keyboard.targeted.targetHat"]: dummyCommandHandler,
    ["cursorless.keyboard.targeted.targetScope"]: dummyCommandHandler,
    ["cursorless.keyboard.targeted.targetSelection"]: dummyCommandHandler,
    ["cursorless.keyboard.targeted.clearTarget"]: dummyCommandHandler,
    ["cursorless.keyboard.targeted.runActionOnTarget"]: dummyCommandHandler,

    // Modal keyboard commands
    ["cursorless.keyboard.modal.modeOn"]: dummyCommandHandler,
    ["cursorless.keyboard.modal.modeOff"]: dummyCommandHandler,
    ["cursorless.keyboard.modal.modeToggle"]: dummyCommandHandler,
  };

  Object.entries(commands).map(([commandId, callback]) =>
    getNeovimRegistry().registerCommand(commandId, callback),
  );
}

export async function dummyCommandHandler(...args: any[]) {
  console.log(`dummyCommandHandler(): args=${args}`);
}
