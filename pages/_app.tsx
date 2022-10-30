import type {AppProps} from 'next/app'
import Head from "next/head";
import {Card, CardContent, Container, createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import {NavBar} from "../src/nav/NavBar";
import dynamic from "next/dynamic";

const theme = createTheme();

function MyApp({Component, pageProps}: AppProps) {
    const title = "Marriage Game Points Calculator";
    const description = "Marriage Game Points / Maal Calculator";
    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="description" content={description}/>
                <link rel="icon" href="/favicon.ico"/>
                <meta name="keywords" content="marriage calculator, maal calculator"/>
                <link rel="manifest" href="/manifest.json"/>
                <meta name='viewport'
                      content='minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover'/>
                <meta name="application-name" content={title}/>
                <meta name="apple-mobile-web-app-capable" content="yes"/>
                <meta name="apple-mobile-web-app-status-bar-style" content="default"/>
                <meta name="apple-mobile-web-app-title" content={title}/>
                <meta name="description" content={description}/>
                <meta name="format-detection" content="telephone=no, date=no, address=no, email=no, url=no"/>
                <meta name="mobile-web-app-capable" content="yes"/>
                <meta name="theme-color" content="#ffffff"/>

                <link rel="shortcut icon" href="/favicon.ico"/>
                <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png"/>

                <meta property="og:type" content="website"/>
                <meta property="og:title" content={title}/>
                <meta property="og:description" content={description}/>
                <meta property="og:site_name" content={title}/>
                <meta property="og:url" content="https://marriage.koju.dev"/>
                <meta property="og:image" content="https://marriage.koju.dev/icons/icon-512x512.png"/>
            </Head>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <Container maxWidth="sm" disableGutters>
                    <NavBar/>
                    <Card variant="outlined" sx={{m: 1}}>
                        <CardContent>
                            <Component {...pageProps} />
                        </CardContent>
                    </Card>
                </Container>
            </ThemeProvider>
        </>

    );
}

export default dynamic(() => Promise.resolve(MyApp), {ssr: false});
