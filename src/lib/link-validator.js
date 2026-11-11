import { getYouTubeVideoId } from "./youtube.js";

/**
 * Validasi spesifik format dan domain link karya submission
 *
 * @param {string} linkType - Tipe link (GITHUB, YOUTUBE, PROPOSAL, ORIGINALITY_STATEMENT, PRESENTATION, FIGMA, FIGMA_PROTOTYPE, DEPLOYMENT, OTHER)
 * @param {string} rawUrl - Tautan yang diinputkan pengguna
 * @returns {{ isValid: boolean, message: string, previewType: "youtube" | "figma" | "github" | "drive" | "web" | "none", videoId?: string }}
 */
export function validateSubmissionLink(linkType, rawUrl) {
  if (!rawUrl || typeof rawUrl !== "string" || rawUrl.trim() === "") {
    return {
      isValid: false,
      message: "Tautan tidak boleh kosong.",
      previewType: "none",
    };
  }

  const trimmed = rawUrl.trim();

  // 1. Validasi URL dasar
  let urlObj;
  try {
    const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    urlObj = new URL(withProtocol);
  } catch {
    return {
      isValid: false,
      message: "Format URL tidak valid. Pastikan diawali http:// atau https://.",
      previewType: "none",
    };
  }

  const hostname = urlObj.hostname.toLowerCase().replace(/^www\./, "");
  const normalizedType = (linkType || "").toUpperCase();

  switch (normalizedType) {
    case "GITHUB":
    case "GITHUB_SECONDARY": {
      if (hostname !== "github.com") {
        return {
          isValid: false,
          message: "Tautan tidak sesuai. Wajib menggunakan URL repositori GitHub (contoh: https://github.com/username/repository).",
          previewType: "none",
        };
      }
      const pathParts = urlObj.pathname.split("/").filter(Boolean);
      if (pathParts.length < 2) {
        return {
          isValid: false,
          message: "Tautan repositori GitHub harus mengarah ke spesifik repositori (contoh: https://github.com/user/project).",
          previewType: "none",
        };
      }
      return {
        isValid: true,
        message: "",
        previewType: "github",
      };
    }

    case "YOUTUBE": {
      // Izinkan YouTube atau Google Drive (opsi video drive)
      const isDrive =
        hostname === "drive.google.com" ||
        hostname === "docs.google.com";

      if (isDrive) {
        return {
          isValid: true,
          message: "",
          previewType: "drive",
        };
      }

      const videoId = getYouTubeVideoId(trimmed);
      if (!videoId) {
        return {
          isValid: false,
          message: "Tautan tidak sesuai. Wajib berupa link video YouTube (contoh: https://www.youtube.com/watch?v=...) atau link video Google Drive (contoh: https://drive.google.com/file/d/...).",
          previewType: "none",
        };
      }
      return {
        isValid: true,
        message: "",
        previewType: "youtube",
        videoId,
      };
    }

    case "PROPOSAL": {
      const isDocsOrDrive =
        hostname === "docs.google.com" ||
        hostname === "drive.google.com";
      if (!isDocsOrDrive) {
        return {
          isValid: false,
          message: "Tautan tidak sesuai. Wajib berupa dokumen Google Docs / Google Drive (contoh: https://docs.google.com/document/d/...).",
          previewType: "none",
        };
      }
      return {
        isValid: true,
        message: "",
        previewType: "drive",
      };
    }

    case "ORIGINALITY_STATEMENT": {
      const isDriveOrDocs =
        hostname === "drive.google.com" ||
        hostname === "docs.google.com";
      if (!isDriveOrDocs) {
        return {
          isValid: false,
          message: "Tautan tidak sesuai. Wajib berupa tautan file Google Drive / Docs (contoh: https://drive.google.com/file/d/...).",
          previewType: "none",
        };
      }
      return {
        isValid: true,
        message: "",
        previewType: "drive",
      };
    }

    case "PRESENTATION": {
      const isGoogleSlides =
        hostname === "docs.google.com" ||
        hostname === "drive.google.com" ||
        hostname === "slides.google.com";
      const isCanva = hostname === "canva.com";

      if (!isGoogleSlides && !isCanva) {
        return {
          isValid: false,
          message: "Tautan tidak sesuai. Wajib berupa Google Slides/Drive atau link presentasi Canva (contoh: https://docs.google.com/presentation/d/... atau https://www.canva.com/design/...).",
          previewType: "none",
        };
      }
      return {
        isValid: true,
        message: "",
        previewType: isCanva ? "web" : "drive",
      };
    }

    case "FIGMA":
    case "FIGMA_PROTOTYPE": {
      if (hostname !== "figma.com") {
        return {
          isValid: false,
          message: "Tautan tidak sesuai. Wajib berupa link file atau prototipe Figma (contoh: https://www.figma.com/design/... atau https://www.figma.com/proto/...).",
          previewType: "none",
        };
      }
      return {
        isValid: true,
        message: "",
        previewType: "figma",
      };
    }

    case "DEPLOYMENT": {
      return {
        isValid: true,
        message: "",
        previewType: "web",
      };
    }

    default: {
      return {
        isValid: true,
        message: "",
        previewType: "web",
      };
    }
  }
}
