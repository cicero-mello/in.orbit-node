import { z } from 'zod'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { createGoalCompletion } from '../../functions/create-goal-completion'

const route = "/goal-completion"

const schema = {
    body: z.object({
        goalId: z.string()
    })
}

export const createGoalCompletionRoute: FastifyPluginAsyncZod = async app => {
    app.post(route, { schema }, async (request) => {
        const { goalId } = request.body
        return await createGoalCompletion({ goalId })
    })
}
