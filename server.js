// import { createServer } from "node:http"

// const server = createServer((request, response) => {
//     response.write("bruno")
    
//     return response.end()
// })

// server.listen(3333)


import { fastify } from "fastify"
import { DataBasePostgres } from "./databae_postgres.js"
// import { DataBaseMemory } from "./database_memory.js"

const server = fastify()

// const dataBase = new DataBaseMemory()
const dataBase = new DataBasePostgres()

server.post("/videos", async(request, replay) => {
    const {title, description, duration} = request.body

    await dataBase.create({
        title, 
        description,
        duration
    })

    return replay.status(201).send()
})

server.get('/videos', async(request) => {
    const search = request.query.search
    
    const video = await dataBase.list(search)

    return video
})

server.put("/videos/:id", async(request, replay) => {
   const idVideo = request.params.id

   const {title, description, duration} = request.body
   
   await dataBase.update(idVideo, {
    title,
    description,
    duration
   })

   return replay.status(204).send()
})

server.delete("/videos/:id",(request, replay) => {
    const idVideo = request.params.id

    dataBase.delete(idVideo)

    replay.status(204).send()
})

server.listen({
    host:'0.0.0.0', 
    port: process.env.PORT ?? 3333,
})
