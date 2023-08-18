import Resolver from "@forge/resolver";
import { exportService, subscriptionService } from "../services";

/**
 * @param {Resolver} resolver
 */
function subscriptionResolver(resolver) {
	resolver.define("getCurrentSubscriptionPlan", async function (request) {
		try {
            let res = await subscriptionService.getCurrentPlan();
            console.log(res);
			return res
		} catch (error) {
			console.log("getCurrentSubscriptionPlan Error: ", error);
			throw new Error(JSON.stringify(error));

			return Promise.reject(error);
		}
	});
}

export default subscriptionResolver;
