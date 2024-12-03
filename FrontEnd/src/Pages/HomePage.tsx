import React from 'react';
import { Search } from 'lucide-react';
import NannyCard from '../components/NannyCard'; // Importando o NannyCard
import NannyForm from '../components/NannyForm'; // Importando o NannyForm
import image1 from '../assets/black.jpeg';
import image2 from '../assets/chinese.jpg';
import image3 from '../assets/mestica.jpeg';
import image4 from '../assets/white.webp';
import image5 from '../assets/white1.jpg';

const ExpressNanniesHomepage = () => {
  const nannies = [
    {
      id: 1,
      name: 'Alice',
      experience: 5,
      photo: '../assets/white1.jpg',
      rating: 4.8,
      location: 'Maputo',
      availableFrom: '8AM',
      availableTo: '6PM',
      hourlyRate: 10,
      languages: ['English', 'Portuguese'],
      specialties: ['First Aid', 'Child Psychology'],
    },
    {
      id: 2,
      name: 'Maria',
      experience: 3,
      photo: '/api/placeholder/300/300',
      rating: 4.5,
      location: 'Beira',
      availableFrom: '9AM',
      availableTo: '5PM',
      hourlyRate: 8,
      languages: ['Portuguese'],
      specialties: ['Infant Care', 'Special Needs'],
    },
  ];

  const images = [image1, image2, image3, image4, image5]; // Array com as imagens do carrossel

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-rose-500 mb-4">
            Express Nannies
          </h1>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
            Welcome to Express Nannies, your trusted platform for finding reliable temporary nannies in Mozambique. Whether you're a tourist enjoying a night out, an expat in need of temporary support, or a parent whose nanny is unavailable, we're here to provide peace of mind with vetted, experienced caregivers.
          </p>
        </div>

        {/* Image Carousel */}
<div className="max-w-6xl mx-auto mb-12 p-4">
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
    {images.map((image, index) => (
      <div
        key={index}
        className="relative rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
      >
        <img
          src={image}
          alt={`Happy family ${index + 1}`}
          className="w-full h-full object-cover"
        />
      </div>
    ))}
  </div>
</div>


        {/* Search Section */}
        <div className="relative max-w-2xl mx-auto mb-12">
          <input
            type="text"
            placeholder="Search for nannies..."
            className="w-full px-6 py-4 rounded-full border border-gray-200 shadow-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200"
          />
          <Search
            className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
        </div>

        {/* Featured Section */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
            Our Trusted Caregivers
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Discover our diverse community of experienced nannies ready to provide exceptional care for your children
          </p>
        </div>

        {/* Nannies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {nannies.map((nanny) => (
            <NannyCard key={nanny.id} nanny={nanny} />
          ))}
        </div>

        {/* Form Section */}
        <NannyForm />
      </div>
    </div>
  );
};

export default ExpressNanniesHomepage;
