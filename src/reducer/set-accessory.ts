import produce from "immer";

import { get } from "lodash-es";

import {
  GameObject,
  AccessorizerBehavior,
  Accessory,
  getIndexOfAccessoryType,
  getBehavior,
  getAccessoryType
} from "oni-save-parser";

import { AppState } from "@/state";

import {
  ACTION_SET_ACCESSORY,
  SetAccessoryAction
} from "@/actions/set-accessory";

export default function setAccessoryReducer(
  state: AppState,
  action: SetAccessoryAction
): AppState {
  if (action.type !== ACTION_SET_ACCESSORY) {
    return state;
  }

  return produce(state, state => {
    const { loadingState, oniSave } = state;
    if (loadingState !== "ready" || !oniSave) {
      return;
    }

    const { gameObjectPath, accessoryName } = action.payload;

    const gameObject: GameObject = get(oniSave, gameObjectPath);
    if (!gameObject) {
      return;
    }

    const behavior = getBehavior(gameObject, AccessorizerBehavior);
    if (!behavior) {
      return;
    }
    const { accessories } = behavior.templateData;

    const type = getAccessoryType(accessoryName);
    if (!type) {
      return;
    }

    const accessoryIndex = getIndexOfAccessoryType(accessories, type);

    const newAccessory = Accessory(accessoryName);

    if (accessoryIndex === -1) {
      // Add
      accessories.push(newAccessory);
    } else {
      // Replace
      accessories[accessoryIndex] = newAccessory;
    }
  });
}
