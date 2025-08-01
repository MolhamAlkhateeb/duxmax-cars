import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Star, MapPin, Phone, Mail, Globe, Car, Calendar, Award } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DealersRepository } from "@/db/repositories/dealers.repository";

type Props = {
  params: Promise<{ dealerId: string; locale: string }>;
};

export default async function DealerDetailPage({ params }: Props) {
  const { dealerId } = await params;
  
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
                  Verified Dealer
                </Badge>
              )}
            </div>
            
            <p className="text-lg text-gray-600 mb-4">
              Professional car dealer with premium vehicle selection
            </p>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                <span className="font-medium">4.5</span>
                <span className="ml-1">(125 reviews)</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                <span>Est. {dealer.createdAt ? new Date(dealer.createdAt).getFullYear() : '2020'}</span>
              </div>
              <div className="flex items-center">
                <Car className="w-4 h-4 mr-1" />
                <span>25 active listings</span>
              </div>
            </div>
          </div>
          
          <div className="lg:text-right">
            <Button size="lg" className="mb-2 w-full lg:w-auto">
              Contact Dealer
            </Button>
            <div className="text-sm text-gray-600">
              <div>Response time: ~2 hours</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">25</div>
            <div className="text-sm text-gray-600">Active Listings</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">500+</div>
            <div className="text-sm text-gray-600">Cars Sold</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">4.5★</div>
            <div className="text-sm text-gray-600">Rating</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600 mb-1">{dealer.createdAt ? new Date().getFullYear() - new Date(dealer.createdAt).getFullYear() : 3}+</div>
            <div className="text-sm text-gray-600">Years Experience</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="listings">Listings</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>About {dealer.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">
                    {dealer.name} is a trusted automotive dealer committed to providing quality vehicles and exceptional customer service. 
                    We specialize in connecting buyers with the perfect vehicles to meet their needs and budget.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Subscription Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-yellow-500" />
                      <span>
                        {dealer.subscription?.tier 
                          ? `${dealer.subscription.tier.charAt(0).toUpperCase() + dealer.subscription.tier.slice(1)} Plan`
                          : 'Basic Plan'
                        }
                      </span>
                      {dealer.subscription?.isActive && (
                        <Badge className="bg-green-100 text-green-800 text-xs">Active</Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Specialties</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Premium Vehicles</Badge>
                    <Badge variant="secondary">Quality Service</Badge>
                    <Badge variant="secondary">Competitive Pricing</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Vehicle Sales</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Trade-ins</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Financing Options</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Customer Support</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Working Hours</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div>
                      <div className="font-medium">Monday - Friday</div>
                      <div className="text-gray-600">9:00 AM - 7:00 PM</div>
                    </div>
                    <div>
                      <div className="font-medium">Saturday - Sunday</div>
                      <div className="text-gray-600">10:00 AM - 6:00 PM</div>
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
              <CardTitle>Current Listings</CardTitle>
              <CardDescription>
                Browse all cars currently available from {dealer.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Car className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  25 Cars Available
                </h3>
                <p className="text-gray-600 mb-4">
                  View all cars from this dealer
                </p>
                <Button asChild>
                  <Link href={`/listings?dealer=${dealer.id}`}>
                    View All Listings
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <CardTitle>Customer Reviews</CardTitle>
              <CardDescription>
                125 reviews with an average rating of 4.5/5
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Star className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Customer Reviews Coming Soon
                </h3>
                <p className="text-gray-600">
                  Review system will be available in the next update
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <div className="font-medium">Location</div>
                      <div className="text-gray-600">UAE - Professional Dealer</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <div className="font-medium">Phone</div>
                      <div className="text-gray-600">{dealer.phone || 'Contact via message'}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <div className="font-medium">Email</div>
                      <div className="text-gray-600">{dealer.email}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Globe className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <div className="font-medium">Contact</div>
                      <div className="text-gray-600">Message via platform</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <Button className="w-full" size="lg">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Now
                  </Button>
                  <Button variant="outline" className="w-full" size="lg">
                    <Mail className="w-4 h-4 mr-2" />
                    Send Email
                  </Button>
                  <Button variant="outline" className="w-full" size="lg">
                    <Globe className="w-4 h-4 mr-2" />
                    Visit Website
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
