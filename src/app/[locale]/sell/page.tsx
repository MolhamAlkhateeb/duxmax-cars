"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Car, MapPin, DollarSign, LogIn } from "lucide-react";
import { SignedIn, SignedOut } from "@daveyplate/better-auth-ui";
import Link from "next/link";

export default function SellPage() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: "",
    mileage: "",
    price: "",
    condition: "",
    fuelType: "",
    transmission: "",
    color: "",
    description: "",
    location: "",
    contactPhone: "",
    contactEmail: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement listing creation
    console.log("Sell form submitted:", formData);
  };

  // Component to show when user is not signed in
  const AuthRequiredCard = () => (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card className="text-center">
        <CardHeader>
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <LogIn className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Sign In Required</CardTitle>
          <CardDescription className="text-lg">
            You need to be signed in to create a listing and sell your car.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg text-left">
            <h3 className="font-semibold text-blue-900 mb-2">Why create an account?</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Manage your car listings</li>
              <li>• Communicate with potential buyers</li>
              <li>• Track inquiries and messages</li>
              <li>• Access your seller dashboard</li>
            </ul>
          </div>
          <p className="text-gray-600">
            Join thousands of sellers on DuxMax and reach potential buyers across the UAE.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href={`/${locale}/auth/signin`}>
                Sign In
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/${locale}/auth/signup`}>
                Create Account
              </Link>
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            Creating an account is free and takes less than a minute.
          </p>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <>
      {/* Show auth required message for unauthenticated users */}
      <SignedOut>
        <AuthRequiredCard />
      </SignedOut>

      {/* Show sell form for authenticated users */}
      <SignedIn>
        <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Sell Your Car</h1>
        <p className="text-gray-600">
          Create a listing to sell your car to thousands of potential buyers
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Car Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Car className="mr-2 h-5 w-5" />
              Car Details
            </CardTitle>
            <CardDescription>
              Provide basic information about your car
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="make">Make</Label>
                <Select
                  value={formData.make}
                  onValueChange={(value) => setFormData({ ...formData, make: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select make" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="toyota">Toyota</SelectItem>
                    <SelectItem value="nissan">Nissan</SelectItem>
                    <SelectItem value="honda">Honda</SelectItem>
                    <SelectItem value="bmw">BMW</SelectItem>
                    <SelectItem value="mercedes">Mercedes-Benz</SelectItem>
                    <SelectItem value="audi">Audi</SelectItem>
                    <SelectItem value="lexus">Lexus</SelectItem>
                    <SelectItem value="infiniti">Infiniti</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  placeholder="e.g. Camry"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Select
                  value={formData.year}
                  onValueChange={(value) => setFormData({ ...formData, year: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 30 }, (_, i) => 2024 - i).map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mileage">Mileage (km)</Label>
                <Input
                  id="mileage"
                  type="number"
                  placeholder="e.g. 50000"
                  value={formData.mileage}
                  onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fuelType">Fuel Type</Label>
                <Select
                  value={formData.fuelType}
                  onValueChange={(value) => setFormData({ ...formData, fuelType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select fuel type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="petrol">Petrol</SelectItem>
                    <SelectItem value="diesel">Diesel</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                    <SelectItem value="electric">Electric</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="transmission">Transmission</Label>
                <Select
                  value={formData.transmission}
                  onValueChange={(value) => setFormData({ ...formData, transmission: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select transmission" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="automatic">Automatic</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="cvt">CVT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="condition">Condition</Label>
                <Select
                  value={formData.condition}
                  onValueChange={(value) => setFormData({ ...formData, condition: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excellent">Excellent</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="poor">Poor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <Input
                  id="color"
                  placeholder="e.g. White"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your car's features, condition, and any additional details..."
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="mr-2 h-5 w-5" />
              Pricing
            </CardTitle>
            <CardDescription>
              Set your asking price
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="price">Price (AED)</Label>
              <Input
                id="price"
                type="number"
                placeholder="e.g. 50000"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
              <p className="text-sm text-gray-500">
                Research similar cars to set a competitive price
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Location & Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="mr-2 h-5 w-5" />
              Location & Contact
            </CardTitle>
            <CardDescription>
              Where is your car located and how can buyers reach you?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Select
                value={formData.location}
                onValueChange={(value) => setFormData({ ...formData, location: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select emirate" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="abu-dhabi">Abu Dhabi</SelectItem>
                  <SelectItem value="dubai">Dubai</SelectItem>
                  <SelectItem value="sharjah">Sharjah</SelectItem>
                  <SelectItem value="ajman">Ajman</SelectItem>
                  <SelectItem value="ras-al-khaimah">Ras Al Khaimah</SelectItem>
                  <SelectItem value="fujairah">Fujairah</SelectItem>
                  <SelectItem value="umm-al-quwain">Umm Al Quwain</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Phone Number</Label>
                <Input
                  id="contactPhone"
                  type="tel"
                  placeholder="+971 XX XXX XXXX"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactEmail">Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Photos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Upload className="mr-2 h-5 w-5" />
              Photos
            </CardTitle>
            <CardDescription>
              Add photos to attract more buyers (coming soon)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">Photo upload functionality coming soon</p>
              <p className="text-sm text-gray-400 mt-2">
                For now, you can contact buyers to share photos directly
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline">
            Save as Draft
          </Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            Publish Listing
          </Button>
        </div>
      </form>
        </div>
      </SignedIn>
    </>
  );
}
