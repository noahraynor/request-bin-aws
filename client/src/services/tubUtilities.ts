import type { Tub } from "../types"

export function sortTubs(tubs: Tub[], sortNewestFirst: boolean) {
  return [...tubs].sort((a, b) => {
    return sortNewestFirst
      ? new Date(b.date_created).getTime() - new Date(a.date_created).getTime()
      : new Date(a.date_created).getTime() - new Date(b.date_created).getTime()
  })
}