"use client";

import React, { ChangeEvent, FormEvent, useState, useEffect } from "react";
import { User, Phone, Calendar, Users, FileText, MapPin } from "lucide-react";
import apiBK from "@/lib/api-bissa-kerja";

interface LocationOption {
  id: string | number;
  name: string;
}

interface FormData {
  // Lokasi KTP
  province_ktp_id: string;
  regencie_ktp_id: string;
  district_ktp_id: string;
  village_ktp_id: string;
  kode_pos_ktp: string;
  alamat_lengkap_ktp: string;

  // Lokasi Domisili
  province_domisili_id: string;
  regencie_domisili_id: string;
  district_domisili_id: string;
  village_domisili_id: string;
  kode_pos_domisili: string;
  alamat_lengkap_domisili: string;
}

interface FormErrors {
  province_ktp_id?: string;
  regencie_ktp_id?: string;
  district_ktp_id?: string;
  village_ktp_id?: string;
  kode_pos_ktp?: string;
  alamat_lengkap_ktp?: string;
  province_domisili_id?: string;
  regencie_domisili_id?: string;
  district_domisili_id?: string;
  village_domisili_id?: string;
  kode_pos_domisili?: string;
  alamat_lengkap_domisili?: string;
  general?: string;
}

const STORAGE_KEY = "location_form_data";

