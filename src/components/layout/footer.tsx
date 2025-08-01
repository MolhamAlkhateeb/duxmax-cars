"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { Car, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  const t = useTranslations("footer");
  const locale = useLocale();

  const footerSections = [
    {
      title: t("sections.company"),
      links: [
        { name: t("links.about"), href: `/${locale}/about` },
        { name: t("links.careers"), href: `/${locale}/careers` },
        { name: t("links.blog"), href: `/${locale}/blog` },
        { name: t("links.press"), href: `/${locale}/press` },
      ],
    },
    {
      title: t("sections.services"),
      links: [
        { name: t("links.buyUsedCars"), href: `/${locale}/listings` },
        { name: t("links.sellYourCar"), href: `/${locale}/sell` },
        { name: t("links.carValuation"), href: `/${locale}/valuation` },
        { name: t("links.financing"), href: `/${locale}/financing` },
      ],
    },
    {
      title: t("sections.support"),
      links: [
        { name: t("links.helpCenter"), href: `/${locale}/help` },
        { name: t("links.contactUs"), href: `/${locale}/contact` },
        { name: t("links.reportIssue"), href: `/${locale}/report` },
        { name: t("links.safety"), href: `/${locale}/safety` },
      ],
    },
    {
      title: t("sections.legal"),
      links: [
        { name: t("links.privacy"), href: `/${locale}/privacy` },
        { name: t("links.terms"), href: `/${locale}/terms` },
        { name: t("links.cookies"), href: `/${locale}/cookies` },
        { name: t("links.disclaimer"), href: `/${locale}/disclaimer` },
      ],
    },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link href={`/${locale}`} className="flex items-center space-x-2 mb-6">
              <Car className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold">DuxMax</span>
            </Link>
            <p className="text-gray-400 mb-6 max-w-md">
              {t("description")}
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-400">
                <MapPin className="h-4 w-4 text-blue-400" />
                <span className="text-sm">{t("contact.address")}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <Phone className="h-4 w-4 text-blue-400" />
                <span className="text-sm">+971 4 XXX XXXX</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <Mail className="h-4 w-4 text-blue-400" />
                <span className="text-sm">info@duxmax.com</span>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} DuxMax. {t("allRightsReserved")}
            </div>
            
            <div className="flex items-center space-x-6">
              <span className="text-gray-400 text-sm">{t("followUs")}</span>
              {/* Social Media Links - Placeholder for now */}
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M20 10C20 4.477 15.523 0 10 0S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.017 0H7.983C3.578 0 0 3.578 0 7.983v4.034C0 16.422 3.578 20 7.983 20h4.034C16.422 20 20 16.422 20 12.017V7.983C20 3.578 16.422 0 12.017 0zm3.13 12.017c0 1.724-1.423 3.13-3.13 3.13H7.983c-1.724 0-3.13-1.423-3.13-3.13V7.983c0-1.724 1.423-3.13 3.13-3.13h4.034c1.724 0 3.13 1.423 3.13 3.13v4.034z" clipRule="evenodd" />
                    <path d="M10 5.074a4.926 4.926 0 100 9.852 4.926 4.926 0 000-9.852zM10 13.25a3.25 3.25 0 110-6.5 3.25 3.25 0 010 6.5z" />
                    <circle cx="15.338" cy="4.662" r="1.075" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
