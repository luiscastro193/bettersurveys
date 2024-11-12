"use strict";
import {loadPyodide} from "./pyodide/pyodide.mjs";
const pyodide = loadPyodide({packages: ["numpy", "pandas", "micropip"]});

onmessage = async function(event) {
	const {id, python, ...context} = event.data;
	
	for (const [key, value] of Object.entries(context))
		self[key] = value;
	
	try {
		let result = await (await pyodide).runPythonAsync(python);
		if (result?.toJs) result = result.toJs({dict_converter: Object.fromEntries});
		if (ArrayBuffer.isView(result)) result = URL.createObjectURL(new Blob([result]));
		postMessage({result, id});
	}
	catch (error) {
		postMessage({error: error.message, id});
	}
}
