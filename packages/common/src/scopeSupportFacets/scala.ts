import {
  LanguageScopeSupportFacetMap,
  ScopeSupportFacetLevel,
} from "./scopeSupportFacets.types";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { supported, unsupported, notApplicable } = ScopeSupportFacetLevel;

export const scalaScopeSupport: LanguageScopeSupportFacetMap = {
  ifStatement: supported,
  disqualifyDelimiter: supported,
};
