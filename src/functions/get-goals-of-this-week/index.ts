import { db } from "../../db"
import { count, gte, lte, and, eq, sql } from "drizzle-orm"
import { goalCompletions, goals } from "../../db/schema"
import { GetGoalsOfThisWeekResponse, GoalOfThisWeek } from "./types"
import dayjs from "dayjs"

export const getGoalsOfThisWeek = async (): Promise<GetGoalsOfThisWeekResponse> => {
    const firstDayOfThisWeek = dayjs().startOf('week').toDate()
    const lastDayOfThisWeek = dayjs().endOf('week').toDate()

    const goalsCreatedUntilThisWeek = db.$with("goals_created_until_this_week").as(
        db.select({
            id: goals.id,
            title: goals.title,
            desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
            createdAt: goals.createdAt,
        }).from(
            goals
        ).where(
            lte(goals.createdAt, lastDayOfThisWeek)
        )
    )

    const completedGoalsCounter = db.$with("completed_goals_counter").as(
        db.select({
            goalId: goalCompletions.goalId,
            completionCount: count(goalCompletions.id).as("completion_count")
        }).from(
            goalCompletions
        ).where(
            and(
                gte(goalCompletions.createdAt, firstDayOfThisWeek),
                lte(goalCompletions.createdAt, lastDayOfThisWeek)
            )
        ).groupBy(
            goalCompletions.goalId
        )
    )

    const goalsOfThisWeek: GoalOfThisWeek[] = await db.with(
        goalsCreatedUntilThisWeek,
        completedGoalsCounter
    ).select({
        id: goalsCreatedUntilThisWeek.id,
        title: goalsCreatedUntilThisWeek.title,
        desiredWeeklyFrequency: goalsCreatedUntilThisWeek.desiredWeeklyFrequency,
        completionCount: sql/*sql*/`
            COALESCE(${completedGoalsCounter.completionCount}, 0)
        `.mapWith(Number)
    }).from(
        goalsCreatedUntilThisWeek
    ).leftJoin(
        completedGoalsCounter,
        eq(completedGoalsCounter.goalId, goalsCreatedUntilThisWeek.id)
    )

    return { goalsOfThisWeek }
}
