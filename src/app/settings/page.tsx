'use client'

import React from 'react'
import { Navbar } from '@/components/Navbar'
import { BottomNav } from '@/components/BottomNav'

export default function SettingsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f9f9ff]">
      <Navbar title="Settings" />

      <main className="pt-20 pb-32 px-6 max-w-md mx-auto flex flex-col flex-grow w-full space-y-6">
        <h2 className="text-xs font-bold uppercase tracking-widest text-[#45474a]/50 pt-2">
          Application Preferences
        </h2>

        {/* Target Language Card */}
        <div className="bg-white border border-[#c5c6ca]/30 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-[#010204]">Target Language</h3>
              <p className="text-xs text-[#45474a]/60">Currently active deck</p>
            </div>
            <span className="text-sm font-bold text-[#39665d] bg-[#b9eade]/30 px-3 py-1 rounded-full">
              🇵🇱 Polish
            </span>
          </div>
        </div>

        {/* Design System Information Card */}
        <div className="bg-white border border-[#c5c6ca]/30 rounded-2xl p-5 shadow-sm space-y-3">
          <h3 className="font-semibold text-[#010204]">Design Philosophy</h3>
          <p className="text-sm text-[#45474a]/80 leading-relaxed font-sans-ui">
            <strong>Minimal Cognitive Focus</strong> — Rejects high-stimulation gamification in favor of a quiet academic digital paper environment.
          </p>
          <div className="text-xs text-[#45474a]/60 space-y-1 border-t border-[#c5c6ca]/20 pt-3">
            <p>• <strong>Word Fade Rule:</strong> Supporting UI elements fade as word mastery increases.</p>
            <p>• <strong>Typography:</strong> Hanken Grotesk for target words, Source Serif 4 for contextual sentences.</p>
          </div>
        </div>

        {/* Audio & Input Settings */}
        <div className="bg-white border border-[#c5c6ca]/30 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#45474a]/60">
            Engine & Audio
          </h3>

          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-sm font-medium text-[#010204]">Diacritic Tolerance</h4>
              <p className="text-xs text-[#45474a]/60">Accepts basic Latin characters for Polish accents (e.g., e for ę)</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
              Enabled
            </span>
          </div>

          <div className="flex justify-between items-center border-t border-[#c5c6ca]/10 pt-3">
            <div>
              <h4 className="text-sm font-medium text-[#010204]">Speech Engine (TTS)</h4>
              <p className="text-xs text-[#45474a]/60">Web Speech API with pl-PL locale voice filtering</p>
            </div>
            <span className="text-xs font-bold text-[#39665d] bg-[#b9eade]/30 px-2.5 py-1 rounded-full">
              Active
            </span>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