const LocationForm = () => {
  const [submitLoading, setSubmitLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Loading states for dropdowns
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingRegenciesKtp, setLoadingRegenciesKtp] = useState(false);
  const [loadingDistrictsKtp, setLoadingDistrictsKtp] = useState(false);
  const [loadingVillagesKtp, setLoadingVillagesKtp] = useState(false);
  const [loadingRegenciesDomisili, setLoadingRegenciesDomisili] =
    useState(false);
  const [loadingDistrictsDomisili, setLoadingDistrictsDomisili] =
    useState(false);
  const [loadingVillagesDomisili, setLoadingVillagesDomisili] = useState(false);

  // Options state
  const [provinces, setProvinces] = useState<LocationOption[]>([]);
  const [regenciesKtp, setRegenciesKtp] = useState<LocationOption[]>([]);
  const [districtsKtp, setDistrictsKtp] = useState<LocationOption[]>([]);
  const [villagesKtp, setVillagesKtp] = useState<LocationOption[]>([]);
  const [regenciesDomisili, setRegenciesDomisili] = useState<LocationOption[]>(
    []
  );
  const [districtsDomisili, setDistrictsDomisili] = useState<LocationOption[]>(
    []
  );
  const [villagesDomisili, setVillagesDomisili] = useState<LocationOption[]>(
    []
  );

  const [formData, setFormData] = useState<FormData>({
    // Lokasi KTP
    province_ktp_id: "",
    regencie_ktp_id: "",
    district_ktp_id: "",
    village_ktp_id: "",
    kode_pos_ktp: "",
    alamat_lengkap_ktp: "",

    // Lokasi Domisili
    province_domisili_id: "",
    regencie_domisili_id: "",
    district_domisili_id: "",
    village_domisili_id: "",
    kode_pos_domisili: "",
    alamat_lengkap_domisili: "",
  });

  // API Functions
  const fetchProvinces = async () => {
    try {
      setLoadingProvinces(true);
      const response = await apiBK.get("/provinces");
      // console.log("Provinces response:", response.data);

      if (response.data && Array.isArray(response.data)) {
        setProvinces(response.data);
      } else if (response.data.data && Array.isArray(response.data.data)) {
        setProvinces(response.data.data);
      } else {
        // console.error("Unexpected provinces response format:", response.data);
        setProvinces([]);
      }
    } catch (error) {
      console.error("Error fetching provinces:", error);
      setProvinces([]);
    } finally {
      setLoadingProvinces(false);
    }
  };

  const fetchRegencies = async (
    provinceId: string,
    type: "ktp" | "domisili"
  ) => {
    if (!provinceId) return;

    try {
      const setLoading =
        type === "ktp" ? setLoadingRegenciesKtp : setLoadingRegenciesDomisili;
      const setRegencies =
        type === "ktp" ? setRegenciesKtp : setRegenciesDomisili;

      setLoading(true);
      const response = await apiBK.get(`/regencies?province_id=${provinceId}`);
      // console.log(`Regencies ${type} response:`, response.data);

      if (response.data && Array.isArray(response.data)) {
        setRegencies(response.data);
      } else if (response.data.data && Array.isArray(response.data.data)) {
        setRegencies(response.data.data);
      } else {
        console.error("Unexpected regencies response format:", response.data);
        setRegencies([]);
      }
    } catch (error) {
      console.error(`Error fetching regencies for ${type}:`, error);
      const setRegencies =
        type === "ktp" ? setRegenciesKtp : setRegenciesDomisili;
      setRegencies([]);
    } finally {
      const setLoading =
        type === "ktp" ? setLoadingRegenciesKtp : setLoadingRegenciesDomisili;
      setLoading(false);
    }
  };

  const fetchDistricts = async (
    regencyId: string,
    type: "ktp" | "domisili"
  ) => {
    if (!regencyId) return;

    try {
      const setLoading =
        type === "ktp" ? setLoadingDistrictsKtp : setLoadingDistrictsDomisili;
      const setDistricts =
        type === "ktp" ? setDistrictsKtp : setDistrictsDomisili;

      setLoading(true);
      const response = await apiBK.get(`/districts?regencie_id=${regencyId}`);
      // console.log(`Districts ${type} response:`, response.data);

      if (response.data && Array.isArray(response.data)) {
        setDistricts(response.data);
      } else if (response.data.data && Array.isArray(response.data.data)) {
        setDistricts(response.data.data);
      } else {
        // console.error("Unexpected districts response format:", response.data);
        setDistricts([]);
      }
    } catch (error) {
      console.error(`Error fetching districts for ${type}:`, error);
      const setDistricts =
        type === "ktp" ? setDistrictsKtp : setDistrictsDomisili;
      setDistricts([]);
    } finally {
      const setLoading =
        type === "ktp" ? setLoadingDistrictsKtp : setLoadingDistrictsDomisili;
      setLoading(false);
    }
  };

  const fetchVillages = async (
    districtId: string,
    type: "ktp" | "domisili"
  ) => {
    if (!districtId) return;

    try {
      const setLoading =
        type === "ktp" ? setLoadingVillagesKtp : setLoadingVillagesDomisili;
      const setVillages = type === "ktp" ? setVillagesKtp : setVillagesDomisili;

      setLoading(true);
      const response = await apiBK.get(`/villages?district_id=${districtId}`);
      // console.log(`Villages ${type} response:`, response.data);

      if (response.data && Array.isArray(response.data)) {
        setVillages(response.data);
      } else if (response.data.data && Array.isArray(response.data.data)) {
        setVillages(response.data.data);
      } else {
        console.error("Unexpected villages response format:", response.data);
        setVillages([]);
      }
    } catch (error) {
      console.error(`Error fetching villages for ${type}:`, error);
      const setVillages = type === "ktp" ? setVillagesKtp : setVillagesDomisili;
      setVillages([]);
    } finally {
      const setLoading =
        type === "ktp" ? setLoadingVillagesKtp : setLoadingVillagesDomisili;
      setLoading(false);
    }
  };

  // Function to load data from localStorage
  const loadFromLocalStorage = (): FormData | null => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        // console.log("Location data loaded from localStorage:", parsedData);
        return parsedData;
      }
    } catch (error) {
      console.error("Error loading location data from localStorage:", error);
    }
    return null;
  };

  // Function to save data to localStorage
  const saveToLocalStorage = (data: any) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      // console.log("Location data saved to localStorage:", data);
    } catch (error) {
      console.error("Error saving location data to localStorage:", error);
    }
  };

  // Function to clear localStorage
  const clearLocalStorage = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Error clearing location localStorage:", error);
    }
  };

  // Load dependent data after form data is loaded
  const loadDependentData = async (savedData: FormData) => {
    // Load KTP dependent data
    if (savedData.province_ktp_id) {
      await fetchRegencies(savedData.province_ktp_id, "ktp");
    }
    if (savedData.regencie_ktp_id) {
      await fetchDistricts(savedData.regencie_ktp_id, "ktp");
    }
    if (savedData.district_ktp_id) {
      await fetchVillages(savedData.district_ktp_id, "ktp");
    }

    // Load Domisili dependent data
    if (savedData.province_domisili_id) {
      await fetchRegencies(savedData.province_domisili_id, "domisili");
    }
    if (savedData.regencie_domisili_id) {
      await fetchDistricts(savedData.regencie_domisili_id, "domisili");
    }
    if (savedData.district_domisili_id) {
      await fetchVillages(savedData.district_domisili_id, "domisili");
    }
  };

  useEffect(() => {
    // Load provinces on component mount
    fetchProvinces();

    // Load data from localStorage
    const savedData = loadFromLocalStorage();
    if (savedData) {
      setFormData(savedData);
      // Load dependent dropdown data
      loadDependentData(savedData);
    }
  }, []);

  const handleInputChange = async (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    console.log("Input change:", { name, value });

    const updatedData = {
      ...formData,
      [name]: value,
    };

    // Handle dependent dropdown logic
    if (name === "province_ktp_id") {
      updatedData.regencie_ktp_id = "";
      updatedData.district_ktp_id = "";
      updatedData.village_ktp_id = "";
      setRegenciesKtp([]);
      setDistrictsKtp([]);
      setVillagesKtp([]);
      if (value) {
        await fetchRegencies(value, "ktp");
      }
    } else if (name === "regencie_ktp_id") {
      updatedData.district_ktp_id = "";
      updatedData.village_ktp_id = "";
      setDistrictsKtp([]);
      setVillagesKtp([]);
      if (value) {
        await fetchDistricts(value, "ktp");
      }
    } else if (name === "district_ktp_id") {
      updatedData.village_ktp_id = "";
      setVillagesKtp([]);
      if (value) {
        await fetchVillages(value, "ktp");
      }
    } else if (name === "province_domisili_id") {
      updatedData.regencie_domisili_id = "";
      updatedData.district_domisili_id = "";
      updatedData.village_domisili_id = "";
      setRegenciesDomisili([]);
      setDistrictsDomisili([]);
      setVillagesDomisili([]);
      if (value) {
        await fetchRegencies(value, "domisili");
      }
    } else if (name === "regencie_domisili_id") {
      updatedData.district_domisili_id = "";
      updatedData.village_domisili_id = "";
      setDistrictsDomisili([]);
      setVillagesDomisili([]);
      if (value) {
        await fetchDistricts(value, "domisili");
      }
    } else if (name === "district_domisili_id") {
      updatedData.village_domisili_id = "";
      setVillagesDomisili([]);
      if (value) {
        await fetchVillages(value, "domisili");
      }
    }

    setFormData(updatedData);

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Clear success message when user modifies form
    if (successMessage) {
      setSuccessMessage(null);
    }
  };

  // Copy KTP data to Domisili
  const copyKtpToDomisili = async () => {
    const updatedData = {
      ...formData,
      province_domisili_id: formData.province_ktp_id,
      regencie_domisili_id: formData.regencie_ktp_id,
      district_domisili_id: formData.district_ktp_id,
      village_domisili_id: formData.village_ktp_id,
      kode_pos_domisili: formData.kode_pos_ktp,
      alamat_lengkap_domisili: formData.alamat_lengkap_ktp,
    };

    setFormData(updatedData);

    // Load dependent data for domisili
    if (formData.province_ktp_id) {
      await fetchRegencies(formData.province_ktp_id, "domisili");
      if (formData.regencie_ktp_id) {
        await fetchDistricts(formData.regencie_ktp_id, "domisili");
        if (formData.district_ktp_id) {
          await fetchVillages(formData.district_ktp_id, "domisili");
        }
      }
    }
  };

  // Form validation
  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    // Validate KTP fields
    if (!formData.province_ktp_id) {
      newErrors.province_ktp_id = "Provinsi KTP wajib dipilih";
    }
    if (!formData.regencie_ktp_id) {
      newErrors.regencie_ktp_id = "Kabupaten/Kota KTP wajib dipilih";
    }
    if (!formData.district_ktp_id) {
      newErrors.district_ktp_id = "Kecamatan KTP wajib dipilih";
    }
    if (!formData.village_ktp_id) {
      newErrors.village_ktp_id = "Desa/Kelurahan KTP wajib dipilih";
    }
    if (!formData.kode_pos_ktp.trim()) {
      newErrors.kode_pos_ktp = "Kode POS KTP wajib diisi";
    } else if (!/^\d{5}$/.test(formData.kode_pos_ktp)) {
      newErrors.kode_pos_ktp = "Kode POS KTP harus 5 digit angka";
    }
    if (!formData.alamat_lengkap_ktp.trim()) {
      newErrors.alamat_lengkap_ktp = "Alamat lengkap KTP wajib diisi";
    }

    // Validate Domisili fields
    if (!formData.province_domisili_id) {
      newErrors.province_domisili_id = "Provinsi domisili wajib dipilih";
    }
    if (!formData.regencie_domisili_id) {
      newErrors.regencie_domisili_id = "Kabupaten/Kota domisili wajib dipilih";
    }
    if (!formData.district_domisili_id) {
      newErrors.district_domisili_id = "Kecamatan domisili wajib dipilih";
    }
    if (!formData.village_domisili_id) {
      newErrors.village_domisili_id = "Desa/Kelurahan domisili wajib dipilih";
    }
    if (!formData.kode_pos_domisili.trim()) {
      newErrors.kode_pos_domisili = "Kode POS domisili wajib diisi";
    } else if (!/^\d{5}$/.test(formData.kode_pos_domisili)) {
      newErrors.kode_pos_domisili = "Kode POS domisili harus 5 digit angka";
    }
    if (!formData.alamat_lengkap_domisili.trim()) {
      newErrors.alamat_lengkap_domisili = "Alamat lengkap domisili wajib diisi";
    }

    return newErrors;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Clear previous messages
    setSuccessMessage(null);
    setErrors({});

    // Validate form
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitLoading(true);

    try {
      // Prepare data for localStorage storage (sesuai dengan schema database)
      const submitData = {
        province_ktp_id: formData.province_ktp_id,
        regencie_ktp_id: formData.regencie_ktp_id,
        district_ktp_id: formData.district_ktp_id,
        village_ktp_id: formData.village_ktp_id,
        kode_pos_ktp: formData.kode_pos_ktp.trim(),
        alamat_lengkap_ktp: formData.alamat_lengkap_ktp.trim(),
        province_domisili_id: formData.province_domisili_id,
        regencie_domisili_id: formData.regencie_domisili_id,
        district_domisili_id: formData.district_domisili_id,
        village_domisili_id: formData.village_domisili_id,
        kode_pos_domisili: formData.kode_pos_domisili.trim(),
        alamat_lengkap_domisili: formData.alamat_lengkap_domisili.trim(),
      };

      // Save to localStorage
      saveToLocalStorage(submitData);

      // Simulate API delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccessMessage("Data lokasi berhasil disimpan");
    } catch (error: any) {
      console.error("Error saving location data to localStorage:", error);
      setErrors({
        general: "Terjadi kesalahan saat menyimpan data",
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  const resetForm = () => {
    const resetData = {
      province_ktp_id: "",
      regencie_ktp_id: "",
      district_ktp_id: "",
      village_ktp_id: "",
      kode_pos_ktp: "",
      alamat_lengkap_ktp: "",
      province_domisili_id: "",
      regencie_domisili_id: "",
      district_domisili_id: "",
      village_domisili_id: "",
      kode_pos_domisili: "",
      alamat_lengkap_domisili: "",
    };

    setFormData(resetData);
    setErrors({});
    setSuccessMessage(null);

    // Clear all dependent dropdown options
    setRegenciesKtp([]);
    setDistrictsKtp([]);
    setVillagesKtp([]);
    setRegenciesDomisili([]);
    setDistrictsDomisili([]);
    setVillagesDomisili([]);

    // Clear localStorage when resetting
    clearLocalStorage();
  };

  return (
    <div className="bg-white dark:bg-gray-800 dark:border-gray-700 border p-6 mb-8 rounded-2xl">
      <div className="w-full mx-auto">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg dark:bg-green-900/20 dark:border-green-800 dark:text-green-400">
            {successMessage}
          </div>
        )}

        {/* General Error Message */}
        {errors.general && (
          <div className="mb-6 p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-8">
            <header>
              <h1 className="text-gray-900 dark:text-white text-2xl mb-4">
                Lokasi KTP
              </h1>
            </header>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Provinsi KTP */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  <MapPin className="inline w-4 h-4 mr-2" />
                  Provinsi <span className="text-red-500">*</span>
                </label>
                <select
                  name="province_ktp_id"
                  value={formData.province_ktp_id}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.province_ktp_id
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-brand-500`}
                  disabled={submitLoading || loadingProvinces}
                >
                  <option value="">
                    {loadingProvinces ? "Loading..." : "Pilih Provinsi"}
                  </option>
                  {provinces.map((province) => (
                    <option key={province.id} value={province.id}>
                      {province.name}
                    </option>
                  ))}
                </select>
                {errors.province_ktp_id && (
                  <p className="text-red-500 text-sm">
                    {errors.province_ktp_id}
                  </p>
                )}
              </div>

              {/* Kabupaten/Kota KTP */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  <MapPin className="inline w-4 h-4 mr-2" />
                  Kabupaten/Kota <span className="text-red-500">*</span>
                </label>
                <select
                  name="regencie_ktp_id"
                  value={formData.regencie_ktp_id}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.regencie_ktp_id
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-brand-500`}
                  disabled={
                    submitLoading ||
                    loadingRegenciesKtp ||
                    !formData.province_ktp_id
                  }
                >
                  <option value="">
                    {loadingRegenciesKtp
                      ? "Loading..."
                      : !formData.province_ktp_id
                      ? "Pilih provinsi terlebih dahulu"
                      : "Pilih Kabupaten/Kota"}
                  </option>
                  {regenciesKtp.map((regency) => (
                    <option key={regency.id} value={regency.id}>
                      {regency.name}
                    </option>
                  ))}
                </select>
                {errors.regencie_ktp_id && (
                  <p className="text-red-500 text-sm">
                    {errors.regencie_ktp_id}
                  </p>
                )}
              </div>

              {/* Kecamatan KTP */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  <MapPin className="inline w-4 h-4 mr-2" />
                  Kecamatan <span className="text-red-500">*</span>
                </label>
                <select
                  name="district_ktp_id"
                  value={formData.district_ktp_id}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.district_ktp_id
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-brand-500`}
                  disabled={
                    submitLoading ||
                    loadingDistrictsKtp ||
                    !formData.regencie_ktp_id
                  }
                >
                  <option value="">
                    {loadingDistrictsKtp
                      ? "Loading..."
                      : !formData.regencie_ktp_id
                      ? "Pilih kabupaten/kota terlebih dahulu"
                      : "Pilih Kecamatan"}
                  </option>
                  {districtsKtp.map((district) => (
                    <option key={district.id} value={district.id}>
                      {district.name}
                    </option>
                  ))}
                </select>
                {errors.district_ktp_id && (
                  <p className="text-red-500 text-sm">
                    {errors.district_ktp_id}
                  </p>
                )}
              </div>

              {/* Desa/Kelurahan KTP */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  <MapPin className="inline w-4 h-4 mr-2" />
                  Desa/Kelurahan <span className="text-red-500">*</span>
                </label>
                <select
                  name="village_ktp_id"
                  value={formData.village_ktp_id}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.village_ktp_id
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-brand-500`}
                  disabled={
                    submitLoading ||
                    loadingVillagesKtp ||
                    !formData.district_ktp_id
                  }
                >
                  <option value="">
                    {loadingVillagesKtp
                      ? "Loading..."
                      : !formData.district_ktp_id
                      ? "Pilih kecamatan terlebih dahulu"
                      : "Pilih Desa/Kelurahan"}
                  </option>
                  {villagesKtp.map((village) => (
                    <option key={village.id} value={village.id}>
                      {village.name}
                    </option>
                  ))}
                </select>
                {errors.village_ktp_id && (
                  <p className="text-red-500 text-sm">
                    {errors.village_ktp_id}
                  </p>
                )}
              </div>

              {/* Kode POS KTP */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  <User className="inline w-4 h-4 mr-2" />
                  Kode POS <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="kode_pos_ktp"
                  value={formData.kode_pos_ktp}
                  onChange={handleInputChange}
                  placeholder="Masukkan Kode POS"
                  maxLength={5}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.kode_pos_ktp
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-brand-500`}
                  disabled={submitLoading}
                />
                {errors.kode_pos_ktp && (
                  <p className="text-red-500 text-sm">{errors.kode_pos_ktp}</p>
                )}
              </div>
            </div>

            {/* Alamat Lengkap KTP */}
            <div className="space-y-2 mt-5">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                <FileText className="inline w-4 h-4 mr-2" />
                Alamat Lengkap <span className="text-red-500">*</span>
              </label>
              <textarea
                name="alamat_lengkap_ktp"
                value={formData.alamat_lengkap_ktp}
                onChange={handleInputChange}
                placeholder="Jl. Anonym No. 01 Blok ABC ...."
                rows={4}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.alamat_lengkap_ktp
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-vertical focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-brand-500`}
                disabled={submitLoading}
              />
              {errors.alamat_lengkap_ktp && (
                <p className="text-red-500 text-sm">
                  {errors.alamat_lengkap_ktp}
                </p>
              )}
            </div>
          </div>

          <div>
            <header className="flex items-center justify-between">
              <h1 className="text-gray-900 dark:text-white text-2xl mb-4">
                Lokasi Domisili
              </h1>
              <button
                type="button"
                onClick={copyKtpToDomisili}
                disabled={submitLoading || !formData.province_ktp_id}
                className="mb-4 px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
              >
                Sama dengan KTP
              </button>
            </header>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Provinsi Domisili */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  <MapPin className="inline w-4 h-4 mr-2" />
                  Provinsi <span className="text-red-500">*</span>
                </label>
                <select
                  name="province_domisili_id"
                  value={formData.province_domisili_id}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.province_domisili_id
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-brand-500`}
                  disabled={submitLoading || loadingProvinces}
                >
                  <option value="">
                    {loadingProvinces ? "Loading..." : "Pilih Provinsi"}
                  </option>
                  {provinces.map((province) => (
                    <option key={province.id} value={province.id}>
                      {province.name}
                    </option>
                  ))}
                </select>
                {errors.province_domisili_id && (
                  <p className="text-red-500 text-sm">
                    {errors.province_domisili_id}
                  </p>
                )}
              </div>

              {/* Kabupaten/Kota Domisili */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  <MapPin className="inline w-4 h-4 mr-2" />
                  Kabupaten/Kota <span className="text-red-500">*</span>
                </label>
                <select
                  name="regencie_domisili_id"
                  value={formData.regencie_domisili_id}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.regencie_domisili_id
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-brand-500`}
                  disabled={
                    submitLoading ||
                    loadingRegenciesDomisili ||
                    !formData.province_domisili_id
                  }
                >
                  <option value="">
                    {loadingRegenciesDomisili
                      ? "Loading..."
                      : !formData.province_domisili_id
                      ? "Pilih provinsi terlebih dahulu"
                      : "Pilih Kabupaten/Kota"}
                  </option>
                  {regenciesDomisili.map((regency) => (
                    <option key={regency.id} value={regency.id}>
                      {regency.name}
                    </option>
                  ))}
                </select>
                {errors.regencie_domisili_id && (
                  <p className="text-red-500 text-sm">
                    {errors.regencie_domisili_id}
                  </p>
                )}
              </div>

              {/* Kecamatan Domisili */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  <MapPin className="inline w-4 h-4 mr-2" />
                  Kecamatan <span className="text-red-500">*</span>
                </label>
                <select
                  name="district_domisili_id"
                  value={formData.district_domisili_id}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.district_domisili_id
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-brand-500`}
                  disabled={
                    submitLoading ||
                    loadingDistrictsDomisili ||
                    !formData.regencie_domisili_id
                  }
                >
                  <option value="">
                    {loadingDistrictsDomisili
                      ? "Loading..."
                      : !formData.regencie_domisili_id
                      ? "Pilih kabupaten/kota terlebih dahulu"
                      : "Pilih Kecamatan"}
                  </option>
                  {districtsDomisili.map((district) => (
                    <option key={district.id} value={district.id}>
                      {district.name}
                    </option>
                  ))}
                </select>
                {errors.district_domisili_id && (
                  <p className="text-red-500 text-sm">
                    {errors.district_domisili_id}
                  </p>
                )}
              </div>

              {/* Desa/Kelurahan Domisili */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  <MapPin className="inline w-4 h-4 mr-2" />
                  Desa/Kelurahan <span className="text-red-500">*</span>
                </label>
                <select
                  name="village_domisili_id"
                  value={formData.village_domisili_id}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.village_domisili_id
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-brand-500`}
                  disabled={
                    submitLoading ||
                    loadingVillagesDomisili ||
                    !formData.district_domisili_id
                  }
                >
                  <option value="">
                    {loadingVillagesDomisili
                      ? "Loading..."
                      : !formData.district_domisili_id
                      ? "Pilih kecamatan terlebih dahulu"
                      : "Pilih Desa/Kelurahan"}
                  </option>
                  {villagesDomisili.map((village) => (
                    <option key={village.id} value={village.id}>
                      {village.name}
                    </option>
                  ))}
                </select>
                {errors.village_domisili_id && (
                  <p className="text-red-500 text-sm">
                    {errors.village_domisili_id}
                  </p>
                )}
              </div>

              {/* Kode POS Domisili */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  <User className="inline w-4 h-4 mr-2" />
                  Kode POS <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="kode_pos_domisili"
                  value={formData.kode_pos_domisili}
                  onChange={handleInputChange}
                  placeholder="Masukkan Kode POS"
                  maxLength={5}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.kode_pos_domisili
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-brand-500`}
                  disabled={submitLoading}
                />
                {errors.kode_pos_domisili && (
                  <p className="text-red-500 text-sm">
                    {errors.kode_pos_domisili}
                  </p>
                )}
              </div>
            </div>

            {/* Alamat Lengkap Domisili */}
            <div className="space-y-2 mt-5">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                <FileText className="inline w-4 h-4 mr-2" />
                Alamat Lengkap <span className="text-red-500">*</span>
              </label>
              <textarea
                name="alamat_lengkap_domisili"
                value={formData.alamat_lengkap_domisili}
                onChange={handleInputChange}
                placeholder="Jl. Anonym No. 01 Blok ABC ...."
                rows={4}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.alamat_lengkap_domisili
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-vertical focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-brand-500`}
                disabled={submitLoading}
              />
              {errors.alamat_lengkap_domisili && (
                <p className="text-red-500 text-sm">
                  {errors.alamat_lengkap_domisili}
                </p>
              )}
            </div>
          </div>

          {/* Tombol Aksi */}
          <div className="flex gap-4 justify-end">
            <button
              type="button"
              onClick={resetForm}
              disabled={submitLoading}
              className="px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={submitLoading}
              className="bg-brand-500 hover:bg-brand-600 disabled:bg-brand-400 text-white font-medium py-3 px-8 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {submitLoading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Menyimpan...
                </>
              ) : (
                "Simpan Data"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default LocationForm;
