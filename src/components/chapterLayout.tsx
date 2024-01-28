import AsideBarChapter from "./aside-bar-chapter";
import { ThemeProvider } from "./theme-provider";

export default function LayoutTwo({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <AsideBarChapter />
        <main>{children}</main>
      </ThemeProvider>
    </>
  );
}
