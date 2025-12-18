"use client";

import React, { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import KindleBezel from "@/components/KindleBezel";
import { ICurrentPage, ISiteConfig } from "@/types/index";
import { ColorSchemeProvider } from "@/contexts/colorScheme";
import { DeviceSettingsProvider } from "@/contexts/deviceSettings";
import { ToolbarProvider, useToolbar } from "@/contexts/toolbar";
import { ReaderSettingsProvider } from "@/contexts/readerSettings";
import { Navbar, StatuBar } from "@/components/ui";
import { useTranslations } from "next-intl";
import "kindle-fonts/bookerly.css";
import "kindle-fonts/amazon-ember.css";

/**
 * Inner layout component that can access toolbar context
 */
const LayoutInner = (props: {
  siteConfig?: ISiteConfig;
  currentPage?: ICurrentPage;
  locale?: string;
  children: React.ReactNode;
  menuItems?: any[];
  containerEle: React.RefObject<HTMLDivElement | null>;
}) => {
  const {
    currentPage,
    siteConfig,
    locale,
    children,
    menuItems = [],
    containerEle,
  } = props;
  const { customToolbar } = useToolbar();
  const t = useTranslations();

  // Check if we have a custom toolbar (like browser mode)
  const hasCustomToolbar = customToolbar !== null;

  // For browser mode, we need full height layout
  if (hasCustomToolbar) {
    return (
      <div ref={containerEle} className="flex flex-col h-full">
        {/* Global Navbar with StatusBar */}
        <Navbar autoClose fixed>
          <StatuBar battery={86} deviceName={t("nav.deviceName")} />
          {customToolbar}
        </Navbar>
        {/* Spacer for fixed navbar on mobile */}
        <div className="h-[88px] md:hidden shrink-0" />
        {/* Main content - takes remaining height, relative for absolute children */}
        <main className="flex-1 overflow-hidden relative">{children}</main>
      </div>
    );
  }

  // Default layout for normal pages
  return (
    <div ref={containerEle}>
      {/* Global Navbar with StatusBar */}
      <Navbar autoClose fixed>
        <StatuBar battery={86} deviceName={t("nav.deviceName")} />
        <Header
          menuItems={menuItems}
          lang={locale}
          currentPage={currentPage}
          siteConfig={siteConfig}
          containerEle={containerEle}
        />
      </Navbar>
      {/* Spacer for fixed navbar on mobile */}
      <div className="h-[88px] md:hidden" />
      {/* Main content */}
      <main className="min-h-[80vh] pb-8 px-4 md:px-6">{children}</main>
    </div>
  );
};

const Layout = (props: {
  /**网站配置 */
  siteConfig?: ISiteConfig;
  /**全部文章 */
  allPosts?: ISiteConfig[];
  /** 当前页面 */
  currentPage?: ICurrentPage;
  locale?: string;
  children: React.ReactNode;
  menuItems?: any[];
}) => {
  const { currentPage, siteConfig, locale, children, menuItems = [] } = props;

  const [colorScheme, setColorScheme] = useState<"light" | "dark">("light");
  const containerEle = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Query the system preference for color scheme
    const darkMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setColorScheme(darkMediaQuery.matches ? "dark" : "light");

    // Listen for changes in system preference
    const handleChange = (e: MediaQueryListEvent) => {
      setColorScheme(e.matches ? "dark" : "light");
    };
    darkMediaQuery.addEventListener("change", handleChange);

    return () => darkMediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    // Reset scroll position when page changes
    const container = containerEle.current;
    if (container) {
      container.scrollTop = 0;
    }
  }, [currentPage]);

  return (
    <ColorSchemeProvider value={{ colorScheme, setColorScheme }}>
      <DeviceSettingsProvider>
        <ReaderSettingsProvider>
          <ToolbarProvider>
            {/* Device label at bottom-left of viewport */}
            <div
              className="hidden md:block fixed bottom-4 left-4 pointer-events-none z-50"
              style={{
                fontSize: "10px",
                fontFamily: "system-ui, -apple-system, sans-serif",
                color: "rgba(80, 80, 80, 0.5)",
                lineHeight: "1.5",
              }}
            >
              <span>Kindle Oasis.</span>
              <br />
              <span>My actual device is KPW5</span>
              <br />
              <span>© 2021 Rene Wang</span>
            </div>

            <KindleBezel dark={colorScheme === "dark"}>
              <LayoutInner
                siteConfig={siteConfig}
                currentPage={currentPage}
                locale={locale}
                menuItems={menuItems}
                containerEle={containerEle}
              >
                {children}
              </LayoutInner>
            </KindleBezel>
          </ToolbarProvider>
        </ReaderSettingsProvider>
      </DeviceSettingsProvider>
    </ColorSchemeProvider>
  );
};

export default Layout;
