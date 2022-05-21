import { state } from './state'

export const actions = {
  increment(params: string) {
    state.count++
  },
  increment2(num: number) {
    state.message = `${num}、${state.message}`
  }
}