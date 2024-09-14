import fastify from "fastify"
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from "fastify-type-provider-zod"
import fastifyCors from '@fastify/cors'
import * as routes from "./routes"

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifyCors, { origin: '*' })

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(routes.createGoalRoute)
app.register(routes.createGoalCompletionRoute)
app.register(routes.getGoalsOfThisWeekRoute)
app.register(routes.getSummaryOfThisWeekRoute)

app.listen({ port: 777 }).then(() => {
    console.log("servidor HTTP rodando")
})
