import casual from 'casual'
import { create, defaults, bodyParser } from 'json-server'

const server = create()
const middlewares = defaults()
const port = 7879

server.use(bodyParser)
server.use(middlewares)
server.set('trust proxy', true)

server.listen(port, '0.0.0.0', () => {
    console.log('Mock is running')
})

casual.register_provider({
    modelization: (id) => {
        let fId = id || casual.uuid
        return {
            id: fId,
            name: casual.fr_FR.city,
            green_energy: casual.integer(0, 100),
            image_url: `https://www.example.org/pyl-bank/${fId}.pyl`
        }
    },
    photogrammetry_job: (nbPhotos, greenEnergy) => {
        return {
            id: casual.uuid,
            nb_photos: nbPhotos || 0,
            green_energy: greenEnergy || casual.integer(0, 100), // %
            status: 'InProgress',
            current_server_energy_rate: casual.double(5, 25), // Watts
            logs: casual.text,
        }
    }
})

server.get('/modelizations', (_, response) => {
    response.status(200).jsonp(modelizations)
})

server.get('/modelization/:id', (request, response) => {
    let res = casual.modelization(request.params["id"])
    response.status(200).jsonp(res)
})

server.get('/jobs', (_, response) => {
    response.status(200).jsonp(jobs)
})

server.get('/job/:id', (req, res) => {
    let target
    for (let job of jobs) {
        if (job.id == req.params["id"]) {
            target = job
            break;
        }
    }
    res.status(200).jsonp(
        target
    )
})

server.post('/job', (request, response) => {
    console.log(request.body)
    let photos = request.body['photos']
    let greenEnergy = request.body['greenEnergyPercentage']
    if (Array.isArray(photos) && photos.length > 0) {
        response.status(200).jsonp({ id: start_job(photos, greenEnergy) })
    } else {
        response.status(400).jsonp()
    }
})


const start_job = (photos, greenEnergy) => {
    let job = casual.photogrammetry_job(photos.length, greenEnergy)
    jobs.push(job);

    const job_duration = photos.length * 15000

    setTimeout(() => {
        for (let i in jobs) {
            if (jobs[i].id == job.id) {
                jobs[i].status = 'Finished';
                break;
            }
        }
    }, job_duration)

    return job.id
}

var array_of = function(times, generator) {
	var result = [];

	for (var i = 0; i < times; ++i) {
		result.push(generator());
	}

	return result;
};

let jobs = [];
let modelizations = array_of(15, casual.modelization);