import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, Car, Fuel, Calendar, Settings, Phone, Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ListingsRepository } from "@/db/repositories/listings.repository";
import { db } from "@/db";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

interface Props {
  params: Promise<{ listingId: string; locale: string }>;
}

export default async function ListingDetailPage({ params }: Props) {
  const { listingId, locale } = await params;
  
  const listingsRepo = new ListingsRepository(db);
  const listing = await listingsRepo.getPublicListingById(listingId);

  if (!listing) {
    notFound();
  }

  // Get translations
  const t = await getTranslations();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href={`/${locale}`}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('listing.backToListings')}
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Images */}
          <Card>
            <CardContent className="p-0">
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                {listing.images && Array.isArray(listing.images) && listing.images.length > 0 ? (
                  <Image
                    src={listing.images[0] as string}
                    alt={listing.title}
                    width={800}
                    height={600}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Car className="w-24 h-24 text-gray-400" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Title and Basic Info */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{listing.title}</CardTitle>
                  <p className="text-lg text-gray-600 mt-2">
                    {listing.year} {listing.make} {listing.model}
                  </p>
                </div>
                <Badge variant={listing.condition === 'new' ? 'default' : 'secondary'}>
                  {listing.condition}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-gray-500" />
                  <span>{listing.mileage?.toLocaleString()} {t('common.km')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Fuel className="w-4 h-4 text-gray-500" />
                  <span>{listing.fuelType}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span>{listing.year}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Car className="w-4 h-4 text-gray-500" />
                  <span>{listing.transmission}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>{t('listing.description')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                {listing.description || t('listing.noDescription')}
              </p>
            </CardContent>
          </Card>

          {/* Vehicle Details */}
          <Card>
            <CardHeader>
              <CardTitle>{t('listing.vehicleDetails')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <strong>{t('listing.bodyType')}:</strong> {listing.bodyType}
                </div>
                <div>
                  <strong>{t('listing.color')}:</strong> {listing.color}
                </div>
                <div>
                  <strong>{t('listing.doors')}:</strong> {listing.doors}
                </div>
                <div>
                  <strong>{t('listing.cylinders')}:</strong> {listing.cylinders}
                </div>
                {listing.horsepower && (
                  <div>
                    <strong>{t('listing.horsepower')}:</strong> {listing.horsepower} HP
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Price and Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-blue-600">
                {listing.currency} {listing.price?.toLocaleString()}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full" size="lg">
                <Phone className="w-4 h-4 mr-2" />
                {t('listing.contactSeller')}
              </Button>
              <Button variant="outline" className="w-full" size="lg">
                <Mail className="w-4 h-4 mr-2" />
                {t('listing.sendMessage')}
              </Button>
              <Button variant="ghost" className="w-full" size="lg">
                <Heart className="w-4 h-4 mr-2" />
                {t('listing.saveToFavorites')}
              </Button>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle>{t('listing.location')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span>{listing.city}, {listing.emirate}</span>
              </div>
              {listing.area && (
                <p className="text-sm text-gray-600 mt-2">{listing.area}</p>
              )}
            </CardContent>
          </Card>

          {/* Seller Info */}
          {listing.user && (
            <Card>
              <CardHeader>
                <CardTitle>{t('listing.sellerInfo')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{listing.user.name}</span>
                    {listing.user.isDealerVerified && (
                      <Badge variant="secondary">{t('listing.verifiedDealer')}</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 capitalize">
                    {listing.user.role}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Safety Note */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-gray-600 space-y-2">
                <p><strong>{t('listing.safetyTips')}:</strong></p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>{t('listing.safetyTip1')}</li>
                  <li>{t('listing.safetyTip2')}</li>
                  <li>{t('listing.safetyTip3')}</li>
                  <li>{t('listing.safetyTip4')}</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
