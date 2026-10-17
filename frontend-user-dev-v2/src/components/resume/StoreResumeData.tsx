import apiBissaKerja from "@/lib/api-bissa-kerja";

// Helper function untuk cek apakah data tidak kosong
const isDataNotEmpty = (data: any): boolean => {
  if (!data || typeof data !== "object") return false;

  // Cek apakah ada field yang tidak kosong
  return Object.values(data).some((value) => {
    if (typeof value === "string") {
      return value.trim() !== "";
    }
    return value !== null && value !== undefined;
  });
};

// Fungsi storeUserProfileForm
export const storeUserProfileForm = async () => {
  try {
    const data = localStorage.getItem("user_profile_form_data");
    if (!data) {
      console.log("No user profile data found in localStorage.");
      return;
    }

    const parsed = JSON.parse(data);
    console.log("Sending user profile data:", parsed);

    if (isDataNotEmpty(parsed)) {
      await apiBissaKerja.post("user/create", parsed);
      console.log("User profile data stored successfully");
    } else {
      console.log("User profile data is empty, skipping API call");
    }
  } catch (error: any) {
    console.log("Error Profile:", error.response?.data || error.message);
    throw error;
  }
};

export const storeLocationForm = async () => {
  try {
    const data = localStorage.getItem("location_form_data");
    if (!data) {
      console.log("No location data found in localStorage.");
      return;
    }

    const parsed = JSON.parse(data);
    console.log("Sending location data:", parsed);

    if (isDataNotEmpty(parsed)) {
      await apiBissaKerja.post("resume/lokasi", parsed);
      console.log("Location data stored successfully");
    } else {
      console.log("Location data is empty, skipping API call");
    }
  } catch (error: any) {
    console.log("Error Location:", error.response?.data || error.message);
    throw error;
  }
};

export const storeSummaryForm = async () => {
  try {
    const data = localStorage.getItem("summary_form_data");
    if (!data) {
      console.log("No summary data found in localStorage.");
      return;
    }

    const parsed = JSON.parse(data);
    console.log("Sending summary data:", parsed);

    if (isDataNotEmpty(parsed)) {
      await apiBissaKerja.post("resume", parsed);
      console.log("Summary data stored successfully");
    } else {
      console.log("Summary data is empty, skipping API call");
    }
  } catch (error: any) {
    console.log("Error Summary:", error.response?.data || error.message);
    throw error;
  }
};

export const storeEducationForm = async () => {
  try {
    const data = localStorage.getItem("education_form_data");
    if (!data) {
      console.log("No education data found in localStorage.");
      return;
    }

    const parsed = JSON.parse(data);
    console.log("Sending education data:", parsed);

    if (isDataNotEmpty(parsed)) {
      await apiBissaKerja.post("resume/pendidikan", parsed);
      console.log("Education data stored successfully");
    } else {
      console.log("Education data is empty, skipping API call");
    }
  } catch (error: any) {
    console.log("Error Education:", error.response?.data || error.message);
    throw error;
  }
};

export const storeExperienceForm = async () => {
  try {
    const data = localStorage.getItem("experience_form_data");
    if (!data) {
      return;
    }

    const parsed = JSON.parse(data);

    if (isDataNotEmpty(parsed)) {
      await apiBissaKerja.post("resume/pengalaman-kerja", parsed);
    } else {
      console.log("Experience data is empty, skipping API call");
    }
  } catch (error: any) {
    console.log("Error Experience:", error.response?.data || error.message);
    throw error;
  }
};

export const storeTrainingForm = async () => {
  try {
    const data = localStorage.getItem("training_form_data");
    if (!data) {
      return;
    }

    const parsed = JSON.parse(data);

    if (isDataNotEmpty(parsed)) {
      await apiBissaKerja.post("resume/pelatihan", parsed);
    } else {
      console.log("Training data is empty, skipping API call");
    }
  } catch (error: any) {
    console.log("Error Training:", error.response?.data || error.message);
    throw error;
  }
};

export const storeCertificationForm = async () => {
  try {
    const data = localStorage.getItem("certification_form_data");
    if (!data) {
      return;
    }

    const parsed = JSON.parse(data);

    if (isDataNotEmpty(parsed)) {
      await apiBissaKerja.post("resume/sertifikasi", parsed);
    } else {
      console.log("Certification data is empty, skipping API call");
    }
  } catch (error: any) {
    console.log("Error Certification:", error.response?.data || error.message);
    throw error;
  }
};

export const storeSkillsForm = async () => {
  try {
    const data = localStorage.getItem("skills_form_data");
    if (!data) {
      return;
    }

    const parsed = JSON.parse(data);

    if (isDataNotEmpty(parsed)) {
      await apiBissaKerja.post("resume/keterampilan", parsed);
    } else {
      console.log("Skills data is empty, skipping API call");
    }
  } catch (error: any) {
    console.log("Error Skills:", error.response?.data || error.message);
    throw error;
  }
};

export const storeLanguageSkillsForm = async () => {
  try {
    const data = localStorage.getItem("language_skills_form_data");
    if (!data) {
      return;
    }

    const parsed = JSON.parse(data);
    if (isDataNotEmpty(parsed)) {
      await apiBissaKerja.post("resume/bahasa", parsed);
    } else {
      console.log("Language skills data is empty, skipping API call");
    }
  } catch (error: any) {
    console.log(
      "Error Language Skills:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const storeAchievementForm = async () => {
  try {
    const data = localStorage.getItem("achievement_form_data");
    if (!data) {
      return;
    }

    const parsed = JSON.parse(data);

    if (isDataNotEmpty(parsed)) {
      // Prepare data sesuai backend
      const apiData = {
        name: parsed.name || "",
        penyelenggara: parsed.penyelenggara || "",
        tanggal_pencapaian: parsed.tanggal_pencapaian || "",
        dokumen_base64: parsed.dokumen_base64 || null,
        dokumen_info: parsed.dokumen_info || null,
      };

      await apiBissaKerja.post("resume/pencapaian", apiData);
    } else {
      console.log("Achievement data is empty, skipping API call");
    }
  } catch (error: any) {
    console.log("Error Achievement:", error.response?.data || error.message);
    throw error;
  }
};
