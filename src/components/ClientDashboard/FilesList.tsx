import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Upload,
  File,
  Image,
  FileText,
  Download,
  Eye,
  Plus,
  Search,
  Filter,
  FolderOpen,
  Calendar,
  User,
  X,
  Paperclip
} from 'lucide-react';
import { filesService, projectsService } from '../../lib/client-dashboard-api';
import type { ProjectFile, Project, AuthSession, FileUploadForm } from '../../types/client-dashboard';

interface FilesListProps {
  clientId: string;
  session: AuthSession;
}

const FilesList: React.FC<FilesListProps> = ({ clientId, session }) => {
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [uploadForm, setUploadForm] = useState<FileUploadForm>({
    project_id: '',
    file_category: 'general',
    description: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    loadData();
  }, [clientId]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load projects
      const projectsResponse = await projectsService.getProjects(clientId, undefined, undefined, 1, 50);
      if (projectsResponse.success && projectsResponse.data) {
        setProjects(projectsResponse.data.data);
        
        // Load files for all projects
        const allFiles: ProjectFile[] = [];
        for (const project of projectsResponse.data.data) {
          const filesResponse = await filesService.getFiles(project.id);
          if (filesResponse.success && filesResponse.data) {
            const filesWithProject = filesResponse.data.map(file => ({
              ...file,
              project
            }));
            allFiles.push(...filesWithProject);
          }
        }
        
        // Sort by creation date (newest first)
        allFiles.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        setFiles(allFiles);
      }
    } catch (error) {
      console.error('Failed to load files:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    try {
      setUploading(true);
      const response = await filesService.uploadFile(selectedFile, {
        ...uploadForm,
        uploaded_by_client_id: clientId
      });
      
      if (response.success && response.data) {
        setFiles([response.data, ...files]);
        setShowUploadForm(false);
        setUploadForm({
          project_id: '',
          file_category: 'general',
          description: ''
        });
        setSelectedFile(null);
      }
    } catch (error) {
      console.error('Failed to upload file:', error);
    } finally {
      setUploading(false);
    }
  };

  const getFileIcon = (fileType: string | undefined, fileName: string) => {
    if (!fileType) {
      const ext = fileName.split('.').pop()?.toLowerCase();
      if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) {
        return <Image className="w-8 h-8 text-green-500" />;
      }
      if (['pdf', 'doc', 'docx', 'txt'].includes(ext || '')) {
        return <FileText className="w-8 h-8 text-blue-500" />;
      }
      return <File className="w-8 h-8 text-purple-500" />;
    }

    if (fileType.startsWith('image/')) {
      return <Image className="w-8 h-8 text-green-500" />;
    }
    if (fileType.includes('pdf') || fileType.includes('document') || fileType.includes('text')) {
      return <FileText className="w-8 h-8 text-blue-500" />;
    }
    return <File className="w-8 h-8 text-purple-500" />;
  };

  const formatFileSize = (bytes: number | undefined) => {
    if (!bytes) return 'Unknown size';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'design':
        return 'bg-purple-100 text-purple-800';
      case 'content':
        return 'bg-blue-100 text-blue-800';
      case 'assets':
        return 'bg-green-100 text-green-800';
      case 'documents':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.file_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || file.file_category === categoryFilter;
    const matchesProject = selectedProject === 'all' || file.project_id === selectedProject;
    
    return matchesSearch && matchesCategory && matchesProject;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 animate-pulse">
              <div className="h-8 bg-white/20 rounded mb-4"></div>
              <div className="h-4 bg-white/20 rounded mb-2"></div>
              <div className="h-4 bg-white/20 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-white">Project Files</h2>
          <p className="text-purple-200">Upload and manage project files and assets</p>
        </div>
        
        <button
          onClick={() => setShowUploadForm(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>Upload File</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300 w-5 h-5" />
          <input
            type="text"
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="all">All Categories</option>
          <option value="design">Design</option>
          <option value="content">Content</option>
          <option value="assets">Assets</option>
          <option value="documents">Documents</option>
          <option value="general">General</option>
        </select>
        
        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="all">All Projects</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.title}
            </option>
          ))}
        </select>
      </div>

      {/* Files Grid */}
      {filteredFiles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFiles.map((file, index) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                {getFileIcon(file.file_type, file.file_name)}
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(file.file_category)}`}>
                  {file.file_category}
                </span>
              </div>
              
              <h3 className="text-white font-semibold mb-2 truncate" title={file.file_name}>
                {file.file_name}
              </h3>
              
              {file.description && (
                <p className="text-purple-200 text-sm mb-3 line-clamp-2">{file.description}</p>
              )}
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2 text-purple-200">
                  <FolderOpen className="w-4 h-4" />
                  <span>{file.project?.title}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-purple-200">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(file.created_at).toLocaleDateString()}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-purple-200">
                  <File className="w-4 h-4" />
                  <span>{formatFileSize(file.file_size)}</span>
                </div>
                
                {file.uploaded_by_admin ? (
                  <div className="flex items-center space-x-2 text-purple-200">
                    <User className="w-4 h-4" />
                    <span>Uploaded by team</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-green-300">
                    <User className="w-4 h-4" />
                    <span>Uploaded by you</span>
                  </div>
                )}
              </div>
              
              <div className="flex space-x-2 mt-4">
                <a
                  href={file.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center space-x-2 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all text-sm"
                >
                  <Eye className="w-4 h-4" />
                  <span>View</span>
                </a>
                <a
                  href={file.file_url}
                  download={file.file_name}
                  className="flex-1 flex items-center justify-center space-x-2 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all text-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Upload className="w-16 h-16 text-purple-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Files Found</h3>
          <p className="text-purple-200">
            {searchTerm || categoryFilter !== 'all' || selectedProject !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Upload your first file to get started'}
          </p>
        </motion.div>
      )}

      {/* Upload File Modal */}
      {showUploadForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 max-w-2xl w-full border border-white/20"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Upload File</h3>
              <button
                onClick={() => setShowUploadForm(false)}
                className="text-purple-300 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleFileUpload} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-purple-200 text-sm font-medium mb-2">
                    Project
                  </label>
                  <select
                    required
                    value={uploadForm.project_id}
                    onChange={(e) => setUploadForm({ ...uploadForm, project_id: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select a project</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.title}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-purple-200 text-sm font-medium mb-2">
                    Category
                  </label>
                  <select
                    value={uploadForm.file_category}
                    onChange={(e) => setUploadForm({ ...uploadForm, file_category: e.target.value as any })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="general">General</option>
                    <option value="design">Design</option>
                    <option value="content">Content</option>
                    <option value="assets">Assets</option>
                    <option value="documents">Documents</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-purple-200 text-sm font-medium mb-2">
                  File
                </label>
                <div className="relative">
                  <input
                    type="file"
                    required
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-600 file:text-white file:cursor-pointer"
                  />
                </div>
                {selectedFile && (
                  <p className="text-purple-300 text-sm mt-2">
                    Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-purple-200 text-sm font-medium mb-2">
                  Description (Optional)
                </label>
                <textarea
                  rows={3}
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  placeholder="Describe the file or its purpose..."
                />
              </div>
              
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setShowUploadForm(false)}
                  className="flex-1 py-3 bg-white/10 text-purple-300 rounded-xl hover:bg-white/15 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {uploading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      <span>Upload File</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default FilesList;
