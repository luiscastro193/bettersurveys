let e,a,t,i=0;function s(){return i=(i+1)%Number.MAX_SAFE_INTEGER}async function n(e,a){let t=await fetch(e,a);if(t.ok)return t;throw t}function l(e){let a=document.createElement("template");return a.innerHTML=e.trim(),a.content.firstChild}class r{constructor(){this.event=new EventTarget,this.aux=new Event("e")}addListener(e,a){let t=this.event;e.myCallbacks?e.myCallbacks.push(a):e.myCallbacks=[a];let i=[new WeakRef(e),new WeakRef(a)];t.addEventListener("e",function e(){let[a,s]=i.map(e=>e.deref());a&&s&&(document.contains(a)?s():t.removeEventListener("e",e))})}addGlobalListener(e){this.event.addEventListener("e",e)}dispatch(){this.event.dispatchEvent(this.aux)}}class o{constructor(e){this.variable=e,this.event=new r}get value(){return this.variable}set value(e){this.variable=e,this.event.dispatch()}subscribe(e,a){this.event.addListener(e,a)}addGlobalListener(e){this.event.addGlobalListener(e)}}const c=new Worker("assets/webworker.js",{type:"module"}),d=new Map;async function u(){new Promise(e=>setTimeout(e))}async function p(){return new Promise(async e=>{await u(),d.size?c.addEventListener("message",async function a(){await u(),d.size||(c.removeEventListener("message",a),e())}):e()})}async function h(e,a,t){a&&await p();let i=s();return new Promise((a,s)=>{d.set(i,{onSuccess:a,onError:s}),c.postMessage({python:e,id:i,...t})})}async function m(e,a){return h(`
		import micropip
		micropip.install(${JSON.stringify(e)})
	`,a)}function w(e){return`await (await pyfetch("${e}")).memoryview()`}async function v(e,a,t){return h(`
		from pyodide.http import pyfetch
		with open("${a}", "wb") as my_file:
			my_file.write(${w(e)})
	`,t)}c.onmessage=function(e){let{id:a,...t}=e.data,{onSuccess:i,onError:s}=d.get(a);d.delete(a),Object.hasOwn(t,"error")?s(t.error):i(t.result)};const b=(async()=>{let e;await v(`${(e=location.pathname).endsWith("/")?e:e+"/"}assets/utils.py`,"utils.py"),await h("import utils")})(),f=m("openpyxl");async function g(e,a){await f,await h(`
		from pyodide.http import pyfetch
		from io import BytesIO
		import pandas as pd
		${a} = pd.read_excel(BytesIO(${w(e)}), engine = "openpyxl")
	`)}async function y(e,a){let t=URL.createObjectURL(e);await g(t,a),URL.revokeObjectURL(t)}async function $(e,a){var t,i;let s;await f,await b,t=await h(`utils.to_excel(${e})`),i=`${a}.xlsx`,(s=document.createElement("a")).href=t,s.download=i,document.body.append(s),s.click(),URL.revokeObjectURL(t),s.remove()}async function S(e,a){return y(e,a)}async function E(e,a,t){if("Excel"==t)return $(e,a);throw Error(`Invalid extension: ${t}`)}async function L(e,a){return h(`
		${a} = ${e}
		del ${e}
	`)}async function k(e){return h(`del ${e}`)}async function T(e){return h(`${e}.columns.tolist()`)}async function x(e){return await b,h(`utils.num_vars(${e})`)}function N(e,a){return e&&e!=a?`, "${e}"`:""}async function q(e,a,t){return await b,h(`utils.harmonized_variables(${e}, ${a}${N(t)})`)}async function _(e,a,t,i){return await b,h(`utils.${a?"numeric":"categories"}_details("${e}", ${t}${N(i,e)})`)}async function P(e,a,t,i){await b;let s=await h(`utils.${a?"numeric":"categories"}_inferred_totals("${e}", ${t}${N(i)})`);return a?s:new Map(s)}async function z(e,a){return await b,await h(`utils.pop_total(${e}${N(a)})`)}f.then(()=>h("import openpyxl"));const D=new o("load"),M={value:!1},F=new o,W=new o;class H{constructor(e){this.targetName=e,this.event=new r}subscribe(e,a){this.event.addListener(e,a)}cancel(e){if(this[e]){let a=this[e].id;this[e].loadPromise.then(()=>k(a)),this[e]=null,this.event.dispatch()}}loadTemp(e){this.cancel("temp");let a={id:`temp${s()}`,filename:e.name};return a.loadPromise=S(e,a.id),this.temp=a,this.event.dispatch(),a.loadPromise.then(()=>{a.id==this.temp?.id&&(a.loaded=!0,this.event.dispatch())}).catch(e=>{if(a.id==this.temp?.id)throw console.error(e),this.temp=null,this.event.dispatch(),e})}confirmTemp(){this.cancel("final"),this.final=this.temp,this.temp=null,this.event.dispatch()}confirmFinal(){let a=this.final;return this.final=null,this.event.dispatch(),L(a.id,this.targetName).then(()=>{let t=a.filename.replace(/\.[^.]+$/,"");if("np_sample"==this.targetName)F.value=t;else if("p_sample"==this.targetName)e=a.weights,W.value=t;else throw Error(`Invalid name: ${this.targetName}`)})}}const A=new H("np_sample"),O=new H("p_sample");for(let e of[A,O])D.addGlobalListener(()=>e.cancel("final"));W.addGlobalListener(()=>{a=W.value&&z("p_sample",e)});const C=n("assets/texts.json").then(e=>e.json());async function R(e){return C.then(a=>a[e])}function j(e){let a=!1;return()=>{a||(a=!0,setTimeout(()=>{a=!1,e()}))}}function G(e){for(let a of e.querySelectorAll("dialog"))a.querySelector(".close-button").onclick=()=>a.close()}async function I(e){let a=l(`<dialog class="modal error">
		<button class="close-button"><img src="images/close.svg" data-inline/></button>
		<img src="images/error.svg">
		<article>
			<h4>${await R("error")}</h4>
			<p>${e}</p>
		</article>
		<button class="button" autofocus>${await R("acceptError")}</button>
	</dialog>`);a.querySelectorAll("button").forEach(e=>e.addEventListener("click",()=>a.close())),a.addEventListener("close",()=>a.remove()),document.body.append(a),a.showModal()}async function V(e){let a=l(`<dialog class="modal loading">
		<img src="images/loading.svg"/>
		<p>${await R("loading")}</p>
		<p>${e}</p>
	</dialog>`);return a.addEventListener("cancel",e=>e.preventDefault()),a.addEventListener("close",()=>a.showModal()),a}function B(e,a){let t=l(`<article class="feedback">
		<img src="images/check-circle.svg"/>
		<div>
			<h3>${e}</h3>
			<p>${a}</p>
		</div>
		<button class="close-button"><img src="images/close.svg" data-inline/></button>
	</article>`);return t.querySelector(".close-button").addEventListener("click",()=>t.remove()),t}const U=[A,O];function J(e,a){let t=l(e[a]?`<article class="uploaded-file">
			<span>${e[a].filename}</span>
			<button class="close-button"><img src="images/close.svg" data-inline/></button>
			<progress ${e[a].loaded?'value = "1"':""}></progress>
		</article>`:'<article class="uploaded-file" hidden></article>');return t.querySelector(".close-button")?.addEventListener("click",()=>e.cancel(a)),e.subscribe(t,()=>t.replaceWith(J(e,a))),t}async function X(e){let a=l(`<select name="weights-var">
		<option value="">${await R("noWeights")}</option>
	</select>`);return e?a.append(...e.map(e=>l(`<option>${e}</option>`))):a.disabled=!0,a}async function K(e){let a=l(`<section class="modal-input">
		<div class="modal-input-top">
			<h4>${await R("loadFile2Subaction")}</h4>
			<span class="lead"><img src="images/lead.svg"/><span class="tooltip">${await R("loadFile2SubactionHelp")}</span></span>
		</div>
		<select></select>
		<p>${await R("loadFile2SubactionSubtitle")}</p>
	</section>`);async function t(e){let t=await X(e);return a.querySelector("select").replaceWith(t),t}return t(),e.subscribe(a,async()=>{let a=e.temp;if(a?.loaded){let i=await x(a.id);if(a.id==e.temp?.id){let e=await t(i);e.addEventListener("change",()=>a.weights=e.value)}}else t()}),a}async function Q(e){let a=l(`<dialog class="modal">
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
	</dialog>`),t=U[e-1];a.querySelector(".button.reversed.minimal").addEventListener("click",()=>a.close());let i=a.querySelector("input[type=file]");i.addEventListener("change",()=>{t.loadTemp(i.files[0]).catch(async e=>I(await R("loadFileError")))}),i.addEventListener("click",()=>i.value=""),a.querySelector(".uploaded-file").replaceWith(J(t,"temp"));let s=a.querySelector(".buttons-row > .button:last-of-type");return t.subscribe(s,()=>s.disabled=!t.temp?.loaded),s.addEventListener("click",()=>{t.confirmTemp(),a.close()}),2==e&&a.querySelector(".uploaded-file").after(await K(t)),a.addEventListener("close",()=>t.cancel("temp")),a}async function Y(e){let a=l(`<label class="radio-label">
		<input type="radio" name="load-type">
		<h3>${await R(`loadOption${e}`)}</h3>
		<p>${await R(`loadOption${e}Subtitle`)}</p>
		<article class="radio-file">
			<img src="images/empty.svg"/>
			<p>${await R("fileSelect")}</p>
			<article class="uploaded-file" hidden></article>
			<button class="button small"><span class="icon"><img src="images/upload.svg" data-inline/></span><span>${await R("fileButton")}</span></button>
		</article>
	</label>`),t=U[e-1];a.querySelector(".radio-file").append(await Q(e)),a.querySelector(".uploaded-file").replaceWith(J(t,"final"));let i=a.querySelector(".button:has(+ dialog)");i.addEventListener("click",()=>i.nextElementSibling.showModal());let s=new o(t.final?.loaded);return t.subscribe(a,()=>s.value=t.final?.loaded),s.subscribe(i,()=>i.disabled=s.value),[a,s,()=>t.confirmFinal()]}async function Z(e){let a=l(`<dialog class="modal">
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
	</dialog>`),t=a.querySelector("input"),i=a.querySelector("select"),[s,n]=a.querySelectorAll(".button");function r(){n.disabled=!(t.value&&i.value)}return t.addEventListener("input",r),i.addEventListener("change",r),s.addEventListener("click",()=>a.close()),n.addEventListener("click",async()=>{let s=await V(await R("downloadLoading"));a.append(s),s.showModal(),E(1==e?"np_sample":"p_sample",t.value,i.value).then(()=>{a.close()}).catch(async e=>{console.error(e),I(await R("downloadError"))}).finally(()=>s.remove())}),r(),a}async function ee(a){if("left"==a||"right"==a){let t="left"==a?1:2,i=await R(`loadFile${t}Title`),s="left"==a?F.value:W.value,n=l(`<header class="dual-header ${a}">
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
			<p>${s}</p>
			<div class="border"></div>
		</header>`);"right"==a&&n.append(l(`<article>
				<span>${await R("weightsVar")}</span>
				<span>${e||await R("noWeights")}</span>
			</article>`));let r=n.querySelectorAll("nav > a"),o=await Promise.all([Q(t),Z(t)]),c=U[t-1];c.subscribe(n,async()=>{if(c.final){let e=await V(await R("loadFileLoading"));n.append(e),e.showModal(),c.confirmFinal()}});for(let e=0;e<o.length;e++)n.append(o[e]),r[e].addEventListener("click",()=>o[e].showModal());return n}if("single"==a)return l(`<header class="single-header"><h2>${await R("loadFile1Title")}</h2><p>${F.value}</p></header>`);throw Error(`Invalid type: ${a}`)}async function ea(){let e=[];return W.value?e.push(await ee("left"),l('<div class="border"></div>'),await ee("right")):e.push(await ee("single")),e}const et=["load","data","weight"];async function ei(e,a){let t=l('<nav class="tabs"></nav>');t.append(...await Promise.all(et.map(async e=>l(`<button>${await R(e+"Tab")}</button>`)))),e=et.indexOf(e),t.children[e].classList.add("active");for(let i=0;i<t.children.length;i++){let s=t.children[i];s.addEventListener("click",()=>D.value=et[i]),a||i==e||(s.disabled=!0)}return t}async function es(e,a,t){let i=l(`<a>${await R("export"+t)}</a>`),s=await Z(t);e.append(i),a.append(s),i.addEventListener("click",()=>s.showModal())}async function en(){let e=l(`<article class="main-title-buttons">
		<label class="dropdown-button">
			<span>${await R("download")}</span>
			<span class="icon"><img src="images/arrow-down.svg" data-inline/></span>
			<input type="checkbox" hidden/>
			<nav class="dropdown from-button color"></nav>
		</label>
	</article>`),a=e.querySelector(".dropdown");return F.value&&await es(a,e,1),W.value&&await es(a,e,2),G(e),e}async function el(){let e=l(`<main class="main-section">
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
	</main>`);return e.querySelector(".tabs").replaceWith(await ei(D.value,F.value)),F.value&&e.querySelector(".main-title").append(await en()),e}async function er(e){let a=l(`<label class="radio-label">
		<input type="radio" name="load-type">
		<h3>${await R("noFileTitle")}</h3>
		<p>${await R("noFileSubtitle")}</p>
		<article class="radio-file">
			<img src="images/data.svg"/>
			<p>${await R("noFileSubSubtitle")}</p>
			<button class="button small adjusted"><span>${await R("noFileConfirm")}</span><span class="icon"><img src="images/arrow-right.svg" data-inline/></span></button>
		</article>
	</label>`),t=a.querySelector("button");t.addEventListener("click",()=>{t.disabled=!0,e.click()});let i=async()=>{W.value&&(await k("p_sample"),W.value=null)};return[a,new o(!0),i]}const eo=[,,];async function ec(e){return 1==e?`<button class="button" disabled>${await R("next")}</button>`:`<section class="buttons-row">
			<button class="button reversed minimal">${await R("back")}</button>
			<button class="button" disabled>${await R("loadFileConfirm")}</button>
		</section>`}async function ed(e=1){let a=l(`<main class="main-content">
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
			${await ec(e)}
			<label class="radio-label"></label>
			${await ec(e)}
		</main>`),t=a.querySelectorAll(".data-load-content > .button, .data-load-content > .buttons-row > .button:last-of-type"),i=a.querySelector(".radio-label"),s=[Y(e)];for(let[a,l,r]of(2==e&&s.push(er(t[0])),s=await Promise.all(s),i.after(...s.map(e=>e[0])),s)){let i=a.querySelector("input");for(let a of t){function n(){i.checked&&(a.disabled=!l.value,eo[e-1]=r)}i.addEventListener("change",n),l.subscribe(a,n)}}for(let i of t)i.addEventListener("click",async()=>{if(i.disabled=!0,e<2)a.replaceWith(await ed(e+1));else{let e=await V(await R("loadFileLoading"));a.append(e),e.showModal(),await Promise.all(eo.map(e=>e())),M.value=!0,D.value="data"}});return a.querySelectorAll(".data-load-content > .buttons-row > .button:first-of-type").forEach(t=>{t.addEventListener("click",async()=>{t.disabled=!0,a.replaceWith(await ed(e-1))})}),i.remove(),G(a),a}async function eu(){let e=await el();return e.querySelector("main").replaceWith(await ed()),e}let ep=new class{constructor(){this.cache=new Map}set(e,a){this.cache.set(a.name,e),a.hasTotals.value=!0}delete(e){this.cache.delete(e.name),e.hasTotals.value=!1}async verify(e,a){let t=await a.npDetails();return!t.some(e=>null==e[0])&&(a.isNpNumeric?"number"==typeof e:t.length==e.size&&t.every(a=>e.has(a[0])))}async refresh(e){let a=this.cache;for(let t of(this.cache=new Map,e)){let e=a.get(t.name);e&&await this.verify(e,t)&&this.set(e,t)}}},eh=new class{constructor(){this.cache=new Set}refresh(e){let a=this.cache;for(let t of(this.cache=new Set,e))t.selected.addGlobalListener(()=>{t.selected.value?this.cache.add(t.name):this.cache.delete(t.name)}),t.selected.value=t.selectable.value&&a.has(t.name)}};class em{static baseProperties=["name","inNp","inP","isNpNumeric","isPNumeric","isHarmonized","harmonReason","pWeights"];constructor(e){for(let a of em.baseProperties)this[a]=e[a];this.selected=new o(!1),this.expanded=new o(!1),this.hasTotals=new o(!1),this.selectable=new o(this.isHarmonized),this.hasTotals.addGlobalListener(()=>this.selectable.value=this.isHarmonized||this.hasTotals.value),this.selectable.addGlobalListener(()=>{this.selected.value&&!this.selectable.value&&(this.selected.value=!1)})}async npDetails(){return this.npCache||(this.npCache=_(this.name,this.isNpNumeric,"np_sample")),this.npCache}async pDetails(){return this.pCache||(this.pCache=_(this.name,this.isPNumeric,"p_sample",e)),this.pCache}async inferredTotals(){return this.inferredCache||(this.inferredCache=P(this.name,this.isPNumeric,"p_sample",e)),this.inferredCache}getTotals(){return ep.cache.get(this.name)}setTotals(e){ep.set(e,this)}deleteTotals(){ep.delete(this)}}class ew{constructor(){this.event=new r}subscribe(e,a){this.event.addListener(e,a)}async variables(){return this.cache||(this.cache=this.variablesPromise().then(async e=>(await ep.refresh(e),eh.refresh(e),e))),this.cache}async filtered(e){return(await this.variables()).filter(e)}async harmonized(){return this.filtered(e=>e.isHarmonized)}async common(){return this.filtered(e=>e.inNp&&e.inP)}async npOnly(){return this.filtered(e=>e.inNp&&!e.inP)}async pOnly(){return this.filtered(e=>!e.inNp&&e.inP)}static async fromHarmonization(){let a=e,[t,i,s]=await Promise.all([q("np_sample","p_sample",a),x("np_sample"),x("p_sample")]);[i,s]=[i,s].map(e=>new Set(e));let n=[];function l(e){return new em({pWeights:a,isNpNumeric:i.has(e.name),isPNumeric:s.has(e.name),...e})}n.push(...t.harmonized.map(e=>l({name:e,inNp:!0,inP:!0,isHarmonized:!0}))),n.push(...t.nonharmonized.map(e=>l({name:e.name,inNp:!0,inP:!0,isHarmonized:!1,harmonReason:e.reason})));for(let e=0;e<2;e++)n.push(...t.unrelated[e].map(a=>l({name:a,inNp:0==e,inP:1==e,isHarmonized:!1})));return n}static async fromData(){let[e,a]=[T("np_sample"),x("np_sample")];return a=new Set(await a),(await e).map(e=>new em({name:e,inNp:!0,inP:!1,isNpNumeric:a.has(e)}))}refresh(){F.value?W.value?(this.areDual=!0,this.variablesPromise=ew.fromHarmonization):(this.areDual=!1,this.variablesPromise=ew.fromData):(this.areDual=null,this.variablesPromise=null),this.cache=null,this.event.dispatch()}}const ev=new ew;F.addGlobalListener(()=>ev.refresh()),W.addGlobalListener(()=>ev.refresh()),ev.refresh();const eb={maximumFractionDigits:2,minimumFractionDigits:2,maximumSignificantDigits:1,minimumSignificantDigits:1,roundingPriority:"morePrecision"},ef=Intl.NumberFormat(void 0,eb);eb.style="percent";const eg=Intl.NumberFormat(void 0,eb);async function ey(e){return[await R("missing"),eg.format(e[1])]}async function e$(e){return null==e[0]?ey(e):[await R(e[0]),ef.format(e[1])]}async function eS(e){return null==e[0]?ey(e):[e[0],eg.format(e[1])]}async function eE(e,a){return Promise.all(e.map(a?e$:eS))}function eL(e,a,t,i){if(!e.hasDetails&&a.checked){e.hasDetails=!0;let a="right"==i?t.pDetails():t.npDetails(),s="right"==i?t.isPNumeric:t.isNpNumeric,n=l('<section class="details"></section>');a.then(async a=>{a=await eE(a,s),n.append(...a.map(e=>l(`<article><span>${e[0]}</span><span>${e[1]}</span></article>`))),e.append(n)})}}async function ek(e){let a=l('<button class="button reversed"></button>');async function t(){a.innerHTML=e.hasTotals.value?await R("editTotals"):await R("insertTotals")}return e.hasTotals.subscribe(a,t),t(),a}function eT(e,a,t){let i=[l(`<span>${e}</span>`),l('<label><input type="number" step="any" required/></label>')],s=i[1].querySelector("input");return a&&(s.valueAsNumber=a),t&&(s.readOnly=!0),i}async function ex(e){let a=await e.npDetails(),t=l(`<section class="totals-container${e.isHarmonized?"":" single"}" style="--items: ${e.isNpNumeric?1:a.length}">
		<article class="totals-article">
			<h4>${await R("totals1")}</h4>
			<h5>${e.name}</h5>
			<section class="totals-items"></section>
		</article>
	</section>`),i=t.querySelector(".totals-items"),s=e.getTotals();if(e.isNpNumeric)i.append(...eT(await R("total"),s));else for(let[e]of a)i.append(...eT(e,s?.get(e)));if(e.isHarmonized){let s=l(`<article class="totals-article">
			<h4>${await R("totals2")}</h4>
			<h5>${e.name}</h5>
			<section class="totals-items"></section>
		</article>`);t.append(s),s=s.querySelector(".totals-items");let n=await e.inferredTotals();if(e.isPNumeric)s.append(...eT(await R("total"),n,!0));else for(let[e,a]of n)s.append(...eT(e,a,!0));let r=l(`<button class="button reversed">${await R("inferTotals")}</button>`);r.addEventListener("click",()=>(function(e,a,t,i){let s=e.querySelectorAll("input");if(i)s[0].valueAsNumber=t;else for(let e=0;e<a.length;e++)s[e].valueAsNumber=t.get(a[e][0])})(i,a,n,e.isPNumeric)),t.querySelector(".totals-article").append(r)}return t}async function eN(e,a,t){let i=[...e.querySelectorAll("input")];if(i.every(e=>!e.value))a.deleteTotals(),t.close();else if(i.every(e=>e.reportValidity())){if(a.isNpNumeric)a.setTotals(i[0].valueAsNumber);else{let e=await a.npDetails();a.setTotals(new Map(e.map((e,a)=>[e[0],i[a].valueAsNumber])))}t.close()}}async function eq(e){let a=l(`<dialog class="modal">
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
	</dialog>`),[t,i,s]=a.querySelectorAll(".button");return a.addEventListener("open",async()=>{(await e.npDetails()).some(e=>null==e[0])?(I(await R("missingError")),a.close()):(a.querySelector(".totals-container").replaceWith(await ex(e)),s.disabled=!1,t.disabled=!1)}),i.addEventListener("click",()=>a.close()),s.addEventListener("click",()=>eN(a.querySelector(".totals-items"),e,a)),t.addEventListener("click",()=>{a.querySelector(".totals-items").querySelectorAll("input").forEach(e=>e.value="")}),a}async function e_(e){let a=await ek(e),t=await eq(e);return a.addEventListener("click",()=>{t.showModal(),t.dispatchEvent(new Event("open"))}),[a,t]}async function eP(e){let a=l(`<header class="variable header">
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
		</label>`));let t=await ev.filtered(a=>a["right"==e?"inP":"inNp"]),[i,s]=a.querySelectorAll("input");i.addEventListener("change",()=>{t.forEach(e=>{e.expanded.value!=i.checked&&(e.expanded.value=i.checked)})}),s?.addEventListener("change",()=>{t.forEach(e=>{e.selectable.value&&e.selected.value!=s.checked&&(e.selected.value=s.checked)})});let n=j(()=>i.checked=t.every(e=>e.expanded.value)),r=j(()=>{let e=t.filter(e=>e.selectable.value);s.checked=e.length&&e.every(e=>e.selected.value)});for(let e of t)e.expanded.subscribe(a,n),s&&(e.selected.subscribe(a,r),e.selectable.subscribe(a,r));return n(),s&&r(),a}async function ez(e){let a=l('<article class="variable-status"></article>');return e.isHarmonized?a.innerHTML='<img width="24" height="24" src="images/check-circle.svg"/>':e.harmonReason?a.innerHTML=`<span class="lead left"><img src="images/lead.svg"/><span class="tooltip">${await R(e.harmonReason+"Reason")}</span></span><img src="images/check-yellow.svg"/>`:a.innerHTML='<img src="images/block.svg"/>',a}async function eD(e,a){let t=l(`<article class="variable view ${"single"!=a?a:""} ${e.isHarmonized?"harmonized":""}">
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
	</label>`)).querySelector("input")).checked=e.selected.value,i.disabled=!e.selectable.value,i.addEventListener("change",()=>e.selected.value=i.checked),e.selected.subscribe(a,()=>i.checked=e.selected.value),e.selectable.subscribe(a,()=>i.disabled=!e.selectable.value),a))}return"right"==a?t.append(await ez(e)):t.append(...await e_(e)),eL(t,i,e,a),t}function eM(){return l('<div class="border"></div>')}function eF(e,a,t){e.expanded.subscribe(t,()=>{a.expanded.value!=e.expanded.value&&(a.expanded.value=e.expanded.value)})}async function eW(){let e=[];if(ev.areDual){e.push(await eP("left"),eM(),await eP("right"));let[a,t,i]=await Promise.all([ev.common(),ev.npOnly(),ev.pOnly()]),s=Math.max(t.length,i.length);for(let t of a)e.push(await eD(t,"left"),eM(),await eD(t,"right"));for(let a=0;a<s;a++){let s,n;t[a]&&(s=await eD(t[a],"left"),e.push(s)),e.push(eM()),i[a]&&(n=await eD(i[a],"right"),e.push(n)),t[a]&&i[a]&&(eF(t[a],i[a],s),eF(i[a],t[a],n))}}else{e.push(await eP("single"));let a=(await ev.variables()).map(e=>eD(e,"single"));e.push(...await Promise.all(a))}return e}async function eH(){let e;ev.variables().catch(async e=>{console.error(e),I(await R("loadFileError")),D.value="load"});let a=l('<main class="main-content"></main>');if(ev.areDual){if(e=l('<section class="dual-container"></section>'),"string"==typeof M.value){let e=(await R("estimatedWeightSubtitle")).replace("$name",M.value);a.append(B(await R("estimatedWeightTitle"),e))}else if(M.value){let e=(await R("loadedFilesSubtitle")).replace("$nVars",(await ev.harmonized()).length);a.append(B(await R("loadedFilesTitle"),e))}}else e=l('<section class="dual-container single"></section>');return e.append(...await ea()),e.append(...await eW()),a.append(e),G(a),M.value=!1,ev.subscribe(a,async()=>a.replaceWith(await eH())),a}async function eA(){let e=await el();return e.querySelector("main").replaceWith(await eH()),e}const eO=m("inps",!0).then(()=>h("import inps",!0));function eC(e,a){return a?`, ${e} = ${JSON.stringify(a)}`:""}async function eR(e,a,t,i,s){await Promise.all([b,eO]),await h(`
		from js import my_totals
		temp_sample, temp_totals = utils.prepare_calibration(${a}, my_totals.to_py()${eC("weights_var",i)})
	`,!1,{my_totals:t});let n=`${eC("weights_column",i)}${eC("population_size",s)}`;await h(`${a}["${e}"] = inps.calibration_weights(temp_sample, temp_totals${n})`),await h("del temp_sample, temp_totals")}async function ej(e,a,t,i,s,n,l,r){await eO;let o=`${eC("weights_column",i)}${eC("population_size",s)}${eC("covariates",n)}`;return l&&(o+=", model = inps.boosting_classifier()"),h(`${a}["${e}"] = inps.${r?"kw":"psa"}_weights(${a}, ${i?`${t}.dropna(subset = "${i}")`:t}${o})${r?"":'["np"]'}`)}class eG{constructor(){this.name=R("calibration"),this.title=R("M\xe9todo de calibraci\xf3n"),this.description=R("calibrationDescription"),this.variables=ev.filtered(e=>e.selected.value&&e.hasTotals.value),this.acceptsOrig=!0}async estimate(e,a,t){if(!a&&!t)throw this.errorMsg=R("calibrationMissing"),Error("Info missing");this.errorMsg=R("calibrationError");let i=new Map((await this.variables).map(e=>[e.name,e.getTotals()]));await eR(e,"np_sample",i,t,a),F.event.dispatch()}}class eI{constructor(e,a){this.boosted=e,this.kernels=a;let t=a?"kw":"psa";e&&(t+="Boost"),this.name=R(t),this.title=R(t+"Title"),this.description=R(t+"Description"),this.errorMsg=R(t+"Error"),this.variables=ev.filtered(e=>e.selected.value&&e.isHarmonized),this.acceptsOrig=!1}async estimate(a,t,i){let s=(await this.variables).map(e=>e.name);await ej(a,"np_sample","p_sample",e,t,s,this.boosted,this.kernels),F.event.dispatch()}}async function eV(){return l(`<main class="main-content">
		<header>
			<h2>${await R("weightTitle")}</h2>
			<h3>${F.value}</h3>
		</header>
		<main class="empty-content">
			<p>${await R("emptyDescription")}</p>
			<img src="images/empty.svg"/>
			<span>${await R("emptyTitle")}</span>
		</main>
	</main>`)}async function eB(e){let a=l(`<section class="vars-table">
		<article>${await R("activeVars")}</article>
	</section>`);for(let t of e)a.append(l(`<article>${t}</article>`));return a}async function eU(){let e=l(`<main class="main-content">
		<header>
			<h2>${await R("weightTitle")}</h2>
			<h3>${F.value}</h3>
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
	</main>`);function t(a){return e.querySelector(a)}let[i,s,n]=["#method",".extra h4",".extra p"].map(t),r=["#orig-weights",'[for="orig-weights"]'].map(t),o=["#pop-size",'[for="pop-size"]'].map(t),c=t(".vars-table + a"),d=t("#new-var-name"),u=t("button"),p=await a;for(let a of(r[0].append(...(await ev.filtered(e=>e.isNpNumeric)).map(e=>l(`<option>${e.name}</option>`))),p&&(o[0].valueAsNumber=p),c.addEventListener("click",()=>D.value="data"),u.onclick=()=>i.reportValidity(),[new eG,new eI,new eI(!0),new eI(!1,!0),new eI(!0,!0)])){let t=await a.variables;if(t.length){let[p,h,m]=await Promise.all([a.name,a.title,a.description]);i.append(l(`<option>${p}</option>`)),i.addEventListener("change",async()=>{i.value==p&&(s.innerHTML=h,n.innerHTML=m,function(e,a,t){e.forEach(e=>e.hidden=!t),e[0].onchange=()=>a.forEach(a=>a.hidden=t&&!!e[0].value),e[0].onchange()}(r,o,a.acceptsOrig),e.querySelector(".vars-table").replaceWith(await eB(t.map(e=>e.name))),c.hidden=!1,u.onclick=async()=>{if(d.reportValidity()&&(o[0].hidden||o[0].reportValidity())){let t=await V(await R("weightLoading"));e.append(t),t.showModal(),a.estimate(d.value,o[0].valueAsNumber,r[0].value).then(()=>{M.value=d.value,D.value="data"}).catch(async e=>{console.error(e),I(await a.errorMsg),t.remove()})}})})}}return i.dispatchEvent(new Event("change")),e}async function eJ(){return(await ev.variables()).some(e=>e.selected.value)?eU():eV()}async function eX(){let e=await el();return e.querySelector("main").replaceWith(await eJ()),e}async function eK(){let e;scrollTo(0,0);let a=t=s();if("load"==D.value)e=eu();else if("data"==D.value)e=eA();else if("weight"==D.value)e=eX();else throw Error(`Invalid screen: ${D.value}`);e=await e,a==t&&document.querySelector(".main-container > main").replaceWith(e)}D.addGlobalListener(eK),eK();