import React, { useState, useEffect } from "react";
import { Home, User, Briefcase, Loader } from "lucide-react";
import axios from "axios";
import UserQualifications from "../components/Nanny/UserQualifications";
import NannyQuickyStats from "../components/Nanny/NannyQuickStats";
import ProfilePictureUploader from "../components/Nanny/ProfilePictureUploader";
import BabysittingRequestManager from "../components/Nanny/BabysittingRequestManager";
import { useTranslation } from "react-i18next";

const NannyDashboard = () => {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState("overview");
  const [nannyProfile, setNannyProfile] = useState(null);
  const [languagesList, setLanguagesList] = useState([]);
  const [formData, setFormData] = useState({
    jobType: "",
    experience: "",
    policeClearance: "",
    policeClearanceFile: null,
    additionalInfo: "",
  });
 const BASE_URL = "https://ola-baba.com";

  useEffect(() => {
    fetchNannyProfile();
    fetchLanguages();
  }, []);

  const fetchNannyProfile = async () => {
    const idUser = localStorage.getItem("SliderService");
    if (!idUser) return;
    try {
      const response = await axios.get(`${BASE_URL}/api/user/${idUser}`);
      setNannyProfile(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const fetchLanguages = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/languages`);
      setLanguagesList(response.data);
    } catch (error) {
      console.error("Error fetching languages:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, policeClearanceFile: e.target.files[0] }));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const idUser = localStorage.getItem("SliderService");
    const submitFormData = new FormData();
    submitFormData.append("id", idUser);
    submitFormData.append("jobType", formData.jobType);
    submitFormData.append("experience", formData.experience);
    submitFormData.append("policeClearance", formData.policeClearance);
    submitFormData.append("additionalInfo", formData.additionalInfo);
    try {
      await axios.put(`${BASE_URL}/api/user/updatenannyProfiles/${idUser}`, submitFormData);
      alert(t("error-nanny.sucessProfile"));
    } catch (error) {
      console.error("Error updating profile:", error);
      alert(t("error-nanny.updateProfile"));
    }
  };

  const handleFileSubmit = async () => {
    if (!formData.policeClearanceFile) return alert("Please select a file");
    const idUser = localStorage.getItem("SliderService");
    const fileData = new FormData();
    fileData.append("policeClearanceFile", formData.policeClearanceFile);
    try {
      await axios.post(`${BASE_URL}/api/user/uploadPoliceClearance/${idUser}`, fileData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("File uploaded successfully");
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("File upload failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <ProfilePictureUploader uploadEndpoint={`${BASE_URL}/api/user/uploadProfile/Picture/${nannyProfile?.user_id}`} fetchImageEndpoint={`${BASE_URL}/api/user/${nannyProfile?.user_id}/profile-picture`} />
            <h2 className="text-2xl font-bold text-blue-700">{nannyProfile?.first_name} {nannyProfile?.last_name}</h2>
            <nav className="space-y-4">
              <button onClick={() => setActiveSection("overview")} className="w-full p-3 rounded-lg bg-gray-200">Overview</button>
              <button onClick={() => setActiveSection("profile")} className="w-full p-3 rounded-lg bg-gray-200">Profile</button>
              <button onClick={() => setActiveSection("jobs")} className="w-full p-3 rounded-lg bg-gray-200">Jobs</button>
              <button onClick={() => setActiveSection("qualifications")} className="w-full p-3 rounded-lg bg-gray-200">Qualifications</button>
            </nav>
          </div>
          <div className="col-span-1 md:col-span-3">
            {activeSection === "profile" && (
              <div className="bg-white p-6 shadow-md rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Profile</h3>
                <form onSubmit={handleFormSubmit}>
                  <input type="text" name="jobType" value={formData.jobType} onChange={handleChange} placeholder="Job Type" />
                  <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg">Submit Profile</button>
                </form>
                <h3 className="text-xl font-semibold mt-6">Upload Documents</h3>
                <input type="file" onChange={handleFileChange} />
                <button onClick={handleFileSubmit} className="bg-green-500 text-white px-4 py-2 rounded-lg">Submit Document</button>
              </div>
            )}
            {activeSection === "qualifications" && <UserQualifications idUser={nannyProfile?.user_id} />}
            {activeSection === "jobs" && <BabysittingRequestManager />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NannyDashboard;
