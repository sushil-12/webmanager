import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface PasswordError {
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasLimitCharacter: boolean;
}
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const convertFileToUrl = (file: File) => URL.createObjectURL(file);
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
) => {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func(...args);
    }, delay) as ReturnType<typeof setTimeout>;
  };
};

export function formatDateString(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString("en-US", options);

  const time = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return `${formattedDate} at ${time}`;
}

// 
export const multiFormatDateString = (timestamp: string = ""): string => {
  const timestampNum = Math.round(new Date(timestamp).getTime() / 1000);
  const date: Date = new Date(timestampNum * 1000);
  const now: Date = new Date();

  const diff: number = now.getTime() - date.getTime();
  const diffInSeconds: number = diff / 1000;
  const diffInMinutes: number = diffInSeconds / 60;
  const diffInHours: number = diffInMinutes / 60;
  const diffInDays: number = diffInHours / 24;

  switch (true) {
    case Math.floor(diffInDays) >= 30:
      return formatDateString(timestamp);
    case Math.floor(diffInDays) === 1:
      return `${Math.floor(diffInDays)} day ago`;
    case Math.floor(diffInDays) > 1 && diffInDays < 30:
      return `${Math.floor(diffInDays)} days ago`;
    case Math.floor(diffInHours) >= 1:
      return `${Math.floor(diffInHours)} hours ago`;
    case Math.floor(diffInMinutes) >= 1:
      return `${Math.floor(diffInMinutes)} minutes ago`;
    default:
      return "Just now";
  }
};

export const checkIsLiked = (likeList: string[], userId: string) => {
  return likeList.includes(userId);
};

export const formatString = (inputString: string) => {
  console.log(inputString, "TEST")
  if (inputString !== '' || inputString !== undefined) {
    const words = inputString?.split('_');
    const capitalizedWords = words?.map(word => word.charAt(0).toUpperCase() + word.slice(1));
    return capitalizedWords?.join(' ');
  }
}

export const createSlug = (inputString: string, charToReplaceString = '-'): string => {
  const lowercaseString = inputString.toLowerCase();
  const words = lowercaseString.split(' ');
  const slug = words.join(charToReplaceString);
  return slug;
};

export const bytesToSize = (bytes: number): string => {
  const sizes: string[] = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  if (bytes === 0) return '0 Byte';

  const i: number = parseInt(String(Math.floor(Math.log(bytes) / Math.log(1024))));
  return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
};

export const checkCookieExists = (cookieName: string) => {
  const cookies = document.cookie.split(';');

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(cookieName + '=')) {
      return true;
    }
  }
  return false;
}
export const getCookieExpirationTimeLeft = (cookieName: string): number | null => {
  const cookies: string[] = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie: string = cookies[i].trim();
    if (cookie.startsWith(cookieName + '=')) {
      const cookieValue: string = cookie.substring(cookieName.length + 1);
      console.log(cookieValue)
      const decodedCookieValue: string = decodeURIComponent(cookieValue);
      const cookieParts: string[] = decodedCookieValue.split(';');
      console.log(cookieParts, "cookieParts");
      for (let j = 0; j < cookieParts.length; j++) {
        const cookiePart: string = cookieParts[j].trim();
        console.log(j, cookiePart, "cookiePart");
        if (cookiePart.startsWith('expires=')) {
          const expiresValue: string = cookiePart.substring('expires='.length);
          const expirationTime: Date = new Date(expiresValue);
          const currentTime: Date = new Date();
          const timeLeft: number = expirationTime.getTime() - currentTime.getTime();
          return timeLeft;
        }
      }
    }
  }
  return null; // Cookie not found or invalid
};

export const getCookieMessage = (cookieName: string): string | null => {
  const cookies: string[] = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie: string = cookies[i].trim();
    if (cookie.startsWith(cookieName + '=')) {
      const cookieValue: string = cookie.substring(cookieName.length + 1);
      const decodedCookieValue: string = decodeURIComponent(cookieValue);
      const cookieParts: string[] = decodedCookieValue.split(';');
      for (let j = 0; j < cookieParts.length; j++) {
        const cookiePart: string = cookieParts[j].trim();
        if (cookiePart.startsWith('message=')) {
          const messageValue: string = cookiePart.substring('message='.length);
          return messageValue;
        }
      }
    }
  }
  return null; // Cookie not found or invalid
};

export const getCookieValue = (cookieName: string): string | null => {
  const name = cookieName + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(';');
  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i].trim();
    if (cookie.startsWith(name)) {
      return cookie.substring(name.length);
    }
  }
  return null; // Cookie not found
};


export const checkPasswordStrength = (password: string): PasswordError | null => {
  // Regular expressions to check for at least one uppercase letter, one lowercase letter, and one number
  const uppercaseRegex = /[A-Z]/;
  const lowercaseRegex = /[a-z]/;
  const numberRegex = /\d/;

  // Check if the password meets the criteria
  const hasUppercase = uppercaseRegex.test(password);
  const hasLowercase = lowercaseRegex.test(password);
  const hasNumber = numberRegex.test(password);
  const hasLimitCharacter = password.length > 8;

  return {
    hasUppercase: hasUppercase,
    hasLowercase: hasLowercase,
    hasNumber: hasNumber,
    hasLimitCharacter: hasLimitCharacter,
  };
};

export const menuSchemaJson = [
  {
    "id": Math.random().toString(36).substr(2, 9),
    "imgURL": "DocumentIcon",
    "route": "/pages",
    "label": "Pages",
    "category": false,
    "type": "default"
  },
  {
    "id": Math.random().toString(36).substr(2, 9),
    "imgURL": "WrenchScrewdriverIcon",
    "route": "/plugins",
    "label": "plugins",
    "category": false,
    "type": "default"
  },
  {
    "id": Math.random().toString(36).substr(2, 9),
    "imgURL": "FilmIcon",
    "route": "/media",
    "label": "Media",
    "category": false,
    "type": "default"
  }
];


export const trimString = (str: string, maxLength: number) => {
  if (!str) return '';
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength);
};
export const formatOption = (option: string) => {
  // Remove .js extension
  const withoutExtension = option.replace('.js', '');

  // Replace hyphens with spaces
  const withoutHyphen = withoutExtension.replace(/-/g, ' ');

  // Capitalize the first letter
  return withoutHyphen.charAt(0).toUpperCase() + withoutHyphen.slice(1);
};

export const createSpacedString = (inputString: string): string => {
  const words = inputString.split('_');
  const spacedString = words.map((word) =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  return spacedString;
};