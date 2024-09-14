import { db } from "../../db"
import { goals } from "../../db/schema"
import { CreateGoalRequest, CreateGoalResponse } from "./types"

export const createGoal = async ({
    title, desiredWeeklyFrequency
}: CreateGoalRequest): Promise<CreateGoalResponse> => {
    const result = await db.insert(
        goals
    ).values({
        title,
        desiredWeeklyFrequency
    }).returning()

    const goal = result[0]

    return { goal }
}
