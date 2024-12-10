import React, { useEffect, useState } from "react";
import axios from "axios";

type UserQualificationsProps = {
  idUser: string;
};

type NannyProfiles = {
  workPreferences: string[];
  ageExperiences: string[];
  languages: string[];
};

const UserQualifications: React.FC<UserQualificationsProps> = ({ idUser }) => {
  const [nannyProfiles, setNannyProfiles] = useState<NannyProfiles | null>(
    null
  );
  const [languagesList, setLanguagesList] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    work_preference: [] as string[],
    preference_age: [] as string[],
    languages: [] as string[],
  });
  const [loading, setLoading] = useState(true);

  // Função para buscar os dados do usuário
  const fetchNannyProfile = async () => {
    try {
      const response = await axios.get(`http://localhost:3005/user/${idUser}`);
      const data = response.data;
      setNannyProfiles(data);
      console.log("Work Preferences:", data.nannyProfile.workPreferences);
      setFormData({
        work_preference:
          data.nannyProfile &&
          data.nannyProfile.workPreferences &&
          Array.isArray(data.nannyProfile.workPreferences)
            ? data.nannyProfile.workPreferences.map(
                (pref) => pref.work_preference
              ) // Mapeia 'work_preference'
            : [],
        preference_age:
          data.ageExperiences && Array.isArray(data.ageExperiences)
            ? data.ageExperiences.map((exp) => exp.age_group)
            : [],
        languages: Array.isArray(data.languages) ? data.languages : [],
      });
    } catch (error) {
      console.error("Erro ao buscar o perfil:", error);
    } finally {
      setLoading(false);
    }
  };

  // Função para buscar os idiomas disponíveis
  const fetchLanguages = async () => {
    try {
      const response = await axios.get("http://localhost:3005/languages");
      setLanguagesList(response.data);
    } catch (error) {
      console.error("Erro ao buscar idiomas:", error);
    }
  };

  // Função para adicionar idioma
  const addLanguage = async (language: string) => {
    try {
      await axios.post(`http://localhost:3005/user/${idUser}/languages`, {
        language,
      });
      setFormData((prev) => ({
        ...prev,
        languages: [...prev.languages, language],
      }));
    } catch (error) {
      console.error("Erro ao adicionar idioma:", error);
    }
  };

  // Função para remover idioma
  const removeLanguage = async (language: string) => {
    try {
      await axios.delete(`http://localhost:3005/lang/${idUser}/${language}`);
      setFormData((prev) => ({
        ...prev,
        languages: prev.languages.filter((lang) => lang !== language),
      }));
    } catch (error) {
      console.error("Erro ao remover idioma:", error);
    }
  };

  // Função para adicionar preferência de trabalho
  const addWorkPreference = async (preference: string) => {
    try {
      await axios.post(
        `http://localhost:3005/user/${idUser}/work-preferences`,
        { preference }
      );
      setFormData((prev) => ({
        ...prev,
        work_preference: [...prev.work_preference, preference],
      }));
    } catch (error) {
      console.error("Erro ao adicionar preferência de trabalho:", error);
    }
  };

  // Função para remover preferência de trabalho
  const removeWorkPreference = async (preference: string) => {
    try {
      await axios.delete(
        `http://localhost:3005/user/${idUser}/${preference}`);

      setFormData((prev) => ({
        ...prev,
        work_preference: prev.work_preference.filter(
          (pref) => pref !== preference
        ),
      }));
    } catch (error) {
      console.error("Erro ao remover preferência de trabalho:", error);
    }
  };

  // Função para adicionar experiência de idade
  const addAgeExperience = async (ageExperience: string) => {
    try {
      await axios.post(`http://localhost:3005/user/${idUser}/age-experience`, {
        ageExperience,
      });
      setFormData((prev) => ({
        ...prev,
        preference_age: [...prev.preference_age, ageExperience],
      }));
    } catch (error) {
      console.error("Erro ao adicionar experiência de idade:", error);
    }
  };

  // Função para remover experiência de idade
  const removeAgeExperience = async (ageExperience: string) => {
    try {
      await axios.delete(
        `http://localhost:3005/user/${idUser}/age-experience`,
        { data: { ageExperience } }
      );
      setFormData((prev) => ({
        ...prev,
        preference_age: prev.preference_age.filter(
          (exp) => exp !== ageExperience
        ),
      }));
    } catch (error) {
      console.error("Erro ao remover experiência de idade:", error);
    }
  };

  useEffect(() => {
    fetchNannyProfile();
    fetchLanguages();
  }, [idUser]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!nannyProfiles) {
    return <div>No data found for the user.</div>;
  }

  return (
    <div className="mt-6">
      {/* Work Preference */}
      <h2 className="text-xl font-semibold text-blue-700">Work Preferences</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-2">Assigned Work Preferences</label>
          <select
            value={formData.work_preference[0] || ""}
            onChange={(e) => {
              removeAgeExperience(formData.work_preference[0]);
            }}
            className="w-full px-3 py-2 border rounded"
          >
            {nannyProfiles.nannyProfile.workPreferences.map((pref, index) => (
              <option key={index} value={pref.work_preference}>
                {pref.work_preference.charAt(0).toUpperCase() +
                  pref.work_preference.slice(1)}
              </option>
            ))}
          </select>
          <button
            className="mt-2 bg-red-500 text-white p-2 rounded"
            onClick={() => removeWorkPreference(formData.work_preference[0])}
          >
            Remove Work Preference
          </button>
        </div>

        <div>
          <label className="block mb-2">Available Work Preferences</label>
          <select
            value=""
            onChange={(e) => {
              const selected = e.target.value;
              if (selected) {
                addWorkPreference(selected); // Add selected preference
              }
            }}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="" disabled>
              Select a work preference
            </option>
            {["morning", "afternoon", "evening", "overnight"]
              .filter(
                (preference) => !formData.work_preference.includes(preference)
              )
              .map((preference, index) => (
                <option key={index} value={preference}>
                  {preference.charAt(0).toUpperCase() + preference.slice(1)}
                </option>
              ))}
          </select>
          <button
            className="mt-2 bg-green-500 text-white p-2 rounded"
            onClick={() => {
              const selected =
                formData.work_preference[formData.work_preference.length - 1];
              if (selected) {
                addWorkPreference(selected); // Add last selected preference
              }
            }}
          >
            Add Work Preference
          </button>
        </div>
      </div>

      {/* Age Experience Preferences */}
      <h2 className="text-xl font-semibold text-blue-700 mt-6">
        Age Experience Preferences
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-2">Assigned Age Experiences</label>
          <select
            value={formData.preference_age[0] || ""}
            onChange={(e) => {
              removeAgeExperience(formData.preference_age[0]);
            }}
            className="w-full px-3 py-2 border rounded"
          >
            {nannyProfiles.ageExperiences.map((age, index) => (
              <option key={index} value={age}>
                {age.charAt(0).toUpperCase() + age.slice(1)}
              </option>
            ))}
          </select>
          <button
            className="mt-2 bg-red-500 text-white p-2 rounded"
            onClick={() => removeAgeExperience(formData.preference_age[0])}
          >
            Remove Age Experience
          </button>
        </div>

        <div>
          <label className="block mb-2">Available Age Experiences</label>
          <select
            value=""
            onChange={(e) => {
              const selected = e.target.value;
              if (selected && !formData.preference_age.includes(selected)) {
                addAgeExperience(selected); // Add selected age experience if not already in the assigned list
              }
            }}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="" disabled>
              Select an age experience
            </option>
            {["babies", "toddlers", "children", "teenagers"]
              .filter((age) => !formData.preference_age.includes(age)) // Ensure selected is not in assigned
              .map((age, index) => (
                <option key={index} value={age}>
                  {age.charAt(0).toUpperCase() + age.slice(1)}
                </option>
              ))}
          </select>
          <button
            className="mt-2 bg-green-500 text-white p-2 rounded"
            onClick={() => {
              const selected =
                formData.preference_age[formData.preference_age.length - 1];
              if (selected && !formData.preference_age.includes(selected)) {
                addAgeExperience(selected); // Add last selected age experience if not already in the assigned list
              }
            }}
          >
            Add Age Experience
          </button>
        </div>
      </div>

      {/* Languages */}
      <h2 className="text-xl font-semibold text-blue-700 mt-6">Languages</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-2">Assigned Languages</label>
          <select
            value={formData.languages[0] || ""}
            onChange={(e) => {
              removeLanguage(formData.languages[0]);
            }}
            className="w-full px-3 py-2 border rounded"
          >
            {formData.languages.map((language, index) => (
              <option key={index} value={language}>
                {language.charAt(0).toUpperCase() + language.slice(1)}
              </option>
            ))}
          </select>
          <button
            className="mt-2 bg-red-500 text-white p-2 rounded"
            onClick={() => removeLanguage(formData.languages[0])}
          >
            Remove Language
          </button>
        </div>

        <div>
          <label className="block mb-2">Available Languages</label>
          <select
            value=""
            onChange={(e) => {
              const selected = e.target.value;
              if (selected) {
                addLanguage(selected); // Add selected language
              }
            }}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="" disabled>
              Select a language
            </option>
            {languagesList
              .filter((language) => !formData.languages.includes(language))
              .map((language, index) => (
                <option key={index} value={language}>
                  {language.charAt(0).toUpperCase() + language.slice(1)}
                </option>
              ))}
          </select>
          <button
            className="mt-2 bg-green-500 text-white p-2 rounded"
            onClick={() => {
              const selected =
                formData.languages[formData.languages.length - 1];
              if (selected) {
                addLanguage(selected); // Add last selected language
              }
            }}
          >
            Add Language
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserQualifications;
