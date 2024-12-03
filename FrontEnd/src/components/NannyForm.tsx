import React, { useState } from 'react';

const NannyRegistrationForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    personalInfo: {},
    qualifications: {},
    availability: {},
    experience: {},
    backgroundCheck: {},
    workPreferences: {},
    languages: {},
    additionalInfo: ''
  });

  const steps = [
    {
      title: 'Informações Pessoais',
      component: PersonalInfoStep
    },
    {
      title: 'Formação & Qualificações',
      component: QualificationsStep
    },
    {
      title: 'Disponibilidade & Experiência',
      component: AvailabilityStep
    },
    {
      title: 'Verificação de Antecedentes',
      component: BackgroundCheckStep
    },
    {
      title: 'Preferências de Trabalho',
      component: WorkPreferencesStep
    },
    {
      title: 'Idiomas & Informações Adicionais',
      component: LanguagesStep
    },
    {
      title: 'Revisar & Enviar',
      component: ReviewStep
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const CurrentStepComponent = steps[currentStep - 1].component;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-2xl rounded-2xl mt-16 mb-8" >
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-4">
          Junte-se à Nossa Equipe de Babás Confiáveis
        </h1>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{width: `${(currentStep / steps.length) * 100}%`}}
          />
        </div>
      </div>

      <CurrentStepComponent />

      <div className="flex justify-between mt-6">
        {currentStep > 1 && (
          <button 
            onClick={prevStep} 
            className="px-4 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-50"
          >
            Anterior
          </button>
        )}

        {currentStep < steps.length ? (
          <button 
            onClick={nextStep} 
            className="ml-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Próximo
          </button>
        ) : (
          <button 
            className="ml-auto px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Enviar Inscrição
          </button>
        )}
      </div>
    </div>
  );
};

const PersonalInfoStep = () => (
  <div className="space-y-4">
    <h2 className="text-xl font-semibold text-blue-700">Informações Pessoais</h2>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block mb-2">Nome</label>
        <input 
          type="text"
          placeholder="Primeiro Nome" 
          className="w-full px-3 py-2 border rounded"
          required 
        />
      </div>
      <div>
        <label className="block mb-2">Sobrenome</label>
        <input 
          type="text"
          placeholder="Último Nome" 
          className="w-full px-3 py-2 border rounded"
          required 
        />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block mb-2">Data de Nascimento</label>
        <input 
          type="date" 
          className="w-full px-3 py-2 border rounded"
          required 
        />
      </div>
      <div>
        <label className="block mb-2">Número de Contato</label>
        <input 
          type="tel" 
          placeholder="+55 123 456 7890" 
          className="w-full px-3 py-2 border rounded"
          required 
        />
      </div>
    </div>
  </div>
);

const QualificationsStep = () => (
  <div className="space-y-4">
    <h2 className="text-xl font-semibold text-blue-700">Formação & Qualificações</h2>
    <div>
      <label className="block mb-2">Nível de Educação</label>
      <select 
        className="w-full px-3 py-2 border rounded"
      >
        <option value="">Selecione o Nível de Educação</option>
        <option value="none">Nenhum</option>
        <option value="secondary">Estudante (Ensino Médio)</option>
        <option value="grade10">Ensino Médio Incompleto</option>
        <option value="grade12">Ensino Médio Completo</option>
        <option value="tvet-student">Estudante (Técnico ou Universidade)</option>
        <option value="tvet-graduate">Técnico Graduado</option>
        <option value="university-graduate">Graduado Universitário</option>
      </select>
    </div>
  </div>
);

