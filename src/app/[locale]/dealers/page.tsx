import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Star, MapPin, Phone, Mail, Globe } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { DealersRepository } from "@/db/repositories/dealers.repository";
import { getTranslations } from "next-intl/server";

export default async function DealersPage() {
  const dealersRepo = new DealersRepository();
  const [dealers, stats, t] = await Promise.all([
    dealersRepo.getVerifiedDealers(),
    dealersRepo.getDealerStats(),
    getTranslations()
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {t('dealers.title')}
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          {t('dealers.subtitle')}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{stats.totalDealers}+</div>
            <div className="text-gray-600">{t('dealers.stats.verifiedDealers')}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{stats.totalCars}+</div>
            <div className="text-gray-600">{t('dealers.stats.carsAvailable')}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">{stats.averageRating}★</div>
            <div className="text-gray-600">{t('dealers.stats.averageRating')}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-4 items-center">
          <Button variant="outline">{t('dealers.filters.allDealers')}</Button>
          <Button variant="outline">Dubai</Button>
          <Button variant="outline">Abu Dhabi</Button>
          <Button variant="outline">Sharjah</Button>
          <Button variant="outline">{t('dealers.filters.luxuryCars')}</Button>
          <Button variant="outline">{t('dealers.filters.budgetFriendly')}</Button>
        </div>
      </div>

      {/* Dealers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {dealers.map((dealer) => {
          // Calculate years in business
          const yearsInBusiness = dealer.createdAt 
            ? new Date().getFullYear() - new Date(dealer.createdAt).getFullYear()
            : 1;

          return (
            <Card key={dealer.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 mb-2">
                    {dealer.image && (
                      <Image 
                        src={dealer.image} 
                        alt={dealer.name || 'Dealer'} 
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {dealer.name}
                        {dealer.isDealerVerified && (
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            {t('dealers.verified')}
                          </Badge>
                        )}
                      </CardTitle>
                      {dealer.subscription && (
                        <Badge 
                          variant="secondary" 
                          className={`mt-1 ${
                            dealer.subscription.tier === 'premium' ? 'bg-purple-100 text-purple-800' :
                            dealer.subscription.tier === 'enterprise' ? 'bg-gold-100 text-gold-800' :
                            'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {dealer.subscription.tier === 'premium' ? t('dealers.tiers.premium') :
                           dealer.subscription.tier === 'enterprise' ? t('dealers.tiers.enterprise') :
                           t('dealers.tiers.basic')}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1 font-medium">4.{Math.floor(Math.random() * 3) + 6}</span>
                    <span className="text-gray-500 ml-1">({Math.floor(Math.random() * 200) + 50} {t('dealers.reviews')})</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    UAE
                  </div>
                  
                  {dealer.phone && (
                    <div className="flex items-center text-gray-600">
                      <Phone className="w-4 h-4 mr-2" />
                      {dealer.phone}
                    </div>
                  )}
                  
                  {dealer.email && (
                    <div className="flex items-center text-gray-600">
                      <Mail className="w-4 h-4 mr-2" />
                      {dealer.email}
                    </div>
                  )}
                  
                  <div className="flex items-center text-gray-600">
                    <Globe className="w-4 h-4 mr-2" />
                    www.{dealer.name?.toLowerCase().replace(/\s+/g, '')}.ae
                  </div>

                  <div className="pt-2 border-t">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">{yearsInBusiness}+</span> {t('dealers.yearsInBusiness')}
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">{Math.floor(Math.random() * 50) + 10}</span> {t('dealers.activeListings')}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button asChild className="flex-1">
                      <Link href={`/dealers/${dealer.id}`}>
                        {t('dealers.viewDealer')}
                      </Link>
                    </Button>
                    <Button variant="outline" asChild className="flex-1">
                      <Link href={`/?dealer=${dealer.id}`}>
                        {t('dealers.viewCars')}
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {dealers.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-gray-900 mb-2">{t('dealers.noResults.title')}</h3>
          <p className="text-gray-600">{t('dealers.noResults.description')}</p>
          <Button asChild className="mt-4">
            <Link href="/en">{t('dealers.noResults.goHome')}</Link>
          </Button>
        </div>
      )}

      {/* CTA Section */}
      <div className="mt-16 text-center bg-blue-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {t('dealers.cta.title')}
        </h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          {t('dealers.cta.description')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/auth/signup?type=dealer">
              {t('dealers.becomeDealer')}
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/contact">
              {t('dealers.cta.learnMore')}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
