import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const apiKeySchema = z.object({
  apiKey: z.string().min(1, { message: "API Key is required" }),
  placeId: z.string().min(1, { message: "Place ID is required" }),
});

type ApiKeyFormData = z.infer<typeof apiKeySchema>;

const GoogleReviewsConnect: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<ApiKeyFormData>({
    resolver: zodResolver(apiKeySchema),
  });

  const onSubmit = (data: ApiKeyFormData) => {
    console.log("Connecting with:", data);
    // Here you would typically send the API key and Place ID to your backend
    // and handle the connection process
    setIsConnected(true);
    alert("Connected to Google Reviews API successfully!");
  };

  const handleDisconnect = () => {
    // In a real scenario, this would revoke access and clear tokens
    setIsConnected(false);
    alert("Disconnected from Google Reviews API");
  };

  return (
    <div>
      {!isConnected ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">
              Google API Key
            </label>
            <input
              id="apiKey"
              type="text"
              {...register('apiKey')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.apiKey && <p className="mt-1 text-sm text-red-600">{errors.apiKey.message}</p>}
          </div>
          <div>
            <label htmlFor="placeId" className="block text-sm font-medium text-gray-700 mb-1">
              Google Place ID
            </label>
            <input
              id="placeId"
              type="text"
              {...register('placeId')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.placeId && <p className="mt-1 text-sm text-red-600">{errors.placeId.message}</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Connect to Google Reviews
          </button>
        </form>
      ) : (
        <div>
          <p className="mb-4 text-green-600">Connected to Google Reviews API</p>
          <button
            onClick={handleDisconnect}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Disconnect from Google Reviews
          </button>
        </div>
      )}
    </div>
  );
};

export default GoogleReviewsConnect;