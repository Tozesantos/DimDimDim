import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'

export default function QRScannerModal({ onScan, onClose }) {
  const scannerRef = useRef(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const container = document.getElementById('qr-reader-container')
    if (container) container.innerHTML = ''

    const scanner = new Html5Qrcode('qr-reader-container')
    scannerRef.current = scanner
    let finished = false

    const safeStop = () => {
      try { scanner.stop().catch(() => {}) } catch (_) {}
    }

    const handleScan = (text) => {
      if (finished) return
      finished = true
      safeStop()
      onScan(text)
    }

    scanner
      .start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 280, height: 280 } },
        handleScan,
        () => {}
      )
      .catch(() => {
        setError('Não foi possível aceder à câmara. Verifica as permissões.')
      })

    return () => {
      if (!finished) {
        finished = true
        safeStop()
      }
    }
  }, [])

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center px-5 py-4 bg-black/80">
        <h3 className="font-semibold text-white text-base">Ler QR Code da Fatura</h3>
        <button
          onClick={onClose}
          className="text-white/70 hover:text-white text-3xl leading-none w-10 h-10 flex items-center justify-center"
          aria-label="Fechar"
        >
          ×
        </button>
      </div>

      {/* Camera area */}
      <div className="flex-1 flex flex-col items-center justify-center bg-black">
        {error ? (
          <div className="mx-6 text-sm text-red-400 bg-red-950/50 border border-red-800 rounded-xl p-5 text-center">
            {error}
          </div>
        ) : (
          <>
            <div
              id="qr-reader-container"
              className="w-full max-w-sm overflow-hidden"
            />
            <p className="text-white/50 text-xs mt-4 text-center px-8">
              Aponta a câmara para o QR Code da fatura
            </p>
          </>
        )}
      </div>
    </div>
  )
}
