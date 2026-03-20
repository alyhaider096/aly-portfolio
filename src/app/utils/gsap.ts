import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";


let registered = false;


export function registerGSAP() {
if (registered) return;
if (typeof window === "undefined") return;
gsap.registerPlugin(ScrollTrigger);
registered = true;
}


export { gsap, ScrollTrigger };


