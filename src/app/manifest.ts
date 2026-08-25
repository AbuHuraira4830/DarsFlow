import type { MetadataRoute } from "next";
export default function manifest():MetadataRoute.Manifest{return{name:"DarsFlow Academy Workspace",short_name:"DarsFlow",description:"Mobile-first lesson records and reviewed academy communication.",start_url:"/app",display:"standalone",background_color:"#f5f8f7",theme_color:"#0f766e",icons:[{src:"/icon.svg",sizes:"any",type:"image/svg+xml"}]}}
