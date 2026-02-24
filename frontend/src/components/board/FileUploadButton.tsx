import React, { useRef } from 'react';
import { Upload, X } from 'lucide-react';

interface FileUploadButtonProps {
    label: string;
    accept?: string;
    onChange: (file: File | null) => void;
    selectedFile: File | null;
}

export default function FileUploadButton({ label, accept, onChange, selectedFile }: FileUploadButtonProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleClick = () => {
        inputRef.current?.click();
    };

    return (
        <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-4">
                <button
                    type="button"
                    onClick={handleClick}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <Upload className="h-4 w-4 mr-2" />
                    {label}
                </button>
                <input
                    type="file"
                    ref={inputRef}
                    className="hidden"
                    accept={accept}
                    onChange={(e) => {
                        if (e.target.files?.[0]) {
                            onChange(e.target.files[0]);
                        }
                    }}
                />
                {selectedFile && (
                    <div className="flex items-center text-sm text-gray-600 bg-gray-100 px-3 py-1.5 rounded-md">
                        <span className="truncate max-w-[200px]">{selectedFile.name}</span>
                        <button
                            type="button"
                            onClick={() => onChange(null)}
                            className="ml-2 text-gray-400 hover:text-red-500 focus:outline-none"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
