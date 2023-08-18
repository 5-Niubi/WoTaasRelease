import Resolver from "@forge/resolver";
import { scheduleService } from "../services";

/**
 * @param {Resolver} resolver
 */
function scheduleResolver(resolver) {
	resolver.define("getThreadSchedule", async function (req) {
		try {
			let response = await scheduleService.getThreadSchedule(req.payload.parameterId);
			console.log(response);
			return response;
		} catch (error) {
			console.log("Error in schedule: ", error);
			throw new Error(JSON.stringify(error));

			return Promise.reject(error);
		}
	});

	resolver.define("schedule", async function (req) {
		try {
			let response = await scheduleService.schedule(req.payload.threadId);
			console.log(response);
			return response;
		} catch (error) {
			console.log("Error in schedule: ", error);
			throw new Error(JSON.stringify(error));

			return Promise.reject(error);
		}
	});

	resolver.define("saveSolution", async function (req) {
		try {
			let response = await scheduleService.saveSolution(req.payload.solutionReq);
			console.log(response);
			return response;
		} catch (error) {
			console.log("Error in saveSolution: ", error);
			throw new Error(JSON.stringify(error));

			return Promise.reject(error);
		}
	});

	resolver.define("getSolutionsByProject", async function (req) {
		try {
			let response = await scheduleService.getSolutionsByProject(req.payload.projectId);
			console.log(response);
			return response;
		} catch (error) {
			console.log("Error in getSolutionsByProject: ", error);
			throw new Error(JSON.stringify(error));

			return Promise.reject(error);
		}
	});

	resolver.define("getSchedule", async function (req) {
		try {
			let response = await scheduleService.getSchedule(req.payload.scheduleId);
			console.log(response);
			return response;
		} catch (error) {
			console.log("Error in getSchedule: ", error);
			throw new Error(JSON.stringify(error));

			return Promise.reject(error);
		}
	});
}

export default scheduleResolver;
