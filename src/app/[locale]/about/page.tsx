import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, Users, Shield, Award } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">About DuxMax</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          UAE&apos;s premier online marketplace for buying and selling quality used cars. 
          We connect thousands of buyers and sellers across the Emirates with a platform 
          built on trust, transparency, and convenience.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Car className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-lg">Quality Cars</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Every car listing is verified to ensure quality and authenticity
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-lg">Trusted Community</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Join thousands of satisfied buyers and sellers in our community
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-purple-600" />
            </div>
            <CardTitle className="text-lg">Secure Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Advanced security measures protect your personal and financial information
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <Award className="h-6 w-6 text-orange-600" />
            </div>
            <CardTitle className="text-lg">Expert Support</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              24/7 customer support in both Arabic and English languages
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Our Story */}
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Our Story</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              Founded in 2024, DuxMax was born from a simple idea: make buying and selling 
              cars in the UAE easier, safer, and more transparent. We recognized that the 
              traditional car marketplace lacked the digital innovation that modern consumers 
              expect.
            </p>
            <p className="text-gray-600 mb-6">
              Our platform brings together individual sellers and verified dealers, creating 
              a comprehensive marketplace where buyers can find exactly what they&apos;re looking 
              for. Whether you&apos;re searching for your first car, upgrading to a luxury vehicle, 
              or looking to sell your current car, DuxMax provides the tools and support you need.
            </p>
            <p className="text-gray-600">
              With bilingual support and deep understanding of the UAE market, we&apos;re committed 
              to serving our diverse community with excellence. Our goal is to become the most 
              trusted name in the UAE automotive marketplace.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
