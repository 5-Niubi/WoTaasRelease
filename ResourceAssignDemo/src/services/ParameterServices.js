import APIServices from "./common/APIServices";

async function saveParameters(parameter) {
	try {
		let response = await APIServices.post(
			`/api/Parameter/SaveParameter`,
			null,parameter
		);
		return response;
	} catch (error) {
		return Promise.reject(error);
	}
}

async function getWorkforceParamter(projectId) {
	try {
		let response = await APIServices.get(
            `/api/Parameter/GetWorkforceParameter`, {Id: projectId});
		return response;
	} catch (error) {
		return Promise.reject(error);
	}
}

async function GetEstimateOverallWorkforce(projectId) {
	try {
		let response = await APIServices.get("/api/Algorithm/GetEstimateOverallWorkforce", {projectId: projectId});
		return response;
	} catch (error) {
		return Promise.reject(error);
	}
}

async function getExecuteAlgorithmDailyLimted(projectId) {
	try {
		let response = await APIServices.get("/api/Algorithm/GetExecuteAlgorithmDailyLimited", {});
		return response;
	} catch (error) {
		return Promise.reject(error);
	}
}

export { saveParameters, getWorkforceParamter, GetEstimateOverallWorkforce, getExecuteAlgorithmDailyLimted };
