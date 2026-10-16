'use client';

import React, { useState, useEffect } from 'react';
import {
  Bell,
  Smartphone,
  CheckCircle2,
  Share2,
  PlusSquare,
  Sparkles,
  Loader2,
  X,
  Send,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import {
  savePushSubscriptionAction,
  sendTestPushNotificationAction,
} from '@/app/lib/notifications';

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default function AdminInstallAndNotifyBar() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isNotifyLoading, setIsNotifyLoading] = useState(false);
  const [notifyMessage, setNotifyMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);

  useEffect(() => {
    // 1. Check if running in standalone mode (already installed as PWA)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsInstalled(isStandalone);

    // 2. Detect iOS device
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isAppleDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isAppleDevice);

    // 3. Listen for Android/Chrome beforeinstallprompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // 4. Check push notification subscription status
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.getRegistration('/sw.js').then((reg) => {
        if (reg) {
          reg.pushManager.getSubscription().then((sub) => {
            setIsSubscribed(!!sub);
          });
        }
      });
    }

    const handleOpenModal = () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
      } else {
        setShowIOSModal(true);
      }
    };
    window.addEventListener('open-admin-install-modal', handleOpenModal);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('open-admin-install-modal', handleOpenModal);
    };
  }, [deferredPrompt]);

  // Handle Enable Notifications
  const handleEnableNotifications = async () => {
    setIsNotifyLoading(true);
    setNotifyMessage(null);

    try {
      if (!('Notification' in window) || !('serviceWorker' in navigator)) {
        throw new Error('Push notifications are not supported in this browser.');
      }

      const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidKey) {
        throw new Error('VAPID public key not configured.');
      }

      const perm = await Notification.requestPermission();
      if (perm !== 'granted') {
        throw new Error('Notification permission was denied. Please allow notifications in browser settings.');
      }

      const reg = await navigator.serviceWorker.register('/sw.js');
      await navigator.serviceWorker.ready;

      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      });

      const raw = sub.toJSON();
      if (!raw.endpoint || !raw.keys?.p256dh || !raw.keys?.auth) {
        throw new Error('Could not read subscription keys.');
      }

      const res = await savePushSubscriptionAction(
        {
          endpoint: raw.endpoint,
          keys: {
            p256dh: raw.keys.p256dh,
            auth: raw.keys.auth,
          },
        },
        'admin',
        'admin@kamran.com'
      );

      if (!res.success) {
        throw new Error(res.error || 'Server rejected subscription.');
      }

      setIsSubscribed(true);
      setNotifyMessage({
        text: 'Order notifications active! Your device will now receive instant alerts for new orders.',
        type: 'success',
      });
    } catch (err: any) {
      setNotifyMessage({
        text: err?.message || 'Failed to enable notifications.',
        type: 'error',
      });
    } finally {
      setIsNotifyLoading(false);
    }
  };

  // Handle Send Test Notification
  const handleSendTest = async () => {
    setIsNotifyLoading(true);
    setNotifyMessage(null);
    try {
      const res = await sendTestPushNotificationAction();
      if (res.success) {
        setNotifyMessage({
          text: `Test alert dispatched! Sent to ${res.count || 1} subscribed device(s).`,
          type: 'success',
        });
      } else {
        setNotifyMessage({
          text: res.error || 'Could not send test notification.',
          type: 'error',
        });
      }
    } catch (err: any) {
      setNotifyMessage({
        text: err?.message || 'Error triggering test alert.',
        type: 'error',
      });
    } finally {
      setIsNotifyLoading(false);
    }
  };

  // Handle Install Admin App on Phone
  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else if (isIOS) {
      setShowIOSModal(true);
    } else {
      // Fallback for browsers without direct prompt
      setShowIOSModal(true);
    }
  };

  return (
    <>
      <div className="w-full bg-gradient-to-r from-zinc-900 via-neutral-900 to-zinc-950 border border-neutral-800 rounded-2xl p-4 sm:p-5 shadow-sm text-white space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Info Side */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-sm sm:text-base text-white">
                  Mobile Admin & Live Order Alerts
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Quick Setup
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-1 max-w-xl leading-relaxed">
                Install Bazaario Admin directly onto your phone screen like a native app and enable instant browser push notifications for every incoming order.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* Install On Phone Button */}
            {isInstalled ? (
              <div className="flex items-center gap-2 px-3.5 py-2 bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 rounded-xl text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>App Installed</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleInstallApp}
                className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-neutral-100 text-black font-semibold rounded-xl text-xs shadow-md transition cursor-pointer active:scale-95"
              >
                <Smartphone className="w-4 h-4 text-neutral-800" />
                <span>Install on Phone</span>
              </button>
            )}

            {/* Notification Button */}
            {!isSubscribed ? (
              <button
                type="button"
                onClick={handleEnableNotifications}
                disabled={isNotifyLoading}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-semibold rounded-xl text-xs shadow-md shadow-amber-500/10 transition cursor-pointer disabled:opacity-50 active:scale-95"
              >
                {isNotifyLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Bell className="w-4 h-4" />
                )}
                <span>Enable Order Notifications</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 px-3 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Notifications Active</span>
                </span>
                <button
                  type="button"
                  onClick={handleSendTest}
                  disabled={isNotifyLoading}
                  className="flex items-center gap-1.5 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-xl text-xs font-medium border border-zinc-700 transition cursor-pointer disabled:opacity-50"
                  title="Send a test notification to verify delivery"
                >
                  {isNotifyLoading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5 text-amber-400" />
                  )}
                  <span>Test Alert</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Feedback Alert */}
        {notifyMessage && (
          <div
            className={`p-3 rounded-xl text-xs flex items-center justify-between border ${
              notifyMessage.type === 'success'
                ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
                : 'bg-rose-950/40 border-rose-800/60 text-rose-300'
            }`}
          >
            <div className="flex items-center gap-2">
              {notifyMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              ) : (
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              )}
              <span>{notifyMessage.text}</span>
            </div>
            <button
              onClick={() => setNotifyMessage(null)}
              className="text-neutral-400 hover:text-white p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* iOS & Manual Installation Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-zinc-700/80 rounded-3xl max-w-md w-full p-6 text-white space-y-5 shadow-2xl relative">
            <button
              onClick={() => setShowIOSModal(false)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1.5 rounded-xl hover:bg-zinc-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">Install Admin on Phone</h3>
                <p className="text-xs text-zinc-400">Add to your Home Screen in 3 seconds</p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 p-3 bg-zinc-950/80 rounded-2xl border border-zinc-800/80">
                <div className="w-7 h-7 rounded-lg bg-zinc-800 flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5">
                  1
                </div>
                <div className="text-xs leading-relaxed text-zinc-300">
                  Open this page on your phone&apos;s browser (<span className="text-white font-semibold">Safari on iPhone</span> or <span className="text-white font-semibold">Chrome on Android</span>).
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-zinc-950/80 rounded-2xl border border-zinc-800/80">
                <div className="w-7 h-7 rounded-lg bg-zinc-800 flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5">
                  2
                </div>
                <div className="text-xs leading-relaxed text-zinc-300">
                  Tap the browser&apos;s menu / share icon:
                  <div className="mt-1.5 flex items-center gap-2 text-amber-400 font-semibold">
                    <Share2 className="w-4 h-4 shrink-0" />
                    <span>Share Button (Safari bottom bar)</span>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-amber-400 font-semibold">
                    <span>⋮ (Chrome top-right menu)</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-zinc-950/80 rounded-2xl border border-zinc-800/80">
                <div className="w-7 h-7 rounded-lg bg-zinc-800 flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5">
                  3
                </div>
                <div className="text-xs leading-relaxed text-zinc-300">
                  Scroll down and tap <span className="text-white font-semibold">&quot;Add to Home Screen&quot;</span> (
                  <PlusSquare className="w-3.5 h-3.5 inline mx-1 text-emerald-400" />
                  ), then confirm by tapping <span className="text-white font-semibold">&quot;Add&quot;</span>.
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowIOSModal(false)}
                className="w-full py-3 bg-white hover:bg-zinc-200 text-black font-semibold text-xs rounded-xl transition cursor-pointer"
              >
                Got It!
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
