import React, { useEffect, useState } from "react";
import axios from "axios";

type UserQualificationsProps = {
  idUser: string;
};

const UserQualifications: React.FC<UserQualificationsProps> = ({ idUser }) => {
  const [formData, setFormData] = useState({
    work_preference: [] as string[],
    preference_age: [] as string[],
    languages: [] as string[],
  });

  const [languagesList, setLanguagesList] = useState<string[]>([]);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [selectedWorkPreference, setSelectedWorkPreference] = useState("");
  const [selectedAgeExperience, setSelectedAgeExperience] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedWorkPreferenceA, setSelectedWorkPreferenceA] =
    useState<string>("");

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, languagesRes] = await Promise.all([
          axios.get(`http://localhost:3005/user/${idUser}`),
          axios.get("http://localhost:3005/languages"),
        ]);

        setFormData({
          work_preference:
          userRes.data.nannyProfile?.workPreferences.map((wp) => wp.work_preference) || [],
          preference_age: userRes.data.ageExperiences || [],
          languages: userRes.data.languages || [],
        });

        setLanguagesList(languagesRes.data.languages);
        
      } catch (error) {
        showMessage("error", "Failed to load data. Please try again later.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [idUser]);

  const handleAdd = async (type: string, value: string) => {
    try {
      const endpoints = {
        work_preference: `http://localhost:3005/experienceWork/${idUser}`,
        preference_age: `http://localhost:3005/experienceAge/${idUser}`,
        languages: `http://localhost:3005/lang/${idUser}`,
      };

      await axios.post(endpoints[type], { [type]: value });
      setFormData((prev) => ({
        ...prev,
        [type]: [...prev[type], value],
      }));
      showMessage("success", `${value} added successfully.`);
    } catch (error) {
      showMessage("error", `Failed to add ${value}.`);
      console.error(error);
    }
  };

  const handleRemove = async (type: string, value: string) => {
    try {
      const endpoints = {
        work_preference: `http://localhost:3005/experienceWork/${idUser}/${value}`,
        preference_age: `http://localhost:3005/experienceAge/${idUser}/${value}`,
        languages: `http://localhost:3005/lang/${idUser}/${value}`,
      };

      await axios.delete(endpoints[type]);
      setFormData((prev) => ({
        ...prev,
        [type]: prev[type].filter((item) => item !== value),
      }));
      showMessage("success", `${value} removed successfully.`);
    } catch (error) {
      showMessage("error", `Failed to remove ${value}.`);
      console.error(error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
    {message.text && (
      <div
        className={`${
          message.type === "success"
            ? "bg-green-100 text-green-800 border border-green-500"
            : "bg-red-100 text-red-800 border border-red-500"
        } p-4 rounded-lg shadow-md mb-4`}
      >
        {message.text}
      </div>
    )}
  
  

      {/* Work Preferences */}
      <div>
  <h2 className="text-xl font-semibold text-blue-700 mb-4">
    Work Preferences
  </h2>
  <div className="grid grid-cols-2 gap-4">
    {/* Assigned Work Preferences */}
    <div>
      <label className="block mb-2">Assigned Work Preferences</label>
      <select
        value={selectedWorkPreference}
        onChange={(e) => setSelectedWorkPreference(e.target.value)}
        className="w-full px-3 py-2 border rounded"
      >
        <option value="" disabled>
          Select a preference to remove
        </option>
        {formData.work_preference.map((pref, index) => (
          <option key={index} value={pref}>
            {pref.charAt(0).toUpperCase() + pref.slice(1)}
          </option>
        ))}
      </select>
      <button
        className="mt-2 bg-red-500 text-white p-2 rounded"
        onClick={() => {
          if (selectedWorkPreference) {
            handleRemove("work_preference", selectedWorkPreference);
            showMessage("success", "Work preference removed successfully.");
          } else {
            showMessage("error", "Please select a work preference to remove.");
          }
        }}
      >
        Remove Work Preference
      </button>
    </div>

    {/* Available Work Preferences */}
    <div>
      <label className="block mb-2">Available Work Preferences</label>
      <select
        value={selectedWorkPreference}
        onChange={(e) => setSelectedWorkPreference(e.target.value)}
        className="w-full px-3 py-2 border rounded"
      >
        <option value="" disabled>
          Select a work preference to add
        </option>
        {["morning", "afternoon", "evening", "overnight"]
          .filter((pref) => !formData.work_preference.includes(pref))
          .map((pref, index) => (
            <option key={index} value={pref}>
              {pref.charAt(0).toUpperCase() + pref.slice(1)}
            </option>
          ))}
      </select>
      <button
        className="mt-2 bg-green-500 text-white p-2 rounded"
        onClick={() => {
          if (
            selectedWorkPreference &&
            !formData.work_preference.includes(selectedWorkPreference)
          ) {
            handleAdd("work_preference", selectedWorkPreference);
            showMessage("success", "Work preference added successfully.");
          } else {
            showMessage("error", "Please select a valid work preference to add.");
          }
        }}
      >
        Add Work Preference
      </button>
    </div>
  </div>
</div>



      {/* Age Preferences */}
      <div>
        <h2 className="text-xl font-semibold text-blue-700 mb-4">
          Age Experiences
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {/* Assigned Age Experiences */}
          <div>
            <label className="block mb-2">Assigned Age Experiences</label>
            <select
              value=""
              onChange={(e) => setSelectedAgeExperience(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="" disabled>
                Select an age experience to remove
              </option>
              {formData.preference_age.map((age, index) => (
                <option key={index} value={age}>
                  {age.charAt(0).toUpperCase() + age.slice(1)}
                </option>
              ))}
            </select>
            <button
              className="mt-2 bg-red-500 text-white p-2 rounded"
              onClick={() => {
                if (selectedAgeExperience) {
                    handleRemove("preference_age", selectedAgeExperience);
                  showMessage(
                    "success",
                    "Age experience removed successfully."
                  );
                } else {
                  showMessage(
                    "error",
                    "Please select an age experience to remove."
                  );
                }
              }}
            >
              Remove Age Experience
            </button>
          </div>

          {/* Available Age Experiences */}
          <div>
            <label className="block mb-2">Available Age Experiences</label>
            <select
              value={selectedAgeExperience}
              onChange={(e) => setSelectedAgeExperience(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="" disabled>
                Select an age experience to add
              </option>
              {["babies", "toddlers", "children", "teenagers"]
                .filter((age) => !formData.preference_age.includes(age))
                .map((age, index) => (
                  <option key={index} value={age}>
                    {age.charAt(0).toUpperCase() + age.slice(1)}
                  </option>
                ))}
            </select>
            <button
              className="mt-2 bg-green-500 text-white p-2 rounded"
              onClick={() => {
                if (
                  selectedAgeExperience &&
                  !formData.preference_age.includes(selectedAgeExperience)
                ) {
                    handleAdd("preference_age", selectedAgeExperience);
                  showMessage("success", "Age experience added successfully.");
                } else {
                  showMessage(
                    "error",
                    "Please select a valid age experience to add."
                  );
                }
              }}
            >
              Add Age Experience
            </button>
          </div>
        </div>
      </div>

      {/* Languages */}
      <div>
        <h2 className="text-xl font-semibold text-blue-700 mb-4">Languages</h2>
        <div className="grid grid-cols-2 gap-4">
          {/* Assigned Languages */}
          <div>
            <label className="block mb-2">Assigned Languages</label>
            <select
              value=""
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="" disabled>
                Select a language to remove
              </option>
              {formData.languages.map((language, index) => (
                <option key={index} value={language}>
                  {language.charAt(0).toUpperCase() + language.slice(1)}
                </option>
              ))}
            </select>
            <button
              className="mt-2 bg-red-500 text-white p-2 rounded"
              onClick={() => {
                if (selectedLanguage) {
                    handleRemove("languages", selectedLanguage);
                  showMessage("success", "Language removed successfully.");
                } else {
                  showMessage("error", "Please select a language to remove.");
                }
              }}
            >
              Remove Language
            </button>
          </div>

          {/* Available Languages */}
          <div>
            <label className="block mb-2">Available Languages</label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="" disabled>
                Select a language to add
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
                if (
                  selectedLanguage &&
                  !formData.languages.includes(selectedLanguage)
                ) {
                    handleAdd("languages", selectedLanguage);
                  showMessage("success", "Language added successfully.");
                } else {
                  showMessage(
                    "error",
                    "Please select a valid language to add."
                  );
                }
              }}
            >
              Add Language
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserQualifications;
