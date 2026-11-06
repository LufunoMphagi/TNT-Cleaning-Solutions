import type { Metadata } from "next";
import "./globals.css";
export const metadata:Metadata={title:"TNT Cleaning Solutions | Book your fresh start",description:"Residential, commercial, specialised and automotive cleaning. Request a booking or a tailored quotation from TNT Cleaning Solutions.",icons:{icon:"/tnt-logo-enhanced.png"}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}