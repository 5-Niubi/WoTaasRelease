import { invoke } from "@forge/bridge";
import moment from "moment";
import { STORAGE } from "./contants";
import { colorsBank } from "./colors";

/**
 * Using moment.js to get current date into format "YYYY-MM-DD"
 * @returns {string} currentDate
 */
export function getCurrentTime() {
	let date = moment();
	let currentDate = date.format("YYYY-MM-DD");
	return currentDate;
}

export function formatDateDMY(date) {
	return moment(date).format("DD-MM-YYYY");
}

export async function saveThreadInfo(threadInfo) {
	try {
		await invoke("setThreadInfo", { threadInfo });
		localStorage.setItem(STORAGE.THREAD_INFO, JSON.stringify(threadInfo));
	} catch (error) {
		Promise.reject(error);
	}
}

export async function removeThreadInfo() {
	try {
		await invoke("removeThreadInfo");
		localStorage.removeItem(STORAGE.THREAD_INFO);
	} catch (error) {
		Promise.reject(error);
	}
}

export function calculateDuration({ startDate, endDate }) {
	var a = moment(startDate);
	var b = moment(endDate);
	var result = b.diff(a, "days");
	return result >= 1 ? result : 0;
}

export function extractProjectKey(str) {
	let projectKey = str.replace(/[^A-Z0-9]+/g, "");
	projectKey = projectKey.slice(0, 10);
	return projectKey;
}

export function cache(key, val) {
	localStorage.setItem(key, val);
}

export function getCache(key) {
	return localStorage.getItem(key);
}

export function clearCache(key) {
	localStorage.removeItem(key);
}

export function clearAllCache() {
	localStorage.clear();
}

export function clearProjectBasedCache() {
	clearCache("project");
	clearCache("milestones");
	clearCache("tasks");
	clearCache("estimation");
	return;
}

export function getCacheObject(key, initValue) {
	let cache = getCache(key);
	if (!cache) {
		cache = initValue;
	} else {
		cache = JSON.parse(cache);
	}
	return cache;
}

/**
 * @desc Get a specific object in the array by its id
 * @param {Array} arr
 * @param {*} id
 * @returns Object | null
 */
export function findObj(arr, id) {
	for (var i = 0; i < arr.length; i++) {
		if (arr[i].id == id) {
			return arr[i];
		}
	}
	return null;
}

/**
 * @desc Get a color in a bank by its index. In case index is exceeded the bank,
 * the function will return the color at the index calculated by module of the original index and array length
 * @param {Int} index
 * @param {Array} bank - array of color; default is colorsBank array
 * @returns Color in array
 */
export function getColor(index, bank = colorsBank) {
	return bank[index % bank.length];
}

export const validateEmail = (value) => {
	//REQUIRES NOT NULL, AND CONTAINS @ SYMBOL
	if (!value) {
		return "NOT_VALID";
	}
	if (!value.includes("@")) {
		return "NOT_VALID";
	}
	return undefined;
};

export const validateNumberOnly = (value) => {
	//REQUIRES NOT NULL, NUMBER ONLY
	if (!value) {
		return "NOT_VALID";
	}

	if (isNaN(parseFloat(value))) {
		return "NOT_VALID";
	}
	const regex = /^\d*\.?\d*$/;
	if (!regex.test(value)) {
		return "NOT_VALID";
	}
	return undefined;
};

export const validateWorkingEffort = (value) => {
	//REQUIRES NOT NULL, NUMBER ONLY, FROM 0.0 TO 24.0
	if (!value) {
		return "NOT_VALID";
	}

	if (isNaN(parseFloat(value))) {
		return "NOT_VALID";
	}

	if (value < 0.0 || value > 24) {
		return "OUT_SCOPE";
	}

    const regex = /^\d*\.?\d{1}$/;
    if (!regex.test(value)) {
      return "NOT_VALID";
    }
	return undefined;
};

export const validateName = (value) => {
	//REQUIRES NOT NULL, LETTER ONLY, 6 CHARACTERS AT LEAST
	if (!value) {
		return "NOT_VALID";
	}
	const regex = /^[A-Za-zÀ-ỹà-ỳĂ-ưă-ưẠ-ỵạ-ỵ ]{6,}$/;
	if (!regex.test(value)) {
		return "NOT_VALID";
	}
	return undefined;
};

export const isObjectEmpty = (objectName) => {
	if (!objectName) {
		return true;
	}
	return Object.keys(objectName).length === 0;
};

export const isArrayEmpty = function (array) {
	if (!array) {
		return true;
	}
	return array.length === 0;
};

export function hasJsonStructure(str) {
	if (typeof str !== "string") return false;
	try {
		const result = JSON.parse(str);
		const type = Object.prototype.toString.call(result);
		return type === "[object Object]" || type === "[object Array]";
	} catch (err) {
		return false;
	}
}

export function extractErrorMessage(error) {
	let stringErr = error.toString();
	const regex = /^Error: There was an error invoking the function - /;
	stringErr = stringErr.replace(regex, "");
	if (!hasJsonStructure(stringErr)) {
		return stringErr;
	}
	return JSON.parse(stringErr);
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function formatText(input) {
	//UPPERCASE AND REMOVE ANY NON-WORD CHARACTER
	const formattedText = input.toLowerCase().replace(/[^\p{L}\d]+/gu, " ");

  // REPLACE SPACES WITH " "
  const result = formattedText.replace(/\s+/g, " ").trim();
  
  // CAPITALIZE FIRST LETTERS
  const capitalizedResult = result.split(" ").map(capitalizeFirstLetter).join(" ");
  
  return capitalizedResult;
}

export function parseForTimeOnly(timeString) {
	return moment(timeString, ["h:m a", "H:m"]);
}

export function generateTimeFrom00To23() {
	let resultArr = [];
	for (let i = 0; i <= 23; i++) {
		let hour = i;
		let minute = "00";
		let time = `${hour}:${minute}`;
		resultArr.push(time);

		minute = "30";
		time = `${hour}:${minute}`;
		resultArr.push(time);
	}

	return resultArr;
}

export function milisecondToHours(miliseconds){
	return miliseconds / (1000 * 60 * 60);
}