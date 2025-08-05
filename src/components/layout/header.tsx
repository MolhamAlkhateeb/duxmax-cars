"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { 
  Car,
  Menu,
  User,
  Globe,
  Plus
} from "lucide-react";
import { SignedIn, SignedOut, UserButton } from "@daveyplate/better-auth-ui";

export function Header() {
  const t = useTranslations("header");
  const locale = useLocale();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: t("nav.browse"), href: `/${locale}` },
    { name: t("nav.dealers"), href: `/${locale}/dealers` },
    { name: t("nav.about"), href: `/${locale}/about` },
    { name: t("nav.contact"), href: `/${locale}/contact` },
  ];

  const otherLocale = locale === "en" ? "ar" : "en";

  return (
    <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center space-x-2">
            <Car className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">DuxMax</span>
            <Badge variant="secondary" className="hidden sm:inline-flex">
              UAE
            </Badge>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Globe className="h-4 w-4 mr-2" />
                  {locale.toUpperCase()}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/${otherLocale}`}>
                    {otherLocale === "ar" ? "العربية" : "English"}
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Sell Car Button */}
            <SignedIn>
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link href={`/${locale}/sell`}>
                  <Plus className="h-4 w-4 mr-2" />
                  {t("actions.sellCar")}
                </Link>
              </Button>
            </SignedIn>
            
            <SignedOut>
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link href={`/${locale}/auth/signin`}>
                  <Plus className="h-4 w-4 mr-2" />
                  {t("actions.sellCar")}
                </Link>
              </Button>
            </SignedOut>

            {/* User Menu */}
            <SignedOut>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href={`/${locale}/auth/signin`}>
                      {t("auth.signIn")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/${locale}/auth/signup`}>
                      {t("auth.signUp")}
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SignedOut>
            
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle>{t("nav.menu")}</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col space-y-4 mt-4">
                  {/* Mobile Navigation */}
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-lg font-medium text-gray-600 hover:text-gray-900 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                  
                  <div className="border-t pt-4 space-y-4">
                    {/* Mobile Language Toggle */}
                    <Link
                      href={`/${otherLocale}`}
                      className="flex items-center text-lg font-medium text-gray-600 hover:text-gray-900"
                    >
                      <Globe className="h-5 w-5 mr-3" />
                      {otherLocale === "ar" ? "العربية" : "English"}
                    </Link>

                    {/* Mobile Sell Car Button */}
                    <SignedIn>
                      <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                        <Link href={`/${locale}/sell`} onClick={() => setIsMobileMenuOpen(false)}>
                          <Plus className="h-4 w-4 mr-2" />
                          {t("actions.sellCar")}
                        </Link>
                      </Button>
                    </SignedIn>
                    
                    <SignedOut>
                      <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                        <Link href={`/${locale}/auth/signin`} onClick={() => setIsMobileMenuOpen(false)}>
                          <Plus className="h-4 w-4 mr-2" />
                          {t("actions.sellCar")}
                        </Link>
                      </Button>
                    </SignedOut>

                    {/* Mobile Auth Links */}
                    <SignedOut>
                      <div className="space-y-2">
                        <Button variant="outline" asChild className="w-full">
                          <Link href={`/${locale}/auth/signin`} onClick={() => setIsMobileMenuOpen(false)}>
                            {t("auth.signIn")}
                          </Link>
                        </Button>
                        <Button variant="ghost" asChild className="w-full">
                          <Link href={`/${locale}/auth/signup`} onClick={() => setIsMobileMenuOpen(false)}>
                            {t("auth.signUp")}
                          </Link>
                        </Button>
                      </div>
                    </SignedOut>
                    
                    <SignedIn>
                      <UserButton />
                    </SignedIn>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
