const {getAllLaunches, 
        // addNewlaunch, 
        ShecheduleNewLaunch,
        exitLaunchId,
        abortLaunchbyId,
    } = require('../../models/launches.models');

async function httpAddNewLaunch(req,res) {
    const launch = req.body;
    if (!launch.mission || !launch.rocket || !launch.launchDate || !launch.target) {
        return res.status(400).json({
            error: 'missing data'
        }) 
    }

    launch.launchDate = new Date(launch.launchDate)
    if (isNaN(launch.launchDate)) {
        return res.status(400).json({
            error: 'missing data'
         }) 
    }
    // addNewlaunch(launch);
    await ShecheduleNewLaunch(launch);
    return res.status(201).json(launch);

}
async function httpGetAllLaunches(req,res) { 
   
    return res.status(200).json(await getAllLaunches());
}

async function httpAbortLaunch(req,res) {
    const launchId = Number(req.params.id);

    const existsLaunch = await exitLaunchId(launchId);
    if(!existsLaunch){
        return res.status(404).json({
            error: ' launch not found',
        })
    }
    
    const aborted = await abortLaunchbyId(launchId)
    if(!aborted) {
        return res.status(400).json({
            error: 'launch not aborted'
        })
    
    }

    return res.status(200).json({
        ok: true,})
}

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch,
    
}