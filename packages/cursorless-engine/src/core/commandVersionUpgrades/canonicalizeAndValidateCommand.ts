import {
  ActionType,
  Command,
  CommandComplete,
  CommandLatest,
  EnforceUndefined,
  LATEST_VERSION,
  OutdatedExtensionError,
  PartialTargetDescriptor,
} from "@cursorless/common";
import { getPartialTargetDescriptors } from "../../util/getPartialTargetDescriptors";
import canonicalizeTargetsInPlace from "./canonicalizeTargetsInPlace";
import { upgradeV0ToV1 } from "./upgradeV0ToV1";
import { upgradeV1ToV2 } from "./upgradeV1ToV2";
import { upgradeV2ToV3 } from "./upgradeV2ToV3";
import { upgradeV3ToV4 } from "./upgradeV3ToV4";
import { upgradeV4ToV5 } from "./upgradeV4ToV5/upgradeV4ToV5";
import { upgradeV5ToV6 } from "./upgradeV5ToV6";
import { upgradeV6ToV7 } from "./upgradeV6ToV7";
import { produce } from "immer";

/**
 * Given a command argument which comes from the client, normalize it so that it
 * conforms to the latest version of the expected cursorless command argument.
 *
 * @param command The command argument to normalize
 * @returns The normalized command argument
 */
export function canonicalizeAndValidateCommand(
  command: Command,
): EnforceUndefined<CommandComplete> {
  const commandUpgraded = upgradeCommand(command);
  const { action, usePrePhraseSnapshot = false, spokenForm } = commandUpgraded;

  return {
    version: LATEST_VERSION,
    spokenForm,
    action: produce(action, (draft) => {
      const partialTargets = getPartialTargetDescriptors(draft);

      canonicalizeTargetsInPlace(partialTargets);
      validateCommand(action.name, partialTargets);
    }),
    usePrePhraseSnapshot,
  };
}

function upgradeCommand(command: Command): CommandLatest {
  if (command.version > LATEST_VERSION) {
    throw new OutdatedExtensionError();
  }

  while (command.version < LATEST_VERSION) {
    switch (command.version) {
      case 0:
        command = upgradeV0ToV1(command);
        break;
      case 1:
        command = upgradeV1ToV2(command);
        break;
      case 2:
        command = upgradeV2ToV3(command);
        break;
      case 3:
        command = upgradeV3ToV4(command);
        break;
      case 4:
        command = upgradeV4ToV5(command);
        break;
      case 5:
        command = upgradeV5ToV6(command);
        break;
      case 6:
        command = upgradeV6ToV7(command);
        break;
      default:
        throw new Error(
          `Can't upgrade from unknown version ${command.version}`,
        );
    }
  }

  if (command.version !== LATEST_VERSION) {
    throw new Error("Command is not latest version");
  }

  return command;
}

/**
 * Validates the given action. Today, this function is a no-op, but in the
 * future it may perform additional validation.
 *
 * @param _actionName The name of the action
 * @param _partialTargets The partial targets of the action
 */
function validateCommand(
  _actionName: ActionType,
  _partialTargets: PartialTargetDescriptor[],
): void {}
