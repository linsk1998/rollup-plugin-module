const PREFIX = "\0module:";

function modulePlugin() {
	return {
		name: "plugin-module",
		resolveId(id, importer) {
			if(id == "module") {
				return PREFIX + importer;
			}
		},
		load(id) {
			if(id.startsWith(PREFIX)) {

			}
		}
	};
}

modulePlugin.default = modulePlugin;
module.export = modulePlugin;