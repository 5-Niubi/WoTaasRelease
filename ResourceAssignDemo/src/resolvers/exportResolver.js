import Resolver from "@forge/resolver";
import { exportService } from "../services";

/**
 * @param {Resolver} resolver
 */
function exportResolver(resolver) {
	resolver.define("exportToJira", async function (request) {
		try {
			return await exportService.exportToJira(
				request.context,
				request.payload.scheduleId,
				request.payload.projectCreateInfo
			);
		} catch (error) {
			console.log("exportToJira Error: ", error);
			if (error.errors.projectName) {
				throw new Error(JSON.stringify(error.errors.projectName));
			}
			if (error.errors.projectKey) {
				throw new Error(JSON.stringify(error.errors.projectKey));
			}
			return Promise.reject(error);
		}
	});
	resolver.define("getDownloadMSXMLUrl", async function (request) {
		try {
			return await exportService.getUrlexportToMSXml(
				request.payload.scheduleId
			);
		} catch (error) {
			console.log("getDownloadMSXMLUrl Error: ", error);
			throw new Error(JSON.stringify(error));

			return Promise.reject(error);
		}
	});

	resolver.define("checkAdministratorprivileges", async function (request) {
		try {
			return await exportService.checkPrivileges(
				request.context
			);
		} catch (error) {
			console.log("checkAdministratorprivileges Error: ", error);
			throw new Error(JSON.stringify(error));

			return Promise.reject(error);
		}
	});
}

export default exportResolver;
