import Resolver from "@forge/resolver";
import resolverReg from "./resolvers";
const resolver = new Resolver();

/**
 * Register Resolver
 */
resolverReg(resolver);

export const handler = resolver.getDefinitions();
