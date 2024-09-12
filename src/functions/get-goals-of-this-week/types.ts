export interface GoalOfThisWeek {
    id: string
    title: string
    desiredWeeklyFrequency: number
    completionCount: number
}

export interface GetGoalsOfThisWeekResponse {
    goalsOfThisWeek: GoalOfThisWeek[]
}
