"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  QrCode,
  Smartphone,
  Copy,
  ShoppingBag,
  RefreshCw,
  ShieldCheck,
  Loader2,
} from "lucide-react";

/**
 * PaymentPage
 * -----------
 * Route: /payment-gateway?orderId=ORDER_123
 *
 * Expects:
 *  - localStorage "authToken"          -> Bearer token
 *  - GET {NEXT_PUBLIC_API_URL}/users/order/singnal/:orderId -> order status polling
 *
 * Uses order.paymentDetails.deeplink / intentURIData to build UPI intents,
 * polls order status every POLL_INTERVAL ms, and expires the session based
 * on the order's real creation time with a proper "session expired" screen.
 */

const POLL_INTERVAL = 2500; // 2.5s
const EXPIRY_SECONDS = 60; // testing: 1 minute. Bump back to 9 * 60 for prod.

type Phase = "loading" | "pending" | "success" | "failed" | "expired" | "error";

interface PaymentDetails {
  txnId?: string;
  paymentId?: string;
  utr?: string | null;
  merchantName?: string;
  merchantVpa?: string;
  amount?: number;
  deeplink?: string;
  intentURIData?: string;
  otpPostUrl?: string;
}

interface Order {
  orderId: string;
  orderDate: string;
  totalAmount: number;
  paymentStatus: "PENDING" | "PAID" | "FAILED" | string;
  paymentDetails?: PaymentDetails;
  [key: string]: unknown;
}

interface UpiApp {
  key: string;
  label: string;
  scheme: string;
  color: string;
}

const UPI_APPS: UpiApp[] = [
  { key: "gpay", label: "Google Pay", scheme: "tez://upi/pay", color: "#4285F4" },
  { key: "phonepe", label: "PhonePe", scheme: "phonepe://pay", color: "#5F259F" },
  { key: "paytm", label: "Paytm", scheme: "paytmmp://pay", color: "#00B9F1" },
  { key: "upi", label: "Any UPI App", scheme: "upi://pay", color: "#0EA5A4" },
];

function buildAppLink(scheme: string, intentQuery: string): string {
  return `${scheme}?${intentQuery}`;
}

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

async function fetchOrder(orderId: string): Promise<Order> {
  const token = localStorage.getItem("authToken");
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/order/singnal/${orderId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!res.ok) throw new Error("Failed to fetch order status");
  const data = await res.json();
  return data.order as Order;
}

function secondsLeftFromOrder(order: Order | null): number {
  const createdAt = order?.orderDate ? new Date(order.orderDate).getTime() : null;
  if (!createdAt || Number.isNaN(createdAt)) return EXPIRY_SECONDS;
  const elapsed = (Date.now() - createdAt) / 1000;
  return Math.max(0, Math.round(EXPIRY_SECONDS - elapsed));
}

function resolveOrderId(): string | null {
  if (typeof window === "undefined") return null;

  // 1) ?orderId=... query param (e.g. /payment-gateway?orderId=ORDER_123)
  const fromQuery = new URLSearchParams(window.location.search).get("orderId");
  if (fromQuery) return fromQuery;

  // 2) fallback: last path segment, but only if it actually looks like an order id
  const lastSegment = window.location.pathname.split("/").filter(Boolean).pop();
  if (lastSegment && lastSegment !== "payment-gateway" && lastSegment !== "payment") {
    return lastSegment;
  }

  return null;
}

interface PaymentPageProps {
  orderId?: string;
}

