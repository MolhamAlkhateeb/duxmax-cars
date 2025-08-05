import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Star, MapPin, Phone, Mail, Globe, Car, Calendar, Award } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DealersRepository } from "@/db/repositories/dealers.repository";
import { getTranslations, getLocale } from "next-intl/server";

type Props = {
  params: Promise<{ dealerId: string; locale: string }>;
};

export default async function DealerDetailPage({ params }: Props) {
  const { dealerId } = await params;
  const locale = await getLocale();
  const t = await getTranslations("dealerDetail");
  const tDealers = await getTranslations("dealers");
  
  const dealersRepo = new DealersRepository();
  const dealer = await dealersRepo.getDealerById(dealerId);

  if (!dealer) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{dealer.name}</h1>
              {dealer.isDealerVerified && (
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  {t("verifiedDealer")}
                </Badge>
              )}
            </div>
            
            <p className="text-lg text-gray-600 mb-4">
              {t("professionalDescription")}
            </p>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                <span className="font-medium">4.5</span>
                <span className="ml-1">(125 reviews)</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                <span>{t("established", { year: dealer.createdAt ? new Date(dealer.createdAt).getFullYear() : '2020' })}</span>
              </div>
              <div className="flex items-center">
                <Car className="w-4 h-4 mr-1" />
                <span>25 {t("activeListings").toLowerCase()}</span>
              </div>
            </div>
          </div>
          
          <div className="lg:text-right">
            <Button size="lg" className="mb-2 w-full lg:w-auto">
              {tDealers("contactDealer")}
            </Button>
            <div className="text-sm text-gray-600">
              <div>{t("responseTime")}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">25</div>
            <div className="text-sm text-gray-600">{t("activeListings")}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">500+</div>
            <div className="text-sm text-gray-600">{t("carsSold")}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">4.5★</div>
            <div className="text-sm text-gray-600">{t("rating")}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600 mb-1">{dealer.createdAt ? new Date().getFullYear() - new Date(dealer.createdAt).getFullYear() : 3}+</div>
            <div className="text-sm text-gray-600">{t("yearsExperience")}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">{t("tabs.overview")}</TabsTrigger>
          <TabsTrigger value="listings">{t("tabs.listings")}</TabsTrigger>
          <TabsTrigger value="reviews">{t("tabs.reviews")}</TabsTrigger>
          <TabsTrigger value="contact">{t("tabs.contact")}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t("about", { dealerName: dealer.name || "Dealer" })}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">
                    {t("aboutDescription", { dealerName: dealer.name || "This dealer" })}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    {t("subscriptionStatus")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-yellow-500" />
                      <span>
                        {dealer.subscription?.tier 
                          ? `${t(dealer.subscription.tier === 'premium' ? 'premiumPlan' : 'basicPlan')}`
                          : t("basicPlan")
                        }
                      </span>
                      {dealer.subscription?.isActive && (
                        <Badge className="bg-green-100 text-green-800 text-xs">{t("activeBadge")}</Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t("specialties")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{t("specialtyTags.premiumVehicles")}</Badge>
                    <Badge variant="secondary">{t("specialtyTags.qualityService")}</Badge>
                    <Badge variant="secondary">{t("specialtyTags.competitivePricing")}</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t("services")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>{t("servicesList.vehicleSales")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>{t("servicesList.tradeIns")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>{t("servicesList.financingOptions")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>{t("servicesList.customerSupport")}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t("workingHours")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div>
                      <div className="font-medium">{t("weekdays")}</div>
                      <div className="text-gray-600">{t("weekdaysTime")}</div>
                    </div>
                    <div>
                      <div className="font-medium">{t("weekends")}</div>
                      <div className="text-gray-600">{t("weekendsTime")}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="listings">
          <Card>
            <CardHeader>
              <CardTitle>{t("currentListings")}</CardTitle>
              <CardDescription>
                {t("currentListingsDescription", { dealerName: dealer.name || "this dealer" })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Car className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {t("carsAvailable", { count: 25 })}
                </h3>
                <p className="text-gray-600 mb-4">
                  {t("viewAllCars")}
                </p>
                <Button asChild>
                  <Link href={`/${locale}?dealer=${dealer.id}`}>
                    {t("viewAllListings")}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <CardTitle>{t("customerReviews")}</CardTitle>
              <CardDescription>
                {t("reviewsDescription", { count: 125, rating: "4.5" })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Star className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {t("reviewsComingSoon")}
                </h3>
                <p className="text-gray-600">
                  {t("reviewSystemNote")}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>{t("contactInformation")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <div className="font-medium">{t("location")}</div>
                      <div className="text-gray-600">{t("locationValue")}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <div className="font-medium">{t("phoneLabel")}</div>
                      <div className="text-gray-600">{dealer.phone || t("contactViaMessage")}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <div className="font-medium">{t("emailLabel")}</div>
                      <div className="text-gray-600">{dealer.email}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Globe className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <div className="font-medium">{t("contactLabel")}</div>
                      <div className="text-gray-600">{t("messageViaPlatform")}</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <Button className="w-full" size="lg">
                    <Phone className="w-4 h-4 mr-2" />
                    {t("callNow")}
                  </Button>
                  <Button variant="outline" className="w-full" size="lg">
                    <Mail className="w-4 h-4 mr-2" />
                    {t("sendEmail")}
                  </Button>
                  <Button variant="outline" className="w-full" size="lg">
                    <Globe className="w-4 h-4 mr-2" />
                    {t("visitWebsite")}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
