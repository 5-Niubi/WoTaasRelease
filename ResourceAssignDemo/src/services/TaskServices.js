import APIServices from "./common/APIServices";

async function getTasks(projectId) {
	try {
		let response = await APIServices.get(`/api/Tasks/GetTasksPertChart`, {ProjectId: projectId});
		return response;
	} catch (error) {
		return Promise.reject(error);
	}
}

async function createTask(taskRequest) {
	try {
		let response = await APIServices.post(
			`/api/Tasks/CreateTask`,
			null,
			taskRequest
		);
		return response;
	} catch (error) {
		// throw new Error(error.messages || "Error in create new task");
		return Promise.reject(error);
	}
}

async function getTask(taskId) {
	try {
		let response = await APIServices.get(`/api/Tasks/GetTask`, {
			taskId,
		});
		return response;
	} catch (error) {
		return Promise.reject(error);
	}
}

async function saveTasks(tasks) {
	try {
		let response = await APIServices.post(
			`/api/Tasks/SaveTasks`,
			null,
			tasks
		);
		return response;
	} catch (error) {
		return Promise.reject(error);
	}
}

async function updateTask(task) {
	try {
		let response = await APIServices.put(
			`/api/Tasks/UpdateTask`,
			null,
			task
		);
		return response;
	} catch (error) {
		return Promise.reject(error);
	}
}

async function deleteTask(id) {
	try {
		let response = await APIServices.delete(
			`/api/Tasks/DeleteTask`,
			{Id: id}
		);
		return response;
	} catch (error) {
		return Promise.reject(error);
	}
}

export { getTasks, createTask, getTask, saveTasks, updateTask, deleteTask };
