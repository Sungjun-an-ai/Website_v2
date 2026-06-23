"use client"

import { useRef, useState } from 'react'
import { Upload, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'

interface UploadFieldProps {
  label: string
  value: string
  onChange: (url: string) => void
  /** storage bucket, defaults to 'media' */
  bucket?: string
  /** folder prefix inside the bucket */
  folder?: string
  /** accept attribute for the file input */
  accept?: string
  /** show an image thumbnail preview */
  preview?: boolean
  /** called with the uploaded file's size in bytes (useful for resources) */
  onUploaded?: (info: { url: string; size: number; ext: string; name: string }) => void
}

export default function UploadField({
  label,
  value,
  onChange,
  bucket = 'media',
  folder = 'uploads',
  accept = 'image/*',
  preview = true,
  onUploaded,
}: UploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFile = async (file: File) => {
    setError(null)
    setUploading(true)
    try {
      const supabase = createClient()
      const ext = file.name.includes('.') ? file.name.split('.').pop()!.toLowerCase() : 'bin'
      const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
      const path = `${folder}/${Date.now()}-${safe}`
      const { error: upErr } = await supabase.storage.from(bucket).upload(path, file, { upsert: true })
      if (upErr) throw new Error(upErr.message)
      const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(path)
      onChange(publicUrl)
      onUploaded?.({ url: publicUrl, size: file.size, ext: ext.toUpperCase(), name: file.name })
    } catch (err) {
      setError(err instanceof Error ? err.message : '업로드 오류')
    } finally {
      setUploading(false)
    }
  }

  const isImage = preview && value && /\.(png|jpe?g|webp|gif|svg)(\?|$)/i.test(value)

  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      <div className="flex items-center gap-2">
        <Input value={value} onChange={e => onChange(e.target.value)} placeholder="URL 또는 업로드" />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-1 whitespace-nowrap rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          업로드
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = '' }}
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {isImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" className="mt-1 h-20 rounded-lg border border-gray-200 object-cover" />
      )}
    </div>
  )
}
