import { createWebTriggerResponse } from "../common/utils";
import { HttpStatus } from "../common/httpStatus";
import AuthenWithBE from "../services/authens/AuthenWithBE";

/**
 * Callback from .net server after OAuth return code, to make a contract with Forge app
 * -> Atlassian -> (code) -> .Net -> Trigger (get context data: appId, cloudId, userId) -> .Net
 * @param {{ body: string; }} request
 */
async function authenBECallbackTrigger(request) {
  try {
    // do the things
    await AuthenWithBE.handleAuthenCallbackFromNET(JSON.parse(request.body));
    
    let response = createWebTriggerResponse({}, HttpStatus.OK);
    return response;
  } catch (err) {
    console.log("Error in webtrigger: ", err);
    let response = createWebTriggerResponse(
      {},
      HttpStatus.INTERNAL_SERVER_ERROR
    );
    return response;
  }
}

async function logoutTrigger(request) {
  try {
    // do the things
    await AuthenWithBE.handleUnauthorizedStatus();
    let response = createWebTriggerResponse({}, HttpStatus.OK);
    return response;
  } catch (err) {
    console.log("Error in webtrigger: ", err);
    let response = createWebTriggerResponse(
      {},
      HttpStatus.INTERNAL_SERVER_ERROR
    );
    return response;
  }
}

export { authenBECallbackTrigger , logoutTrigger};
