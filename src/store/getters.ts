import { state } from "./state"

export const getters= {
  doublePlusOne(): number {
    return state.count * 2 + 1
  },
}