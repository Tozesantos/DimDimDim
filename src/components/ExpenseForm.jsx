import { useState } from 'react'
import { CATEGORIES } from '../lib/constants'
import QRScannerModal from './QRScannerModal'

function parseInvoiceQR(qrString) {
  const fields = {}
  qrString.split('*').forEach((part) => {
    const idx = part.indexOf(':')
    if (idx > 0) {
      fields[part.slice(0, idx)] = part.slice(idx + 1)
    }
  })

  const raw = fields['F'] || ''
  const date =
    raw.length === 8
      ? `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`
      : new Date().toISOString().split('T')[0]

  return {
    invoice_number: fields['G'] || '',
    amount: fields['O'] ? parseFloat(fields['O']) : '',
    date,
    nif: fields['A'] || null,
    total_vat: fields['N'] ? parseFloat(fields['N']) : null,
  }
}

export default function ExpenseForm({ onAdd }) {
  const [form, setForm] = useState({
    description: '',
    invoice_number: '',
    amount: '',
    category: 'Outros',
    date: new Date().toISOString().split('T')[0],
    is_casal: false,
  })
  const [loading, setLoading] = useState(false)
  const [showScanner, setShowScanner] = useState(false)
  const [scannedMeta, setScannedMeta] = useState(null)

  function handleQRScan(text) {
    setShowScanner(false)
    const parsed = parseInvoiceQR(text)
    setForm((prev) => ({
      ...prev,
      invoice_number: parsed.invoice_number || prev.invoice_number,
      amount: parsed.amount !== '' ? parsed.amount : prev.amount,
      date: parsed.date,
    }))
    if (parsed.nif || parsed.total_vat != null) {
      setScannedMeta({ nif: parsed.nif, total_vat: parsed.total_vat })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.description || !form.amount) return
    setLoading(true)
    await onAdd({
      ...form,
      amount: parseFloat(form.amount),
      invoice_number: form.invoice_number || null,
      nif: scannedMeta?.nif ?? null,
      total_vat: scannedMeta?.total_vat ?? null,
    })
    setForm({
      description: '',
      invoice_number: '',
      amount: '',
      category: 'Outros',
      date: new Date().toISOString().split('T')[0],
      is_casal: false,
    })
    setScannedMeta(null)
    setLoading(false)
  }

  const inputClass = 'border border-brand-stone/60 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-amber bg-white text-brand-dark placeholder-brand-stone'

  return (
    <>
      {showScanner && (
        <QRScannerModal onScan={handleQRScan} onClose={() => setShowScanner(false)} />
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-5 flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <h2 className="text-base font-semibold text-brand-navy">Nova Despesa</h2>
          <button
            type="button"
            onClick={() => setShowScanner(true)}
            className="flex items-center gap-1.5 text-xs font-medium text-brand-amber hover:text-brand-rust bg-brand-sand px-3 py-1.5 rounded-lg transition border border-brand-stone/40"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <path d="M14 14h3v3m0 4h4m-4-4v4m-3-7h.01" />
            </svg>
            Ler Fatura
          </button>
        </div>

        {scannedMeta && (
          <div className="bg-brand-sand border border-brand-stone/40 rounded-lg px-3 py-2 flex gap-4 text-xs text-brand-stone">
            {scannedMeta.nif && (
              <span>NIF <strong className="text-brand-navy">{scannedMeta.nif}</strong></span>
            )}
            {scannedMeta.total_vat != null && (
              <span>IVA <strong className="text-brand-navy">{scannedMeta.total_vat.toFixed(2)} €</strong></span>
            )}
          </div>
        )}

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-brand-stone">Descrição</label>
          <input
            type="text"
            placeholder="Ex: Supermercado"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className={inputClass}
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-brand-stone">Nº da Fatura</label>
          <input
            type="text"
            placeholder="Ex: FR 004/18305"
            value={form.invoice_number}
            onChange={(e) => setForm({ ...form, invoice_number: e.target.value })}
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-brand-stone">Valor (€)</label>
            <input
              type="number"
              placeholder="0.00"
              min="0.01"
              step="0.01"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className={inputClass}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-brand-stone">Data</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-brand-stone">Categoria</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className={inputClass + ' bg-white'}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={() => setForm({ ...form, is_casal: !form.is_casal })}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border transition ${
            form.is_casal
              ? 'bg-brand-rust/10 border-brand-rust/30 text-brand-rust'
              : 'bg-brand-sand border-brand-stone/40 text-brand-stone'
          }`}
        >
          <span className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${form.is_casal ? 'bg-brand-rust' : 'bg-brand-stone'}`}>
            <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${form.is_casal ? 'translate-x-4' : 'translate-x-0.5'}`} />
          </span>
          <span className="text-sm font-medium">Despesa de Casal</span>
          {form.is_casal && <span className="ml-auto w-2 h-2 rounded-full bg-brand-rust" />}
        </button>

        <button
          type="submit"
          disabled={loading}
          className="bg-brand-amber hover:bg-brand-rust text-brand-dark hover:text-white font-semibold py-2.5 rounded-lg text-sm transition disabled:opacity-50"
        >
          {loading ? 'A guardar...' : '+ Adicionar Despesa'}
        </button>
      </form>
    </>
  )
}
