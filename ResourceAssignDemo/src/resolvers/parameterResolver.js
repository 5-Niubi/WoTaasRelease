import Resolver from "@forge/resolver";
import { parameterService } from "../services";

/**
 * @param {Resolver} resolver
 */
function parameterResolver(resolver) {

	resolver.define("saveParameters", async function (req) {
		try {
			let response = await parameterService.saveParameters(req.payload.parameter);
			console.log("Save Parameters: ", response);
			return response;
		} catch (error) {
			console.log("Error in save parameters: ", error);
			throw new Error(JSON.stringify(error));

			return Promise.reject(error);
		}
	});

    resolver.define("getWorkforceParameter", async function (req) {
		try {
			let response = await parameterService.getWorkforceParamter(req.payload.projectId);
			console.log("Workforce Parameters: ", response);
			return response;
		} catch (error) {
			console.log("Error in workforce parameters: ", error);
			throw new Error(JSON.stringify(error));

			return Promise.reject(error);
		}
	});

    resolver.define("getEstimateOverallWorkforce", async function (req) {
		try {
			let response = await parameterService.GetEstimateOverallWorkforce(req.payload.projectId);
			console.log("GetEstimateOverallWorkforce: ", response);
			return response;
		} catch (error) {
			console.log("Error in GetEstimateOverallWorkforce: ", error);
			throw new Error(JSON.stringify(error));

			return Promise.reject(error);
		}
	});

    resolver.define("getExecuteAlgorithmDailyLimited", async function () {
		try {
			let response = await parameterService.getExecuteAlgorithmDailyLimted({});
			console.log("getExecuteAlgorithmDailyLimited: ", response);
			return response;
		} catch (error) {
			console.log("Error in getExecuteAlgorithmDailyLimited: ", error);
			throw new Error(JSON.stringify(error));

			return Promise.reject(error);
		}
	});
    
}

export default parameterResolver;
