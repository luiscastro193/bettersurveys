"use strict";
import "https://cdn.jsdelivr.net/pyodide/dev/full/pyodide.js";
const requiredPackages = ["numpy", "pandas", "micropip"];

async function loadPyodideAndPackages() {
	//self.pyodide = await loadPyodide({packages: requiredPackages});
	self.pyodide = await loadPyodide();
	await self.pyodide.loadPackage(requiredPackages, {checkIntegrity: false});
}

const pyodideReady = loadPyodideAndPackages();

self.onmessage = async function(event) {
	await pyodideReady;
	const {id, python, ...context} = event.data;
	
	for (const [key, value] of Object.entries(context))
		self[key] = value;
	
	try {
		let result = await self.pyodide.runPythonAsync(python);
		if (result?.toJs) result = result.toJs({dict_converter: Object.fromEntries});
		if (ArrayBuffer.isView(result)) result = URL.createObjectURL(new Blob([result]));
		self.postMessage({result, id});
	}
	catch (error) {
		self.postMessage({error: error.message, id});
	}
}