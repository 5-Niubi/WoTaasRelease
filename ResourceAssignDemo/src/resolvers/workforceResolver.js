import Resolver from "@forge/resolver";
import { workforceService } from "../services";

/**
 * @param {Resolver} resolver
 */
function workforceResolver(resolver){

    resolver.define("getAllWorkforces", async function (req){
        try {
            return await workforceService.getAllWorkforces();
        } catch (error){
            console.log("Workforce Error: ", error);
			throw new Error(JSON.stringify(error));

            return Promise.reject(error);
        }
    });

    resolver.define("getAllUserJira", async function () {
		try {
			return await workforceService.getAllUsersJira({});
		} catch (error) {
			console.log("Error in getAllUserJira: ", error);
			throw new Error(JSON.stringify(error));

			return Promise.reject(error);
		}
	});

    resolver.define("updateWorkforce", async function (req) {
		try {
			return await workforceService.updateWorkforce(req.payload.workforce_request);
		} catch (error) {
			console.log("Error in UpdateWorkforce: ", error);
			throw new Error(JSON.stringify(error));

			return Promise.reject(error);
		}
	});

    resolver.define("getWorkforceById", async function (req) {
		try {
			return await workforceService.getWorkforceById(req.payload.id);
		} catch (error) {
			console.log("Error in Get Workforce ID: ", error);
			throw new Error(JSON.stringify(error));

			return Promise.reject(error);
		}
	});

    resolver.define("createWorkforce", async function (req) {
		try {
			return await workforceService.createWorkforce(req.payload.workforce_request);
		} catch (error) {
			console.log("Error in Create Workforce: ", error);
			throw new Error(JSON.stringify(error));

			return Promise.reject(error);
		}
	});

    resolver.define("deleteWorkforce", async function (req) {
		try {
			return await workforceService.deleteWorkforce(req.payload.id);
		} catch (error) {
			console.log("Error in deleteWorkforce: ", error);
			return Promise.reject(error);
		}
	});

}

export default workforceResolver;