const AvailabilityStep = () => (
  <div className="space-y-4">
    <h2 className="text-xl font-semibold text-blue-700">Disponibilidade & Experiência</h2>
    
    <div className="space-y-2">
      <label className="block mb-2">Tipo de Trabalho</label>
      <div className="flex space-x-4">
        <label className="inline-flex items-center">
          <input 
            type="radio" 
            name="job-type" 
            className="form-radio" 
            value="full-time" 
          />
          <span className="ml-2">Tempo Integral</span>
        </label>
        <label className="inline-flex items-center">
          <input 
            type="radio" 
            name="job-type" 
            className="form-radio" 
            value="temporary" 
          />
          <span className="ml-2">Temporário</span>
        </label>
      </div>
    </div>

    <div className="space-y-2">
      <label className="block mb-2">Experiência</label>
      <select className="w-full px-3 py-2 border rounded">
        <option value="">Anos de Experiência</option>
        <option value="none">Nenhum</option>
        <option value="1-2">1 - 2 anos</option>
        <option value="3-5">3 - 5 anos</option>
        <option value="5+">Mais de 5 anos</option>
      </select>
    </div>

    <div className="space-y-2">
      <label className="block mb-2">Grupos Etários com Experiência</label>
      <div className="grid grid-cols-2 gap-2">
        {['Bebês (0-12 meses)', 'Crianças pequenas (1-3 anos)', 
          'Pré-escolares (4-5 anos)', 'Idade escolar (6-12 anos)', 
          'Adolescentes (13+ anos)'].map((group, index) => (
          <label key={index} className="inline-flex items-center">
            <input 
              type="checkbox" 
              className="form-checkbox" 
              value={group} 
            />
            <span className="ml-2">{group}</span>
          </label>
        ))}
      </div>
    </div>
  </div>
);

const BackgroundCheckStep = () => (
  <div className="space-y-4">
    <h2 className="text-xl font-semibold text-blue-700">Verificação de Antecedentes</h2>
    <div className="space-y-2">
      <div>
        <label className="block mb-2">Possui Antecedentes Criminais?</label>
        <div className="flex space-x-4">
          <label className="inline-flex items-center">
            <input 
              type="radio" 
              name="criminal-record" 
              className="form-radio" 
              value="yes" 
            />
            <span className="ml-2">Sim</span>
          </label>
          <label className="inline-flex items-center">
            <input 
              type="radio" 
              name="criminal-record" 
              className="form-radio" 
              value="no" 
            />
            <span className="ml-2">Não</span>
          </label>
        </div>
      </div>
    </div>
  </div>
);

const WorkPreferencesStep = () => (
  <div className="space-y-4">
    <h2 className="text-xl font-semibold text-blue-700">Preferências de Trabalho</h2>
    <div className="space-y-2">
      <div>
        <label className="block mb-2">Disponível para Crianças com Necessidades Especiais?</label>
        <div className="flex space-x-4">
          <label className="inline-flex items-center">
            <input 
              type="radio" 
              name="special-needs" 
              className="form-radio" 
              value="yes" 
            />
            <span className="ml-2">Sim</span>
          </label>
          <label className="inline-flex items-center">
            <input 
              type="radio" 
              name="special-needs" 
              className="form-radio" 
              value="no" 
            />
            <span className="ml-2">Não</span>
          </label>
        </div>
      </div>
    </div>
  </div>
);

const LanguagesStep = () => (
  <div className="space-y-4">
    <h2 className="text-xl font-semibold text-blue-700">Idiomas & Informações Adicionais</h2>
    <div className="space-y-2">
      <label className="block mb-2">Idiomas</label>
      <div className="grid grid-cols-2 gap-2">
        {['Português', 'Inglês', 'Línguas Locais'].map((lang, index) => (
          <label key={index} className="inline-flex items-center">
            <input 
              type="checkbox" 
              className="form-checkbox" 
              value={lang} 
            />
            <span className="ml-2">{lang}</span>
          </label>
        ))}
      </div>
      <div className="mt-2">
        <label className="block mb-2">Outros Idiomas</label>
        <input 
          type="text"
          placeholder="Especifique outros idiomas" 
          className="w-full px-3 py-2 border rounded"
        />
      </div>
    </div>
    <div className="space-y-2 mt-4">
      <label className="block mb-2">Informações Adicionais</label>
      <textarea 
        placeholder="Outras informações que gostaria de compartilhar" 
        className="w-full px-3 py-2 border rounded h-24"
      />
    </div>
  </div>
);

const ReviewStep = () => (
  <div className="space-y-4">
    <h2 className="text-xl font-semibold text-blue-700">Revisar Inscrição</h2>
    <div className="bg-blue-50 p-4 rounded-lg">
      <p>Por favor, revise cuidadosamente todas as suas informações antes de enviar.</p>
      <p className="mt-2 text-sm text-gray-600">
        Após clicar em 'Enviar Inscrição', processaremos seu registro 
        e entraremos em contato com mais instruções.
      </p>
    </div>
  </div>
);

export default NannyRegistrationForm;