const launchesDatabase = require('./launches.mongo');
const planets = require('./planets.mongo');
const launches = new Map();
const DEFAULT_FLIGHT_NUMBER = 100;

const launch = {
    flightNumber: 100,
    mission: 'Kepler Exploration X',
    rocket: 'Explor IS1',
    launchDate: new Date('December 27,2030'),
    target: 'Kepler-442 b',
    customers:['ZTM','NASA'],
    upcoming: true,
    success: true,
}

saveLaunch(launch);
// launches.set(launch.flightNumber, launch);

async function getLastedFlightNumber() {
    const latestLaunch = await launchesDatabase.findOne().sort('-flightNumber');

    if(!latestLaunch) {
        return DEFAULT_FLIGHT_NUMBER;
    }
    return latestLaunch.flightNumber;
};

async function getAllLaunches(){
    return await launchesDatabase.find({},{_id:0,__v:0});
}

async function saveLaunch(launch) {

    const planet = await planets.findOne({
        kepler_name: launch.target,
    
    });

    if(!planet) {
        throw new Error('No matching planet found');
    }

   await  launchesDatabase.updateOne({
        flightNumber: launch.flightNumber,
   }, launch, {
         upsert: true,
   });
}

async function exitLaunchId(launchId)  {
    return await launchesDatabase.findOne({
        flightNumber: launchId,
    
    }); 
}

async function ShecheduleNewLaunch(launch) {
    const newFlightNumber = getLastedFlightNumber() + 1;
    const newLaunch = Object.assign(launch, {
        success: true,
        upcoming: true,
        customers: ['ZERO to mastery','NASA'],
        flightNumber: newFlightNumber,
    });
    
    await saveLaunch(newLaunch);

}

// function addNewlaunch(launch) {
//     latestFlightNumber++;
//     launches.set(
//         latestFlightNumber, 
//         Object.assign(launch, {
//             success:true,
//             upcoming: true,
//             customer: ['ZERO to mastery','NASA'],
//             flightNumber: latestFlightNumber,
//         })
//     )
// }

async function abortLaunchbyId(launchId) {

   const aborted =  await launchesDatabase.updateOne({
        flightNumber: launchId,
    }, {
        upcoming: false,
        success: false,
    
    });

    return aborted.ok === 1 && aborted.nModified === 1;
    // const aborted = launches.get(launchId);
    // aborted.upcoming = false;
    // aborted.success = false;
    // return aborted;
}



module.exports = {
    getAllLaunches,
    // addNewlaunch,
    ShecheduleNewLaunch,
    exitLaunchId,
    abortLaunchbyId,
}