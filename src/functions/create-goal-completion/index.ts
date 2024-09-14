import { db } from "../../db"
import { goalCompletions } from "../../db/schema"
import { CreateGoalCompletionRequest, CreateGoalCompletionResponse } from "./types"
import { validate } from "./validate"

export const createGoalCompletion = async ({
    goalId
}: CreateGoalCompletionRequest): Promise<CreateGoalCompletionResponse> => {
    await validate(goalId)

    const insertResult = await db.insert(
        goalCompletions
    ).values({
        goalId
    }).returning()

    const goalCompletion = insertResult[0]
    return { goalCompletion }
}
