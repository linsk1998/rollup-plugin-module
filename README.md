# rollup-plugin-module
 plugin to get rollup module info

### Before

```javascript
import * as module from "module";

console.log(module.id);
```

### After

```javascript
console.log("@/views/HomePage.tsx");
```

## Config

```javascript
const moduleRollupPlugin = require('rollup-plugin-module');

moduleRollupPlugin({
	baseUrl: "./src",
	idPrefix: "@/",
	include: ['src/**']
})
```

## Type reference

```javascript
/// <reference types="rollup-plugin-module/client" />
```
