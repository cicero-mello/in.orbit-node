import { db } from "../../db"
import { goals } from "../../db/schema"
import { CreateGoalRequest, CreateGoalResult } from "./types"

export const createGoal = async ({
    title, desiredWeeklyFrequency
}: CreateGoalRequest): Promise<CreateGoalResult> => {
    const result = await db.insert(
        goals
    ).values({
        title,
        desiredWeeklyFrequency
    }).returning()

    const goal = result[0]

    return { goal }
}
