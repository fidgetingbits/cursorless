import {
  Command,
  // CommandServerApi,
  CURSORLESS_COMMAND_ID,
} from "@cursorless/common";
import { getNeovimRegistry } from "@cursorless/neovim-registry";
// import { CommandApi } from "@cursorless/cursorless-engine";
// import type { NeovimClient } from "neovim";
// import { handleCommandInternal } from "../../cursorless-neovim/src/registerCommands";
// import { NeovimIDE } from "./ide/neovim/NeovimIDE";
//import * as vscode from "vscode";

export async function runCursorlessCommand(
  // client: NeovimClient,
  // neovimIDE: NeovimIDE,
  // commandApi: CommandApi,
  // cmdSrvApi: CommandServerApi,
  command: Command,
) {
  //return vscode.commands.executeCommand(CURSORLESS_COMMAND_ID, command);
  return await getNeovimRegistry().executeCommand(
    CURSORLESS_COMMAND_ID,
    command,
  );
  // return handleCommandInternal(
  //   client,
  //   neovimIDE,
  //   commandApi,
  //   cmdSrvApi,
  //   CURSORLESS_COMMAND_ID,
  //   command,
  // );
}