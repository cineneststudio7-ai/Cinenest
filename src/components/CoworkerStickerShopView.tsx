import React, { useState, useEffect } from 'react';
import { 
  Coffee, Heart, Users, Sparkles, Star, Download, Copy, Check, Gift, 
  Laptop, ShieldCheck, Printer, Trash2, ArrowRight, Smile, ThumbsUp, Leaf, Send,
  Link2, ExternalLink, FileCode, RefreshCw, MessageSquare
} from 'lucide-react';
import { COWORKER_STICKERS, CoworkerSticker } from '../data/preschoolData';
import { CoworkerStickerOrder } from '../types/series';
import { saveStickerOrder, getStickerOrders, deleteStickerOrder } from '../utils/crypto';
import { generateStickerSvg, createStickerDataUri, CHARACTER_POSE_LABELS } from '../utils/stickerGenerator';

export interface GeneratedLinkPayload {
  blobUrl: string;
  dataUri: string;
  filename: string;
  generatedAt: string;
  embeddedMessage: string;
  stickerName: string;
}

export const CoworkerStickerShopView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSticker, setSelectedSticker] = useState<CoworkerSticker>(COWORKER_STICKERS[0]);
  const [recipientName, setRecipientName] = useState<string>('Sarah (Engineering Lead)');
  const [senderName, setSenderName] = useState<string>('From your Courtyard Team');
  const [customMessage, setCustomMessage] = useState<string>(COWORKER_STICKERS[0].defaultMessage);
  const [selectedPose, setSelectedPose] = useState<string>('puchu_puku_tea');
  const [mockupType, setMockupType] = useState<'laptop' | 'mug' | 'bottle' | 'sheet'>('laptop');
  const [copiedNotice, setCopiedNotice] = useState<boolean>(false);
  const [copiedLinkNotice, setCopiedLinkNotice] = useState<boolean>(false);
  const [orderSuccessNotice, setOrderSuccessNotice] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'catalog' | 'history'>('catalog');
  const [ordersHistory, setOrdersHistory] = useState<CoworkerStickerOrder[]>([]);
  const [generatedLink, setGeneratedLink] = useState<GeneratedLinkPayload | null>(null);
  const [isGeneratingLink, setIsGeneratingLink] = useState<boolean>(false);

  // Load encrypted orders on mount
  useEffect(() => {
    loadOrders();
  }, []);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      if (generatedLink?.blobUrl) {
        URL.revokeObjectURL(generatedLink.blobUrl);
      }
    };
  }, [generatedLink]);

  const loadOrders = async () => {
    try {
      const orders = await getStickerOrders();
      setOrdersHistory(orders);
    } catch (err) {
      console.error('Failed to load encrypted sticker orders:', err);
    }
  };

  const handleSelectSticker = (sticker: CoworkerSticker) => {
    setSelectedSticker(sticker);
    setCustomMessage(sticker.defaultMessage);
    // Reset generated link so user is prompted to generate with the new sticker/message
    if (generatedLink?.blobUrl) {
      URL.revokeObjectURL(generatedLink.blobUrl);
    }
    setGeneratedLink(null);
  };

  const handleCopyDigitalCard = async () => {
    const cardText = `🍵 *Puchu & Puku Coworker Appreciation Sticker* 💖
To: *${recipientName}*
From: *${senderName}*
Sticker: *${selectedSticker.name}* (${selectedSticker.nameBn})

"${customMessage}"

_Courtyard Wisdom: "${selectedSticker.tagline}"_
_Characters: Puchu (Toddler in mint dress) & Puku (Glowing Heart Ceramic Mug)_`;

    try {
      await navigator.clipboard.writeText(cardText);
      setCopiedNotice(true);
      setTimeout(() => setCopiedNotice(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleSaveEncryptedOrder = async () => {
    try {
      await saveStickerOrder({
        stickerId: selectedSticker.id,
        stickerName: selectedSticker.name,
        category: selectedSticker.category,
        recipientName: recipientName.trim() || 'Valued Colleague',
        senderName: senderName.trim() || 'Courtyard Companion',
        customMessage: customMessage.trim(),
        characterPose: selectedPose,
        mockupFormat: mockupType,
      });
      setOrderSuccessNotice(true);
      await loadOrders();
      setTimeout(() => setOrderSuccessNotice(false), 3000);
    } catch (err) {
      console.error('Failed to save encrypted sticker order:', err);
    }
  };

  const handleDeleteOrder = async (id: string) => {
    try {
      await deleteStickerOrder(id);
      await loadOrders();
    } catch (err) {
      console.error('Failed to delete order:', err);
    }
  };

  /**
   * Generates a downloadable SVG with the user's custom message baked in,
   * creating an active download link payload and Object URL.
   */
  const handleGenerateDownloadLink = () => {
    setIsGeneratingLink(true);

    if (generatedLink?.blobUrl) {
      URL.revokeObjectURL(generatedLink.blobUrl);
    }

    const svgContent = generateStickerSvg({
      stickerName: selectedSticker.name,
      stickerNameBn: selectedSticker.nameBn,
      category: selectedSticker.category,
      customMessage: customMessage,
      recipientName: recipientName,
      senderName: senderName,
      characterPose: selectedPose,
    });

    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const blobUrl = URL.createObjectURL(blob);
    const dataUri = createStickerDataUri(svgContent);
    const sanitizedRecipient = recipientName.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 15) || 'Teammate';
    const filename = `Puchu_Puku_${selectedSticker.id}_${sanitizedRecipient}_Decal.svg`;

    setTimeout(() => {
      setGeneratedLink({
        blobUrl,
        dataUri,
        filename,
        generatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        embeddedMessage: customMessage.trim() || selectedSticker.defaultMessage,
        stickerName: selectedSticker.name,
      });
      setIsGeneratingLink(false);
    }, 200);
  };

  /**
   * Direct download of the vector decal SVG with personalized text.
   */
  const handleDownloadDecalSVG = () => {
    const svgContent = generateStickerSvg({
      stickerName: selectedSticker.name,
      stickerNameBn: selectedSticker.nameBn,
      category: selectedSticker.category,
      customMessage: customMessage,
      recipientName: recipientName,
      senderName: senderName,
      characterPose: selectedPose,
    });

    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const sanitizedRecipient = recipientName.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 15) || 'Teammate';
    link.download = `Puchu_Puku_${selectedSticker.id}_${sanitizedRecipient}_Decal.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyGeneratedDataUri = async () => {
    if (!generatedLink) return;
    try {
      await navigator.clipboard.writeText(generatedLink.dataUri);
      setCopiedLinkNotice(true);
      setTimeout(() => setCopiedLinkNotice(false), 2500);
    } catch {
      // Fallback
    }
  };

  const filteredStickers = selectedCategory === 'All'
    ? COWORKER_STICKERS
    : COWORKER_STICKERS.filter(s => s.category === selectedCategory);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Premier Coworker Appreciation Banner */}
      <section className="bg-gradient-to-r from-amber-900 via-stone-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 fill-stone-950" />
                <span>Premier Member Coworker Studio</span>
              </span>
              <span className="text-xs text-amber-200">Official Character Merchandise & Kindness Gifts</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-bold font-serif tracking-tight text-white">
              Buy & Gift Puchu & Puku Stickers for Coworkers
            </h2>

            <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
              Brighten your team's day with official Puchu & Puku character stickers. From morning tea breaks and banana-leaf deep focus mode, to sprint celebration "Shabash!" kudos—send digital cards or create die-cut decals for laptops, mugs, and water bottles.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 ${
                activeTab === 'catalog'
                  ? 'bg-amber-400 text-stone-950 shadow-md'
                  : 'bg-white/10 text-stone-200 hover:bg-white/20'
              }`}
            >
              <Gift className="w-4 h-4" />
              <span>Sticker Catalog & Studio</span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 ${
                activeTab === 'history'
                  ? 'bg-amber-400 text-stone-950 shadow-md'
                  : 'bg-white/10 text-stone-200 hover:bg-white/20'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Encrypted Gifts ({ordersHistory.length})</span>
            </button>
          </div>
        </div>
      </section>

      {/* Catalog & Customizer Tab */}
      {activeTab === 'catalog' && (
        <div className="space-y-8">
          {/* Category Filter Chips */}
          <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs">
              {['All', 'Tea Break', 'Teamwork', 'Kudos', 'Encouragement', 'Focus Mode'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition ${
                    selectedCategory === cat
                      ? 'bg-emerald-700 text-white font-semibold shadow-2xs'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <span className="text-xs text-stone-500 font-medium">
              {filteredStickers.length} Character Designs Available
            </span>
          </div>

          {/* Main 2-Column Layout: Catalog Grid + Live Customizer & Mockup */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 7 Cols: Sticker Designs Selection */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredStickers.map((sticker) => {
                const isSelected = selectedSticker.id === sticker.id;
                return (
                  <div
                    key={sticker.id}
                    onClick={() => handleSelectSticker(sticker)}
                    className={`cursor-pointer rounded-3xl p-5 border transition flex flex-col justify-between space-y-4 relative ${
                      isSelected
                        ? 'bg-gradient-to-b from-amber-50 to-white border-emerald-500 shadow-md ring-2 ring-emerald-300'
                        : 'bg-white hover:bg-amber-50/40 border-amber-200/80 shadow-2xs'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                          <span>{sticker.iconSymbol}</span>
                          <span>{sticker.category}</span>
                        </span>
                        {isSelected && (
                          <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-md">
                            <Check className="w-3 h-3" /> Selected
                          </span>
                        )}
                      </div>

                      {/* Character Illustration Preview */}
                      <div className="h-32 rounded-2xl bg-gradient-to-tr from-amber-100/60 to-emerald-50 flex items-center justify-center p-3 relative overflow-hidden border border-amber-100">
                        <div className="text-center space-y-1">
                          <div className="text-4xl filter drop-shadow-md animate-bounce-subtle">
                            {sticker.iconSymbol === '☕' ? '🍵' : sticker.iconSymbol === '🤝' ? '🤝' : sticker.iconSymbol === '🌿' ? '🌿' : '💖'}
                          </div>
                          <span className="text-xs font-bold font-serif text-stone-800 block">
                            {sticker.name}
                          </span>
                          <span className="text-[11px] text-emerald-700 font-serif">
                            {sticker.nameBn}
                          </span>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-medium text-stone-700 leading-snug">
                          {sticker.tagline}
                        </p>
                        <p className="text-[11px] text-stone-500 italic mt-0.5">
                          {sticker.taglineBn}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-stone-100 text-[11px] text-stone-500">
                      <span className="font-semibold text-stone-700">Best for:</span> {sticker.suggestedOccasion}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right 5 Cols: Live Sticker Customizer & Realistic Mockup */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-amber-200/90 shadow-lg space-y-6 sticky top-24">
              <div className="flex items-center justify-between border-b border-amber-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-amber-100 text-amber-900">
                    <Sparkles className="w-4 h-4 text-amber-700" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-stone-900 text-base">
                      Live Coworker Customizer
                    </h3>
                    <p className="text-[11px] text-stone-500">
                      Personalize message & preview real-world items
                    </p>
                  </div>
                </div>

                {/* Mockup Format Switcher */}
                <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
                  <button
                    onClick={() => setMockupType('laptop')}
                    title="Laptop Decal Preview"
                    className={`p-1.5 rounded-lg transition ${mockupType === 'laptop' ? 'bg-white shadow-xs text-stone-900 font-bold' : 'text-stone-500'}`}
                  >
                    <Laptop className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setMockupType('mug')}
                    title="Ceramic Desk Mug Preview"
                    className={`p-1.5 rounded-lg transition ${mockupType === 'mug' ? 'bg-white shadow-xs text-stone-900 font-bold' : 'text-stone-500'}`}
                  >
                    <Coffee className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setMockupType('bottle')}
                    title="Hydro Water Bottle Preview"
                    className={`p-1.5 rounded-lg transition ${mockupType === 'bottle' ? 'bg-white shadow-xs text-stone-900 font-bold' : 'text-stone-500'}`}
                  >
                    <Leaf className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setMockupType('sheet')}
                    title="Printable Sticker Sheet Preview"
                    className={`p-1.5 rounded-lg transition ${mockupType === 'sheet' ? 'bg-white shadow-xs text-stone-900 font-bold' : 'text-stone-500'}`}
                  >
                    <Printer className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Realistic Visual Mockup Canvas with Live Custom Message */}
              <div className="relative rounded-2xl overflow-hidden border border-amber-200 bg-stone-950 p-6 flex flex-col items-center justify-center min-h-[240px]">
                {/* Background Simulation */}
                {mockupType === 'laptop' && (
                  <div className="w-full max-w-xs bg-stone-800 rounded-t-xl p-4 border border-stone-700 shadow-2xl relative flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-stone-700/80 mb-3 flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-stone-600"></div>
                    </div>
                    {/* Realistic Die-cut Sticker on Laptop Lid */}
                    <div className="bg-amber-50 rounded-2xl p-3 shadow-xl border-2 border-white max-w-[210px] text-center transform -rotate-2 hover:rotate-0 transition duration-300 space-y-1.5">
                      <div className="text-2xl">{selectedSticker.iconSymbol}</div>
                      <p className="text-xs font-bold font-serif text-stone-900 leading-tight">
                        {selectedSticker.name}
                      </p>
                      <p className="text-[10px] text-emerald-800 font-serif font-semibold">
                        {selectedSticker.nameBn}
                      </p>
                      
                      {/* Live Custom Message on Sticker */}
                      <div className="px-2 py-1 bg-amber-100/90 rounded-lg border border-amber-300 text-[10px] text-amber-950 font-serif italic font-medium leading-tight line-clamp-2">
                        “{customMessage.trim() || 'Your personalized message here'}”
                      </div>

                      <div className="pt-1 border-t border-stone-200/60 text-[9px] text-stone-600 font-medium truncate">
                        For: {recipientName || 'Teammate'}
                      </div>
                    </div>
                    <span className="text-[10px] text-stone-400 mt-4 tracking-wider uppercase">
                      MacBook Space Gray Decal Mockup
                    </span>
                  </div>
                )}

                {mockupType === 'mug' && (
                  <div className="relative flex flex-col items-center">
                    <div className="w-32 h-36 bg-stone-100 rounded-b-3xl border-4 border-stone-300 relative shadow-2xl flex flex-col items-center justify-center p-2.5 text-center">
                      {/* Mug Handle */}
                      <div className="absolute -right-7 top-4 w-7 h-18 rounded-r-2xl border-4 border-stone-300"></div>
                      {/* Puku-style mug face & sticker */}
                      <Heart className="w-5 h-5 text-rose-500 fill-rose-500 mx-auto animate-pulse" />
                      <span className="text-[10px] font-bold text-stone-800 block mt-1">
                        {selectedSticker.name}
                      </span>
                      {/* Custom Message Badge on Ceramic Mug */}
                      <div className="mt-1 px-1.5 py-0.5 bg-amber-200/70 rounded text-[9px] text-amber-950 font-serif italic max-w-[100px] truncate">
                        “{customMessage.trim() || 'Tea-rific!'}”
                      </div>
                      <span className="text-[8px] text-stone-600 block mt-1">
                        To: {recipientName || 'Teammate'}
                      </span>
                    </div>
                    <span className="text-[10px] text-stone-400 mt-4 tracking-wider uppercase">
                      11oz Ceramic Puku Desk Mug Mockup
                    </span>
                  </div>
                )}

                {mockupType === 'bottle' && (
                  <div className="relative flex flex-col items-center">
                    <div className="w-24 h-40 bg-gradient-to-b from-stone-700 via-stone-800 to-stone-900 rounded-t-2xl rounded-b-3xl border border-stone-600 relative shadow-2xl flex flex-col items-center justify-center p-2 text-center">
                      {/* Bottle Cap */}
                      <div className="w-10 h-4 bg-stone-500 rounded-t-md -mt-7 mb-2 border border-stone-400"></div>
                      <div className="bg-amber-50/95 rounded-xl p-2 border border-amber-300 text-stone-900 w-full shadow-md">
                        <div className="text-base">{selectedSticker.iconSymbol}</div>
                        <p className="text-[9px] font-bold leading-tight">{selectedSticker.name}</p>
                        <p className="text-[8px] text-emerald-800 italic mt-0.5 truncate">
                          “{customMessage.trim() || 'Stay hydrated!'}”
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] text-stone-400 mt-4 tracking-wider uppercase">
                      Stainless Courtyard Hydro Flask Mockup
                    </span>
                  </div>
                )}

                {mockupType === 'sheet' && (
                  <div className="w-full max-w-xs bg-white rounded-xl p-3 border border-stone-300 shadow-xl grid grid-cols-3 gap-2">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="p-1.5 rounded-lg bg-amber-50/70 border border-amber-200 text-center space-y-0.5">
                        <div className="text-sm">{selectedSticker.iconSymbol}</div>
                        <p className="text-[8px] font-bold text-stone-800 truncate">
                          {selectedSticker.name}
                        </p>
                        <p className="text-[7px] text-amber-900 italic truncate">
                          “{customMessage.trim() || 'Shabash!'}”
                        </p>
                      </div>
                    ))}
                    <div className="col-span-3 text-center pt-1 border-t border-stone-100 text-[8px] text-stone-500 font-mono">
                      Printable 3x3 Die-Cut Sheet (Glossy Vinyl)
                    </div>
                  </div>
                )}
              </div>

              {/* Form Customization Controls */}
              <div className="space-y-4 text-xs">
                <div>
                  <label htmlFor="coworker-recipient-input" className="font-semibold text-stone-700 block mb-1">
                    To Coworker Name & Role:
                  </label>
                  <input
                    id="coworker-recipient-input"
                    type="text"
                    value={recipientName}
                    onChange={(e) => {
                      setRecipientName(e.target.value);
                      if (generatedLink) setGeneratedLink(null);
                    }}
                    placeholder="e.g. Sarah, Engineering Lead"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>

                <div>
                  <label htmlFor="coworker-sender-input" className="font-semibold text-stone-700 block mb-1">
                    From:
                  </label>
                  <input
                    id="coworker-sender-input"
                    type="text"
                    value={senderName}
                    onChange={(e) => {
                      setSenderName(e.target.value);
                      if (generatedLink) setGeneratedLink(null);
                    }}
                    placeholder="e.g. Priyo & Courtyard Team"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>

                {/* Explicit 'Custom Message' Input Field */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="custom-message-input" className="font-semibold text-stone-800 flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Custom Message:</span>
                    </label>
                    <span className={`text-[11px] font-mono ${customMessage.length > 70 ? 'text-amber-600 font-bold' : 'text-stone-400'}`}>
                      {customMessage.length} / 80
                    </span>
                  </div>

                  <textarea
                    id="custom-message-input"
                    name="customMessage"
                    rows={2}
                    maxLength={80}
                    value={customMessage}
                    onChange={(e) => {
                      setCustomMessage(e.target.value);
                      if (generatedLink) setGeneratedLink(null);
                    }}
                    placeholder="Enter personalized text for the sticker (e.g. You are the calm in every sprint storm!)..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white leading-relaxed text-stone-800"
                  />
                  
                  <p className="text-[10px] text-stone-500">
                    💡 This personalized text appears directly on the Puchu & Puku sticker graphic and will be baked into the vector SVG download link.
                  </p>

                  {/* Quick-Select Message Suggestions */}
                  <div className="pt-1 space-y-1">
                    <span className="text-[10px] text-stone-400 font-medium block">Quick presets:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        "You're tea-rific! 🍵",
                        "Calm & resilient in every sprint! 🌿",
                        "Outstanding collaboration & heart! 💖",
                        "Shabash! Milestone conquered! 🌟",
                        "Courtyard kindness award! ☀️"
                      ].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => {
                            setCustomMessage(preset);
                            if (generatedLink) setGeneratedLink(null);
                          }}
                          className="text-[10px] px-2 py-0.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80 transition"
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Character Pose Selector */}
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">
                    Locked Character Art Pose:
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { id: 'puchu_puku_tea', label: '🍵 Puchu & Puku Tea Pour' },
                      { id: 'puku_glowing_heart', label: '💖 Puku Glowing Heart' },
                      { id: 'banana_leaf_rain', label: '🌿 Banana Leaf Shield' },
                      { id: 'shabash_applause', label: '🌟 Shabash Standing Ovation' },
                    ].map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          setSelectedPose(p.id);
                          if (generatedLink) setGeneratedLink(null);
                        }}
                        className={`p-2 rounded-xl border text-left transition text-[11px] ${
                          selectedPose === p.id
                            ? 'bg-emerald-50 border-emerald-500 font-bold text-emerald-900'
                            : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons & Download Link Generation */}
              <div className="space-y-3 pt-3 border-t border-stone-100">
                {/* Dedicated 'Generate Download Link' Action */}
                <button
                  type="button"
                  onClick={handleGenerateDownloadLink}
                  disabled={isGeneratingLink}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2"
                >
                  {isGeneratingLink ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-amber-200" />
                      <span>Generating Sticker Download Link...</span>
                    </>
                  ) : (
                    <>
                      <Link2 className="w-4 h-4 text-amber-200" />
                      <span>Generate Sticker Download Link (with Custom Message)</span>
                    </>
                  )}
                </button>

                {/* Generated Download Link Active Card */}
                {generatedLink && (
                  <div className="p-4 rounded-2xl bg-emerald-50/90 border border-emerald-300 shadow-sm space-y-2.5 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-emerald-900 flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Download Link Generated!</span>
                      </span>
                      <span className="text-[10px] text-emerald-700 font-mono">
                        {generatedLink.generatedAt}
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-white border border-emerald-200 text-[11px] space-y-1">
                      <div className="flex items-center gap-1.5 text-stone-800 font-semibold truncate">
                        <FileCode className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{generatedLink.filename}</span>
                      </div>
                      <p className="text-[10px] text-amber-900 font-serif italic truncate">
                        Baked Message: “{generatedLink.embeddedMessage}”
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {/* Direct Anchor Download Link */}
                      <a
                        href={generatedLink.blobUrl}
                        download={generatedLink.filename}
                        className="py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-xs text-center"
                      >
                        <Download className="w-3.5 h-3.5 text-amber-300" />
                        <span>Download SVG Decal</span>
                      </a>

                      {/* Copy Link / Data URI */}
                      <button
                        type="button"
                        onClick={handleCopyGeneratedDataUri}
                        className="py-2 px-3 rounded-xl bg-white hover:bg-stone-50 border border-emerald-300 text-emerald-900 font-semibold text-xs transition flex items-center justify-center gap-1.5"
                      >
                        {copiedLinkNotice ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-emerald-700" />
                        )}
                        <span>{copiedLinkNotice ? 'Copied Data Link!' : 'Copy Vector Link'}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Buy / Send Gift Action (Saves to Encrypted Vault) */}
                <button
                  type="button"
                  onClick={handleSaveEncryptedOrder}
                  className="w-full py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs sm:text-sm shadow-sm transition flex items-center justify-center gap-2"
                >
                  <Gift className="w-4 h-4 text-amber-300" />
                  <span>Save Gift to Encrypted Local Vault</span>
                </button>

                {orderSuccessNotice && (
                  <div className="p-2.5 rounded-xl bg-emerald-100 border border-emerald-400 text-emerald-900 text-xs font-semibold flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Gift encrypted & saved to your local storage vault!</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  {/* Copy Digital Slack Card */}
                  <button
                    type="button"
                    onClick={handleCopyDigitalCard}
                    className="py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs transition flex items-center justify-center gap-1.5"
                  >
                    {copiedNotice ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-stone-600" />}
                    <span>{copiedNotice ? 'Copied Card!' : 'Copy Slack Card'}</span>
                  </button>

                  {/* Immediate Download Decal SVG */}
                  <button
                    type="button"
                    onClick={handleDownloadDecalSVG}
                    className="py-2 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs transition flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-200" />
                    <span>Instant SVG</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Encrypted Orders & Gift History Tab */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-amber-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-serif font-bold text-lg text-stone-900">
                  Your Encrypted Coworker Gift Vault
                </h3>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 font-mono font-semibold border border-emerald-200">
                AES-GCM 256-bit Protected
              </span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Every coworker sticker you configure and gift is strictly encrypted inside your browser's local storage with zero plaintext exposure. No third-party servers ever see your coworker names or private notes.
            </p>
          </div>

          {ordersHistory.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-amber-300 space-y-3">
              <Gift className="w-12 h-12 text-amber-500 mx-auto" />
              <h4 className="font-serif font-bold text-stone-800 text-base">
                No Coworker Stickers Gifted Yet
              </h4>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Select a sticker design from the catalog above to personalize a warm message for a teammate!
              </p>
              <button
                onClick={() => setActiveTab('catalog')}
                className="mt-2 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-xs"
              >
                Browse Sticker Catalog
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ordersHistory.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl p-5 border border-amber-200 shadow-2xs space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900">
                        {order.category}
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono">
                        {new Date(order.timestamp).toLocaleDateString()}
                      </span>
                    </div>

                    <h4 className="font-serif font-bold text-stone-900 text-base">
                      {order.stickerName}
                    </h4>

                    <div className="text-xs space-y-1">
                      <p className="font-semibold text-emerald-800">
                        To: {order.recipientName}
                      </p>
                      <p className="text-stone-500">
                        From: {order.senderName}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-amber-50/70 text-xs text-stone-700 italic border border-amber-100">
                      "{order.customMessage}"
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-stone-500 font-mono">
                      Format: {order.mockupFormat}
                    </span>
                    <button
                      onClick={() => handleDeleteOrder(order.id)}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition"
                      title="Delete encrypted record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
