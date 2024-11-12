let e,a,t,i=0;function n(){return i=(i+1)%Number.MAX_SAFE_INTEGER}async function s(e,a){let t=await fetch(e,a);if(t.ok)return t;throw t}function l(e){let a=document.createElement("template");return a.innerHTML=e.trim(),a.content.firstChild}class r{constructor(){this.event=new EventTarget,this.aux=new Event("e")}addListener(e,a){let t=this.event;e.myCallbacks?e.myCallbacks.push(a):e.myCallbacks=[a];let i=[new WeakRef(e),new WeakRef(a)];t.addEventListener("e",function e(){let[a,n]=i.map(e=>e.deref());a&&n&&(document.contains(a)?n():t.removeEventListener("e",e))})}addGlobalListener(e){this.event.addEventListener("e",e)}dispatch(){this.event.dispatchEvent(this.aux)}}class o{constructor(e){this.variable=e,this.event=new r}get value(){return this.variable}set value(e){this.variable=e,this.event.dispatch()}subscribe(e,a){this.event.addListener(e,a)}addGlobalListener(e){this.event.addGlobalListener(e)}}const c=new Worker("assets/webworker.js",{type:"module"}),d=new Map;async function p(){new Promise(e=>setTimeout(e))}async function u(){return new Promise(async e=>{await p(),d.size?c.addEventListener("message",async function a(){await p(),d.size||(c.removeEventListener("message",a),e())}):e()})}async function m(e,a,t){a&&await u();let i=n();return new Promise((a,n)=>{d.set(i,{onSuccess:a,onError:n}),c.postMessage({python:e,id:i,...t})})}async function h(e,a){return m(`
		import micropip
		micropip.install(${JSON.stringify(e)})
	`,a)}function w(e){return`await (await pyfetch("${e}")).memoryview()`}async function v(e,a,t){return m(`
		from pyodide.http import pyfetch
		with open("${a}", "wb") as my_file:
			my_file.write(${w(e)})
	`,t)}c.onmessage=function(e){let{id:a,...t}=e.data,{onSuccess:i,onError:n}=d.get(a);d.delete(a),Object.hasOwn(t,"error")?n(t.error):i(t.result)};const b=(async()=>{let e;await v(`${(e=location.pathname).endsWith("/")?e:e+"/"}assets/utils.py`,"utils.py"),await m("import utils")})(),f=h("openpyxl");async function g(e,a){await f,await m(`
		from pyodide.http import pyfetch
		from io import BytesIO
		import pandas as pd
		${a} = pd.read_excel(BytesIO(${w(e)}), engine = "openpyxl")
	`)}async function y(e,a){let t=URL.createObjectURL(e);await g(t,a),URL.revokeObjectURL(t)}async function $(e,a){var t,i;let n;await f,await b,t=await m(`utils.to_excel(${e})`),i=`${a}.xlsx`,(n=document.createElement("a")).href=t,n.download=i,document.body.append(n),n.click(),URL.revokeObjectURL(t),n.remove()}async function S(e,a){return y(e,a)}async function E(e,a,t){if("Excel"==t)return $(e,a);throw Error(`Invalid extension: ${t}`)}async function L(e,a){return m(`
		${a} = ${e}
		del ${e}
	`)}async function k(e){return m(`del ${e}`)}async function x(e){return m(`${e}.columns.tolist()`)}async function _(e){return await b,m(`utils.num_vars(${e})`)}function q(e,a){return e&&e!=a?`, "${e}"`:""}async function T(e,a,t){return await b,m(`utils.harmonized_variables(${e}, ${a}${q(t)})`)}async function N(e,a,t,i){return await b,m(`utils.${a?"numeric":"categories"}_details("${e}", ${t}${q(i,e)})`)}async function P(e,a,t,i){await b;let n=await m(`utils.${a?"numeric":"categories"}_inferred_totals("${e}", ${t}${q(i)})`);return a?n:new Map(n)}async function M(e,a){return await b,await m(`utils.pop_total(${e}${q(a)})`)}f.then(()=>m("import openpyxl"));const z=new o("load"),D={value:!1},W=new o,F=new o;class H{constructor(e){this.targetName=e,this.event=new r}subscribe(e,a){this.event.addListener(e,a)}cancel(e){if(this[e]){let a=this[e].id;this[e].loadPromise.then(()=>k(a)),this[e]=null,this.event.dispatch()}}loadTemp(e){this.cancel("temp");let a={id:`temp${n()}`,filename:e.name};return a.loadPromise=S(e,a.id),this.temp=a,this.event.dispatch(),a.loadPromise.then(()=>{a.id==this.temp?.id&&(a.loaded=!0,this.event.dispatch())}).catch(e=>{if(a.id==this.temp?.id)throw console.error(e),this.temp=null,this.event.dispatch(),e})}confirmTemp(){this.cancel("final"),this.final=this.temp,this.temp=null,this.event.dispatch()}confirmFinal(){let a=this.final;return this.final=null,this.event.dispatch(),L(a.id,this.targetName).then(()=>{let t=a.filename.replace(/\.[^.]+$/,"");if("np_sample"==this.targetName)W.value=t;else if("p_sample"==this.targetName)e=a.weights,F.value=t;else throw Error(`Invalid name: ${this.targetName}`)})}}const A=new H("np_sample"),O=new H("p_sample");for(let e of[A,O])z.addGlobalListener(()=>e.cancel("final"));F.addGlobalListener(()=>{a=F.value&&M("p_sample",e)});const C=s("assets/texts.json").then(e=>e.json());async function R(e){return C.then(a=>a[e])}const V={maximumFractionDigits:2,minimumFractionDigits:2,maximumSignificantDigits:1,minimumSignificantDigits:1,roundingPriority:"morePrecision"},j=Intl.NumberFormat(void 0,V);V.style="percent";const G=Intl.NumberFormat(void 0,V);function I(e){let a=!1;return()=>{a||(a=!0,setTimeout(()=>{a=!1,e()}))}}function B(e){for(let a of e.querySelectorAll("dialog"))a.querySelector(".close-button").onclick=()=>a.close()}async function U(e){let a=l(`<dialog class="modal error">
		<button class="close-button"><img src="images/close.svg" data-inline/></button>
		<img src="images/error.svg">
		<article>
			<h4>${await R("error")}</h4>
			<p>${e}</p>
		</article>
		<button class="button" autofocus>${await R("acceptError")}</button>
	</dialog>`);a.querySelectorAll("button").forEach(e=>e.addEventListener("click",()=>a.close())),a.addEventListener("close",()=>a.remove()),document.body.append(a),a.showModal()}async function J(e){let a=l(`<dialog class="modal loading">
		<img src="images/loading.svg"/>
		<p>${await R("loading")}</p>
		<p>${e}</p>
	</dialog>`);return a.addEventListener("cancel",e=>e.preventDefault()),a.addEventListener("close",()=>a.showModal()),a}function X(e,a){let t=l(`<article class="feedback">
		<img src="images/check-circle.svg"/>
		<div>
			<h3>${e}</h3>
			<p>${a}</p>
		</div>
		<button class="close-button"><img src="images/close.svg" data-inline/></button>
	</article>`);return t.querySelector(".close-button").addEventListener("click",()=>t.remove()),t}const K=[A,O];function Q(e,a){let t=l(e[a]?`<article class="uploaded-file">
			<span>${e[a].filename}</span>
			<button class="close-button"><img src="images/close.svg" data-inline/></button>
			<progress ${e[a].loaded?'value = "1"':""}></progress>
		</article>`:'<article class="uploaded-file" hidden></article>');return t.querySelector(".close-button")?.addEventListener("click",()=>e.cancel(a)),e.subscribe(t,()=>t.replaceWith(Q(e,a))),t}async function Y(e){let a=l(`<select name="weights-var">
		<option value="">${await R("noWeights")}</option>
	</select>`);return e?a.append(...e.map(e=>l(`<option>${e}</option>`))):a.disabled=!0,a}async function Z(e){let a=l(`<section class="modal-input">
		<div class="modal-input-top">
			<h4>${await R("loadFile2Subaction")}</h4>
			<span class="lead"><img src="images/lead.svg"/><span class="tooltip">${await R("loadFile2SubactionHelp")}</span></span>
		</div>
		<select></select>
		<p>${await R("loadFile2SubactionSubtitle")}</p>
	</section>`);async function t(e){let t=await Y(e);return a.querySelector("select").replaceWith(t),t}return t(),e.subscribe(a,async()=>{let a=e.temp;if(a?.loaded){let i=await _(a.id);if(a.id==e.temp?.id){let e=await t(i);e.addEventListener("change",()=>a.weights=e.value)}}else t()}),a}async function ee(e){let a=l(`<dialog class="modal">
		<div class="modal-top">
			<header>
				<h3>${await R("loadFile"+e+"Title")}</h3>
				<p>${await R("loadFile"+e+"Subtitle")}</p>
			</header>
			<button class="close-button"><img src="images/close.svg" data-inline/></button>
		</div>
		<section class="modal-input padded">
			<div class="modal-input-top">
				<h4>${await R("loadFile"+e+"Action")}</h4>
				<span class="lead"><img src="images/lead.svg"/><span class="tooltip">${await R("loadFile"+e+"ActionHelp")}</span></span>
			</div>
			<label class="button reversed">
				<span class="large icon"><img src="images/upload.svg" data-inline/></span>
				<span>${await R("fileButton")}</span>
				<input name="file${e}" type="file" accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" autofocus/>
			</label>
			<p>${await R("fileButtonSubtitle")}</p>
		</section>
		<article class="uploaded-file" hidden></article>
		<section class="buttons-row">
			<button class="button reversed minimal">${await R("cancel")}</button>
			<button class="button" disabled>${await R("fileButton")}</button>
		</section>
	</dialog>`),t=K[e-1];a.querySelector(".button.reversed.minimal").addEventListener("click",()=>a.close());let i=a.querySelector("input[type=file]");i.addEventListener("change",()=>{t.loadTemp(i.files[0]).catch(async e=>U(await R("loadFileError")))}),i.addEventListener("click",()=>i.value=""),a.querySelector(".uploaded-file").replaceWith(Q(t,"temp"));let n=a.querySelector(".buttons-row > .button:last-of-type");return t.subscribe(n,()=>n.disabled=!t.temp?.loaded),n.addEventListener("click",()=>{t.confirmTemp(),a.close()}),2==e&&a.querySelector(".uploaded-file").after(await Z(t)),a.addEventListener("close",()=>t.cancel("temp")),a}async function ea(e){let a=l(`<label class="radio-label">
		<input type="radio" name="load-type">
		<h3>${await R(`loadOption${e}`)}</h3>
		<p>${await R(`loadOption${e}Subtitle`)}</p>
		<article class="radio-file">
			<img src="images/empty.svg"/>
			<p>${await R("fileSelect")}</p>
			<article class="uploaded-file" hidden></article>
			<button class="button small"><span class="icon"><img src="images/upload.svg" data-inline/></span><span>${await R("fileButton")}</span></button>
		</article>
	</label>`),t=K[e-1];a.querySelector(".radio-file").append(await ee(e)),a.querySelector(".uploaded-file").replaceWith(Q(t,"final"));let i=a.querySelector(".button:has(+ dialog)");i.addEventListener("click",()=>i.nextElementSibling.showModal());let n=new o(t.final?.loaded);return t.subscribe(a,()=>n.value=t.final?.loaded),n.subscribe(i,()=>i.disabled=n.value),[a,n,()=>t.confirmFinal()]}async function et(e){let a=l(`<dialog class="modal">
		<div class="modal-top">
			<header>
				<h3>${await R(`download${e}Title`)}</h3>
				<p>${await R(`download${e}Subtitle`)}</p>
			</header>
			<button class="close-button"><img src="images/close.svg" data-inline/></button>
		</div>
		<section class="modal-input">
			<div class="modal-input-top">
				<h4>${await R("downloadFilename")}</h4>
			</div>
			<input name="filename" type="text" autofocus/>
		</section>
		<section class="modal-input">
			<div class="modal-input-top">
				<h4>${await R("downloadFormat")}</h4>
			</div>
			<select name="format" class="big">
				<option value="" hidden>${await R("downloadFormatPlaceholder")}</option>
				<option>Excel</option>
			</select>
		</section>
		<section class="buttons-row">
			<button class="button reversed minimal">${await R("cancel")}</button>
			<button class="button" disabled>${await R("downloadConfirm")}</button>
		</section>
	</dialog>`),t=a.querySelector("input"),i=a.querySelector("select"),[n,s]=a.querySelectorAll(".button");function r(){s.disabled=!(t.value&&i.value)}return t.addEventListener("input",r),i.addEventListener("change",r),n.addEventListener("click",()=>a.close()),s.addEventListener("click",async()=>{let n=await J(await R("downloadLoading"));a.append(n),n.showModal(),E(1==e?"np_sample":"p_sample",t.value,i.value).then(()=>{a.close()}).catch(async e=>{console.error(e),U(await R("downloadError"))}).finally(()=>n.remove())}),r(),a}async function ei(a){if("left"==a||"right"==a){let t="left"==a?1:2,i=await R(`loadFile${t}Title`),n="left"==a?W.value:F.value,s=l(`<header class="dual-header ${a}">
			<h2>${i}</h2>
			<label>
				<span>${await R("actions")}</span>
				<span class="icon"><img src="images/arrow-down.svg" data-inline/></span>
				<input type="checkbox" hidden/>
				<nav class="dropdown from-button">
					<a>${await R("loadNewData")}</a>
					<a>${await R("downloadData")}</a>
				</nav>
			</label>
			<p>${n}</p>
			<div class="border"></div>
		</header>`);"right"==a&&s.append(l(`<article>
				<span>${await R("weightsVar")}</span>
				<span>${e||await R("noWeights")}</span>
			</article>`));let r=s.querySelectorAll("nav > a"),o=await Promise.all([ee(t),et(t)]),c=K[t-1];c.subscribe(s,async()=>{if(c.final){let e=await J(await R("loadFileLoading"));s.append(e),e.showModal(),c.confirmFinal()}});for(let e=0;e<o.length;e++)s.append(o[e]),r[e].addEventListener("click",()=>o[e].showModal());return s}if("single"==a)return l(`<header class="single-header"><h2>${await R("loadFile1Title")}</h2><p>${W.value}</p></header>`);throw Error(`Invalid type: ${a}`)}async function en(){let e=[];return F.value?e.push(await ei("left"),l('<div class="border"></div>'),await ei("right")):e.push(await ei("single")),e}const es=["load","data","weight","estimation"];async function el(e,a){let t=l('<nav class="tabs"></nav>');t.append(...await Promise.all(es.map(async e=>l(`<button>${await R(e+"Tab")}</button>`)))),e=es.indexOf(e),t.children[e].classList.add("active");for(let i=0;i<t.children.length;i++){let n=t.children[i];n.addEventListener("click",()=>z.value=es[i]),a||i==e||(n.disabled=!0)}return t}async function er(e,a,t){let i=l(`<a>${await R("export"+t)}</a>`),n=await et(t);e.append(i),a.append(n),i.addEventListener("click",()=>n.showModal())}async function eo(){let e=l(`<article class="main-title-buttons">
		<label class="dropdown-button">
			<span>${await R("download")}</span>
			<span class="icon"><img src="images/arrow-down.svg" data-inline/></span>
			<input type="checkbox" hidden/>
			<nav class="dropdown from-button color"></nav>
		</label>
	</article>`),a=e.querySelector(".dropdown");return W.value&&await er(a,e,1),F.value&&await er(a,e,2),B(e),e}async function ec(){let e=l(`<main class="main-section">
		<nav class="breadcrumb">
			<a><img src="images/home.svg" data-inline/><span>${await R("home")}</span></a>
			<img src="images/arrow-right.svg" data-inline/>
			<a>${await R("projectsTab")}</a>
			<img src="images/arrow-right.svg" data-inline/>
			<a>${await R("defaultProject")}</a>
		</nav>
		<section class="main-title">
			<article class="main-title-text">
				<h1>${await R("defaultProject")}</h1>
				<p>${await R("defaultProjectDesc")}</p>
			</article>
		</section>
		<nav class="tabs"></nav>
		<main></main>
	</main>`);return e.querySelector(".tabs").replaceWith(await el(z.value,W.value)),W.value&&e.querySelector(".main-title").append(await eo()),e}async function ed(e){let a=l(`<label class="radio-label">
		<input type="radio" name="load-type">
		<h3>${await R("noFileTitle")}</h3>
		<p>${await R("noFileSubtitle")}</p>
		<article class="radio-file">
			<img src="images/data.svg"/>
			<p>${await R("noFileSubSubtitle")}</p>
			<button class="button small adjusted"><span>${await R("noFileConfirm")}</span><span class="icon"><img src="images/arrow-right.svg" data-inline/></span></button>
		</article>
	</label>`),t=a.querySelector("button");t.addEventListener("click",()=>{t.disabled=!0,e.click()});let i=async()=>{F.value&&(await k("p_sample"),F.value=null)};return[a,new o(!0),i]}const ep=[,,];async function eu(e){return 1==e?`<button class="button" disabled>${await R("next")}</button>`:`<section class="buttons-row">
			<button class="button reversed minimal">${await R("back")}</button>
			<button class="button" disabled>${await R("loadFileConfirm")}</button>
		</section>`}async function em(e=1){let a=l(`<main class="main-content">
		<header>
			<h2>${await R("loadTitle")}</h2>
			<p>${await R("loadSubtitle")}</p>
		</header>
		<main class="data-load-content">
			<article class="stepper">
				<span class="step-icon active">${1==e?1:'<img src="images/check.svg"/>'}</span>
				<span class="step-text active">${await R("loadStep1")}</span>
				<img src="images/stepper.svg"/>
				<span class="step-icon ${2==e?"active":""}">2</span>
				<span class="step-text ${2==e?"active":""}">${await R("loadStep2")}</span>
			</article>
			${await eu(e)}
			<label class="radio-label"></label>
			${await eu(e)}
		</main>`),t=a.querySelectorAll(".data-load-content > .button, .data-load-content > .buttons-row > .button:last-of-type"),i=a.querySelector(".radio-label"),n=[ea(e)];for(let[a,l,r]of(2==e&&n.push(ed(t[0])),n=await Promise.all(n),i.after(...n.map(e=>e[0])),n)){let i=a.querySelector("input");for(let a of t){function s(){i.checked&&(a.disabled=!l.value,ep[e-1]=r)}i.addEventListener("change",s),l.subscribe(a,s)}}for(let i of t)i.addEventListener("click",async()=>{if(i.disabled=!0,e<2)a.replaceWith(await em(e+1));else{let e=await J(await R("loadFileLoading"));a.append(e),e.showModal(),await Promise.all(ep.map(e=>e())),D.value=!0,z.value="data"}});return a.querySelectorAll(".data-load-content > .buttons-row > .button:first-of-type").forEach(t=>{t.addEventListener("click",async()=>{t.disabled=!0,a.replaceWith(await em(e-1))})}),i.remove(),B(a),a}async function eh(){let e=await ec();return e.querySelector("main").replaceWith(await em()),e}let ew=new class{constructor(){this.cache=new Map}set(e,a){this.cache.set(a.name,e),a.hasTotals.value=!0}delete(e){this.cache.delete(e.name),e.hasTotals.value=!1}async verify(e,a){let t=await a.npDetails();return!t.some(e=>null==e[0])&&(a.isNpNumeric?"number"==typeof e:t.length==e.size&&t.every(a=>e.has(a[0])))}async refresh(e){let a=this.cache;for(let t of(this.cache=new Map,e)){let e=a.get(t.name);e&&await this.verify(e,t)&&this.set(e,t)}}},ev=new class{constructor(){this.cache=new Set}refresh(e){let a=this.cache;for(let t of(this.cache=new Set,e))t.selected.addGlobalListener(()=>{t.selected.value?this.cache.add(t.name):this.cache.delete(t.name)}),t.selected.value=t.selectable.value&&a.has(t.name)}};class eb{static baseProperties=["name","inNp","inP","isNpNumeric","isPNumeric","isHarmonized","harmonReason","pWeights"];constructor(e){for(let a of eb.baseProperties)this[a]=e[a];this.selected=new o(!1),this.expanded=new o(!1),this.hasTotals=new o(!1),this.selectable=new o(this.isHarmonized),this.hasTotals.addGlobalListener(()=>this.selectable.value=this.isHarmonized||this.hasTotals.value),this.selectable.addGlobalListener(()=>{this.selected.value&&!this.selectable.value&&(this.selected.value=!1)})}async npDetails(){return this.npCache||(this.npCache=N(this.name,this.isNpNumeric,"np_sample")),this.npCache}async pDetails(){return this.pCache||(this.pCache=N(this.name,this.isPNumeric,"p_sample",e)),this.pCache}async inferredTotals(){return this.inferredCache||(this.inferredCache=P(this.name,this.isPNumeric,"p_sample",e)),this.inferredCache}getTotals(){return ew.cache.get(this.name)}setTotals(e){ew.set(e,this)}deleteTotals(){ew.delete(this)}}class ef{constructor(){this.event=new r}subscribe(e,a){this.event.addListener(e,a)}async variables(){return this.cache||(this.cache=this.variablesPromise().then(async e=>(await ew.refresh(e),ev.refresh(e),e))),this.cache}async filtered(e){return(await this.variables()).filter(e)}async harmonized(){return this.filtered(e=>e.isHarmonized)}async common(){return this.filtered(e=>e.inNp&&e.inP)}async npOnly(){return this.filtered(e=>e.inNp&&!e.inP)}async pOnly(){return this.filtered(e=>!e.inNp&&e.inP)}static async fromHarmonization(){let a=e,[t,i,n]=await Promise.all([T("np_sample","p_sample",a),_("np_sample"),_("p_sample")]);[i,n]=[i,n].map(e=>new Set(e));let s=[];function l(e){return new eb({pWeights:a,isNpNumeric:i.has(e.name),isPNumeric:n.has(e.name),...e})}s.push(...t.harmonized.map(e=>l({name:e,inNp:!0,inP:!0,isHarmonized:!0}))),s.push(...t.nonharmonized.map(e=>l({name:e.name,inNp:!0,inP:!0,isHarmonized:!1,harmonReason:e.reason})));for(let e=0;e<2;e++)s.push(...t.unrelated[e].map(a=>l({name:a,inNp:0==e,inP:1==e,isHarmonized:!1})));return s}static async fromData(){let[e,a]=[x("np_sample"),_("np_sample")];return a=new Set(await a),(await e).map(e=>new eb({name:e,inNp:!0,inP:!1,isNpNumeric:a.has(e)}))}refresh(){W.value?F.value?(this.areDual=!0,this.variablesPromise=ef.fromHarmonization):(this.areDual=!1,this.variablesPromise=ef.fromData):(this.areDual=null,this.variablesPromise=null),this.cache=null,this.event.dispatch()}}const eg=new ef;async function ey(e){return[await R("missing"),G.format(e[1])]}async function e$(e){return null==e[0]?ey(e):[await R(e[0]),j.format(e[1])]}async function eS(e){return null==e[0]?ey(e):[e[0],G.format(e[1])]}async function eE(e,a){return Promise.all(e.map(a?e$:eS))}function eL(e,a,t,i){if(!e.hasDetails&&a.checked){e.hasDetails=!0;let a="right"==i?t.pDetails():t.npDetails(),n="right"==i?t.isPNumeric:t.isNpNumeric,s=l('<section class="details"></section>');a.then(async a=>{a=await eE(a,n),s.append(...a.map(e=>l(`<article><span>${e[0]}</span><span>${e[1]}</span></article>`))),e.append(s)})}}async function ek(e){let a=l('<button class="button reversed"></button>');async function t(){a.innerHTML=e.hasTotals.value?await R("editTotals"):await R("insertTotals")}return e.hasTotals.subscribe(a,t),t(),a}function ex(e,a,t){let i=[l(`<span>${e}</span>`),l('<label><input type="number" step="any" required/></label>')],n=i[1].querySelector("input");return a&&(n.valueAsNumber=a),t&&(n.readOnly=!0),i}async function e_(e){let a=await e.npDetails(),t=l(`<section class="totals-container${e.isHarmonized?"":" single"}" style="--items: ${e.isNpNumeric?1:a.length}">
		<article class="totals-article">
			<h4>${await R("totals1")}</h4>
			<h5>${e.name}</h5>
			<section class="totals-items"></section>
		</article>
	</section>`),i=t.querySelector(".totals-items"),n=e.getTotals();if(e.isNpNumeric)i.append(...ex(await R("total"),n));else for(let[e]of a)i.append(...ex(e,n?.get(e)));if(e.isHarmonized){let n=l(`<article class="totals-article">
			<h4>${await R("totals2")}</h4>
			<h5>${e.name}</h5>
			<section class="totals-items"></section>
		</article>`);t.append(n),n=n.querySelector(".totals-items");let s=await e.inferredTotals();if(e.isPNumeric)n.append(...ex(await R("total"),s,!0));else for(let[e,a]of s)n.append(...ex(e,a,!0));let r=l(`<button class="button reversed">${await R("inferTotals")}</button>`);r.addEventListener("click",()=>(function(e,a,t,i){let n=e.querySelectorAll("input");if(i)n[0].valueAsNumber=t;else for(let e=0;e<a.length;e++)n[e].valueAsNumber=t.get(a[e][0])})(i,a,s,e.isPNumeric)),t.querySelector(".totals-article").append(r)}return t}async function eq(e,a,t){let i=[...e.querySelectorAll("input")];if(i.every(e=>!e.value))a.deleteTotals(),t.close();else if(i.every(e=>e.reportValidity())){if(a.isNpNumeric)a.setTotals(i[0].valueAsNumber);else{let e=await a.npDetails();a.setTotals(new Map(e.map((e,a)=>[e[0],i[a].valueAsNumber])))}t.close()}}async function eT(e){let a=l(`<dialog class="modal">
		<div class="modal-top">
			<header>
				<h3>${await R("editTotals")}</h3>
				<p>${await R("editTotalsSubtitle")}</p>
			</header>
			<button class="close-button"><img src="images/close.svg" data-inline/></button>
		</div>
		<section class="totals-container"></section>
		<section class="buttons-row">
			<button class="button reversed minimal" disabled>${await R("deleteTotals")}</button>
			<section>
				<button class="button reversed minimal">${await R("cancel")}</button>
				<button class="button" disabled>${await R("setTotals")}</button>
			</section>
		</section>
	</dialog>`),[t,i,n]=a.querySelectorAll(".button");return a.addEventListener("open",async()=>{(await e.npDetails()).some(e=>null==e[0])?(U(await R("missingError")),a.close()):(a.querySelector(".totals-container").replaceWith(await e_(e)),n.disabled=!1,t.disabled=!1)}),i.addEventListener("click",()=>a.close()),n.addEventListener("click",()=>eq(a.querySelector(".totals-items"),e,a)),t.addEventListener("click",()=>{a.querySelector(".totals-items").querySelectorAll("input").forEach(e=>e.value="")}),a}async function eN(e){let a=await ek(e),t=await eT(e);return a.addEventListener("click",()=>{t.showModal(),t.dispatchEvent(new Event("open"))}),[a,t]}async function eP(e){let a=l(`<header class="variable header">
		<label class="expand-arrow icon">
			<input type="checkbox" hidden/>
			<img src="images/arrow-right.svg" data-inline/>
			<img src="images/arrow-down.svg" data-inline/>
		</label>
		<div class="border"></div>
		<span>${await R("variables")}</span>
	</header>`);"single"!=e&&a.classList.add(e),"right"!=e&&a.querySelector(".border").after(l(`<label class="checkbox icon">
			<input type="checkbox" hidden/>
			<img src="images/check.svg"/>
		</label>`));let t=await eg.filtered(a=>a["right"==e?"inP":"inNp"]),[i,n]=a.querySelectorAll("input");i.addEventListener("change",()=>{t.forEach(e=>{e.expanded.value!=i.checked&&(e.expanded.value=i.checked)})}),n?.addEventListener("change",()=>{t.forEach(e=>{e.selectable.value&&e.selected.value!=n.checked&&(e.selected.value=n.checked)})});let s=I(()=>i.checked=t.every(e=>e.expanded.value)),r=I(()=>{let e=t.filter(e=>e.selectable.value);n.checked=e.length&&e.every(e=>e.selected.value)});for(let e of t)e.expanded.subscribe(a,s),n&&(e.selected.subscribe(a,r),e.selectable.subscribe(a,r));return s(),n&&r(),a}async function eM(e){let a=l('<article class="variable-status"></article>');return e.isHarmonized?a.innerHTML='<img width="24" height="24" src="images/check-circle.svg"/>':e.harmonReason?a.innerHTML=`<span class="lead left"><img src="images/lead.svg"/><span class="tooltip">${await R(e.harmonReason+"Reason")}</span></span><img src="images/check-yellow.svg"/>`:a.innerHTML='<img src="images/block.svg"/>',a}async function ez(e,a){let t=l(`<article class="variable view ${"single"!=a?a:""} ${e.isHarmonized?"harmonized":""}">
		<label class="expand-arrow icon">
			<input type="checkbox" hidden/>
			<img src="images/arrow-right.svg" data-inline/>
			<img src="images/arrow-down.svg" data-inline/>
		</label>
		<div class="border"></div>
		<span>${e.name}</span>
	</article>`),i=t.querySelector("input");if(i.checked=e.expanded.value,i.addEventListener("change",()=>e.expanded.value=i.checked),e.expanded.subscribe(t,()=>{i.checked=e.expanded.value,eL(t,i,e,a)}),"right"!=a){let a,i;t.querySelector(".border").after(((i=(a=l(`<label class="checkbox icon">
		<input type="checkbox" hidden/>
		<img src="images/check.svg"/>
	</label>`)).querySelector("input")).checked=e.selected.value,i.disabled=!e.selectable.value,i.addEventListener("change",()=>e.selected.value=i.checked),e.selected.subscribe(a,()=>i.checked=e.selected.value),e.selectable.subscribe(a,()=>i.disabled=!e.selectable.value),a))}return"right"==a?t.append(await eM(e)):t.append(...await eN(e)),eL(t,i,e,a),t}function eD(){return l('<div class="border"></div>')}function eW(e,a,t){e.expanded.subscribe(t,()=>{a.expanded.value!=e.expanded.value&&(a.expanded.value=e.expanded.value)})}async function eF(){let e=[];if(eg.areDual){e.push(await eP("left"),eD(),await eP("right"));let[a,t,i]=await Promise.all([eg.common(),eg.npOnly(),eg.pOnly()]),n=Math.max(t.length,i.length);for(let t of a)e.push(await ez(t,"left"),eD(),await ez(t,"right"));for(let a=0;a<n;a++){let n,s;t[a]&&(n=await ez(t[a],"left"),e.push(n)),e.push(eD()),i[a]&&(s=await ez(i[a],"right"),e.push(s)),t[a]&&i[a]&&(eW(t[a],i[a],n),eW(i[a],t[a],s))}}else{e.push(await eP("single"));let a=(await eg.variables()).map(e=>ez(e,"single"));e.push(...await Promise.all(a))}return e}async function eH(){let e;eg.variables().catch(async e=>{console.error(e),U(await R("loadFileFinalError")),z.value="load"});let a=l('<main class="main-content"></main>');if(eg.areDual){if(e=l('<section class="dual-container"></section>'),"string"==typeof D.value){let e=(await R("estimatedWeightSubtitle")).replace("$name",D.value);a.append(X(await R("estimatedWeightTitle"),e))}else if(D.value){let e=(await R("loadedFilesSubtitle")).replace("$nVars",(await eg.harmonized()).length);a.append(X(await R("loadedFilesTitle"),e))}}else e=l('<section class="dual-container single"></section>');return e.append(...await en()),e.append(...await eF()),a.append(e),B(a),D.value=!1,eg.subscribe(a,async()=>a.replaceWith(await eH())),a}async function eA(){let e=await ec();return e.querySelector("main").replaceWith(await eH()),e}W.addGlobalListener(()=>eg.refresh()),F.addGlobalListener(()=>eg.refresh()),eg.refresh();const eO=h("inps",!0).then(()=>m("import inps",!0));function eC(e,a){return a?`, ${e} = ${JSON.stringify(a)}`:""}async function eR(e,a,t,i,n){await Promise.all([b,eO]),await m(`
		from js import my_totals
		temp_sample, temp_totals = utils.prepare_calibration(${a}, my_totals.to_py()${eC("weights_var",i)})
	`,!1,{my_totals:t});let s=`${eC("weights_column",i)}${eC("population_size",n)}`;await m(`${a}["${e}"] = inps.calibration_weights(temp_sample, temp_totals${s})`),await m("del temp_sample, temp_totals")}async function eV(e,a,t,i,n,s,l,r){await eO;let o=`${eC("weights_column",i)}${eC("population_size",n)}${eC("covariates",s)}`;l&&(o+=", model = inps.boosting_classifier()"),await m(`${a}["${e}"] = inps.${r?"kw":"psa"}_weights(${a}, ${i?`${t}.dropna(subset = "${i}")`:t}${o})${r?"":'["np"]'}`)}async function ej(e,a,t,i,n,s,l){await Promise.all([b,eO]);let r=`${eC("weights_var",a)}${eC("method",t)}${eC("covariates",s)}${eC("p_weights_var",l)}`;return m(`utils.estimation(${i}, '${e}'${", p_sample = "+n}${r})`)}class eG{constructor(){this.name=R("calibration"),this.title=R("M\xe9todo de calibraci\xf3n"),this.description=R("calibrationDescription"),this.variables=eg.filtered(e=>e.selected.value&&e.hasTotals.value),this.acceptsOrig=!0}async estimate(e,a,t){if(!a&&!t)throw this.errorMsg=R("calibrationMissing"),Error("Info missing");this.errorMsg=R("calibrationError");let i=new Map((await this.variables).map(e=>[e.name,e.getTotals()]));await eR(e,"np_sample",i,t,a),W.event.dispatch()}}class eI{constructor(e,a){this.boosted=e,this.kernels=a;let t=a?"kw":"psa";e&&(t+="Boost"),this.name=R(t),this.title=R(t+"Title"),this.description=R(t+"Description"),this.errorMsg=R(t+"Error"),this.variables=eg.filtered(e=>e.selected.value&&e.isHarmonized),this.acceptsOrig=!1}async estimate(a,t,i){let n=(await this.variables).map(e=>e.name);await eV(a,"np_sample","p_sample",e,t,n,this.boosted,this.kernels),W.event.dispatch()}}async function eB(){return l(`<main class="main-content">
		<header>
			<h2>${await R("weightTitle")}</h2>
			<h3>${W.value}</h3>
		</header>
		<main class="empty-content">
			<p>${await R("emptyDescription")}</p>
			<img src="images/empty.svg"/>
			<span>${await R("emptyTitle")}</span>
		</main>
	</main>`)}async function eU(e){let a=l(`<section class="vars-table">
		<article>${await R("activeVars")}</article>
	</section>`);for(let t of e)a.append(l(`<article>${t}</article>`));return a}async function eJ(){let e=l(`<main class="main-content">
		<header>
			<h2>${await R("weightTitle")}</h2>
			<h3>${W.value}</h3>
		</header>
		<form class="weight-form">
			<section class="inputs">
				<label for="method">
					<span>${await R("method")}</span>
					<span class="lead">
						<img src="images/lead.svg"/>
						<span class="tooltip">
							<h4>${await R("methodTitle")}</h4>
							<p>${await R("methodDescription")}</p>
						</span>
					</span>
				</label>
				<select id="method" required>
					<option value="" hidden>${await R("methodPlaceholder")}</option>
				</select>
				<article class="extra">
					<span>${await R("methodExplain")}</span>
					<span class="lead">
						<img src="images/lead.svg"/>
						<span class="tooltip">
							<h4>${await R("methodExplainTitle")}</h4>
							<p>${await R("methodExplainDescription")}</p>
						</span>
					</span>
				</article>
				<label for="orig-weights" hidden>
					<span>${await R("origWeights")}</span>
					<span class="lead">
						<img src="images/lead.svg"/>
						<span class="tooltip">
							<h4>${await R("origWeightsTitle")}</h4>
							<p>${await R("origWeightsDescription")}</p>
						</span>
					</span>
				</label>
				<select id="orig-weights" hidden>
					<option value="">${await R("uniformWeights")}</option>
				</select>
				<label for="pop-size">
					<span>${await R("popSize")}</span>
					<span class="lead">
						<img src="images/lead.svg"/>
						<span class="tooltip">
							<h4>${await R("popSizeTitle")}</h4>
							<p>${await R("popSizeDescription")}</p>
						</span>
					</span>
				</label>
				<input id="pop-size" type="number" placeholder="${await R("popSizePlaceholder")}"/>
			</section>
			<section class="vars-table" hidden></section>
			<a hidden>${await R("changeVars")}</a>
			<section class="inputs single">
				<label for="new-var-name">${await R("newVar")}</label>
				<input id="new-var-name" type="text" placeholder="${await R("newVarPlaceholder")}" required/>
			</section>
			<button class="button" type="button">${await R("weightButton")}</button>
		</form>
	</main>`);function t(a){return e.querySelector(a)}let[i,n,s]=["#method",".extra h4",".extra p"].map(t),r=["#orig-weights",'[for="orig-weights"]'].map(t),o=["#pop-size",'[for="pop-size"]'].map(t),c=t(".vars-table + a"),d=t("#new-var-name"),p=t("button"),u=await a;for(let a of(r[0].append(...(await eg.filtered(e=>e.isNpNumeric)).map(e=>l(`<option>${e.name}</option>`))),u&&(o[0].valueAsNumber=u),c.addEventListener("click",()=>z.value="data"),p.onclick=()=>i.reportValidity(),[new eG,new eI,new eI(!0),new eI(!1,!0),new eI(!0,!0)])){let t=await a.variables;if(t.length){let[u,m,h]=await Promise.all([a.name,a.title,a.description]);i.append(l(`<option>${u}</option>`)),i.addEventListener("change",async()=>{i.value==u&&(n.innerHTML=m,s.innerHTML=h,function(e,a,t){e.forEach(e=>e.hidden=!t),e[0].onchange=()=>a.forEach(a=>a.hidden=t&&!!e[0].value),e[0].onchange()}(r,o,a.acceptsOrig),e.querySelector(".vars-table").replaceWith(await eU(t.map(e=>e.name))),c.hidden=!1,p.onclick=async()=>{if(d.reportValidity()&&(o[0].hidden||o[0].reportValidity())){let t=await J(await R("weightLoading"));e.append(t),t.showModal(),a.estimate(d.value,o[0].valueAsNumber,r[0].value).then(()=>{D.value=d.value,z.value="data"}).catch(async e=>{console.error(e),U(await a.errorMsg),t.remove()})}})})}}return i.dispatchEvent(new Event("change")),e}async function eX(){return(await eg.variables()).some(e=>e.selected.value)?eJ():eB()}async function eK(){let e=await ec();return e.querySelector("main").replaceWith(await eX()),e}function eQ(e,a){return l(`<option${a?` value="${a}"`:""}>${e}</option>`)}async function eY(e,a,t,i=!1){let n=l(`<label>
		<span>${a}</span>
		<select id="${e}"${i?" disabled":""}>
			<option value="">${await R("uniformWeights")}</option>
		</select>
	</label>`);return n.querySelector("select").append(...t.map(e=>eQ(e))),n}async function eZ(e,a,t,i=!1){let n=l(`<label>
		<span>${a}</span>
		<span class="lead"><img src="images/lead.svg"/><span class="tooltip">${await R("estimationMethodDescription")}</span></span>
		<select id="${e}"${i?" disabled":""}>
			<option value="">${await R("noMatching")}</option>
		</select>
	</label>`);return t&&n.querySelector("select").append(eQ(await R("linearMatching"),"linear"),eQ(await R("boostedMatching"),"boosting")),n}async function e0(e,a){let t=await a;return e.replaceWith(t),t.querySelector("select")}async function e1(e){let a=l(`<section class="selectors">
		<section class="row">
			<label>
				<span>${await R("targetVar")}</span>
				<select id="target-var" required>
					<option value="" hidden>${await R("selectVar")}</option>
				</select>
			</label>
			<label id="weights-var"></label>
			<label id="estimation-method"></label>
		</section>
		<div class="border"></div>
		<section class="row">
			<label>
				<span>${await R("compare")}</span>
				<div class="switch"><input id="compare" type="checkbox" hidden/></div>
			</label>
			<label id="compare-var"></label>
			<label id="compare-method"></label>
			<button id="estimate" class="button compact" disabled>${await R("estimate")}</button>
		</section>
	</section>`),[t,i,n,s,r,o,c]=["target-var","weights-var","compare-var","estimation-method","compare-method","compare","estimate"].map(e=>a.querySelector("#"+e)),d=await eg.variables(),p=d.filter(e=>e.isNpNumeric).map(e=>e.name);t.append(...d.map(e=>eQ(e.name))),i=await e0(i,eY("weights-var",await R("weightsVar"),p)),n=await e0(n,eY("compare-var",await R("compareVar"),p,!0));let u=d.some(e=>e.isHarmonized&&e.selected.value);function m(){c.disabled=!t.value}for(let e of(s=await e0(s,eZ("estimation-method",await R("estimationMethod"),u)),r=await e0(r,eZ("compare-method",await R("compareMethod"),u,!0)),o.onchange=()=>{n.disabled=!o.checked,r.disabled=!o.checked},[t,i,n,s,r,o]))e.addEventListener("change",m);return c.onclick=()=>{c.disabled=!0,e(t.value,i.value,s.value,o.checked,n.value,r.value)},a}async function e2(e,a,t){let i="data"in a,n=[[e]],s=t?2:1,l=!!t;if(t){let e=["",await R("mainEstimation"),await R("altEstimation")];i&&e.unshift(""),n.push(e)}let r=i?"percentageEstimation":"numericEstimation",o=i?"pertentageInterval":"numericInterval";[r,o]=await Promise.all([r,o].map(R));let c=i?G:j;if(i){function d(e){return[c.format(e[0]),""]}function p(e){return[e[1],e[2]].map(e=>c.format(e))}for(let e=0;e<a.index.length;e++){let i=[a.index[e],r];i.push(...d(a.data[e]));let s=["",o];if(s.push(...p(a.data[e])),t){let n=t.index.indexOf(a.index[e]);i.push(...d(t.data[n])),s.push(...p(t.data[n]))}n.push(i,s)}}else{let e=[r,c.format(a.estimation),""];t&&e.push(c.format(t.estimation),"");let i=[o,c.format(a.interval_lower),c.format(a.interval_upper)];t&&i.push(c.format(t.interval_lower),c.format(t.interval_upper)),n.push(e,i)}return[n,s,i?2:1,l]}async function e4(a,t,i,n,s,r){let o,c,d;(i||r)&&(d=(await eg.filtered(e=>e.isHarmonized&&e.selected.value)).map(e=>e.name)),o=ej(a,t,i,"np_sample","p_sample",d,e),n&&(c=ej(a,s,r,"np_sample","p_sample",d,e)),[o,c]=await Promise.all([o,c]);let p=l(`<main class="estimation-results">
		<article>
			<h4>${await R(n?"comparedHeader":"estimationHeader")}</h4>
		</article>
	</main>`);return p.querySelector("article").append(function(e,a,t,i){let n=l(`<section class="estimation-table" style="--columns: ${e[e.length-1].length}"></section>`);for(let s=0;s<e.length;s++){let r=e[s],o=l(`<div class="row${s<a?" titles":""}"></div>`);for(let e=0;e<r.length;e++){let n=l(`<article>${r[e]}</article>`);(s<a||e<t)&&(n.classList.add("title"),i&&s==a-1&&e>=r.length-2&&n.classList.add("expanded")),o.append(n)}n.append(o)}return n}(...await e2(a,o,c))),p}async function e3(){let e=l(`<main class="main-content">
		<header>
			<h2>${await R("estimationTitle")}</h2>
			<h3>${W.value}</h3>
		</header>
		<section class="selectors"></section>
		<main class="empty-content">
			<p>${await R("emptyEstimation")}</p>
			<img src="images/empty.svg"/>
			<span>${await R("emptyTitle")}</span>
		</main>
	</main>`);async function a(...t){let i=await J(await R("estimationLoading"));e.append(i),i.showModal(),await e4(...t).then(a=>e.querySelector("main").replaceWith(a)).catch(async a=>{console.error(a),U(await R("estimationError")),e.querySelector("#estimate").disabled=!1}),i.remove()}return e.querySelector(".selectors").replaceWith(await e1(a)),e}async function e5(){let e=await ec();return e.querySelector("main").replaceWith(await e3()),e}async function e6(){let e;scrollTo(0,0);let a=t=n();if("load"==z.value)e=eh();else if("data"==z.value)e=eA();else if("weight"==z.value)e=eK();else if("estimation"==z.value)e=e5();else throw Error(`Invalid screen: ${z.value}`);e=await e,a==t&&document.querySelector(".main-container > main").replaceWith(e)}z.addGlobalListener(e6),e6();