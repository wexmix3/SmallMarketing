'use client';

import { useState, useRef, useEffect } from 'react';
import {
  PhotoIcon,
  VideoCameraIcon,
  XMarkIcon,
  ArrowUpTrayIcon,
  DocumentIcon,
  LinkIcon,
  EyeIcon,
  PlusIcon,
  ArrowsPointingOutIcon
} from '@heroicons/react/24/outline';
import { MediaAttachment } from '@/models/social';

interface MediaUploaderProps {
  onMediaChange: (media: MediaAttachment[]) => void;
  initialMedia?: MediaAttachment[];
  maxFiles?: number;
  allowedTypes?: ('image' | 'video' | 'document' | 'link' | 'gif')[];
}

export default function MediaUploader({
  onMediaChange,
  initialMedia = [],
  maxFiles = 10,
  allowedTypes = ['image', 'video', 'gif']
}: MediaUploaderProps) {
  const [media, setMedia] = useState<MediaAttachment[]>(initialMedia);
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewMedia, setPreviewMedia] = useState<MediaAttachment | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update media when initialMedia changes
  useEffect(() => {
    setMedia(initialMedia);
  }, [initialMedia]);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      if (media.length + e.target.files.length > maxFiles) {
        setError(`You can only upload a maximum of ${maxFiles} files`);
        return;
      }

      setError(null);
      setIsUploading(true);
      handleFiles(Array.from(e.target.files));
    }
  };

  // Handle drag events
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Handle drop event
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      if (media.length + e.dataTransfer.files.length > maxFiles) {
        setError(`You can only upload a maximum of ${maxFiles} files`);
        return;
      }

      setError(null);
      setIsUploading(true);
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  // Process files
  const handleFiles = (files: File[]) => {
    const newMedia: MediaAttachment[] = [];
    let processed = 0;

    files.forEach((file, index) => {
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        setError(`File ${file.name} exceeds the 10MB size limit`);
        return;
      }

      // Determine file type
      let fileType: MediaAttachment['type'] = 'document';
      if (file.type.startsWith('image/')) {
        fileType = file.type === 'image/gif' ? 'gif' : 'image';
      } else if (file.type.startsWith('video/')) {
        fileType = 'video';
      }

      // Check if file type is allowed
      if (!allowedTypes.includes(fileType)) {
        setError(`File type ${fileType} is not allowed`);
        return;
      }

      // Create a URL for the file
      const url = URL.createObjectURL(file);

      // Create media attachment
      const mediaAttachment: MediaAttachment = {
        id: `new-${Date.now()}-${index}`,
        type: fileType,
        url: url,
        thumbnail: fileType === 'image' || fileType === 'gif' ? url : undefined,
        title: file.name,
        size: file.size,
        mimeType: file.type,
        createdAt: new Date()
      };

      // Add dimensions for images
      if (fileType === 'image' || fileType === 'gif') {
        const img = new Image();
        img.onload = () => {
          mediaAttachment.dimensions = {
            width: img.width,
            height: img.height
          };
          processed++;
          if (processed === files.length) {
            finishUpload(newMedia);
          }
        };
        img.onerror = () => {
          processed++;
          if (processed === files.length) {
            finishUpload(newMedia);
          }
        };
        img.src = url;
      } else {
        processed++;
      }

      newMedia.push(mediaAttachment);
    });

    // If no image files to process dimensions for, finish upload immediately
    if (processed === files.length) {
      finishUpload(newMedia);
    }
  };

  // Finish upload process
  const finishUpload = (newMedia: MediaAttachment[]) => {
    const updatedMedia = [...media, ...newMedia];
    setMedia(updatedMedia);
    onMediaChange(updatedMedia);
    setIsUploading(false);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Remove a media item
  const handleRemoveMedia = (id: string) => {
    const mediaToRemove = media.find(item => item.id === id);
    if (mediaToRemove && mediaToRemove.url.startsWith('blob:')) {
      // Revoke object URL to prevent memory leaks
      URL.revokeObjectURL(mediaToRemove.url);
      if (mediaToRemove.thumbnail && mediaToRemove.thumbnail.startsWith('blob:')) {
        URL.revokeObjectURL(mediaToRemove.thumbnail);
      }
    }

    const updatedMedia = media.filter(item => item.id !== id);
    setMedia(updatedMedia);
    onMediaChange(updatedMedia);

    // Close preview if the removed item was being previewed
    if (previewMedia && previewMedia.id === id) {
      setPreviewMedia(null);
    }
  };

  // Trigger file input click
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Open preview modal
  const openPreview = (item: MediaAttachment) => {
    setPreviewMedia(item);
  };

  // Close preview modal
  const closePreview = () => {
    setPreviewMedia(null);
  };

  // Get icon for media type
  const getMediaIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <PhotoIcon className="h-5 w-5 text-gray-400" />;
      case 'video':
        return <VideoCameraIcon className="h-5 w-5 text-gray-400" />;
      case 'gif':
        return <PhotoIcon className="h-5 w-5 text-gray-400" />;
      case 'link':
        return <LinkIcon className="h-5 w-5 text-gray-400" />;
      default:
        return <DocumentIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  // Format file size
  const formatFileSize = (bytes: number | undefined) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-4">
      {/* Error message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-3 rounded">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <XMarkIcon className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Media preview grid */}
      {media.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {media.map((item) => (
            <div key={item.id} className="relative group rounded-lg overflow-hidden border border-gray-200">
              <div className="aspect-w-16 aspect-h-9 w-full overflow-hidden bg-gray-100">
                {item.type === 'image' || item.type === 'gif' ? (
                  <img
                    src={item.thumbnail || item.url}
                    alt={item.title || 'Media preview'}
                    className="object-cover w-full h-full"
                  />
                ) : item.type === 'video' ? (
                  <div className="flex items-center justify-center h-full bg-gray-800">
                    <VideoCameraIcon className="h-10 w-10 text-gray-300" />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    {getMediaIcon(item.type)}
                  </div>
                )}

                {/* Overlay with actions */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => openPreview(item)}
                    className="p-1.5 bg-white rounded-full mx-1 hover:bg-gray-100"
                    title="Preview"
                  >
                    <EyeIcon className="h-4 w-4 text-gray-700" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveMedia(item.id)}
                    className="p-1.5 bg-white rounded-full mx-1 hover:bg-gray-100"
                    title="Remove"
                  >
                    <XMarkIcon className="h-4 w-4 text-gray-700" />
                  </button>
                </div>
              </div>

              {/* File info */}
              <div className="p-2 text-xs truncate">
                <div className="font-medium text-gray-700 truncate">
                  {item.title || `${item.type.charAt(0).toUpperCase() + item.type.slice(1)} file`}
                </div>
                {item.size && (
                  <div className="text-gray-500">{formatFileSize(item.size)}</div>
                )}
              </div>
            </div>
          ))}

          {/* Add more button */}
          {media.length < maxFiles && (
            <div
              className="aspect-w-16 aspect-h-9 w-full border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 bg-gray-50"
              onClick={handleButtonClick}
            >
              <div className="text-center p-4">
                <PlusIcon className="h-8 w-8 text-gray-400 mx-auto" />
                <p className="mt-1 text-xs text-gray-500">Add Media</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Upload area (only show if no media or under limit) */}
      {media.length === 0 && (
        <div
          className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer ${
            dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
          } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={handleButtonClick}
        >
          <ArrowUpTrayIcon className="h-10 w-10 text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">
            <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {allowedTypes.includes('image') && 'PNG, JPG, '}
            {allowedTypes.includes('gif') && 'GIF, '}
            {allowedTypes.includes('video') && 'MP4, '}
            {allowedTypes.includes('document') && 'PDF, DOC, '}
            (max. 10MB)
          </p>
          {isUploading && (
            <div className="mt-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>
      )}

      {/* File input (hidden) */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={allowedTypes.map(type => {
          switch(type) {
            case 'image': return 'image/jpeg,image/png,image/webp';
            case 'gif': return 'image/gif';
            case 'video': return 'video/mp4,video/quicktime';
            case 'document': return '.pdf,.doc,.docx';
            default: return '';
          }
        }).join(',')}
        className="hidden"
        onChange={handleFileChange}
        disabled={isUploading || media.length >= maxFiles}
      />

      {/* Preview modal */}
      {previewMedia && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={closePreview}></div>

            {/* Modal panel */}
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                        {previewMedia.title || 'Media Preview'}
                      </h3>
                      <button
                        type="button"
                        className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                        onClick={closePreview}
                      >
                        <XMarkIcon className="h-6 w-6" />
                      </button>
                    </div>

                    <div className="mt-2">
                      {previewMedia.type === 'image' || previewMedia.type === 'gif' ? (
                        <img
                          src={previewMedia.url}
                          alt={previewMedia.title || 'Media preview'}
                          className="max-h-[70vh] mx-auto object-contain"
                        />
                      ) : previewMedia.type === 'video' ? (
                        <video
                          src={previewMedia.url}
                          controls
                          className="max-h-[70vh] mx-auto"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center p-10 bg-gray-100 rounded-lg">
                          {getMediaIcon(previewMedia.type)}
                          <p className="mt-2 text-sm text-gray-500">{previewMedia.title}</p>
                        </div>
                      )}
                    </div>

                    {/* File details */}
                    <div className="mt-4 bg-gray-50 p-3 rounded-md">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Type</p>
                          <p className="font-medium">{previewMedia.type.charAt(0).toUpperCase() + previewMedia.type.slice(1)}</p>
                        </div>
                        {previewMedia.size && (
                          <div>
                            <p className="text-gray-500">Size</p>
                            <p className="font-medium">{formatFileSize(previewMedia.size)}</p>
                          </div>
                        )}
                        {previewMedia.dimensions && (
                          <div>
                            <p className="text-gray-500">Dimensions</p>
                            <p className="font-medium">{previewMedia.dimensions.width} × {previewMedia.dimensions.height}</p>
                          </div>
                        )}
                        {previewMedia.mimeType && (
                          <div>
                            <p className="text-gray-500">Format</p>
                            <p className="font-medium">{previewMedia.mimeType.split('/')[1].toUpperCase()}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={closePreview}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    handleRemoveMedia(previewMedia.id);
                    closePreview();
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
