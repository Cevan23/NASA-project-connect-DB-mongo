const http = require('http');

const app = require('./app');

const {mongoConnect} = require('./services/mongo');

const {loadPlanetsData} = require('./models/planets.models')

const PORT = process.env.PORT || 8000;
const server =  http.createServer(app);



async function startServer() {

    await mongoConnect();
    await loadPlanetsData();

    server.listen(PORT, () => {
     console.log(`Listening on port ${PORT} ...`)
     console.log('Express server started on port %s at %s', server.address().port, server.address().address);
    });
}

startServer();




