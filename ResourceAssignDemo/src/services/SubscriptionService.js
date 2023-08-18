import APIServices from "./common/APIServices";


async function getCurrentPlan() {
	try {
		return await APIServices.get("/api/Subscription/Index", null);
	} catch (error) {
		return Promise.reject(error);
	}
}

export { getCurrentPlan };
