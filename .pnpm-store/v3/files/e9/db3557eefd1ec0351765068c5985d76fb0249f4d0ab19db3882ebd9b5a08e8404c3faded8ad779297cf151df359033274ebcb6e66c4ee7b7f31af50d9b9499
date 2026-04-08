"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
function schemaWrapper(schemaId, payload) {
  return {
    schema_id: schemaId,
    payload,
    metadata: {
      event_created_at_ms: Date.now()
    }
  };
}
function parseGid(gid) {
  const defaultReturn = { id: "", resource: null };
  if (typeof gid !== "string") {
    return defaultReturn;
  }
  const matches = gid.match(/^gid:\/\/shopify\/(\w+)\/([^/]+)/);
  if (!matches || matches.length === 1) {
    return defaultReturn;
  }
  const id = matches[2] ?? null;
  const resource = matches[1] ?? null;
  return { id, resource };
}
function addDataIf(keyValuePairs, formattedData) {
  if (typeof keyValuePairs !== "object") {
    return {};
  }
  Object.entries(keyValuePairs).forEach(([key, value]) => {
    if (value) {
      formattedData[key] = value;
    }
  });
  return formattedData;
}
function errorIfServer(fnName) {
  if (typeof document === "undefined") {
    console.error(
      `${fnName} should only be used within the useEffect callback or event handlers`
    );
    return true;
  }
  return false;
}
exports.addDataIf = addDataIf;
exports.errorIfServer = errorIfServer;
exports.parseGid = parseGid;
exports.schemaWrapper = schemaWrapper;
//# sourceMappingURL=analytics-utils.js.map
