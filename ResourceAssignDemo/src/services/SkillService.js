import APIServices from "./common/APIServices";

async function getAllSkill() {
	try {
		let response = await APIServices.get("/api/Skills/GetSkills", null);
		return response;
	} catch (error) {
		return Promise.reject(error);
	}
}

async function createSkill(skillReq) {
	try {
		let response = await APIServices.post("/api/Skills/CreateSkill", null, skillReq);
		return response;
	} catch (error) {
		return Promise.reject(error);
	}
}

async function updateSkill(skillRequest) {
	try {
		let response = await APIServices.put(
			`/api/Skills/UpdateNameSkill`,
			null,
			skillRequest
		);
		return response;
	} catch (error) {
		return Promise.reject(error);
	}
}

async function deleteSkill(skillId) {
	try {
		let response = await APIServices.delete(
			`/api/Skills/DeleteSkill`, 
			{id: skillId}
		);
		return response;
	} catch (error) {
		return Promise.reject(error);
	}
}

export { getAllSkill, createSkill, updateSkill, deleteSkill };
