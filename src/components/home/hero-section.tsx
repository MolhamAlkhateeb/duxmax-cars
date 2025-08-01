import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Car, Users, Shield } from "lucide-react";
import { StatsRepository } from "@/db/repositories/stats.repository";
import { getTranslations, getLocale } from "next-intl/server";

export async function HeroSection() {
  const statsRepo = new StatsRepository();
  const stats = await statsRepo.getPlatformStats();
  const t = await getTranslations("home.hero");
  const locale = await getLocale();

  return (
    <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Main Hero Content */}
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            {t("title")}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {t("subtitle")}
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative flex">
              <Input
                type="text"
                placeholder={t("searchPlaceholder")}
                className="pl-12 pr-4 py-4 text-lg rounded-l-lg border-r-0 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Button size="lg" className="rounded-l-none bg-blue-600 hover:bg-blue-700 px-8">
                Search
              </Button>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href={`/${locale}/listings`}>
                <Car className="mr-2 h-5 w-5" />
                {t("cta.browse")}
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href={`/${locale}/sell`}>
                {t("cta.sell")}
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                <Car className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {stats.totalListings.toLocaleString()}+
              </div>
              <div className="text-gray-600">Cars Available</div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {stats.totalDealers.toLocaleString()}+
              </div>
              <div className="text-gray-600">Verified Dealers</div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">100%</div>
              <div className="text-gray-600">Secure Transactions</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
