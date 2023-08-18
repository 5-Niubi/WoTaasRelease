import API, { route, storage } from "@forge/api";
import { STORAGE } from "../../common/constants";
import { HttpStatus } from "../../common/httpStatus";
import AuthenWithBE from "../authens/AuthenWithBE";

class APIJiraService {
	async get(url, params) {
		try {
			const queryParams = new URLSearchParams();
			if (params) {
				Object.keys(params).forEach((key) =>
					queryParams.append(key, params[key])
				);
			}
			let response = await API.asApp().requestJira(
				route`${url}?${queryParams}`,
				{
					method: "GET",
				}
			);

			if (response.ok) {
				return await response.json();
			}
			return Promise.reject(response);
		} catch (err) {
			return Promise.reject(err);
		}
	}

	/**
	 * @param {string} url
	 * @param {Object} data
	 */
	async post(url, params, data) {
		try {
			const queryParams = new URLSearchParams();
			if (params) {
				Object.keys(params).forEach((key) =>
					queryParams.append(key, params[key])
				);
			}
			let response = await API.asApp().requestJira(
				route`${url}?${queryParams}`,
				{
					method: "POST",
					body: JSON.stringify(data),
				}
			);
			if (response.ok) {
				return await response.json();
			}
			return Promise.reject(await response.json());
		} catch (err) {
			return Promise.reject(err);
		}
	}

	async getAsUser(url, params) {
		try {
			const queryParams = new URLSearchParams();
			if (params) {
				Object.keys(params).forEach((key) =>
					queryParams.append(key, params[key])
				);
			}
			let response = await API.asUser().requestJira(
				route`${url}?${queryParams}`,
				{
					method: "GET",
				}
			);

			if (response.ok) {
				return await response.json();
			}
			console.log(`Response getAllUsersJira: ${response.status} ${response.statusText}`);
			console.log("getAllUsersJira",await response.json());
			return Promise.reject(response);
		} catch (err) {
			return Promise.reject(err);
		}
	}
}

export default new APIJiraService();
