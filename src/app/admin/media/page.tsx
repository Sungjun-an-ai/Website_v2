"use client"

import { useEffect, useState, useRef, useCallback } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { formatFileSize } from '@/lib/utils'
import { Upload, Copy, Trash2, Eye, FileText, Film, Image as ImageIcon, File } from 'lucide-react'

type MediaFile = {
  name: string
  id: string
  updated_at: string
  created_at: string
  metadata: {
    size: number
    mimetype: string
  }
  publicUrl: string
}

const BUCKET = 'media'

function getFileIcon(mime: string) {
  if (mime.startsWith('image/')) return <ImageIcon className="h-5 w-5 text-blue-400" />
  if (mime.startsWith('video/')) return <Film className="h-5 w-5 text-purple-400" />
  if (mime === 'application/pdf') return <FileText className="h-5 w-5 text-red-400" />
  return <File className="h-5 w-5 text-gray-400" />
}

function getFileCategory(mime: string): string {
  if (mime.startsWith('image/')) return 'image'
  if (mime.startsWith('video/')) return 'video'
  if (mime === 'application/pdf') return 'PDF'
  if (mime.includes('word') || mime.includes('document')) return 'Word'
  return 'file'
}

export default function AdminMediaPage() {
  const [files, setFiles] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')
  const [copied, setCopied] = useState<string | null>(null)
  const [preview, setPreview] = useState<MediaFile | null>(null)
  const [filter, setFilter] = useState<'all' | 'image' | 'video' | 'PDF' | 'Word' | 'file'>('all')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchFiles = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const supabase = createClient()
      const { data, error: listErr } = await supabase.storage.from(BUCKET).list('', {
        limit: 200,
        sortBy: { column: 'created_at', order: 'desc' },
      })
      if (listErr) throw new Error(listErr.message)
      const enriched: MediaFile[] = (data || [])
        .filter(f => f.name !== '.emptyFolderPlaceholder')
        .map(f => ({
          name: f.name,
          id: f.id || f.name,
          updated_at: f.updated_at || '',
          created_at: f.created_at || '',
          metadata: {
            size: f.metadata?.size || 0,
            mimetype: f.metadata?.mimetype || 'application/octet-stream',
          },
          publicUrl: supabase.storage.from(BUCKET).getPublicUrl(f.name).data.publicUrl,
        }))
      setFiles(enriched)
    } catch (err) {
      setError(err instanceof Error ? err.message : '파일 목록을 불러오지 못했습니다.')
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetchFiles() }, [fetchFiles])

  const sanitizeFilename = (name: string): string => {
    // Strip path components and keep only safe characters
    const basename = name.replace(/^.*[/\\]/, '')
    return basename.replace(/[^a-zA-Z0-9._\-가-힣]/g, '_')
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files
    if (!fileList || fileList.length === 0) return
    setUploading(true)
    setError('')
    const supabase = createClient()
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i]
      // Prefix with timestamp to avoid conflicts and prevent path traversal
      const safeName = `${Date.now()}_${sanitizeFilename(file.name)}`
      setUploadProgress(`업로드 중: ${file.name} (${i + 1}/${fileList.length})`)
      const { error: upErr } = await supabase.storage
        .from(BUCKET)
        .upload(safeName, file, { upsert: false })
      if (upErr) {
        setError(`오류: ${upErr.message}`)
        break
      }
    }
    setUploadProgress('')
    setUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
    fetchFiles()
  }

  const handleDelete = async (file: MediaFile) => {
    if (!confirm(`"${file.name}" 파일을 삭제하시겠습니까?`)) return
    const supabase = createClient()
    const { error: delErr } = await supabase.storage.from(BUCKET).remove([file.name])
    if (delErr) setError(`삭제 오류: ${delErr.message}`)
    else fetchFiles()
  }

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url)
    setCopied(url)
    setTimeout(() => setCopied(null), 2000)
  }

  const filtered = filter === 'all'
    ? files
    : files.filter(f => getFileCategory(f.metadata.mimetype) === filter)

  const categories = ['all', 'image', 'video', 'PDF', 'Word', 'file'] as const
  const categoryLabels: Record<string, string> = {
    all: '전체', image: '이미지', video: '동영상', PDF: 'PDF', Word: 'Word', file: '기타',
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">미디어 관리</h1>
            <p className="text-sm text-gray-500 mt-1">이미지, 동영상, PDF, 문서 등 파일을 업로드하고 관리합니다</p>
          </div>
          <Button onClick={() => fileInputRef.current?.click()} disabled={uploading}>
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? uploadProgress || '업로드 중...' : '파일 업로드'}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*,.pdf,.doc,.docx"
            className="hidden"
            onChange={handleUpload}
          />
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Filter tabs */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === cat ? 'bg-navy text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-navy'
              }`}
            >
              {categoryLabels[cat]}
              {cat === 'all' && ` (${files.length})`}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">로딩 중...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Upload className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">파일이 없습니다</p>
            <p className="text-sm mt-1">파일 업로드 버튼을 클릭해 파일을 추가하세요</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filtered.map(file => {
              const isImage = file.metadata.mimetype.startsWith('image/')
              const isVideo = file.metadata.mimetype.startsWith('video/')
              return (
                <div
                  key={file.id}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden group relative"
                >
                  {/* Thumbnail */}
                  <div className="h-32 bg-gray-100 flex items-center justify-center overflow-hidden">
                    {isImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={file.publicUrl}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                    ) : isVideo ? (
                      <video
                        src={file.publicUrl}
                        className="w-full h-full object-cover"
                        muted
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        {getFileIcon(file.metadata.mimetype)}
                        <span className="text-xs text-gray-400 uppercase">
                          {getFileCategory(file.metadata.mimetype)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-2">
                    <p className="text-xs font-medium text-gray-700 truncate" title={file.name}>
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-400">{formatFileSize(file.metadata.size)}</p>
                  </div>

                  {/* Actions overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleCopy(file.publicUrl)}
                      className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                      title="URL 복사"
                    >
                      {copied === file.publicUrl
                        ? <span className="text-xs text-green-600 font-medium">복사됨!</span>
                        : <Copy className="h-4 w-4 text-gray-700" />}
                    </button>
                    <button
                      onClick={() => setPreview(file)}
                      className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                      title="미리보기"
                    >
                      <Eye className="h-4 w-4 text-gray-700" />
                    </button>
                    <button
                      onClick={() => handleDelete(file)}
                      className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                      title="삭제"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Preview Modal */}
        {preview && (
          <div
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
            onClick={() => setPreview(null)}
          >
            <div
              className="bg-white rounded-xl overflow-hidden max-w-3xl w-full max-h-[90vh] flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div>
                  <h3 className="font-semibold text-gray-900">{preview.name}</h3>
                  <p className="text-xs text-gray-400">
                    {formatFileSize(preview.metadata.size)} · {preview.metadata.mimetype}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleCopy(preview.publicUrl)}>
                    <Copy className="h-4 w-4 mr-1" />
                    {copied === preview.publicUrl ? '복사됨!' : 'URL 복사'}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setPreview(null)}>✕</Button>
                </div>
              </div>
              <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-gray-50">
                {preview.metadata.mimetype.startsWith('image/') ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={preview.publicUrl}
                    alt={preview.name}
                    className="max-w-full max-h-full object-contain"
                  />
                ) : preview.metadata.mimetype.startsWith('video/') ? (
                  <video src={preview.publicUrl} controls className="max-w-full max-h-full" />
                ) : preview.metadata.mimetype === 'application/pdf' ? (
                  <iframe src={preview.publicUrl} className="w-full h-96" title={preview.name} sandbox="allow-scripts allow-same-origin" />
                ) : (
                  <div className="text-center">
                    <File className="h-16 w-16 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 mb-3">미리보기를 지원하지 않는 파일 형식입니다.</p>
                    <a
                      href={preview.publicUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-navy underline text-sm"
                    >
                      새 탭에서 열기
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
