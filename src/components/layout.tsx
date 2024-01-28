import AsideBar from "./aside-bar";
import { ThemeProvider } from "./theme-provider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <AsideBar />
        <main>{children}</main>
      </ThemeProvider>
    </>
  );
}
