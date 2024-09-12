import { db } from "../../db"
import { and, count, eq, gte, lte, sql } from "drizzle-orm"
import { goalCompletions, goals } from "../../db/schema"
import dayjs from "dayjs"

export const validate = async (goalId: string) => {
    const firstDayOfThisWeek = dayjs().startOf("week").toDate()
    const lastDayOfThisWeek = dayjs().endOf("week").toDate()

    const completedGoalsCounter = await db.$with("completed_goals_counter").as(
        db.select({
            goalId: goalCompletions.goalId,
            completionCount: count(goalCompletions.id).as("completion_count")
        }).from(
            goalCompletions
        ).where(
            and(
                gte(goalCompletions.createdAt, firstDayOfThisWeek),
                lte(goalCompletions.createdAt, lastDayOfThisWeek),
                eq(goalCompletions.goalId, goalId)
            )
        ).groupBy(
            goalCompletions.goalId
        )
    )

    const currentCompletionGoalInfos = await db.with(
        completedGoalsCounter
    ).select({
        desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
        completionCount: sql/*sql*/`
            COALESCE(${completedGoalsCounter.completionCount}, 0)
        `.mapWith(Number)
    }).from(
        goals
    ).leftJoin(
        completedGoalsCounter,
        eq(completedGoalsCounter.goalId, goals.id)
    ).where(
        eq(goals.id, goalId)
    ).limit(
        1
    )

    const goalIdExistsInGoalsTable = !!currentCompletionGoalInfos[0]
    if(!goalIdExistsInGoalsTable){
        throw new Error("Goal ID not found!")
    }

    const {
        desiredWeeklyFrequency,
        completionCount
    } = currentCompletionGoalInfos[0]

    const canCreateGoalCompletion = completionCount < desiredWeeklyFrequency
    if(!canCreateGoalCompletion) {
        throw new Error("Goal already completed this week!")
    }
}
