import casual from 'casual'
import http from 'http'
import { create, defaults, bodyParser } from 'json-server'

const server = create()
const middlewares = defaults()
const port = 8080
const photogrammetryHost = "localhost"
const photogrammetryPort = 7879

server.use(bodyParser)
server.use(middlewares)
server.set('trust proxy', true)

server.get('/job/:id', (req, response) => {
    http.get(
        `http://${photogrammetryHost}:${photogrammetryPort}/job/${req.params["id"]}`
        , (res) => {
        let data = ''

        res.on('data', d => {
            data += d
        })
        res.on('end', () => {
            response.status(200).send(data)
        })

        res.on('error', (chunk) => {
            console.log(chunk);
        })
    })
})

server.listen(port, '0.0.0.0', () => {
    console.log('Orchestrator mock is running')
})
