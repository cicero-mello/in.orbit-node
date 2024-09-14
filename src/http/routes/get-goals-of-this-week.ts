import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { getGoalsOfThisWeek } from '../../functions/get-goals-of-this-week'

const route = "/goals-of-this-week"

export const getGoalsOfThisWeekRoute: FastifyPluginAsyncZod = async app => {
    app.get(route, getGoalsOfThisWeek)
}
