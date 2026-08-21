"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Link2Icon, PersonIcon, LayersIcon } from "@radix-ui/react-icons";

const teamFormSchema = z
  .object({
    team_name: z.string().max(25, "Nama tim maksimal 25 karakter").optional(),
    file_url: z.url({
      protocol: /^https?$/,
      hostname: /^drive\.google\.com$/,
      message: "Harap masukkan link Google Drive yang valid",
    }),
    team_lead: z.string().optional(),
    member_1: z.string().optional(),
    member_2: z.string().optional(),
    team_type: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const isTooShort = (val) => val.replace(/\s+/g, "").length < 3;

    // Group
    if (data.team_type === "GROUP") {
      if (!data.team_name || isTooShort(data.team_name)) {
        ctx.addIssue({
          message: "Nama tim minimal 3 karakter",
          path: ["team_name"],
        });
      }
      if (!data.team_lead || isTooShort(data.team_lead)) {
        ctx.addIssue({ path: ["team_lead"] });
      }
      if (data.member_1 && isTooShort(data.member_1)) {
        ctx.addIssue({ path: ["member_1"] });
      }
      if (data.member_2 && isTooShort(data.member_2)) {
        ctx.addIssue({ path: ["member_2"] });
      }
    }

    // Individual
    else {
      if (!data.team_lead || isTooShort(data.team_lead)) {
        ctx.addIssue({
          message: "Nama peserta minimal 3 karakter",
          path: ["team_lead"],
        });
      }
    }
  });

function PersonInput({
  field,
  register,
  errors,
  placeholder,
  role,
  required = false,
}) {
  return (
    <div className="relative">
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mia-muted-2 z-10 pointer-events-none">
        <PersonIcon className="w-4 h-4" />
      </div>
      <Input
        type="text"
        placeholder={placeholder}
        required={required}
        {...register(field)}
        className={cn(
          "h-11 bg-input rounded-xl pl-10 pr-22 text-sm text-foreground placeholder:text-mia-muted-2 transition-all peer",
          errors[field]
            ? "border-destructive focus-visible:ring-destructive"
            : "border-border focus-visible:border-ring focus-visible:ring-ring/50",
        )}
      />
      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-mia-muted-2 z-10 pointer-events-none select-none peer-placeholder-shown:hidden">
        {role}
      </span>
    </div>
  );
}

