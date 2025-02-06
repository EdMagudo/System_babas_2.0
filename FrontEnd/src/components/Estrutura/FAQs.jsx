import React from 'react';
import { useTranslation } from 'react-i18next';

const FAQs = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-6 mb-4">
      <h1 className="text-4xl font-extrabold text-transparent bg-gradient-to-r from-teal-600 to-green-600 bg-clip-text mb-12 text-center">
        {t('faq.title')}
      </h1>
      <div className="space-y-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-indigo-700">{t('faq.q1')}</h2>
          <p className="text-lg text-gray-700">{t('faq.a1')}</p>
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-indigo-700">{t('faq.q2')}</h2>
          <p className="text-lg text-gray-700">{t('faq.a2')}</p>
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-indigo-700">{t('faq.q3')}</h2>
          <p className="text-lg text-gray-700">{t('faq.a3')}</p>
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-indigo-700">{t('faq.q4')}</h2>
          <p className="text-lg text-gray-700">{t('faq.a4')}</p>
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-indigo-700">{t('faq.q5')}</h2>
          <p className="text-lg text-gray-700">{t('faq.a5')}</p>
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-indigo-700">{t('faq.q6')}</h2>
          <p className="text-lg text-gray-700">{t('faq.a6')}</p>
        </div>
      </div>
    </div>
  );
};

export default FAQs;
