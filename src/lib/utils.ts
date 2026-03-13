import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toSlug(str: string) {
  str = str.toLowerCase();
  str = str.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // Loại bỏ dấu
  str = str.replace(/[đĐ]/g, 'd');
  str = str.replace(/([^0-9a-z-\s])/g, ''); // Loại bỏ ký tự đặc biệt
  str = str.replace(/(\s+)/g, '-'); // Thay khoảng trắng bằng -
  str = str.replace(/-+/g, '-'); // Loại bỏ dấu - liên tiếp
  str = str.replace(/^-+|-+$/g, ''); // Loại bỏ dấu - ở đầu và cuối
  return str;
}