export function TeamForm({
  registration,
  onSubmit,
  onCancel,
  isPending = false,
}) {
  const teamType = registration?.category?.team_type || "GROUP";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(teamFormSchema),
    defaultValues: {
      team_name: "",
      team_lead: "",
      member_1: "",
      member_2: "",
      file_url: "",
      team_type: teamType,
    },
  });

  // Untuk lomba Grup (2-3 orang) dengan 1 ketua + 2 anggota
  const groupPersonInputs = [
    {
      field: "team_lead",
      placeholder: "Nama ketua (wajib)",
      role: "Ketua",
      required: true,
    },
    {
      field: "member_1",
      placeholder: "Nama anggota 1 (opsional)",
      role: "Anggota 1",
    },
    {
      field: "member_2",
      placeholder: "Nama anggota 2 (opsional)",
      role: "Anggota 2",
    },
  ];

  useEffect(() => {
    if (registration) {
      let lead = "";
      let m1 = "";
      let m2 = "";
      console.log(registration.team_members);

      if (registration.team_members) {
        try {
          const parsed = JSON.parse(registration.team_members);
          if (Array.isArray(parsed)) {
            lead = parsed[0] || "";
            m1 = parsed[1] || "";
            m2 = parsed[2] || "";
          }
        } catch (e) {
          const arr = registration.team_members
            .replace(/[\[\]']/g, "")
            .split(",")
            .map((name) => name.trim())
            .filter((name) => name !== "");
          lead = arr[0] || "";
          m1 = arr[1] || "";
          m2 = arr[2] || "";
        }
      }

      reset({
        team_name: registration.team_name || "",
        team_lead: lead,
        member_1: m1,
        member_2: m2,
        file_url: registration.file_url || "",
        team_type: teamType,
      });
    }
  }, [registration, reset, teamType]);

  const cleanString = (val) => {
    if (!val) return "";
    return val.trim().replace(/\s+/g, " ");
  };

  const handleFormSubmit = (data) => {
    const trimmedTeamName = cleanString(data.team_name);
    const trimmedFileUrl = data.file_url ? data.file_url.trim() : "";
    const trimmedLead = cleanString(data.team_lead);
    const trimmedM1 = cleanString(data.member_1);
    const trimmedM2 = cleanString(data.member_2);

    let formattedTeamMembers = "";
    if (teamType === "INDIVIDUAL") {
      formattedTeamMembers = `['${trimmedLead}']`;
    } else {
      const names = [trimmedLead, trimmedM1, trimmedM2].filter((n) => n !== "");
      formattedTeamMembers = `['${names.join("', '")}']`;
    }

    const payload = {
      team_name: teamType === "INDIVIDUAL" ? trimmedLead : trimmedTeamName,
      team_members: formattedTeamMembers,
      file_url: trimmedFileUrl,
    };

    onSubmit(payload);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-5 selection:bg-primary selection:text-white"
    >
      {/* Individual Competition Field */}
      {teamType === "INDIVIDUAL" && (
        <div className="space-y-2">
          <Label className="block text-sm font-semibold text-foreground">
            Nama Peserta
          </Label>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mia-muted-2 z-10 pointer-events-none">
              <PersonIcon className="w-4 h-4" />
            </div>
            <Input
              type="text"
              placeholder="Masukkan nama peserta"
              required
              {...register("team_lead")}
              className={cn(
                "h-11 bg-input rounded-xl pl-10 pr-4 text-sm text-foreground placeholder:text-mia-muted-2 transition-all",
                errors.team_lead
                  ? "border-destructive focus-visible:ring-destructive"
                  : "border-border focus-visible:border-ring focus-visible:ring-ring/50",
              )}
            />
          </div>
          {errors.team_lead && (
            <p className="text-xs text-destructive mt-1 font-medium">
              {errors.team_lead.message}
            </p>
          )}
        </div>
      )}

      {/* Group Competition Additional Fields */}
      {teamType === "GROUP" && (
        <div className="space-y-5">
          {/* Team Name */}
          <div className="space-y-2">
            <Label
              htmlFor="team_name"
              className="block text-sm font-semibold text-foreground"
            >
              Nama Tim
            </Label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mia-muted-2 z-10 pointer-events-none">
                <LayersIcon className="w-4 h-4" />
              </div>
              <Input
                id="team_name"
                placeholder="Masukkan nama tim"
                required
                {...register("team_name")}
                className={cn(
                  "h-11 bg-input rounded-xl pl-10 pr-4 text-sm text-foreground placeholder:text-mia-muted-2 transition-all",
                  errors.team_name
                    ? "border-destructive focus-visible:ring-destructive"
                    : "border-border focus-visible:border-ring focus-visible:ring-ring/50",
                )}
              />
            </div>
            {errors.team_name && (
              <p className="text-xs text-destructive mt-1 font-medium">
                {errors.team_name.message}
              </p>
            )}
          </div>

          {/* Team Members Stacks */}
          <div className="space-y-3">
            <Label className="block text-sm font-semibold text-foreground">
              Anggota Tim
            </Label>

            {groupPersonInputs.map((person, index) => (
              <PersonInput
                key={index}
                {...person}
                register={register}
                errors={errors}
              />
            ))}

            {(errors.team_lead || errors.member_1 || errors.member_2) && (
              <p className="text-xs text-destructive mt-1 font-medium">
                Nama peserta minimal 3 karakter
              </p>
            )}
          </div>
        </div>
      )}

      <Separator />

      {/* Drive Document Link Field */}
      <div className="space-y-2">
        <Label
          htmlFor="file_url"
          className="block text-sm font-semibold text-foreground"
        >
          Link Drive Dokumen
        </Label>
        <div className="relative">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mia-muted-2 z-10 pointer-events-none">
            <Link2Icon className="w-4 h-4" />
          </div>
          <Input
            id="file_url"
            placeholder="https://drive.google.com/..."
            required
            {...register("file_url")}
            className={cn(
              "h-11 bg-input rounded-xl pl-10 pr-4 text-sm text-foreground placeholder:text-mia-muted-2 transition-all",
              errors.file_url
                ? "border-destructive focus-visible:ring-destructive"
                : "border-border focus-visible:border-ring focus-visible:ring-ring/50",
            )}
          />
        </div>
        <p className="text-xs text-mia-muted-2">
          Upload dokumen-dokumen persyaratan ke Google Drive dan masukkan link
          publiknya di sini
        </p>
        {errors.file_url && (
          <p className="text-xs text-destructive mt-1 font-medium">
            {errors.file_url.message}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="pt-3 border-t border-border/40 flex flex-col-reverse sm:flex-row justify-end gap-2.5">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isPending}
            className="h-11 rounded-full border-border/40 hover:bg-input text-foreground text-sm font-semibold px-5 cursor-pointer"
          >
            Batal
          </Button>
        )}
        <Button
          type="submit"
          disabled={isPending}
          className="mia-btn-primary h-11 px-6 text-sm font-semibold rounded-full shadow-lg shadow-red-900/30 cursor-pointer"
        >
          {isPending ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </div>
    </form>
  );
}