export default function PaymentPage({ orderId: orderIdProp }: PaymentPageProps) {
  const [orderId, setOrderId] = useState<string | null>(orderIdProp || null);
  const [orderIdResolved, setOrderIdResolved] = useState<boolean>(!!orderIdProp);

  // resolve on mount (client-side only, since window/search params aren't
  // available during SSR in Next.js)
  useEffect(() => {
    if (!orderIdProp) {
      setOrderId(resolveOrderId());
      setOrderIdResolved(true);
    }
  }, [orderIdProp]);

  const [order, setOrder] = useState<Order | null>(null);
  const [phase, setPhase] = useState<Phase>("loading");
  const [secondsLeft, setSecondsLeft] = useState<number>(EXPIRY_SECONDS);
  const [copied, setCopied] = useState<boolean>(false);
  const [pollTick, setPollTick] = useState<number>(0);
  const hasAutoOpened = useRef<boolean>(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerInitialized = useRef<boolean>(false);

  const applyOrderStatus = useCallback((ord: Order) => {
    setOrder(ord);
    const status = ord?.paymentStatus;

    // Anchor the countdown to the order's real creation time, only once —
    // later polls shouldn't reset an already-ticking timer.
    if (!timerInitialized.current) {
      timerInitialized.current = true;
      const remaining = secondsLeftFromOrder(ord);
      setSecondsLeft(remaining);
      if (remaining <= 0 && status !== "PAID" && status !== "FAILED") {
        setPhase("expired");
        return;
      }
    }

    if (status === "PAID") {
      setPhase("success");
    } else if (status === "FAILED") {
      setPhase("failed");
    } else {
      setPhase((prev) => (prev === "expired" ? prev : "pending"));
    }
  }, []);

  // initial load
  useEffect(() => {
    if (!orderIdResolved) return; // still figuring out orderId, don't flash an error
    if (!orderId) {
      setPhase("error");
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const ord = await fetchOrder(orderId);
        if (!cancelled) applyOrderStatus(ord);
      } catch (e) {
        if (!cancelled) setPhase("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [orderId, orderIdResolved, applyOrderStatus]);

  // auto-open the default UPI intent once, on mobile, as soon as order is loaded
  useEffect(() => {
    if (
      !hasAutoOpened.current &&
      order?.paymentDetails?.deeplink &&
      phase === "pending" &&
      /Android|iPhone/i.test(navigator.userAgent)
    ) {
      hasAutoOpened.current = true;
      window.location.href = order.paymentDetails.deeplink;
    }
  }, [order, phase]);

  // polling loop
  useEffect(() => {
    if (!orderId || (phase !== "pending" && phase !== "loading")) return;

    pollRef.current = setInterval(async () => {
      try {
        const ord = await fetchOrder(orderId);
        setPollTick((t) => t + 1);
        applyOrderStatus(ord);
      } catch (e) {
        // keep polling silently, don't hard fail on a transient network blip
      }
    }, POLL_INTERVAL);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [orderId, phase, applyOrderStatus]);

  // countdown timer
  useEffect(() => {
    if (phase !== "pending" && phase !== "loading") return;
    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          if (pollRef.current) clearInterval(pollRef.current);
          setPhase("expired");
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase]);

  const handleRetry = () => {
    setSecondsLeft(EXPIRY_SECONDS);
    setPhase("loading");
    hasAutoOpened.current = false;
    timerInitialized.current = false;
    window.location.reload();
  };

  const handleCopyUtr = () => {
    if (!order?.paymentDetails?.merchantVpa) return;
    navigator.clipboard.writeText(order.paymentDetails.merchantVpa);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const goToShop = () => {
    window.location.href = "/shop";
  };

  const intentQuery = order?.paymentDetails?.intentURIData;
  const qrData = order?.paymentDetails?.deeplink;
  const qrSrc = qrData
    ? `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=8&data=${encodeURIComponent(
        qrData
      )}`
    : null;

  const progressPct = Math.max(0, Math.min(100, (secondsLeft / EXPIRY_SECONDS) * 100));

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md">
        {/* Brand strip */}
        <div className="flex items-center justify-center gap-2 mb-6 text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-xs tracking-wide uppercase">Secured Checkout</span>
        </div>

        <div className="rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl shadow-black/40 overflow-hidden">
          {phase === "loading" && <LoadingState />}
          {phase === "error" && <ErrorState onRetry={handleRetry} />}
          {phase === "expired" && <ExpiredState onRetry={handleRetry} />}
          {phase === "success" && <SuccessState order={order} onShop={goToShop} />}
          {phase === "failed" && <FailedState onRetry={handleRetry} />}

          {phase === "pending" && order && (
            <PendingState
              order={order}
              secondsLeft={secondsLeft}
              progressPct={progressPct}
              qrSrc={qrSrc}
              intentQuery={intentQuery}
              copied={copied}
              onCopy={handleCopyUtr}
              pollTick={pollTick}
            />
          )}
        </div>

        <p className="text-center text-xs text-slate-600 mt-5">
          Do not close this window until your payment is confirmed.
        </p>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="p-14 flex flex-col items-center gap-4">
      <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
      <p className="text-slate-400 text-sm">Preparing your payment…</p>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="p-10 flex flex-col items-center gap-4 text-center">
      <XCircle className="w-12 h-12 text-rose-400" />
      <div>
        <h2 className="text-lg font-semibold">Couldn&apos;t load this order</h2>
        <p className="text-slate-400 text-sm mt-1">
          Check your connection and try again.
        </p>
      </div>
      <button
        onClick={onRetry}
        className="mt-2 inline-flex items-center gap-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors px-4 py-2 text-sm font-medium"
      >
        <RefreshCw className="w-4 h-4" /> Retry
      </button>
    </div>
  );
}

interface PendingStateProps {
  order: Order;
  secondsLeft: number;
  progressPct: number;
  qrSrc: string | null;
  intentQuery?: string;
  copied: boolean;
  onCopy: () => void;
  pollTick: number;
}

function PendingState({
  order,
  secondsLeft,
  progressPct,
  qrSrc,
  intentQuery,
  copied,
  onCopy,
}: PendingStateProps) {
  const amount = order?.totalAmount ?? order?.paymentDetails?.amount;
  const vpa = order?.paymentDetails?.merchantVpa;
  const urgent = secondsLeft <= 60;

  return (
    <div>
      {/* Amount header */}
      <div className="px-6 pt-6 pb-5 border-b border-slate-800">
        <div className="flex items-center justify-between">
          <span className="text-slate-400 text-sm">Order #{order.orderId?.slice(-8)}</span>
          <span
            className={`flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full ${
              urgent
                ? "bg-rose-500/10 text-rose-400"
                : "bg-amber-500/10 text-amber-400"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            {formatTime(secondsLeft)}
          </span>
        </div>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-3xl font-bold tracking-tight">₹{amount}</span>
        </div>
        <div className="mt-3 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-linear ${
              urgent ? "bg-rose-500" : "bg-emerald-500"
            }`}
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* QR */}
      <div className="px-6 py-6 flex flex-col items-center border-b border-slate-800">
        <div className="bg-white p-3 rounded-xl">
          {qrSrc ? (
            <img src={qrSrc} alt="Scan to pay with any UPI app" width={200} height={200} />
          ) : (
            <div className="w-[200px] h-[200px] flex items-center justify-center text-slate-400">
              <QrCode className="w-10 h-10" />
            </div>
          )}
        </div>
        <p className="text-slate-400 text-xs mt-3 flex items-center gap-1.5">
          <QrCode className="w-3.5 h-3.5" /> Scan with any UPI app
        </p>

        {vpa && (
          <button
            onClick={onCopy}
            className="mt-3 inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
          >
            <Copy className="w-3 h-3" />
            {copied ? "Copied" : vpa}
          </button>
        )}
      </div>

      {/* App buttons */}
      <div className="px-6 py-6">
        <p className="text-xs text-slate-500 mb-3 flex items-center gap-1.5">
          <Smartphone className="w-3.5 h-3.5" /> Or pay directly with
        </p>
        <div className="grid grid-cols-2 gap-2.5">
          {UPI_APPS.map((app) => (
            <a
              key={app.key}
              href={intentQuery ? buildAppLink(app.scheme, intentQuery) : "#"}
              className="flex items-center justify-center gap-2 rounded-lg border border-slate-800 bg-slate-950 hover:bg-slate-800 transition-colors px-3 py-2.5 text-sm font-medium"
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: app.color }}
              />
              {app.label}
            </a>
          ))}
        </div>
      </div>

      {/* Polling indicator */}
      <div className="px-6 pb-6 flex items-center justify-center gap-2 text-xs text-slate-500">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        Waiting for payment confirmation…
      </div>
    </div>
  );
}

function SuccessState({ order, onShop }: { order: Order | null; onShop: () => void }) {
  return (
    <div className="p-10 flex flex-col items-center gap-4 text-center animate-[fadeIn_0.3s_ease-out]">
      <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
        <CheckCircle2 className="w-9 h-9 text-emerald-400" />
      </div>
      <div>
        <h2 className="text-xl font-semibold">Payment successful</h2>
        <p className="text-slate-400 text-sm mt-1">
          ₹{order?.totalAmount} paid for order #{order?.orderId?.slice(-8)}
        </p>
      </div>
      <button
        onClick={onShop}
        className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 transition-colors px-4 py-3 text-sm font-semibold text-slate-950"
      >
        <ShoppingBag className="w-4 h-4" /> Continue Shopping
      </button>
    </div>
  );
}

function FailedState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="p-10 flex flex-col items-center gap-4 text-center">
      <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center">
        <XCircle className="w-9 h-9 text-rose-400" />
      </div>
      <div>
        <h2 className="text-xl font-semibold">Payment failed</h2>
        <p className="text-slate-400 text-sm mt-1">
          Your payment couldn&apos;t be completed. No amount was deducted.
        </p>
      </div>
      <button
        onClick={onRetry}
        className="mt-2 inline-flex items-center gap-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors px-4 py-2.5 text-sm font-medium"
      >
        <RefreshCw className="w-4 h-4" /> Try Again
      </button>
    </div>
  );
}

function ExpiredState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="p-10 flex flex-col items-center gap-4 text-center">
      <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center">
        <Clock className="w-9 h-9 text-slate-400" />
      </div>
      <div>
        <h2 className="text-xl font-semibold">Session expired</h2>
        <p className="text-slate-400 text-sm mt-1">
          This payment window has timed out for your security. Start a new
          payment to continue.
        </p>
      </div>
      <button
        onClick={onRetry}
        className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-slate-100 hover:bg-white transition-colors px-4 py-3 text-sm font-semibold text-slate-950"
      >
        <RefreshCw className="w-4 h-4" /> Start New Payment
      </button>
    </div>
  );
}