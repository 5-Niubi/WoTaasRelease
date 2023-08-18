import  commonResolver  from "./commonResolver";
import exportResolver from "./exportResolver";
import projectResolver from "./projectResolver";
import skillResolver from "./skillResolver";
import taskResolver from "./taskResolver";
import workforceResolver from "./workforceResolver";
import milestoneResolver from "./milestoneResolver";
import parameterResolver from "./parameterResolver";
import scheduleResolver from "./scheduleResolver";
import threadResolver from "./threadResolver";
import subscriptionResolver from "./subscriptionResolver";

/**
 * @param {import("@forge/resolver").default} resolver
 */
function resolverReg(resolver){
    commonResolver(resolver);
    projectResolver(resolver);
    skillResolver(resolver);
    taskResolver(resolver);
    workforceResolver(resolver);
    exportResolver(resolver);
    milestoneResolver(resolver);
    parameterResolver(resolver);
    scheduleResolver(resolver);
    threadResolver(resolver);
    subscriptionResolver(resolver);
}

export default resolverReg;