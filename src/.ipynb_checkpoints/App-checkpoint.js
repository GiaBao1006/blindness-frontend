import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_URL = "https://predictvisionsolution.shop/predict"; // Flask EC2 endpoint

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setPrediction(null);

    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", selectedFile); // Phải đúng key "file" như backend yêu cầu

      const response = await axios.post(API_URL, formData); // KHÔNG set headers thủ công
      setPrediction(response.data);
    } catch (err) {
      setPrediction("Lỗi rồi: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Blindness Detection AI</h1>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mb-4"
      />

      {previewUrl && (
        <img
          src={previewUrl}
          alt="preview"
          className="w-64 h-64 object-contain border mb-4"
        />
      )}

      <button
        onClick={handleSubmit}
        disabled={!selectedFile || loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Đang dự đoán..." : "Gửi Dự Đoán"}
      </button>

      {prediction && (
        <div className="mt-6 p-4 bg-white rounded shadow">
          <p className="font-semibold">Kết quả dự đoán:</p>
          <pre>{JSON.stringify(prediction, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;