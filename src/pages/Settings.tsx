import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import GoogleReviewsConnect from '../components/GoogleReviewsConnect';
import { useClinicContext } from '../context/ClinicContext';

const settingsSchema = z.object({
  clinicName: z.string().min(2, { message: "Clinic name must be at least 2 characters long" }),
  logo: z.instanceof(FileList).optional(),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

const Settings: React.FC = () => {
  const { clinicInfo, updateClinicInfo } = useClinicContext();
  const [logoPreview, setLogoPreview] = useState<string | null>(clinicInfo.logo);
  const { register, handleSubmit, formState: { errors } } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      clinicName: clinicInfo.name,
    },
  });

  const onSubmit = (data: SettingsFormData) => {
    const updatedInfo: Partial<{ name: string; logo: string }> = { name: data.clinicName };
    
    if (data.logo && data.logo[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Logo = reader.result as string;
        updateClinicInfo({ ...updatedInfo, logo: base64Logo });
      };
      reader.readAsDataURL(data.logo[0]);
    } else {
      updateClinicInfo(updatedInfo);
    }

    alert("Settings saved successfully!");
  };

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Clinic Information</h2>
        
        <div className="mb-4">
          <label htmlFor="clinicName" className="block text-sm font-medium text-gray-700 mb-1">
            Clinic/Hospital Name
          </label>
          <input
            id="clinicName"
            type="text"
            {...register('clinicName')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.clinicName && <p className="mt-1 text-sm text-red-600">{errors.clinicName.message}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-1">
            Logo
          </label>
          <input
            id="logo"
            type="file"
            accept="image/*"
            {...register('logo')}
            onChange={handleLogoChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.logo && <p className="mt-1 text-sm text-red-600">{errors.logo.message}</p>}
          {logoPreview && (
            <img src={logoPreview} alt="Logo preview" className="mt-2 max-w-xs rounded-md" />
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Save Changes
        </button>
      </form>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Google Reviews Integration</h2>
        <GoogleReviewsConnect />
      </div>
    </div>
  );
};

export default Settings;