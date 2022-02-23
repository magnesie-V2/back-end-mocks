import { create, defaults, bodyParser } from 'json-server'

const server = create()
const middlewares = defaults()
const port = 7882
let MIN_VALUE = 700

server.use(bodyParser)
server.use(middlewares)
server.set('trust proxy', true)

function get_date(basic_str) {
    let date_array = basic_str.split("-")
    return new Date(date_array[0],date_array[1],date_array[2],date_array[3],date_array[4])
}

server.get('/sensors/weather_weather_sol/measurements', (req, response) => {
    let start_date = get_date(req.query["start_date"])
    let end_date = get_date(req.query["end_date"])

    let timestamps = []
    let values = []

    let loop = start_date;
    const SECOND_GAP = 15;
    while (loop <= end_date) {
        timestamps.push(loop.toString())
        values.push(
            Math.floor(Math.random() * 10) + MIN_VALUE
        )
        let newDate = loop.setUTCSeconds(loop.getUTCSeconds() + SECOND_GAP);
        loop = new Date(newDate);
    }

    response.status(200).jsonp(
        {
            "timestamps": timestamps,
            "values": values
        }
    )
})

server.get('/mode/sunny', (_, res) => {
    MIN_VALUE = 700
    res.status(200).jsonp("Ok")
})

server.get('/mode/dark', (_, res) => {
    MIN_VALUE = 30
    res.status(200).jsonp("Ok")
})

server.listen(port, '0.0.0.0', () => {
    console.log('API Seduce mock is running')
})
