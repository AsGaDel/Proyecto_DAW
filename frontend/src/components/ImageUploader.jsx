import { useState, useRef } from "react";

export default function ImageUploader({ value, onChange }) {
  const [preview, setPreview] = useState(null);
  const inputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;
    onChange(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleInputChange = (e) => handleFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onChange(null);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="mb-6">
      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
        Subir imagen
      </label>

      <div
        onClick={() => !preview && inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className={`relative w-full aspect-[4/3] rounded-lg overflow-hidden border-2 border-dashed transition-colors duration-150
          ${preview
            ? "border-transparent cursor-default"
            : "border-gray-300 hover:border-blue-400 cursor-pointer bg-gray-50"
          }`}
      >
        {preview ? (
          <>
            <img src={preview} alt="Vista previa" className="w-full h-full object-cover" />
            <button
              onClick={handleRemove}
              className="absolute top-2 right-2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full w-7 h-7 flex items-center justify-center transition-opacity"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
            </svg>
            <p className="text-xs text-gray-400">Arrastra una imagen o haz clic para seleccionar</p>
            <p className="text-xs text-gray-300">PNG, JPG — máx. 10 MB</p>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".png,.jpg,.jpeg"
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  );
}