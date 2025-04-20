import React, { useState } from 'react';
import { Upload, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from "sonner";

const PortfolioUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [activeTab, setActiveTab] = useState('raw_portfolio');
  const [tables, setTables] = useState<{
    raw_portfolio: string;
    stocks: string;
    sectors: string;
    active_weights: string;
    attribution: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;

    if (selectedFile) {
      const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase() || '';

      if (['xls', 'xlsx', 'csv'].includes(fileExtension)) {
        setFile(selectedFile);
      } else {
        toast.error('Please upload a valid .xls, .xlsx, or .csv file');
        event.target.value = '';
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    setUploaded(false);
    setError(null);

    try {
      // Determine the correct API URL based on the environment
      const isLocalDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const apiUrl = isLocalDev ? 'http://localhost:5000/upload' : '/api/upload';

      const response = await fetch(apiUrl, {
      method: "POST",
      body: formData,
});

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.raw_portfolio || !data.stocks || !data.sectors || !data.active_weights || !data.attribution) {
        throw new Error('Missing data in response');
      }

      setTables({
        raw_portfolio: data.raw_portfolio,
        stocks: data.stocks,
        sectors: data.sectors,
        active_weights: data.active_weights,
        attribution: data.attribution,
      });

      setUploaded(true);
      toast.success("Upload successful!");
    } catch (err: any) {
      console.error("Upload error:", err);

      // Determine the error type and display specific messages
      if (err.message.includes('Upload failed')) {
        setError(`Error uploading file: ${err.message}`);
      } else if (err.message.includes('Missing data in response')) {
        setError("Error: Data missing in the server response.");
      } else {
        setError("An unexpected error occurred while uploading the file.");
      }

      toast.error("Failed to upload portfolio. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleReupload = () => {
    setFile(null);
    setUploaded(false);
    setActiveTab('raw_portfolio');
    setTables(null);  // Reset tables when reuploading
    setError(null);  // Reset error
  };

  // Extracting button content logic into a separate function
  const getButtonContent = () => {
    if (uploading) {
      return (
        <>
          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
          <span>Uploading...</span>
        </>
      );
    }

    if (uploaded) {
      return (
        <>
          <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
          <span>Uploaded</span>
        </>
      );
    }

    return (
      <>
        <Upload className="mr-2 h-4 w-4" />
        <span>Upload</span>
      </>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* File Upload Section */}
      <div className="flex items-center space-x-4">
        <input
          type="file"
          accept=".xls,.xlsx,.csv"
          onChange={handleFileChange}
          className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
        />
        <Button
          onClick={handleUpload}
          disabled={!file || uploading}
          variant="default"
          className="flex items-center space-x-2"
        >
          {getButtonContent()}
        </Button>
      </div>

      {/* Reupload Button (show only if uploaded) */}
      {uploaded && (
        <div className="mt-4 flex items-center justify-center">
          <Button
            onClick={handleReupload}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <XCircle className="mr-2 h-4 w-4 text-red-600" />
            <span>Re-upload</span>
          </Button>
        </div>
      )}

      {/* Tabs for Tables */}
      {tables && (
        <Tabs defaultValue="raw_portfolio" value={activeTab} onValueChange={setActiveTab} className="mt-8">
          <TabsList className="flex space-x-2">
            <TabsTrigger value="raw_portfolio">Raw Portfolio</TabsTrigger>
            <TabsTrigger value="stocks">Portfolio Decomposition</TabsTrigger>
            <TabsTrigger value="sectors">Sector Distribution</TabsTrigger>
            <TabsTrigger value="active_weights">Active Weights</TabsTrigger>
            <TabsTrigger value="attribution">Performance Attribution</TabsTrigger>
          </TabsList>

          {/* Tab Content */}
          <TabsContent value="raw_portfolio">
            <div dangerouslySetInnerHTML={{ __html: tables.raw_portfolio }} />
          </TabsContent>
          <TabsContent value="stocks">
            <div dangerouslySetInnerHTML={{ __html: tables.stocks }} />
          </TabsContent>
          <TabsContent value="sectors">
            <div dangerouslySetInnerHTML={{ __html: tables.sectors }} />
          </TabsContent>
          <TabsContent value="active_weights">
            <div dangerouslySetInnerHTML={{ __html: tables.active_weights }} />
          </TabsContent>
          <TabsContent value="attribution">
            <div dangerouslySetInnerHTML={{ __html: tables.attribution }} />
          </TabsContent>
        </Tabs>
      )}

      {/* Error Message */}
      {error && (
        <div className="text-red-500 font-medium mt-4">
          {error}
        </div>
      )}
    </div>
  );
};

export default PortfolioUploader;
