import API, { route } from "@forge/api";
import APIJiraServices from "./common/APIJiraServices";
import APIServices from "./common/APIServices";
import { BACKEND_dNET_DOMAIN } from "../common/constants";

async function exportToJira(context, scheduleId, projectCreate) {
	try {
		// let body = {};
		// body.key = projectCreate.projectKey;
		// body.leadAccountId = context.accountId;
		// body.name = projectCreate.projectName;
		// body.projectTemplateKey = "com.pyxis.greenhopper.jira:gh-simplified-basic";
		// body.projectTypeKey = "software";

		// let response = await APIJiraServices.post("/rest/api/3/project", null, body);
		
		const result = await APIServices.get(`/api/Export/ExportToJira`, {
			scheduleId,
			projectKey: projectCreate.projectKey,
			projectName: projectCreate.projectName
		});
		return result;
	} catch (error) {
		return Promise.reject(error);
	}
}

async function getUrlexportToMSXml(scheduleId) {
	try {
		// Get Token
		const result = await APIServices.get(
			`/Authentication/GetTokenForDownload`,
			null
		);
		let token = result.token;

		let apiDownload = "/api/Export/ExportToMicrosoftProject";
		let url = new URL(`${BACKEND_dNET_DOMAIN}${apiDownload}`);
		url.searchParams.append("scheduleId", scheduleId);
		url.searchParams.append("token", token);
		return url.toString();
	} catch (error) {
		return Promise.reject(error);
	}
}

async function checkPrivileges(context){
	// try {
	// 	console.log(context);
	// 	const result = await APIJiraServices.get(
	// 		`/rest/api/3/user/permission/search`,
	// 		{}
	// 	);
	// 	console.log(return)
	// 	return ;
	// } catch (error) {
	// 	return Promise.reject(error);
	// }
}

export { exportToJira, getUrlexportToMSXml, checkPrivileges };
