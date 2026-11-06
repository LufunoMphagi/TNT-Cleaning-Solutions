import {home} from "./home";
import Script from "next/script";
export default function Home(){return <><div dangerouslySetInnerHTML={{__html:home}}/><Script src="/app.js" strategy="afterInteractive" /></>}
