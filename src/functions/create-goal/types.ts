import { Goal } from "../../db/types"

export interface CreateGoalRequest {
    title: string
    desiredWeeklyFrequency: number
}

export interface CreateGoalResult {
    goal: Goal
}
