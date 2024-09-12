export interface Goal {
    id: string
    title: string
    desiredWeeklyFrequency: number
    createdAt: Date
}

export interface GoalCompletion {
    id: string
    goalId: string
    createdAt: Date
}
