"use client";

import dynamic from "next/dynamic";

const BottomNav = dynamic(() => import("@/components/BottomNav"), { ssr: false });
const InstallPrompt = dynamic(() => import("@/components/InstallPrompt"), { ssr: false });
const ServiceWorkerRegister = dynamic(() => import("@/components/ServiceWorkerRegister"), { ssr: false });
const CookieConsent = dynamic(() => import("@/components/CookieConsent"), { ssr: false });
const NotificationPrompt = dynamic(() => import("@/components/NotificationPrompt"), { ssr: false });
const SplashScreen = dynamic(() => import("@/components/SplashScreen"), { ssr: false });
const DragScroll = dynamic(() => import("@/components/DragScroll"), { ssr: false });
const SocialProof = dynamic(() => import("@/components/SocialProof"), { ssr: false });
const SyncProvider = dynamic(() => import("@/components/SyncProvider"), { ssr: false });
const OfflineIndicator = dynamic(() => import("@/components/OfflineIndicator"), { ssr: false });
const WaterReminder = dynamic(() => import("@/components/WaterReminder"), { ssr: false });
const ExerciseReminder = dynamic(() => import("@/components/ExerciseReminder"), { ssr: false });

/**
 * Wrapper za sve client-only komponente koje se lazy loaduju.
 * Ovo je Client Component pa može da koristi ssr: false.
 */
export default function ClientShell() {
  return (
    <>
      <BottomNav />
      <InstallPrompt />
      <ServiceWorkerRegister />
      <CookieConsent />
      <NotificationPrompt />
      <SplashScreen />
      <DragScroll />
      <SocialProof />
      <SyncProvider />
      <OfflineIndicator />
      <WaterReminder />
      <ExerciseReminder />
    </>
  );
}
