import Resolver from "@forge/resolver";
import { taskService } from "../services";

/**
 * @param {Resolver} resolver
 */
function taskResolver(resolver) {
	resolver.define("getTasksList", async function (req) {
		try {
			return await taskService.getTasks(req.payload.projectId);
		} catch (error) {
			console.log("Error in getTasksList: ", error);
			throw new Error(JSON.stringify(error));

			return Promise.reject(error);
		}
	});

	resolver.define("createNewTask", async function (req) {
		try {
			let response = await taskService.createTask(req.payload.taskObjRequest);
			console.log(response);
			return response;
		} catch (error) {
			console.log("Error in createNewTask: ", error);
			// throw new Error(error.messages || "Error in create new task");
			throw new Error(JSON.stringify(error));
			return Promise.reject(error);
		}
	});

	resolver.define("getTaskDetail", async function (req) {
		try {
			let response = await taskService.getTask(req.payload.taskId);
			console.log(response);
			return response;
		} catch (error) {
			console.log("Error in getTaskDetail: ", error);
			throw new Error(JSON.stringify(error));

			return Promise.reject(error);
		}
	});

	resolver.define("saveTasks", async function (req) {
		try {
			let response = await taskService.saveTasks(req.payload.tasks);
			console.log("SaveTasks response: ", response);
			return response;
		} catch (error) {
			console.log("Error in saveTasks: ", error);
			throw new Error(JSON.stringify(error));

			Promise.reject(error);
			return error;
		}
	});

	resolver.define("updateTask", async function (req) {
		try {
			let response = await taskService.updateTask(req.payload.task);
			console.log(response);
			return response;
		} catch (error) {
			console.log("Error in updateTask: ", error);
			throw new Error(JSON.stringify(error));
			return Promise.reject(error);
		}
	});

	resolver.define("deleteTask", async function (req) {
		try {
			let response = await taskService.deleteTask(req.payload.taskId);
			console.log(response);
			return response;
		} catch (error) {
			console.log("Error in deleteTask: ", error);
			throw new Error(JSON.stringify(error));
			return Promise.reject(error);
		}
	});
}

export default taskResolver;
