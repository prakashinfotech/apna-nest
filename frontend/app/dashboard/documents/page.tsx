import type { Metadata } from 'next'
import { FileText, Upload, Download, Eye, Trash2, Shield, CheckCircle2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = { title: 'Documents' }

const DOCUMENTS = [
  { id: 1, name: 'Sale Agreement — Bopal Property', type: 'PDF', size: '2.4 MB', status: 'verified', date: 'Apr 15, 2026', property: '3BHK in Bopal' },
  { id: 2, name: 'RERA Certificate', type: 'PDF', size: '1.1 MB', status: 'verified', date: 'Mar 28, 2026', property: '3BHK in Bopal' },
  { id: 3, name: 'Property Tax Receipt 2025–26', type: 'PDF', size: '0.8 MB', status: 'pending', date: 'Feb 10, 2026', property: 'Villa in Vastrapur' },
  { id: 4, name: 'Encumbrance Certificate', type: 'PDF', size: '1.5 MB', status: 'verified', date: 'Jan 22, 2026', property: 'Villa in Vastrapur' },
]

export default function DocumentsPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Documents</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Manage your property documents securely</p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
          style={{ background: 'var(--primary-500)', color: 'white' }}
        >
          <Upload className="w-4 h-4" />
          Upload Document
        </button>
      </div>

      {/* Upload area */}
      <div className="border-2 border-dashed rounded-2xl p-8 text-center" style={{ borderColor: 'var(--border)' }}>
        <Upload className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--text-tertiary)' }} />
        <p className="font-medium" style={{ color: 'var(--text-primary)' }}>Drag & drop documents here</p>
        <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>PDF, JPG, PNG up to 10MB each</p>
      </div>

      {/* Documents list */}
      <div className="space-y-3">
        {DOCUMENTS.map((doc) => (
          <Card key={doc.id}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: 'var(--primary-50)' }}>
                  <FileText className="w-5 h-5" style={{ color: 'var(--primary-500)' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{doc.name}</p>
                    {doc.status === 'verified' ? (
                      <Badge variant="verified" className="gap-1 text-[10px] px-1.5 py-0">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified
                      </Badge>
                    ) : (
                      <Badge variant="warning" className="text-[10px] px-1.5 py-0">Pending</Badge>
                    )}
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
                    {doc.property} · {doc.type} · {doc.size} · {doc.date}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button className="h-8 w-8 rounded-lg border border-border flex items-center justify-center hover:border-[var(--primary-500)] transition-colors">
                    <Eye className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                  </button>
                  <button className="h-8 w-8 rounded-lg border border-border flex items-center justify-center hover:border-[var(--primary-500)] transition-colors">
                    <Download className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                  </button>
                  <button className="h-8 w-8 rounded-lg border border-border flex items-center justify-center hover:border-red-400 transition-colors">
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="p-4 rounded-2xl flex items-start gap-3" style={{ background: 'var(--primary-50)' }}>
        <Shield className="w-5 h-5 shrink-0 mt-0.5" style={{ color: 'var(--primary-500)' }} />
        <div>
          <p className="text-sm font-semibold" style={{ color: 'var(--primary-700)' }}>Secure document storage</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--primary-600)' }}>
            All documents are encrypted end-to-end and stored securely. Only you and parties you authorize can access them.
          </p>
        </div>
      </div>
    </div>
  )
}
