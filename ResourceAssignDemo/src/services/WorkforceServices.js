
import APIJiraServices from "./common/APIJiraServices";
import APIServices from "./common/APIServices";

async function getAllWorkforces() {
	try {
		let response = await APIServices.get(`/api/Workforces/GetAllWorkforces`, null);
		return response;
	} catch (error) {
		return Promise.reject(error);
	}
}

async function getWorkforceById(id) {
	try {
		let response = await APIServices.get(`/api/Workforces/GetWorkforceById`, {
			id,
		});
		return response;
	} catch (error) {
		return Promise.reject(error);
	}
}

async function getAllUsersJira(params) {
	try {
        let response = await APIJiraServices.getAsUser(`/rest/api/3/users/search`, params);
			console.log("getallusersjira resolver ", response);
		return response;
	} catch (error) {
		return Promise.reject(error);
	}
}

async function updateWorkforce(workforce_request) {
	try {
		let response = await APIServices.put(
			`/api/Workforces/UpdateWorkforce`,
			null,
			workforce_request
		);
		return response;
	} catch (error) {
		return Promise.reject(error);
	}
}

async function createWorkforce(workforce_request) {
	try {
		let response = await APIServices.post(
			`/api/Workforces/CreateWorkforce`,
			null,
			workforce_request
		);
		return response;
	} catch (error) {
		return Promise.reject(error);
	}
}

async function deleteWorkforce(id) {
	try {
		let response = await APIServices.delete(
			`/api/Workforces/DeleteWorkforce`,
			{id,}
		);
		return response;
	} catch (error) {
		return Promise.reject(error);
	}
}

export {getAllWorkforces, getAllUsersJira, updateWorkforce, getWorkforceById, createWorkforce, deleteWorkforce};