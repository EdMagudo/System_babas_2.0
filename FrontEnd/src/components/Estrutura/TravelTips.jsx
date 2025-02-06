import React from 'react';
import { useTranslation } from 'react-i18next';

const TravelTips = () => {
  const { t } = useTranslation();

  const renderList = (key) => {
    const list = t(key, { returnObjects: true });
    if (Array.isArray(list)) {
      return list.map((item, index) => <li key={index} className="ml-4 text-lg">{item}</li>);
    }
    return <p className="text-lg text-gray-600">{list}</p>;
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-4 mb-4">
      <h1 className="text-4xl font-extrabold text-transparent bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text mb-12 text-center">
       
      </h1>
      <div className="space-y-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-indigo-700">{t('travelTips.entryRequirements.title')}</h2>
          <p className="text-lg text-gray-700">{t('travelTips.entryRequirements.visa')}</p>
          <p className="text-lg text-gray-700">{t('travelTips.entryRequirements.passport')}</p>
          <p className="text-lg text-gray-700">{t('travelTips.entryRequirements.vaccinations')}</p>
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-indigo-700">{t('travelTips.bestTimeToVisit.title')}</h2>
          <p className="text-lg text-gray-700">{t('travelTips.bestTimeToVisit.hotSeason')}</p>
          <p className="text-lg text-gray-700">{t('travelTips.bestTimeToVisit.coldSeason')}</p>
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-indigo-700">{t('travelTips.currencyAndPayments.title')}</h2>
          <p className="text-lg text-gray-700">{t('travelTips.currencyAndPayments.currency')}</p>
          <p className="text-lg text-gray-700">{t('travelTips.currencyAndPayments.payment')}</p>
          <p className="text-lg text-gray-700">{t('travelTips.currencyAndPayments.atms')}</p>
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-indigo-700">{t('travelTips.language.title')}</h2>
          <p className="text-lg text-gray-700">{t('travelTips.language.text')}</p>
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-indigo-700">{t('travelTips.safetyAndSecurity.title')}</h2>
          <p className="text-lg text-gray-700">{t('travelTips.safetyAndSecurity.political')}</p>
          <p className="text-lg text-gray-700">{t('travelTips.safetyAndSecurity.pettyCrime')}</p>
          <p className="text-lg text-gray-700">{t('travelTips.safetyAndSecurity.healthAndSafety')}</p>
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-indigo-700">{t('travelTips.transport.title')}</h2>
          <p className="text-lg text-gray-700">{t('travelTips.transport.flights')}</p>
          <p className="text-lg text-gray-700">{t('travelTips.transport.roadTravel')}</p>
          <p className="text-lg text-gray-700">{t('travelTips.transport.publicTransport')}</p>
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-indigo-700">{t('travelTips.topDestinations.title')}</h2>
          <ul className="space-y-2 pl-4 text-gray-700">
            {renderList('travelTips.topDestinations.destinations')}
          </ul>
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-indigo-700">{t('travelTips.foodAndDrinks.title')}</h2>
          <p className="text-lg text-gray-700">{t('travelTips.foodAndDrinks.seafood')}</p>
          <p className="text-lg text-gray-700">{t('travelTips.foodAndDrinks.localDishes')}</p>
          <p className="text-lg text-gray-700">{t('travelTips.foodAndDrinks.drinks')}</p>
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-indigo-700">{t('travelTips.cultureAndEtiquette.title')}</h2>
          <p className="text-lg text-gray-700">{t('travelTips.cultureAndEtiquette.respectTraditions')}</p>
          <p className="text-lg text-gray-700">{t('travelTips.cultureAndEtiquette.greetings')}</p>
          <p className="text-lg text-gray-700">{t('travelTips.cultureAndEtiquette.photography')}</p>
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-indigo-700">{t('travelTips.activitiesToConsider.title')}</h2>
          <ul className="space-y-2 pl-4 text-gray-700">
            {renderList('travelTips.activitiesToConsider.activities')}
          </ul>
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-indigo-700">{t('travelTips.usefulContacts.title')}</h2>
          <p className="text-lg text-gray-700">{t('travelTips.usefulContacts.emergency')}</p>
          <p className="text-lg text-gray-700">{t('travelTips.usefulContacts.police')}</p>
          <ul className="space-y-2 pl-4 text-gray-700">
            {renderList('travelTips.usefulContacts.hospitals')}
          </ul>
          <p className="text-lg text-gray-700">{t('travelTips.usefulContacts.other.airport')}</p>
          <p className="text-lg text-gray-700">{t('travelTips.usefulContacts.other.LAM')}</p>
          <p className="text-lg text-gray-700">{t('travelTips.usefulContacts.other.firefighters')}</p>
        </div>
      </div>
    </div>
  );
};

export default TravelTips;
