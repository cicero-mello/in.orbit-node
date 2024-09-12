import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { getSummaryOfThisWeek } from '../../functions/get-summary-of-this-week'

const route = "/summary-of-this-week"

export const getSummaryOfThisWeekRoute: FastifyPluginAsyncZod = async app => {
    app.get(route, async () => {
        const { summaryOfThisWeek } = await getSummaryOfThisWeek()
        return summaryOfThisWeek
    })
}
