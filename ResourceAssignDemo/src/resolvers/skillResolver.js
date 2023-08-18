import Resolver from "@forge/resolver";
import { skillService } from "../services";

/**
 * @param {Resolver} resolver
 */
function skillResolver(resolver) {
	resolver.define("getAllSkills", async function (req) {
		try {               
			return await skillService.getAllSkill();
		} catch (error) {
			throw new Error(JSON.stringify(error));

			console.log("Error in getAllSkills: ", error);
		}
	});

	resolver.define("createSkill", async function (req) {
		try {               
			return await skillService.createSkill(req.payload.skillReq);
		} catch (error) {
			console.log("Error in createSkill: ", error);
			throw new Error(JSON.stringify(error));

		}
	});

	resolver.define("updateSkill", async function (req) {
		try {               
			return await skillService.updateSkill(req.payload.skillRequest);
		} catch (error) {
			console.log("Error in updateSkill: ", error);
		}
	});

	resolver.define("deleteSkill", async function (req) {
		try {               
			return await skillService.deleteSkill(req.payload.skillId);
		} catch (error) {
			console.log("Error in deleteSkill: ", error);
		}
	});
}

export default skillResolver;