import API, { storage } from "@forge/api";
import { STORAGE } from "../../common/constants";
import { HttpStatus } from "../../common/httpStatus";
import AuthenWithBE from "../authens/AuthenWithBE";
import { BACKEND_SERVER_DOMAIN } from "../../common/environment";

/**
 * Using for get api from .NET server
 */
class APIServices {
	DOMAIN = BACKEND_SERVER_DOMAIN;
	
	/**
	 * @param {string} url
	 */
	async get(url, params) {
		try {
			let fetchUrl = new URL(`${this.DOMAIN}${url}`);
			if (params) {
				Object.keys(params).forEach((key) =>
					fetchUrl.searchParams.append(key, params[key])
				);
			}
			let response = await API.fetch(fetchUrl.toString(), {
				method: "GET",
				headers: {
					Authorization: `Bearer ${await storage.getSecret(STORAGE.TOKEN)}`
				},
			});
			switch (response.status) {
				case HttpStatus.OK.code:
					return await response.json();
				case HttpStatus.UNAUTHORIZED.code:
					AuthenWithBE.handleUnauthorizedStatus();
					break;
				case HttpStatus.BAD_REQUEST.code:
					return Promise.reject(await response.json());
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
			let fetchUrl = new URL(`${this.DOMAIN}${url}`);
			if (params) {
				Object.keys(params).forEach((key) =>
					fetchUrl.searchParams.append(key, params[key])
				);
			}
			let response = await API.fetch(fetchUrl.toString(), {
				method: "POST",
				headers: {
					Authorization: `Bearer ${await storage.getSecret(STORAGE.TOKEN)}`,
				},
				body:JSON.stringify(data),
			});
			switch (response.status) {
				case HttpStatus.OK.code:
					return await response.json();
				case HttpStatus.UNAUTHORIZED.code:
					AuthenWithBE.handleUnauthorizedStatus();
					break;
				case HttpStatus.BAD_REQUEST.code:
					return Promise.reject(await response.json());
                case HttpStatus.PRECONDITION_FAILED.code:
                    return Promise.reject(await response.json());
			}
			return Promise.reject(response);
		} catch (err) {
			return Promise.reject(err);
		}
	}
	/**
	 * @param {string} url
	 * @param {{}} params
	 * @param {{}} data
	 */
	async put(url, params, data) {
		try {
			let fetchUrl = new URL(`${this.DOMAIN}${url}`);
			if (params) {
				Object.keys(params).forEach((key) =>
					fetchUrl.searchParams.append(key, params[key])
				);
			}
			let response = await API.fetch(fetchUrl.toString(), {
				method: "PUT",
				headers: {
					Authorization: `Bearer ${await storage.getSecret(STORAGE.TOKEN)}`,
				},
				body: JSON.stringify(data),
			});
			switch (response.status) {
				case HttpStatus.OK.code:
					return await response.json();
				case HttpStatus.UNAUTHORIZED.code:
					AuthenWithBE.handleUnauthorizedStatus();
					break;
				case HttpStatus.BAD_REQUEST.code:
					return Promise.reject(await response.json());
			}
		} catch (err) {
			return Promise.reject(err);
		}
	}

	/**
	 * @param {string} url
	 */
	async delete(url, params) {
		try {
			let fetchUrl = new URL(`${this.DOMAIN}${url}`);
			if (params) {
				Object.keys(params).forEach((key) =>
					fetchUrl.searchParams.append(key, params[key])
				);
			}
			// console.log("TOKEN: ", await storage.getSecret(STORAGE.TOKEN));
			let response = await API.fetch(fetchUrl.toString(), {
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${await storage.getSecret(STORAGE.TOKEN)}`,
				},
			});
			switch (response.status) {
				case HttpStatus.OK.code:
					return await response.json();
				case HttpStatus.UNAUTHORIZED.code:
					AuthenWithBE.handleUnauthorizedStatus();
					break;
				case HttpStatus.BAD_REQUEST.code:
					return Promise.reject(await response.json());
			}
		} catch (err) {
			return Promise.reject(err);
		}
	}
}

export default new APIServices();
