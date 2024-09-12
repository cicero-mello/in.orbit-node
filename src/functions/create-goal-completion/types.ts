import { GoalCompletion } from "../../db/types"

export interface CreateGoalCompletionRequest {
    goalId: string
}

export interface CreateGoalCompletionResult {
    goalCompletion: GoalCompletion
}
