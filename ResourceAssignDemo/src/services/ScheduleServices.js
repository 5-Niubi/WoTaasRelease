import API, { route } from "@forge/api";
import APIServices from "./common/APIServices";
import APIJiraServices from "./common/APIJiraServices";

async function getThreadSchedule(parameterId) {
	try {
		let response = await APIServices.get(`/api/Algorithm/ExecuteAlgorithm`, {
			parameterId,
		});
		return response;
	} catch (error) {
		return Promise.reject(error);
	}
}

async function schedule(threadId) {
	try {
		let response = await APIServices.get(`/api/Thread/GetThreadResult`, {
			threadId,
		});
		return response;
	} catch (error) {
		return Promise.reject(error);
	}
}

async function saveSolution(solutionReq) {
	try {
		let response = await APIServices.post(`/api/Schedule/CreateSolution`, null,
			solutionReq);
		return response;
	} catch (error) {
		return Promise.reject(error);
	}
}

async function getSolutionsByProject(projectId) {
	try {
		let response = await APIServices.get(`/api/Schedule/GetSchedulesByProject`, { projectId } );
		return response;
	} catch (error) {
		return Promise.reject(error);
	}
}

async function getSchedule(scheduleId) {
	try {
		let response = await APIServices.get(`/api/Schedule/GetSchedule`, { scheduleId } );
		return response;
	} catch (error) {
		return Promise.reject(error);
	}
}

export {
	getThreadSchedule,
	schedule,
	saveSolution,
	getSolutionsByProject,
	getSchedule
};
