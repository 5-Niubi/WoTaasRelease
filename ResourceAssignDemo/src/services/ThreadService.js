import { storage } from "@forge/api";
import { STORAGE } from "../common/constants";
import APIServices from "./common/APIServices";

async function addThreadState(threadInfo) {
	try {
		let state = threadInfo;
		await storage.set(STORAGE.THREAD_STATE, state);
	} catch (error) {
		return Promise.reject(error);
	}
}

async function getThreadState() {
	try {
		let state = await storage.get(STORAGE.THREAD_STATE);
		if (state) {
			Promise.reject("Thread Empty!");
		}
		return state;
	} catch (error) {
		return Promise.reject(error);
	}
}

async function removeThreadState() {
	try {
		await storage.delete(STORAGE.THREAD_STATE);
	} catch (error) {
		return Promise.reject(error);
	}
}

async function getThreadResult(threadId) {
	try {
		return await APIServices.get("/api/Thread/GetThreadResult", { threadId });
	} catch (error) {
		return Promise.reject(error);
	}
}

export { addThreadState, getThreadState, removeThreadState, getThreadResult };
