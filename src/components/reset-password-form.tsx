"use client";
import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { CheckCircle, XCircle } from "lucide-react";

const passwordRequirements = [
  {
    label: "At least 8 characters",
    test: (pwd: string) => pwd.length >= 8,
  },
  {
    label: "At least one uppercase letter",
    test: (pwd: string) => /[A-Z]/.test(pwd),
  },
  {
    label: "At least one digit",
    test: (pwd: string) => /\d/.test(pwd),
  },
  {
    label: "At least one special character",
    test: (pwd: string) => /[!@#$%^&*()_\-+=<>?/[\]{}|~`.,;:]/.test(pwd),
  },
];

export default function ResetPasswordFormDemo() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function allRequirementsMet(password: string) {
    return passwordRequirements.every((r) => r.test(password));
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!allRequirementsMet(newPassword)) {
      toast("Password requirements not met", {
        description: "Please satisfy all password rules.",
      });
      setLoading(false);
      return;
    }
    if (newPassword !== confirmPassword) {
      toast("Passwords do not match", {
        description: "Please ensure both passwords are the same.",
      });
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });
      if (!response.ok) throw new Error();
      toast("Password reset!", {
        description: "You can now log in with your new password.",
      });
      setTimeout(() => navigate("/login"), 1500);
    } catch {
      toast("Reset failed", {
        description: "This link is invalid or expired, or there was an error.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
      <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
        Reset your password
      </h2>
      <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
        Enter your new password below. Make it strong!
      </p>

      <form className="my-8" onSubmit={handleSubmit}>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="newPassword">New Password</Label>
          <Input
            id="newPassword"
            type="password"
            placeholder="••••••••"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          {/* Real-time requirements checklist */}
          <div className="pt-2 flex flex-col gap-1">
            {passwordRequirements.map((req, idx) => {
              const passed = req.test(newPassword);
              return (
                <div key={idx} className="flex items-center gap-1 text-xs">
                  {passed ? (
                    <CheckCircle
                      className="text-[#148d1c] dark:text-green-400 size-4"
                      aria-hidden
                    />
                  ) : (
                    <XCircle
                      className="text-gray-400 dark:text-neutral-400 size-4"
                      aria-hidden
                    />
                  )}
                  <span
                    className={
                      passed
                        ? "text-[#148d1c] dark:text-green-400"
                        : "text-neutral-500 dark:text-neutral-400"
                    }
                  >
                    {req.label}
                  </span>
                </div>
              );
            })}
          </div>
        </LabelInputContainer>

        <LabelInputContainer className="mb-8">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </LabelInputContainer>

        <button
          className={cn(
            "group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-[#b7410e] to-[#ff6f3c] font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset]",
            "dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
          )}
          disabled={loading}
          type="submit"
        >
          {loading ? "Resetting..." : "Reset Password"}
          <BottomGradient />
        </button>
      </form>
    </div>
  );
}

// ---------- Reusable helpers -----------
const BottomGradient = () => (
  <>
    <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-[#b7410e] to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
    <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-[#ff6f3c]/90 to-transparent opacity-80 blur-md transition duration-500 group-hover/btn:opacity-100" />
  </>
);

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("flex w-full flex-col space-y-2", className)}>
    {children}
  </div>
);
