import { storage, webTrigger } from "@forge/api";
import { STORAGE } from "../../common/constants";
import { Base64 } from "../../common/utils";
import { APP_CLIENT_ID } from "../../common/environment";

class AuthenWithBE {
	clientId = APP_CLIENT_ID;

	async generateOAuthURL(context) {
		let urlTrigger = await webTrigger.getUrl("authen-app-web-trigger-key");
		let stateOAuthURLModel = {
			triggerUrl: urlTrigger,
			accountId: context.accountId,
			cloudId: context.cloudId,
		};
		let stateData = JSON.stringify(stateOAuthURLModel);
		stateData = Base64.encode(stateData);
		const grantAccessUrl =
			`https://auth.atlassian.com/authorize?audience=api.atlassian.com` +
			`&client_id=${this.clientId}` +
			`&scope=manage%3Ajira-project%20write%3Ajira-work%20read%3Ajira-work%20manage%3Ajira-configuration%20read%3Ajira-user%20offline_access` +
			`&redirect_uri=http%3A%2F%2Flocalhost%3A5126%2FAuthentication%2FCallback` +
			`&state=${stateData}` +
			`&response_type=code` +
			`&prompt=consent`;
		return grantAccessUrl;
	}

	async handleUnauthorizedStatus() {
		storage.delete(STORAGE.IS_AUTHENTICATED);
		storage.deleteSecret(STORAGE.TOKEN);
	}
 
	/**
	 * @param {Object} data
	 */
	async handleAuthenCallbackFromNET(data) {
		await storage.setSecret(STORAGE.TOKEN, data.token);
		await storage.set(STORAGE.IS_AUTHENTICATED, true);
	}
}

export default new AuthenWithBE();
