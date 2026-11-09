export type View = "play" | "skim";

export const VIEW_KEY = "view";

/**
 * Runs in <head> before the body is parsed, so the right face is shown on first paint.
 * URL ?view= wins over the saved choice; default is Play.
 */
export const VIEW_BOOT_SCRIPT = `(function(){var d=document.documentElement,v=null;try{v=new URLSearchParams(location.search).get("view")}catch(e){}if(v!=="play"&&v!=="skim"){try{v=localStorage.getItem("${VIEW_KEY}")}catch(e){}}d.setAttribute("data-view",v==="skim"?"skim":"play")})();`;

