import Resolver from "@forge/resolver";
import { milestoneService } from "../services";

/**
 * @param {Resolver} resolver
 */
function milestoneResolver(resolver) {
	resolver.define("getAllMilestones", async function (req) {
		try {               
			return await milestoneService.getAllMilestones(req.payload.projectId);
		} catch (error) {
			console.log("Error in getAllMilestones: ", error);
			throw new Error(JSON.stringify(error));

		}
	});

	resolver.define("createMilestone", async function (req) {
		try {
			let response = await milestoneService.createMilestone(req.payload.milestoneObjRequest);
			return response;
		} catch (error) {
			console.log("Error in createMilestone: ", error);
			throw new Error(JSON.stringify(error));

			return Promise.reject(error);
		}
	});

	resolver.define("updateMilestone", async function (req) {
		try {
			let response = await milestoneService.updateMilestone(req.payload.milestoneObjRequest);
			return response;
		} catch (error) {
			console.log("Error in updateMilestone: ", error);
			return Promise.reject(error);
		}
	});

	resolver.define("deleteMilestone", async function (req) {
		try {
			let response = await milestoneService.deleteMilestone(req.payload.milestoneId);
			console.log(response);
			return response;
		} catch (error) {
			console.log("Error in deleteMilestone: ", error);
			// throw new Error(error.message || "Error in Deleting milestone");
			return Promise.reject(error);
		}
	});
}

export default milestoneResolver;