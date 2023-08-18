import APIServices from "./common/APIServices";

async function getAllMilestones(projectId) {
	try {
		let response = await APIServices.get("/api/Milestones/GetMilestones", {projectId: projectId});
		return response;
	} catch (error) {
		return Promise.reject(error);
	}
}

async function createMilestone(milestoneRequest) {
	try {
		let response = await APIServices.post(
			`/api/Milestones/CreateMilestone`,
			null,
			milestoneRequest
		);
		return response;
	} catch (error) {
		return Promise.reject(error);
	}
}

async function updateMilestone(milestoneRequest) {
	try {
		let response = await APIServices.put(
			`/api/Milestones/UpdateMilestone`,
			null,
			milestoneRequest
		);
		return response;
	} catch (error) {
		return Promise.reject(error);
	}
}

async function deleteMilestone(milestoneId) {
	try {
		let response = await APIServices.delete(
			`/api/Milestones/DeleteMilestone`, 
			{id: milestoneId}
		);
		return response;
	} catch (error) {
		return Promise.reject(error);
	}
}

export { getAllMilestones, createMilestone, updateMilestone, deleteMilestone };
