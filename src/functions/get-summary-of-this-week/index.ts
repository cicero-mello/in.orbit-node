import dayjs from "dayjs"
import { db } from "../../db"
import { goalCompletions, goals } from "../../db/schema"
import { and, eq, gte, lte, sql } from "drizzle-orm"
import { GoalsByDay, SummaryOfThisWeek, SummaryOfThisWeekResponse } from "./types"

export const getSummaryOfThisWeek = async (): Promise<SummaryOfThisWeekResponse> => {
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

    const goalsCompletedInThisWeek = db.$with("goals_completed_in_this_week").as(
        db.select({
            id: goalCompletions.id,
            title: goals.title,
            completedAt: goalCompletions.createdAt,
            completedAtDate: sql/*sql*/`
                DATE(${goalCompletions.createdAt})
            `.as("completed_at_date")
        }).from(
            goalCompletions
        ).innerJoin(
            goals,
            eq(goals.id, goalCompletions.goalId)
        ).where(
            and(
                gte(goalCompletions.createdAt, firstDayOfThisWeek),
                lte(goalCompletions.createdAt, lastDayOfThisWeek)
            )
        )
    )

    const goalsCompletedByDayInThisWeek = db.$with("goals_completed_by_day_in_this_week").as(
        db.select({
            date: goalsCompletedInThisWeek.completedAtDate,
            goals: sql/*sql*/`
                JSON_AGG(
                    JSON_BUILD_OBJECT(
                        'id', ${goalsCompletedInThisWeek.id},
                        'title', ${goalsCompletedInThisWeek.title},
                        'completedAt', ${goalsCompletedInThisWeek.completedAt}
                    )
                )
            `.as("goals")
        }).from(
            goalsCompletedInThisWeek
        ).groupBy(
            goalsCompletedInThisWeek.completedAtDate
        )
    )

    const summaryOfThisWeek: SummaryOfThisWeek[] = await db.with(
        goalsCreatedUntilThisWeek,
        goalsCompletedInThisWeek,
        goalsCompletedByDayInThisWeek
    ).select({
        completedGoals: sql/*sql*/`(
            SELECT
                COUNT(*)
            FROM
                ${goalsCompletedInThisWeek}
        )`.mapWith(Number),

        totalGoals: sql/*sql*/`(
            SELECT
                SUM(${goalsCreatedUntilThisWeek.desiredWeeklyFrequency})
                FROM ${goalsCreatedUntilThisWeek}
        )`.mapWith(Number),

        goalsByDay: sql/*sql*/`(
            SELECT
                JSON_AGG(
                    JSON_BUILD_OBJECT(
                        'day', ${goalsCompletedByDayInThisWeek.date},
                        'goals', ${goalsCompletedByDayInThisWeek.goals}
                    )
                    ORDER BY ${goalsCompletedByDayInThisWeek.date} DESC
                )
            FROM ${goalsCompletedByDayInThisWeek}
        )`.mapWith((result: GoalsByDay[]) => result.map((item) => ({
            day: new Date(item.day),
            goals: item.goals.map(({completedAt, ...rest}) => ({
                ...rest,
                completedAt: new Date(completedAt)
            }))
        })))
    }).from(
        goalsCompletedByDayInThisWeek
    ).limit(
        1
    )

    return { summaryOfThisWeek: summaryOfThisWeek[0] }
}
