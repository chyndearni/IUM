import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  MapPin,
  DollarSign,
  Calendar,
  Building,
  Briefcase,
  GraduationCap,
  Heart,
  CheckSquare,
  AlertCircle,
  X,
} from "lucide-react";
import apiBissaKerja from "@/lib/api-bissa-kerja";
// Type definitions
interface FormData {
  jobTitle: string;
  location: string;
  salaryRange: string;
  jobType: string;
  applicationDeadline: string;
  experience: string;
  education: string;
  description: string;
  requirements: string;
  responsibilities: string;
  benefits: string;
  skills: string[];
  disabilityTypes: string[];
  workAccommodations: string;
  accessibilityFeatures: string;
}

interface FormErrors {
  [key: string]: string;
}

interface DisabilityData {
  id: number;
  kategori_disabilitas: string;
  tingkat_disabilitas: string;
}

interface DisabilityCategory {
  category: string;
  levels: DisabilityData[];
}

interface InputFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}

// API Response interface (adjust based on your actual API response structure)
interface ApiResponse {
  data: DisabilityData[];
  message?: string;
  status?: string;
}

// Job type options
type JobType =
  | "Full-time"
  | "Part-time"
  | "Contract"
  | "Freelance"
  | "Internship"
  | "";

// Move InputField component outside to prevent re-renders
const InputField: React.FC<InputFieldProps> = ({
  label,
  required = false,
  error,
  children,
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {error && (
      <div className="flex items-center mt-1 text-sm text-red-600 dark:text-red-400">
        <AlertCircle className="w-4 h-4 mr-1" />
        {error}
      </div>
    )}
  </div>
);

export default function CreateJobForDisability() {
  const router = useRouter();
  // Initialize form data
  const [formData, setFormData] = useState<FormData>({
    jobTitle: "",
    location: "",
    salaryRange: "",
    jobType: "",
    applicationDeadline: "",
    experience: "",
    education: "",
    description: "",
    requirements: "",
    responsibilities: "",
    benefits: "",
    skills: [],
    disabilityTypes: [],
    workAccommodations: "",
    accessibilityFeatures: "",
  });

  const [skillInput, setSkillInput] = useState<string>("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [disabilityOptions, setDisabilityOptions] = useState<
    DisabilityCategory[]
  >([]);
  const [isLoadingDisabilities, setIsLoadingDisabilities] =
    useState<boolean>(true);
  const [disabilityError, setDisabilityError] = useState<string>("");
  const [salaryMinInput, setSalaryMinInput] = useState<string>("");
  const [salaryMaxInput, setSalaryMaxInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch disability data from API using axios
  const fetchDisabilities = async (): Promise<void> => {
    try {
      setIsLoadingDisabilities(true);
      setDisabilityError("");

      // Make API call using axios
      const response = await apiBissaKerja.get<ApiResponse>("disability");

      // Extract data from response
      // Adjust this based on your actual API response structure
      let data: DisabilityData[];

      if (response.data.data) {
        // If API returns { data: [...] }
        data = response.data.data;
      } else if (Array.isArray(response.data)) {
        // If API returns [...] directly
        data = response.data as unknown as DisabilityData[];
      } else {
        throw new Error("Invalid API response structure");
      }

      // Validate data structure
      if (!Array.isArray(data)) {
        throw new Error("Data is not an array");
      }

      // Validate each item has required fields
      data.forEach((item, index) => {
        if (
          !item.id ||
          !item.kategori_disabilitas ||
          !item.tingkat_disabilitas
        ) {
          throw new Error(`Invalid data structure at index ${index}`);
        }
      });

      // Function to sort disability levels
      const sortDisabilityLevels = (
        levels: DisabilityData[]
      ): DisabilityData[] => {
        const levelOrder: { [key: string]: number } = {
          ringan: 1,
          sedang: 2,
          berat: 3,
          "semua tingkat": 4,
        };

        return levels.sort((a, b) => {
          // Extract the level keyword from tingkat_disabilitas
          const levelA = a.tingkat_disabilitas.toLowerCase();
          const levelB = b.tingkat_disabilitas.toLowerCase();

          // Find order for level A
          let orderA = 999; // default high number for unknown levels
          for (const [keyword, order] of Object.entries(levelOrder)) {
            if (levelA.includes(keyword)) {
              orderA = order;
              break;
            }
          }

          // Find order for level B
          let orderB = 999; // default high number for unknown levels
          for (const [keyword, order] of Object.entries(levelOrder)) {
            if (levelB.includes(keyword)) {
              orderB = order;
              break;
            }
          }

          return orderA - orderB;
        });
      };

      // Group data by kategori_disabilitas
      const groupedData = data.reduce(
        (acc: { [key: string]: DisabilityData[] }, item) => {
          const category = item.kategori_disabilitas;
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(item);
          return acc;
        },
        {}
      );

      // Convert to DisabilityCategory format and sort levels
      const formattedData: DisabilityCategory[] = Object.keys(groupedData).map(
        (category) => ({
          category,
          levels: sortDisabilityLevels(groupedData[category]),
        })
      );

      setDisabilityOptions(formattedData);
    } catch (error) {
      console.error("Error fetching disabilities:", error);

      let errorMessage = "Gagal memuat data disabilitas. Silakan coba lagi.";

      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Server responded with error status
          errorMessage = `Server error: ${error.response.status} - ${
            error.response.data?.message || error.message
          }`;
        } else if (error.request) {
          // Request was made but no response received
          errorMessage =
            "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.";
        } else {
          // Something else happened
          errorMessage = `Error: ${error.message}`;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      setDisabilityError(errorMessage);

      // Optional: Set fallback data if needed
      // setDisabilityOptions([
      //   {
      //     category: "Tunanetra (Disabilitas Penglihatan)",
      //     levels: [
      //       {
      //         id: 1,
      //         kategori_disabilitas: "Tunanetra (Disabilitas Penglihatan)",
      //         tingkat_disabilitas: "Tunanetra Ringan",
      //       },
      //       // ... more fallback data
      //     ],
      //   },
      // ]);
    } finally {
      setIsLoadingDisabilities(false);
      setIsLoading(false);
    }
  };

  // Load disabilities on component mount
  useEffect(() => {
    fetchDisabilities();
  }, []);

  // Utility functions for salary formatting
  const formatRupiah = (value: string): string => {
    // Remove all non-digit characters
    const cleanValue = value.replace(/\D/g, "");

    if (!cleanValue) return "";

    // Format with thousand separators
    const formatted = cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `Rp ${formatted}`;
  };

  const cleanNumber = (value: string): string => {
    return value.replace(/\D/g, "");
  };

  const handleSalaryChange = (type: "min" | "max", value: string): void => {
    const cleanValue = cleanNumber(value);

    if (type === "min") {
      setSalaryMinInput(cleanValue);
    } else {
      setSalaryMaxInput(cleanValue);
    }

    // Update the combined salary range
    const minValue = type === "min" ? cleanValue : salaryMinInput;
    const maxValue = type === "max" ? cleanValue : salaryMaxInput;

    let salaryRange = "";
    if (minValue && maxValue) {
      salaryRange = `${formatRupiah(minValue)} - ${formatRupiah(maxValue)}`;
    } else if (minValue) {
      salaryRange = `${formatRupiah(minValue)} ke atas`;
    } else if (maxValue) {
      salaryRange = `Sampai ${formatRupiah(maxValue)}`;
    }

    handleInputChange("salaryRange", salaryRange);
  };

  const jobTypeOptions: JobType[] = [
    "Full-time",
    "Part-time",
    "Contract",
    "Freelance",
    "Internship",
  ];

  const handleInputChange = (
    field: keyof FormData,
    value: string | string[]
  ): void => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const addSkill = (skill: string) => {
    const trimmedSkill = skill.trim();
    if (trimmedSkill && !formData.skills.includes(trimmedSkill)) {
      handleInputChange("skills", [...formData.skills, trimmedSkill]);
      setSkillInput("");
      return true;
    }
    setSkillInput("");
    return false;
  };

  const removeSkill = (skillToRemove: string): void => {
    handleInputChange(
      "skills",
      formData.skills.filter((skill) => skill !== skillToRemove)
    );
  };

  const handleSkillInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      if (skillInput.trim()) {
        addSkill(skillInput);
      }
    } else if (e.key === ",") {
      e.preventDefault();
      e.stopPropagation();
      if (skillInput.trim()) {
        addSkill(skillInput);
      }
    } else if (
      e.key === "Backspace" &&
      !skillInput &&
      formData.skills.length > 0
    ) {
      e.preventDefault();
      removeSkill(formData.skills[formData.skills.length - 1]);
    }
  };

  const handleSkillInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const value = e.target.value;

    // Check if user typed comma
    if (value.includes(",")) {
      const skillsToAdd = value.split(",");
      const lastSkill = skillsToAdd.pop() || "";

      // Add all skills except the last one
      skillsToAdd.forEach((skill) => {
        if (skill.trim()) {
          addSkill(skill.trim());
        }
      });

      // Set the remaining text
      setSkillInput(lastSkill);
    } else {
      setSkillInput(value);
    }
  };

  const handleSkillInputBlur = (): void => {
    if (skillInput.trim()) {
      addSkill(skillInput);
    }
  };

  const handleDisabilityChange = (
    disabilityId: number,
    disabilityLabel: string
  ): void => {
    setFormData((prev) => ({
      ...prev,
      disabilityTypes: prev.disabilityTypes.includes(disabilityId.toString())
        ? prev.disabilityTypes.filter(
            (d: string) => d !== disabilityId.toString()
          )
        : [...prev.disabilityTypes, disabilityId.toString()],
    }));
  };

  // Helper function to get selected disability labels for display
  const getSelectedDisabilityLabels = (): string[] => {
    const labels: string[] = [];
    disabilityOptions.forEach((category) => {
      category.levels.forEach((level) => {
        if (formData.disabilityTypes.includes(level.id.toString())) {
          labels.push(level.tingkat_disabilitas);
        }
      });
    });
    return labels;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.jobTitle.trim())
      newErrors.jobTitle = "Judul pekerjaan wajib diisi";
    if (!formData.location.trim()) newErrors.location = "Lokasi wajib diisi";
    if (!formData.jobType) newErrors.jobType = "Tipe pekerjaan wajib dipilih";
    if (!formData.applicationDeadline)
      newErrors.applicationDeadline = "Batas waktu lamaran wajib diisi";
    if (!formData.experience.trim())
      newErrors.experience = "Pengalaman kerja wajib diisi";
    if (!formData.education.trim())
      newErrors.education = "Pendidikan minimal wajib diisi";
    if (!formData.description.trim())
      newErrors.description = "Deskripsi pekerjaan wajib diisi";
    if (!formData.requirements.trim())
      newErrors.requirements = "Persyaratan wajib diisi";
    if (!formData.responsibilities.trim())
      newErrors.responsibilities = "Tanggung jawab wajib diisi";
    if (!formData.benefits.trim()) newErrors.benefits = "Benefit wajib diisi";
    if (!formData.skills.length)
      newErrors.skills = "Minimal satu keahlian wajib diisi";
    if (formData.disabilityTypes.length === 0)
      newErrors.disabilityTypes = "Pilih minimal satu jenis disabilitas";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (validateForm()) {
      const selectedDisabilityLabels = getSelectedDisabilityLabels();
      const submissionData = {
        ...formData,
        selectedDisabilityLabels, // Include readable labels for display
        disabilityIds: formData.disabilityTypes.map((id) => parseInt(id)), // Convert to numbers for backend
      };

      const response = await apiBissaKerja.post(
        "company/job-vacancies",
        submissionData
      );

      if (response.status === 201) {
        resetForm();
        router.push("/lowongan-pekerjaan");
      } else {
        alert("Gagal menyimpan lowongan kerja. Silakan coba lagi.");
      }
    } else {
      alert("Mohon lengkapi semua field yang wajib diisi");
    }
  };

  const resetForm = (): void => {
    setFormData({
      jobTitle: "",
      location: "",
      salaryRange: "",
      jobType: "",
      applicationDeadline: "",
      experience: "",
      education: "",
      description: "",
      requirements: "",
      responsibilities: "",
      benefits: "",
      skills: [],
      disabilityTypes: [],
      workAccommodations: "",
      accessibilityFeatures: "",
    });
    setSkillInput("");
    setSalaryMinInput("");
    setSalaryMaxInput("");
    setErrors({});
  };

  if (isLoading) {
    // return <JobFormSkeleton />;
    return "Loading...";
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full mx-auto py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          {/* Header */}
          <div className="bg-gradient-to-r from-brand-600 to-brand-800 text-white p-6 rounded-t-lg">
            <div className="flex items-center space-x-3">
              <Briefcase className="w-8 h-8" />
              <div>
                <h1 className="text-2xl font-bold">Buat Lowongan Kerja</h1>
                <p className="text-blue-100">
                  Khusus untuk Penyandang Disabilitas
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-8">
            {/* Basic Job Information */}
            <section className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Building className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Informasi Dasar Pekerjaan
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Judul Pekerjaan"
                  required
                  error={errors.jobTitle}
                >
                  <input
                    type="text"
                    value={formData.jobTitle}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleInputChange("jobTitle", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                    placeholder="Contoh: Frontend Developer"
                    aria-describedby="jobTitle-error"
                  />
                </InputField>

                <InputField label="Lokasi" required error={errors.location}>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange("location", e.target.value)
                      }
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                      placeholder="Contoh: Jakarta Selatan, DKI Jakarta"
                      aria-describedby="location-error"
                    />
                  </div>
                </InputField>

                <InputField label="Rentang Gaji" error={errors.salaryRange}>
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* Minimum Salary */}
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={
                            salaryMinInput ? formatRupiah(salaryMinInput) : ""
                          }
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleSalaryChange("min", e.target.value)
                          }
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                          placeholder="Gaji minimum"
                        />
                        <label className="absolute -top-2 left-3 px-1 bg-white dark:bg-gray-800 text-xs text-gray-500">
                          Minimum
                        </label>
                      </div>

                      {/* Maximum Salary */}
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={
                            salaryMaxInput ? formatRupiah(salaryMaxInput) : ""
                          }
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleSalaryChange("max", e.target.value)
                          }
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                          placeholder="Gaji maksimum"
                        />
                        <label className="absolute -top-2 left-3 px-1 bg-white dark:bg-gray-800 text-xs text-gray-500">
                          Maksimum
                        </label>
                      </div>
                    </div>

                    {/* Display Combined Range */}
                    {formData.salaryRange && (
                      <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                        Preview: {formData.salaryRange}
                      </div>
                    )}

                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      💡 Isi salah satu atau keduanya. Hanya angka yang
                      diperbolehkan.
                    </p>
                  </div>
                </InputField>

                <InputField
                  label="Tipe Pekerjaan"
                  required
                  error={errors.jobType}
                >
                  <select
                    value={formData.jobType}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      handleInputChange("jobType", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                    aria-describedby="jobType-error"
                  >
                    <option value="">Pilih tipe pekerjaan</option>
                    {jobTypeOptions.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </InputField>

                <InputField
                  label="Batas Waktu Lamaran"
                  required
                  error={errors.applicationDeadline}
                >
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      value={formData.applicationDeadline}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange("applicationDeadline", e.target.value)
                      }
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                      aria-describedby="applicationDeadline-error"
                    />
                  </div>
                </InputField>

                <InputField
                  label="Pengalaman Kerja"
                  required
                  error={errors.experience}
                >
                  <input
                    type="text"
                    value={formData.experience}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleInputChange("experience", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                    placeholder="Contoh: 2-4 tahun / Fresh graduate"
                    aria-describedby="experience-error"
                  />
                </InputField>

                <InputField
                  label="Pendidikan Minimal"
                  required
                  error={errors.education}
                >
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.education}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange("education", e.target.value)
                      }
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                      placeholder="Contoh: S1 Teknik Informatika / SMA"
                      aria-describedby="education-error"
                    />
                  </div>
                </InputField>
              </div>
            </section>

            {/* Disability Types */}
            <section className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Jenis Disabilitas yang Diutamakan
                  </h2>
                </div>
                {!isLoadingDisabilities && !disabilityError && (
                  <button
                    type="button"
                    onClick={fetchDisabilities}
                    className="text-sm text-blue-600 hover:text-blue-700 dark:text-white"
                    title="Refresh data disabilitas"
                  >
                    Refresh
                  </button>
                )}
              </div>

              <InputField
                label="Pilih jenis dan tingkat disabilitas yang sesuai dengan pekerjaan ini"
                required
                error={errors.disabilityTypes}
              >
                {isLoadingDisabilities ? (
                  <div className="flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600 dark:text-gray-400">
                      Memuat data disabilitas...
                    </span>
                  </div>
                ) : disabilityError ? (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
                    <div className="flex items-center">
                      <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                      <span className="text-red-700 dark:text-red-400">
                        {disabilityError}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={fetchDisabilities}
                      className="mt-2 px-3 py-1 bg-red-100 hover:bg-red-200 dark:bg-red-800 dark:hover:bg-red-700 text-red-700 dark:text-red-200 rounded text-sm transition-colors"
                    >
                      Coba Lagi
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6 mt-4">
                    {disabilityOptions.map((category: DisabilityCategory) => (
                      <div
                        key={category.category}
                        className="border border-gray-200 dark:border-gray-600 rounded-lg p-4"
                      >
                        <h4 className="font-medium text-gray-900 dark:text-white mb-3 text-sm">
                          {category.category}
                        </h4>
                        <div className="grid grid-cols-1 gap-2">
                          {category.levels.map((level: DisabilityData) => (
                            <label
                              key={level.id}
                              className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                            >
                              <input
                                type="checkbox"
                                checked={formData.disabilityTypes.includes(
                                  level.id.toString()
                                )}
                                onChange={() =>
                                  handleDisabilityChange(
                                    level.id,
                                    level.tingkat_disabilitas
                                  )
                                }
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                              />
                              <span className="text-sm text-gray-700 dark:text-gray-300">
                                {level.tingkat_disabilitas}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </InputField>
            </section>

            {/* Work Accommodations */}
            <section className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-4">
                <CheckSquare className="w-5 h-5 text-green-600" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Akomodasi Kerja
                </h2>
              </div>

              <InputField label="Akomodasi dan Dukungan yang Disediakan">
                <textarea
                  value={formData.workAccommodations}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    handleInputChange("workAccommodations", e.target.value)
                  }
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white resize-none"
                  placeholder="Contoh: Jam kerja fleksibel, Peralatan khusus disediakan, Akses kursi roda, Software screen reader, Interpreter bahasa isyarat"
                />
              </InputField>

              <div className="mt-4">
                <InputField label="Fitur Aksesibilitas Kantor">
                  <textarea
                    value={formData.accessibilityFeatures}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      handleInputChange("accessibilityFeatures", e.target.value)
                    }
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white resize-none"
                    placeholder="Contoh: Lift dengan braille, Ramp untuk kursi roda, Toilet yang accessible, Parkir khusus disabilitas"
                  />
                </InputField>
              </div>
            </section>

            {/* Job Description */}
            <section className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Deskripsi Pekerjaan
              </h2>

              <InputField
                label="Deskripsi Lengkap"
                required
                error={errors.description}
              >
                <textarea
                  value={formData.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    handleInputChange("description", e.target.value)
                  }
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white resize-none"
                  placeholder="Jelaskan detail pekerjaan, tanggung jawab utama, dan lingkungan kerja yang inklusif..."
                  aria-describedby="description-error"
                />
              </InputField>
            </section>

            {/* Requirements */}
            <section className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Persyaratan
              </h2>

              <InputField
                label="Daftar Persyaratan"
                required
                error={errors.requirements}
              >
                <textarea
                  value={formData.requirements}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    handleInputChange("requirements", e.target.value)
                  }
                  rows={8}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white resize-none"
                  placeholder="Masukkan setiap persyaratan dalam baris terpisah, contoh: Minimal 2 tahun pengalaman dalam pengembangan Frontend, Menguasai React.js dan ekosistemnya, Bersedia bekerja dalam lingkungan inklusif, Memiliki kemampuan komunikasi yang baik"
                  aria-describedby="requirements-error"
                />
              </InputField>
            </section>

            {/* Responsibilities */}
            <section className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Tanggung Jawab
              </h2>

              <InputField
                label="Daftar Tanggung Jawab"
                required
                error={errors.responsibilities}
              >
                <textarea
                  value={formData.responsibilities}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    handleInputChange("responsibilities", e.target.value)
                  }
                  rows={8}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white resize-none"
                  placeholder="Masukkan setiap tanggung jawab dalam baris terpisah, contoh: Mengembangkan dan memelihara aplikasi web menggunakan React.js, Berkolaborasi dengan tim dalam lingkungan yang inklusif, Menulis kode yang clean, maintainable, dan well-documented, Mengikuti training dan pengembangan skill"
                  aria-describedby="responsibilities-error"
                />
              </InputField>
            </section>

            {/* Benefits */}
            <section className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Benefit & Fasilitas
              </h2>

              <InputField
                label="Daftar Benefit"
                required
                error={errors.benefits}
              >
                <textarea
                  value={formData.benefits}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    handleInputChange("benefits", e.target.value)
                  }
                  rows={8}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white resize-none"
                  placeholder="Masukkan setiap benefit dalam baris terpisah, contoh: Gaji kompetitif sesuai pengalaman, Tunjangan kesehatan dan keluarga, Asuransi kecelakaan kerja, Flexible working hours, Work from home options, Training dan development program, Lingkungan kerja yang inklusif"
                  aria-describedby="benefits-error"
                />
              </InputField>
            </section>

            {/* Skills */}
            <section className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Keahlian yang Dibutuhkan
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Daftar Keahlian <span className="text-red-500">*</span>
                </label>

                <div className="space-y-3">
                  {/* Skills Display */}
                  <div className="flex flex-wrap gap-2 min-h-[2.5rem] p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
                    {formData.skills.map((skill, index) => (
                      <span
                        key={`skill-${index}-${skill}`}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}

                    {/* Input Field */}
                    <input
                      type="text"
                      value={skillInput}
                      onChange={handleSkillInputChange}
                      onKeyDown={handleSkillInputKeyDown}
                      onBlur={handleSkillInputBlur}
                      placeholder={
                        formData.skills.length === 0
                          ? "Ketik keahlian dan tekan Enter atau koma..."
                          : "Tambah keahlian..."
                      }
                      className="flex-1 min-w-[200px] outline-none bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      autoComplete="off"
                    />
                  </div>

                  {/* Error Message */}
                  {errors.skills && (
                    <div className="flex items-center mt-1 text-sm text-red-600 dark:text-red-400">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.skills}
                    </div>
                  )}

                  {/* Suggested Skills */}
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Saran keahlian populer:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "JavaScript",
                        "TypeScript",
                        "React",
                        "Vue.js",
                        "Angular",
                        "Node.js",
                        "Python",
                        "Java",
                        "PHP",
                        "HTML5",
                        "CSS3",
                        "Tailwind CSS",
                        "MySQL",
                        "PostgreSQL",
                        "MongoDB",
                        "Git",
                        "Docker",
                        "AWS",
                        "Komunikasi",
                        "Teamwork",
                        "Problem Solving",
                        "Adaptabilitas",
                      ]
                        .filter(
                          (suggestion) => !formData.skills.includes(suggestion)
                        )
                        .map((suggestion) => (
                          <button
                            key={suggestion}
                            type="button"
                            onClick={() => {
                              addSkill(suggestion);
                            }}
                            className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                          >
                            + {suggestion}
                          </button>
                        ))}
                    </div>
                  </div>

                  {/* Help Text */}
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    💡 Tips: Tekan <strong>Enter</strong> atau ketik{" "}
                    <strong>koma (,)</strong> untuk menambah keahlian. Klik di
                    luar input atau gunakan <strong>Backspace</strong> kosong
                    untuk menghapus skill terakhir.
                  </p>
                </div>
              </div>
            </section>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  type="button"
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors"
                  onClick={resetForm}
                >
                  Reset Form
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
                >
                  <CheckSquare className="w-5 h-5" />
                  <span>Simpan Lowongan</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
