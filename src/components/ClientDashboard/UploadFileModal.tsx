import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, File, Image, FileText, Folder, Package, Award } from 'lucide-react';
import { fileUploadService, UploadFileForm } from '../../lib/client-quick-actions';

interface UploadFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: string;
  projects: any[];
  onFileUploaded?: (file: any) => void;
}

const UploadFileModal: React.FC<UploadFileModalProps> = ({
  isOpen,
  onClose,
  clientId,
  projects,
  onFileUploaded
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    project_id: '',
    milestone_id: '',
    description: '',
    category: 'general' as const,
    file: null as File | null
  });

  const categories = [
    { value: 'general', label: 'General', icon: File, color: 'blue' },
    { value: 'design', label: 'Design', icon: Image, color: 'purple' },
    { value: 'content', label: 'Content', icon: FileText, color: 'green' },
    { value: 'documentation', label: 'Documentation', icon: Folder, color: 'yellow' },
    { value: 'assets', label: 'Assets', icon: Package, color: 'orange' },
    { value: 'deliverable', label: 'Deliverable', icon: Award, color: 'red' }
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setForm({ ...form, file: e.dataTransfer.files[0] });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setForm({ ...form, file: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.file || !form.project_id) {
      setError('Please select a project and file to upload');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const uploadData: UploadFileForm = {
        project_id: form.project_id,
        milestone_id: form.milestone_id || undefined,
        file: form.file,
        description: form.description,
        category: form.category
      };

      const response = await fileUploadService.uploadFile(clientId, uploadData);

      if (response.success && response.data) {
        setSuccess('File uploaded successfully!');
        onFileUploaded?.(response.data);
        
        // Reset form
        setForm({
          project_id: '',
          milestone_id: '',
          description: '',
          category: 'general',
          file: null
        });

        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }

        // Close modal after 2 seconds
        setTimeout(() => {
          onClose();
          setSuccess('');
        }, 2000);
      } else {
        setError(response.error || 'Failed to upload file');
      }
    } catch (err: any) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl">
                    <Upload className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Upload Files</h2>
                    <p className="text-purple-200 text-sm">Share files with your project team</p>
                  </div>
                </div>
                
                <button
                  onClick={onClose}
                  className="p-2 text-purple-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Form */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Project Selection */}
                <div>
                  <label className="block text-white font-medium mb-2">
                    Project *
                  </label>
                  <select
                    required
                    value={form.project_id}
                    onChange={(e) => setForm({ ...form, project_id: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="" className="bg-purple-900">Select a project</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id} className="bg-purple-900">
                        {project.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* File Category */}
                <div>
                  <label className="block text-white font-medium mb-3">
                    File Category
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {categories.map((category) => {
                      const Icon = category.icon;
                      const isSelected = form.category === category.value;
                      return (
                        <motion.button
                          key={category.value}
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setForm({ ...form, category: category.value as any })}
                          className={`p-3 rounded-xl border transition-all ${
                            isSelected
                              ? 'bg-green-500/20 border-green-500/50 text-green-300'
                              : 'bg-white/5 border-white/20 text-purple-200 hover:bg-white/10'
                          }`}
                        >
                          <Icon className="w-5 h-5 mx-auto mb-2" />
                          <span className="text-sm font-medium">{category.label}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* File Upload Area */}
                <div>
                  <label className="block text-white font-medium mb-2">
                    File *
                  </label>
                  <div
                    className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                      dragActive
                        ? 'border-green-500 bg-green-500/10'
                        : 'border-white/20 hover:border-white/40'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={handleFileSelect}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    
                    {form.file ? (
                      <div className="space-y-3">
                        <div className="w-16 h-16 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto">
                          <File className="w-8 h-8 text-green-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">{form.file.name}</p>
                          <p className="text-purple-300 text-sm">{formatFileSize(form.file.size)}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setForm({ ...form, file: null });
                            if (fileInputRef.current) fileInputRef.current.value = '';
                          }}
                          className="text-red-400 hover:text-red-300 text-sm"
                        >
                          Remove file
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center mx-auto">
                          <Upload className="w-8 h-8 text-purple-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">Drop your file here</p>
                          <p className="text-purple-300 text-sm">or click to browse</p>
                        </div>
                        <p className="text-purple-400 text-xs">
                          Supports: Images, Documents, Archives (Max 10MB)
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-white font-medium mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    placeholder="Brief description of the file..."
                  />
                </div>

                {/* Error/Success Messages */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 text-sm"
                  >
                    {error}
                  </motion.div>
                )}

                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-200 text-sm"
                  >
                    {success}
                  </motion.div>
                )}

                {/* Submit Button */}
                <div className="flex justify-end space-x-3 pt-4">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    className="px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all"
                  >
                    Cancel
                  </motion.button>
                  
                  <motion.button
                    type="submit"
                    disabled={loading || !form.file || !form.project_id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Uploading...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Upload className="w-4 h-4" />
                        <span>Upload File</span>
                      </div>
                    )}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default UploadFileModal;
