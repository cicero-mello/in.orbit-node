export interface SummaryCompletionGoal {
    id: string
    title: string
    completedAt: Date
}

export interface GoalsByDay {
    day: Date,
    goals: SummaryCompletionGoal[]
}

export interface SummaryOfThisWeek {
    completedGoals: number
    totalGoals: number
    goalsByDay: GoalsByDay[]
}

export interface SummaryOfThisWeekResponse {
    summaryOfThisWeek: SummaryOfThisWeek
}
