"use client";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Venus, Mars } from "lucide-react";
import { MotionButton } from "@/components/ui/MotionButton";
import type { ReactNode } from "react";

interface GenderOption {
  value: string;
  label: string;
  icon: ReactNode;
}

const genderOptions: GenderOption[] = [
  { value: "male", label: "Male", icon: <Mars size={40} strokeWidth={1.7} /> },
  {
    value: "female",
    label: "Female",
    icon: <Venus size={40} strokeWidth={1.7} />,
  },
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  const [loading, setLoading] = useState(false);

  // Separate raw values in lbs for user, to avoid overwriting input
  const [weightRaw, setWeightRaw] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [heightCm, setHeightCm] = useState("");

  const [form, setForm] = useState({
    gender: "",
    age: "",
    heightUnit: "cm",
    weightUnit: "kg",
    weight: "", // stored as kg for the backend
  });

  // Redirect logic: if not authenticated, go to login; if already onboarded, go to dashboard
  useEffect(() => {
    if (!user) navigate("/onboarding");
    else if (user.onboarded) navigate("/dashboard");
  }, [user, navigate]);

  // Height conversion (ft/in to cm)
  useEffect(() => {
    if (form.heightUnit === "ft" && heightFt && heightIn !== "") {
      const ft = Number(heightFt);
      const inch = Number(heightIn);
      if (!isNaN(ft) && !isNaN(inch)) {
        setHeightCm((ft * 30.48 + inch * 2.54).toFixed(1));
      } else {
        setHeightCm("");
      }
    } else if (form.heightUnit === "cm") {
      setHeightCm(""); // Reset; direct input will be used
    }
  }, [heightFt, heightIn, form.heightUnit]);

  // Weight conversion (lbs to kg)
  useEffect(() => {
    if (form.weightUnit === "lbs" && weightRaw !== "") {
      const kg = (Number(weightRaw) * 0.453592).toFixed(1);
      setForm((f) => ({ ...f, weight: kg }));
    } else if (form.weightUnit === "kg") {
      setForm((f) => ({ ...f, weight: weightRaw }));
    }
  }, [weightRaw, form.weightUnit]);

  // Reset weight or height raw values on unit change
  function handleUnitSwitch(type: "heightUnit" | "weightUnit", value: string) {
    if (type === "heightUnit") {
      setForm((f) => ({ ...f, heightUnit: value }));
      setHeightFt("");
      setHeightIn("");
      setHeightCm("");
    } else if (type === "weightUnit") {
      setForm((f) => ({ ...f, weightUnit: value, weight: "" }));
      setWeightRaw("");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // use correct height in cm for backend
    const numericHeightCm =
      form.heightUnit === "cm"
        ? Number(heightCm || "") ||
          Number(
            (document.getElementById("heightCm") as HTMLInputElement)?.value
          )
        : Number(heightCm);
    if (!form.gender || !form.age || !numericHeightCm || !form.weight) {
      toast("Please complete all required fields.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/user/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gender: form.gender,
          age: Number(form.age),
          heightCm: numericHeightCm,
          weightKg: Number(form.weight),
        }),
      });
      if (!res.ok) throw new Error("Onboarding failed");
      setUser({ ...user!, onboarded: true });
      toast.success("You're in! Welcome to Repwise.");
      navigate("/dashboard");
    } catch {
      toast.error("Could not complete onboarding.", {
        description: "Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={cn(
        "mx-auto w-full max-w-lg rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121212] shadow-md px-8 py-8 my-14 transition-colors duration-300"
      )}
    >
      <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200 mb-2">
        Welcome, {user?.firstName || "friend"}
      </h2>
      <p className="mb-7 text-neutral-600 dark:text-neutral-400 font-normal">
        Before you start tracking, let's personalize Repwise just for you.
      </p>

      <form className="space-y-7" onSubmit={handleSubmit} autoComplete="off">
        {/* GENDER */}
        <div>
          <Label className="mb-2 block text-sm font-medium">
            Select your gender
          </Label>
          <div className="flex gap-5 justify-center">
            {genderOptions.map((opt) => (
              <MotionButton
                key={opt.value}
                className={cn(
                  "w-32 h-24 flex flex-col items-center justify-center gap-2 rounded-lg border shadow-sm group transition-all duration-200 text-base",
                  form.gender === opt.value
                    ? "border-[#b7410e] bg-[#fff7f3] dark:bg-[#181012] ring-2 ring-[#ff6f3c] scale-105"
                    : "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#222] hover:border-[#b7410e]/50"
                )}
                selected={form.gender === opt.value}
                onClick={() => setForm((f) => ({ ...f, gender: opt.value }))}
              >
                <div
                  className={
                    form.gender === opt.value
                      ? "text-[#b7410e]"
                      : "text-neutral-400 dark:text-neutral-500"
                  }
                >
                  {opt.icon}
                </div>
                <span
                  className={cn(
                    "font-medium",
                    form.gender === opt.value
                      ? "text-[#b7410e]"
                      : "text-neutral-700 dark:text-neutral-300"
                  )}
                >
                  {opt.label}
                </span>
              </MotionButton>
            ))}
          </div>
        </div>

        {/* AGE */}
        <div>
          <Label htmlFor="age" className="mb-2 block text-sm font-medium">
            Your age
          </Label>
          <Input
            id="age"
            type="number"
            min={14}
            max={120}
            value={form.age}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                age: e.target.value.replace(/[^0-9]/g, ""),
              }))
            }
            placeholder="E.g. 28"
            className="w-32 text-base"
            required
            inputMode="numeric"
            maxLength={3}
          />
        </div>

        {/* HEIGHT */}
        <div>
          <Label className="mb-2 block text-sm font-medium">Height</Label>
          <div className="flex items-center gap-4">
            <div className="flex gap-1">
              <button
                type="button"
                className={cn(
                  "px-3 py-1 rounded-l font-semibold transition border",
                  form.heightUnit === "cm"
                    ? "bg-[#ffede3] border-[#b7410e] text-[#b7410e]"
                    : "bg-neutral-100 dark:bg-neutral-900 border-neutral-200"
                )}
                onClick={() => handleUnitSwitch("heightUnit", "cm")}
              >
                cm
              </button>
              <button
                type="button"
                className={cn(
                  "px-3 py-1 rounded-r font-semibold transition border",
                  form.heightUnit === "ft"
                    ? "bg-[#ffede3] border-[#b7410e] text-[#b7410e]"
                    : "bg-neutral-100 dark:bg-neutral-900 border-neutral-200"
                )}
                onClick={() => handleUnitSwitch("heightUnit", "ft")}
              >
                ft/in
              </button>
            </div>
            {form.heightUnit === "cm" ? (
              <Input
                id="heightCm"
                name="heightCm"
                type="number"
                min={100}
                max={250}
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
                className="w-20 text-base"
                placeholder="cm"
                required
              />
            ) : (
              <>
                <Input
                  name="heightFt"
                  type="number"
                  min={2}
                  max={8}
                  value={heightFt}
                  onChange={(e) => setHeightFt(e.target.value)}
                  className="w-14 text-base"
                  placeholder="ft"
                  required
                />
                <Input
                  name="heightIn"
                  type="number"
                  min={0}
                  max={11}
                  value={heightIn}
                  onChange={(e) => setHeightIn(e.target.value)}
                  className="w-14 text-base"
                  placeholder="in"
                  required
                />
                <span className="ml-2 text-xs text-neutral-400">
                  {heightFt && heightIn ? `= ${heightCm} cm` : ""}
                </span>
              </>
            )}
          </div>
        </div>

        {/* WEIGHT */}
        <div>
          <Label className="mb-2 block text-sm font-medium">Weight</Label>
          <div className="flex items-center gap-4">
            <div className="flex gap-1">
              <button
                type="button"
                className={cn(
                  "px-3 py-1 rounded-l font-semibold transition border",
                  form.weightUnit === "kg"
                    ? "bg-[#ffede3] border-[#b7410e] text-[#b7410e]"
                    : "bg-neutral-100 dark:bg-neutral-900 border-neutral-200"
                )}
                onClick={() => handleUnitSwitch("weightUnit", "kg")}
              >
                kg
              </button>
              <button
                type="button"
                className={cn(
                  "px-3 py-1 rounded-r font-semibold transition border",
                  form.weightUnit === "lbs"
                    ? "bg-[#ffede3] border-[#b7410e] text-[#b7410e]"
                    : "bg-neutral-100 dark:bg-neutral-900 border-neutral-200"
                )}
                onClick={() => handleUnitSwitch("weightUnit", "lbs")}
              >
                lbs
              </button>
            </div>
            <Input
              name="weight"
              type="number"
              min={20}
              max={250}
              required
              value={form.weightUnit === "kg" ? form.weight : weightRaw}
              onChange={(e) =>
                form.weightUnit === "kg"
                  ? setForm((f) => ({ ...f, weight: e.target.value }))
                  : setWeightRaw(e.target.value)
              }
              className="w-20 text-base"
              placeholder={form.weightUnit}
            />
            {form.weightUnit === "lbs" && weightRaw && (
              <span className="ml-2 text-xs text-neutral-400">
                {weightRaw
                  ? `= ${(Number(weightRaw) * 0.453592).toFixed(1)} kg`
                  : ""}
              </span>
            )}
          </div>
        </div>

        {/* CTAS */}
        <div className="flex justify-between items-center pt-5 gap-4">
          <button
            type="button"
            className="text-neutral-400 font-medium underline underline-offset-4 hover:text-[#b7410e] transition"
            onClick={() => {
              setUser({ ...user!, onboarded: true });
              navigate("/dashboard");
            }}
          >
            Skip for now
          </button>
          <button
            type="submit"
            className={cn(
              "rounded-lg px-8 py-2 font-semibold text-base shadow-md transition-all duration-150",
              "bg-gradient-to-br from-[#b7410e] to-[#ff6f3c] text-white hover:brightness-110 focus-visible:ring-2 focus-visible:ring-[#b7410e]",
              loading && "opacity-60 pointer-events-none"
            )}
            disabled={
              !form.gender ||
              !form.age ||
              !(form.heightUnit === "cm"
                ? heightCm
                : heightFt && heightIn && heightCm) ||
              !(form.weightUnit === "kg"
                ? form.weight
                : weightRaw && form.weight) ||
              loading
            }
          >
            {loading ? "Saving..." : "Continue"}
          </button>
        </div>
      </form>
    </div>
  );
}
