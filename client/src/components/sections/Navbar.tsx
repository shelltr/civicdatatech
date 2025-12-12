import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShieldLogo } from "@/components/ui/shield-logo";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const BASE_PATH = "/";

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    const handleScroll = () => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        setIsScrolled(window.scrollY > 20);
      }, 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timeout) clearTimeout(timeout);
    };
  }, []);

  // Use a "section" key for in-page sections; Get Involved is a normal route
   const navLinks: (
    | { name: string; section: "mission" | "strategy" | "partners" }
    | { name: string; href: string }
  )[] = [
    { name: "Mission", section: "mission" },
    { name: "Strategy", section: "strategy" },
    { name: "Partners", section: "partners" },
    { name: "Get Involved", href: "/#/get-involved" },
  ];

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const isOnHome = () => {
    // Locally: "http://localhost:5173/#/"
    // Deployed: "https://civicdatatech.github.io/#/"
    const { pathname, hash } = window.location;

    const isLocal =
      pathname === "/" &&
      (hash === "" || hash === "#" || hash === "#/" || hash === "#");

    const isDeployed =
      pathname === BASE_PATH + "/" &&
      (hash === "" || hash === "#" || hash === "#/" || hash === "#");

    return isLocal || isDeployed;
  };

  const handleSectionClick =
    (section: "mission" | "strategy" | "partners") =>
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();

      if (isOnHome()) {
        // Already on home: just smooth-scroll
        scrollToId(section);
      } else {
        // Coming from another page: navigate to home with query; Home page will scroll
        window.location.href = `${BASE_PATH}/#/?section=${section}`;
      }
    };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <a href="/#/" className="flex items-center gap-2 group">
          <ShieldLogo className="h-8 w-8 group-hover:scale-105 transition-transform duration-300" />
          <span className="font-display font-bold text-xl tracking-tight text-foreground">
            Civic Data <span className="text-primary">Tech</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) =>
            "section" in link ? (
              <a
                key={link.name}
                href={`/#/?section=${link.section}`}
                onClick={handleSectionClick(link.section)}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer"
              >
                {link.name}
              </a>
            ) : (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer"
              >
                {link.name}
              </a>
            )
          )}
          <Button className="bg-primary hover:bg-primary/90" asChild>
            <a href="mailto:info@civicdata.tech">Contact Us</a>
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-foreground p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-border p-6 shadow-lg animate-in slide-in-from-top-5">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) =>
              "section" in link ? (
                <a
                  key={link.name}
                  href={`/#/?section=${link.section}`}
                  onClick={(e) => {
                    handleSectionClick(link.section)(e);
                    setMobileMenuOpen(false);
                  }}
                  className="text-lg font-medium text-foreground py-2 border-b border-border/50 cursor-pointer"
                >
                  {link.name}
                </a>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg font-medium text-foreground py-2 border-b border-border/50 cursor-pointer"
                >
                  {link.name}
                </a>
              )
            )}
            <Button className="w-full mt-4" asChild>
              <a href="mailto:info@civicdata.tech">Contact Us</a>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}