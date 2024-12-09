import React from "react";

 const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      policeClearanceFile: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const submitFormData = new FormData();
    const id_user = localStorage.getItem("idUser");
    
    // Append user ID
    submitFormData.append("id", id_user);
    
    // Append form fields
    submitFormData.append("jobType", formData.jobType);
    submitFormData.append("experience", formData.experience);
    submitFormData.append("policeClearance", formData.policeClearance);
    
    // Append file if exists
    if (formData.policeClearanceFile) {
      submitFormData.append("policeClearanceFile", formData.policeClearanceFile);
    }
    
    // Convert arrays to JSON strings
    submitFormData.append("work_preference", JSON.stringify(formData.work_preference));
    submitFormData.append("preference_age", JSON.stringify(formData.preference_age));
    submitFormData.append("languages", JSON.stringify(formData.languages));
    submitFormData.append("additionalInfo", formData.additionalInfo);
  
    try {

      console.log("FormData contents:");
      submitFormData.forEach((value, key) => {
        console.log(${key}:, value);
      });
      const response = await axios.put(
        http://localhost:3005/user/updatenannyProfiles/${id_user}, 
        submitFormData, 
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      console.log("Profile updated successfully:",  JSON.stringify(response.data, null, 2));
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

const Profile = ({
  nannyProfile,
  formData,
  setFormData,
  handleChange,
  handleFileChange,
  handleSubmit,
  languagesList,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4 text-blue-700">
        Personal Details
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="font-medium">
            Name: {nannyProfile.first_name} {nannyProfile.last_name}
          </p>
          <p>Email: {nannyProfile.email}</p>
          <p>
            Location: {nannyProfile.province_name}, {nannyProfile.country_name}
          </p>
        </div>
        <div>
          <p>Education: {nannyProfile.educationLevel}</p>
        </div>
      </div>
      {/* Availability & Experience */}
      <div className="space-y-4 mt-6">
        <h2 className="text-xl font-semibold text-blue-700">
          Availability & Experience
        </h2>
        <div className="space-y-2">
          <label className="block mb-2">Job Type</label>
          <div className="flex space-x-4">
            {["full_time", "temporary"].map((type) => (
              <label key={type} className="inline-flex items-center">
                <input
                  type="radio"
                  name="jobType"
                  value={type}
                  checked={formData.jobType === type}
                  onChange={handleChange}
                  className="form-radio"
                />
                <span className="ml-2 capitalize">
                  {type.replace("-", " ")}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block mb-2">Experience</label>
          <select
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Years of Experience</option>
            <option value="none">None</option>
            <option value="1-2">1 - 2 years</option>
            <option value="3-5">3 - 5 years</option>
            <option value="5+">More than 5 years</option>
          </select>
        </div>
      </div>

      {/* Background Check */}
      <div className="space-y-4 mt-6">
        <h2 className="text-xl font-semibold text-blue-700">
          Background Check
        </h2>
        <div className="space-y-2">
          <label className="block mb-2">Do you have a police clearance?</label>
          <div className="flex space-x-4">
            {["yes", "no"].map((option) => (
              <label key={option} className="inline-flex items-center">
                <input
                  type="radio"
                  name="policeClearance"
                  value={option}
                  checked={formData.policeClearance === option}
                  onChange={handleChange}
                  className="form-radio"
                />
                <span className="ml-2 capitalize">{option}</span>
              </label>
            ))}
          </div>
          <div>
            <label className="block mb-2">
              Please upload a copy of your police clearance:
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        </div>
      </div>

      <h2 className="text-xl font-semibold text-blue-700">Work Preferences</h2>
      <div className="space-y-2">
        <label className="block mb-2">Preferred Working Hours</label>
        <div className="grid grid-cols-2 gap-2">
          {["morning", "afternoon", "evening", "overnight"].map(
            (time, index) => (
              <label key={index} className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  value={time}
                  checked={formData.work_preference.includes(time)}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      work_preference: e.target.checked
                        ? [...prev.work_preference, time]
                        : prev.work_preference.filter((t) => t !== time),
                    }));
                  }}
                />
                <span className="ml-2">
                  {time.charAt(0).toUpperCase() + time.slice(1)}
                </span>
              </label>
            )
          )}
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-blue-700">
          Preferred Age Group
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {["babies", "toddlers", "children", "teenagers"].map(
            (group, index) => (
              <label key={index} className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  value={group}
                  checked={formData.preference_age.includes(group)}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      preference_age: e.target.checked
                        ? [...prev.preference_age, group]
                        : prev.preference_age.filter((g) => g !== group),
                    }));
                  }}
                />
                <span className="ml-2">
                  {group.charAt(0).toUpperCase() +
                    group.slice(1).replace("_", " ")}
                </span>
              </label>
            )
          )}
        </div>
      </div>

      {/* Languages & Additional Information */}
      <div className="space-y-4 mt-6">
        <h2 className="text-xl font-semibold text-blue-700">
          Languages & Additional Information
        </h2>
        <div className="space-y-2">
          <label className="block mb-2">Languages Spoken</label>
          <select
            multiple
            value={formData.languages}
            onChange={(e) =>
              setFormData({
                ...formData,
                languages: Array.from(
                  e.target.selectedOptions,
                  (opt) => opt.value
                ),
              })
            }
            className="w-full px-3 py-2 border rounded"
          >
            {languagesList.map((language, index) => (
              <option key={index} value={language}>
                {language}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block mb-2">Additional Information</label>
          <textarea
            name="additionalInfo"
            value={formData.additionalInfo}
            onChange={handleChange}
            placeholder="Please share any other relevant information"
            className="w-full px-3 py-2 border rounded"
          />
        </div>
      </div>
      <button
        onClick={handleSubmit}
        className="px-4 py-2 mt-4 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Submit
      </button>
    </div>
  );
};

export default Profile;
