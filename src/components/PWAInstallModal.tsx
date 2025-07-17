'use client';

import { useState, useEffect } from 'react';
import { detectPlatform, type DeviceInfo } from '@/utils/pwaDetection';
import { 
  getPWAInstructions, 
  getPWAModalTitle, 
  getPWADetectionText, 
  getPWAOtherPlatformsText, 
  getPWACloseText,
  type PWAInstruction
} from '@/utils/pwaInstructions';
import { AppLanguage } from '@/types';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: AppLanguage;
}

export default function PWAInstallModal({ isOpen, onClose, language }: PWAInstallModalProps) {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [showAllPlatforms, setShowAllPlatforms] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      const info = detectPlatform();
      setDeviceInfo(info);
      setSelectedPlatform(info.platform);
    }
  }, [isOpen]);

  if (!isOpen || !deviceInfo) return null;

  const allInstructions = getPWAInstructions(language);
  const currentPlatformInstructions = allInstructions[deviceInfo.platform] || [];
  const detectedInstruction = currentPlatformInstructions.find(inst => 
    inst.browser === deviceInfo.browser
  ) || currentPlatformInstructions[0];

  const renderInstructions = (instructions: PWAInstruction[]) => {
    return instructions.map((instruction, index) => (
      <div key={index} className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center mb-3">
          <span className="text-2xl mr-2">{instruction.icon}</span>
          <h4 className="font-semibold text-lg text-gray-900">
            {instruction.platform} - {instruction.browser}
          </h4>
        </div>
        <ol className="space-y-2">
          {instruction.steps.map((step, stepIndex) => (
            <li key={stepIndex} className="text-sm leading-relaxed text-gray-800">
              {step}
            </li>
          ))}
        </ol>
      </div>
    ));
  };

  const renderPlatformSelector = () => {
    const platforms = Object.keys(allInstructions);
    return (
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {platforms.map(platform => (
            <button
              key={platform}
              onClick={() => setSelectedPlatform(platform)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedPlatform === platform
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-300'
              }`}
            >
              {platform === 'ios' ? 'iOS' : platform === 'android' ? 'Android' : 'Desktop'}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900">
              {getPWAModalTitle(language)}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-900 text-xl font-bold"
            >
              ×
            </button>
          </div>

          {!showAllPlatforms ? (
            <div>
              <p className="mb-4 text-gray-800 text-base">
                {getPWADetectionText(
                  deviceInfo.platform === 'ios' ? 'iOS' : 
                  deviceInfo.platform === 'android' ? 'Android' : 'Desktop',
                  deviceInfo.browser,
                  language
                )}
              </p>

              {detectedInstruction && (
                <div className="mb-4">
                  {renderInstructions([detectedInstruction])}
                </div>
              )}

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setShowAllPlatforms(true)}
                  className="text-blue-600 hover:text-blue-800 text-sm underline font-medium"
                >
                  {getPWAOtherPlatformsText(language)}
                </button>
                
                <button
                  onClick={onClose}
                  className="neo-button neo-button-primary mt-4"
                >
                  {getPWACloseText(language)}
                </button>
              </div>
            </div>
          ) : (
            <div>
              <button
                onClick={() => setShowAllPlatforms(false)}
                className="text-blue-600 hover:text-blue-800 text-sm underline mb-4 font-medium"
              >
                ← {getPWADetectionText(
                  deviceInfo.platform === 'ios' ? 'iOS' : 
                  deviceInfo.platform === 'android' ? 'Android' : 'Desktop',
                  deviceInfo.browser,
                  language
                )}
              </button>

              {renderPlatformSelector()}

              <div className="max-h-64 overflow-y-auto">
                {renderInstructions(allInstructions[selectedPlatform] || [])}
              </div>

              <button
                onClick={onClose}
                className="neo-button neo-button-primary mt-4 w-full"
              >
                {getPWACloseText(language)}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}