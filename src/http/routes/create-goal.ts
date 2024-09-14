import { z } from 'zod'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { createGoal } from '../../functions/create-goal'

const route = "/goal"

const schema = {
    body: z.object({
        title: z.string(),
        desiredWeeklyFrequency: z.number().int().min(1).max(7)
    })
}

export const createGoalRoute: FastifyPluginAsyncZod = async app => {
    app.post(route, { schema }, async (request) => {
        const { title, desiredWeeklyFrequency } = request.body
        return await createGoal({ title, desiredWeeklyFrequency })
    })
}
