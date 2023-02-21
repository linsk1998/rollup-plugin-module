const path = require("path");
const crypto = require("crypto");
const pluginutils = require('@rollup/pluginutils');

const PREFIX = "\0module:";
const MODULE_ID_PREFIX = "moduleId_";
const MODULE_URI_PREFIX = "moduleUri_";

function modulePlugin(options) {
	if(!options) options = {};
	var filter = pluginutils.createFilter(options.include, options.exclude);
	var baseUrl = options.baseUrl ? path.resolve(process.cwd(), options.baseUrl) : process.cwd();
	baseUrl = baseUrl.replace(/\\/g, "/");
	if(!baseUrl.endsWith("/")) {
		baseUrl = baseUrl + "/";
	}
	var idPrefix = options.idPrefix || "";
	var uriPrefix = options.uriPrefix || "./";
	var hashModule = new Map();

	return {
		name: "plugin-module",
		resolveId(id, importer) {
			if(filter(importer)) {
				if(id == "module") {
					return PREFIX + importer;
				}
			}
		},
		load(id) {
			if(id.startsWith(PREFIX)) {
				id = id.substring(PREFIX.length);
				var hash = getHash(id);
				hashModule.set(hash, id);
				return `export var id=import.meta.${MODULE_ID_PREFIX}${hash};export var uri=import.meta.${MODULE_URI_PREFIX}${hash};`;
			}
		},
		resolveImportMeta(property, { chunkId, moduleId }) {
			if(property.startsWith(MODULE_ID_PREFIX)) {
				let hash = property.substring(MODULE_ID_PREFIX.length);
				let id = hashModule.get(hash);
				let moduleInfo = this.getModuleInfo(id);
				id = moduleInfo.id.replace(/\\/g, "/");
				if(id.startsWith(baseUrl)) {
					return JSON.stringify(idPrefix + id.substring(baseUrl.length));
				}
			} else if(property.startsWith(MODULE_URI_PREFIX)) {
				return JSON.stringify(uriPrefix + chunkId);
			}
		}
	};
}

function getHash(content) {
	return crypto.createHmac('sha256', content)
		.digest('hex')
		.substring(0, 8);
}

modulePlugin.default = modulePlugin;
module.exports = modulePlugin;
