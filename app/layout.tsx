import type { Metadata } from "next";
import "./globals.scss";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import theme from "./theme";
import { ThemeProvider } from "@mui/material/styles";
import { Montserrat } from "next/font/google";
import CssBaseline from "@mui/material/CssBaseline";
import { ReactQueryProvider } from "./_providers/reactQueryProvider";
import { SWRProvider } from "./_providers/swrQueryProvider";
import { ToasterProvider } from "./_providers/snackBarProvider";
import { getSession } from "./_components/auth";
import SessionProvider from "./_providers/sessionProvides";

const montserrat = Montserrat({
  weight: ["300", "400", "500", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "coasta-utility-management-system-web",
  description: "coasta-utility-management-system-web",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let session = await getSession();
  return (
    <html lang="en">
      <CssBaseline />
      <body className={montserrat.className}>
        <SessionProvider value={session}>
          <AppRouterCacheProvider>
            <ToasterProvider>
              <ThemeProvider theme={theme}>
                <SWRProvider>
                  <ReactQueryProvider>{children}</ReactQueryProvider>
                </SWRProvider>
              </ThemeProvider>
            </ToasterProvider>
          </AppRouterCacheProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
