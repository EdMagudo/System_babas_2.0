import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  MapPin, 
  Palmtree, 
  Utensils, 
  AlertCircle, 
  Building, 
  Umbrella, 
  Coffee, 
  Home,
  ChefHat,
  Ship,
  Star,
  Heart,
  Sun,
  Calendar,
  Car,
  DollarSign,
  Droplet
} from 'lucide-react';

const MozambiqueTravelGuide = () => {
  const { t } = useTranslation(); // Hook para traduções
  const [activeTab, setActiveTab] = useState('attractions');
  const [hoveredCard, setHoveredCard] = useState(null);

  const categories = [
    { id: 'attractions', icon: <MapPin size={24} />, label: t('travelGuide.family_attractions'), color: 'bg-indigo-500' },
    { id: 'safaris', icon: <Palmtree size={24} />, label: t('travelGuide.national_parks'), color: 'bg-emerald-500' },
    { id: 'restaurants', icon: <Utensils size={24} />, label: t('travelGuide.restaurants_in_maputo'), color: 'bg-amber-500' },
    { id: 'tips', icon: <AlertCircle size={24} />, label: t('travelGuide.essential_tips'), color: 'bg-rose-500' }
  ];

  const attractions = [
    { icon: <Building size={24} />, name: 'Cathedral of Our Lady of the Immaculate Conception' },
    { icon: <Star size={24} />, name: 'FEIMA - Feira de Artesanato' },
    { icon: <Home size={24} />, name: 'Maputo Central Train Station' },
    { icon: <Building size={24} />, name: 'Maputo Central Market' }
  ];

  const parks = [
    { icon: <Palmtree size={24} />, name: 'Maputo National Park' },
    { icon: <Palmtree size={24} />, name: 'Bazaruto National Park' },
    { icon: <Palmtree size={24} />, name: 'Gorongoza National Park' },
    { icon: <Palmtree size={24} />, name: 'Niassa Reserve' }
  ];

  const beaches = [
    { icon: <Umbrella size={24} />, name: 'Ponta de Ouro' },
    { icon: <Umbrella size={24} />, name: 'Ponta Mamoli Bay' },
    { icon: <Ship size={24} />, name: 'Inhaca Island' },
    { icon: <Umbrella size={24} />, name: 'Macaneta' },
    { icon: <Umbrella size={24} />, name: 'Bilene' },
    { icon: <Umbrella size={24} />, name: 'Vilanculos' },
    { icon: <Umbrella size={24} />, name: 'Tofo' },
    { icon: <Ship size={24} />, name: 'Bazaruto Archipelago' },
    { icon: <Ship size={24} />, name: 'Ilha de Moçambique' },
    { icon: <Umbrella size={24} />, name: 'Pemba' }
  ];

  const restaurants = {
    maputo: [
      { icon: <ChefHat size={24} />, name: 'A Nossa Tasca' },
      { icon: <ChefHat size={24} />, name: 'Artistas' },
      { icon: <ChefHat size={24} />, name: 'Botanica' },
      { icon: <ChefHat size={24} />, name: 'Calypso' },
      { icon: <ChefHat size={24} />, name: 'Fish Market' },
      { icon: <ChefHat size={24} />, name: 'Mundos' }
    ],
    coastal: [
      { icon: <Coffee size={24} />, name: 'A Florestinha do Indico' },
      { icon: <Coffee size={24} />, name: 'Love Café and Deli' },
      { icon: <Utensils size={24} />, name: 'Pontas Restaurant' },
      { icon: <Heart size={24} />, name: 'Complexo Palmeiras' },
      { icon: <Umbrella size={24} />, name: 'San Martinho Beach club' }
    ]
  };

  const travelTips = [
    { icon: <AlertCircle size={24} />, text: t('travelGuide.malaria_risk') },
    { icon: <Calendar size={24} />, text: t('travelGuide.best_climate') },
    { icon: <Car size={24} />, text: t('travelGuide.4x4_rental') },
    { icon: <DollarSign size={24} />, text: t('travelGuide.tip_standard') },
    { icon: <Droplet size={24} />, text: t('travelGuide.water') }
  ];

  const LocationCard = ({ icon, text, index }) => (
    <div 
      className={`group transition-all duration-300 hover:scale-105 cursor-pointer
        ${hoveredCard === index ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
      onMouseEnter={() => setHoveredCard(index)}
      onMouseLeave={() => setHoveredCard(null)}
    >
      <div className="p-4 flex items-center gap-4">
        <div className="p-2 rounded-full bg-blue-50 group-hover:bg-blue-100 transition-colors">
          {icon}
        </div>
        <span className="font-medium group-hover:text-blue-600 transition-colors">{text}</span>
      </div>
    </div>
  );

  const renderSection = (section) => {
    switch (section) {
      case 'attractions':
        return (
          <div className="space-y-8">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {t('travelGuide.places_to_visit_in_mozambique')}
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {attractions.map((item, index) => (
                <LocationCard key={index} icon={item.icon} text={item.name} index={index} />
              ))}
            </div>
          </div>
        );
      
      case 'safaris':
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-6">
                {t('travelGuide.national_parks')}
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {parks.map((park, index) => (
                  <LocationCard key={index} icon={park.icon} text={park.name} index={`park-${index}`} />
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent mb-6">
                {t('travelGuide.beaches')}
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {beaches.map((beach, index) => (
                  <LocationCard key={index} icon={beach.icon} text={beach.name} index={`beach-${index}`} />
                ))}
              </div>
            </div>
          </div>
        );

      case 'restaurants':
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent mb-6">
                {t('travelGuide.restaurants_in_maputo')}
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {restaurants.maputo.map((restaurant, index) => (
                  <LocationCard key={index} icon={restaurant.icon} text={restaurant.name} index={`maputo-${index}`} />
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-amber-500 to-yellow-500 bg-clip-text text-transparent mb-6">
                {t('travelGuide.coastal_restaurants')}
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {restaurants.coastal.map((restaurant, index) => (
                  <LocationCard key={index} icon={restaurant.icon} text={restaurant.name} index={`coastal-${index}`} />
                ))}
              </div>
            </div>
          </div>
        );

      case 'tips':
        return (
          <div className="space-y-8">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-6">
              {t('travelGuide.essential_tips')}
            </h3>
            <div className="space-y-4">
              {travelTips.map((tip, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="p-2 rounded-full bg-pink-50">
                    {tip.icon}
                  </div>
                  <span>{tip.text}</span>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex gap-8 mb-6">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveTab(category.id)}
            className={`flex gap-2 items-center p-4 rounded-lg 
              ${activeTab === category.id ? 'bg-gray-100 shadow-lg' : ''}`}
          >
            {category.icon}
            <span>{category.label}</span>
          </button>
        ))}
      </div>
      <div>
        {renderSection(activeTab)}
      </div>
    </div>
  );
};

export default MozambiqueTravelGuide;
