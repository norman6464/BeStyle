/**
 * バリデーションユーティリティ
 */

// バリデーション結果の型
export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

// バリデーションルールの型
export type ValidationRule<T = string> = (value: T) => ValidationResult;

/**
 * 必須チェック
 */
export const required = (message = '必須項目です'): ValidationRule => {
  return (value: string) => ({
    isValid: value.trim().length > 0,
    message: value.trim().length > 0 ? undefined : message,
  });
};

/**
 * 最小文字数チェック
 */
export const minLength = (min: number, message?: string): ValidationRule => {
  return (value: string) => ({
    isValid: value.length >= min,
    message: value.length >= min ? undefined : message || `${min}文字以上で入力してください`,
  });
};

/**
 * 最大文字数チェック
 */
export const maxLength = (max: number, message?: string): ValidationRule => {
  return (value: string) => ({
    isValid: value.length <= max,
    message: value.length <= max ? undefined : message || `${max}文字以内で入力してください`,
  });
};

/**
 * メールアドレス形式チェック
 */
export const email = (message = '有効なメールアドレスを入力してください'): ValidationRule => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return (value: string) => ({
    isValid: emailRegex.test(value),
    message: emailRegex.test(value) ? undefined : message,
  });
};

/**
 * パスワード強度チェック
 * - 8文字以上
 * - 大文字を含む
 * - 小文字を含む
 * - 数字を含む
 */
export const passwordStrength = (message?: string): ValidationRule => {
  return (value: string) => {
    const hasMinLength = value.length >= 8;
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);

    const isValid = hasMinLength && hasUpperCase && hasLowerCase && hasNumber;

    let errorMessage = message;
    if (!errorMessage && !isValid) {
      const missing: string[] = [];
      if (!hasMinLength) missing.push('8文字以上');
      if (!hasUpperCase) missing.push('大文字');
      if (!hasLowerCase) missing.push('小文字');
      if (!hasNumber) missing.push('数字');
      errorMessage = `パスワードには${missing.join('、')}が必要です`;
    }

    return {
      isValid,
      message: isValid ? undefined : errorMessage,
    };
  };
};

/**
 * ユーザー名形式チェック
 * - 英数字とアンダースコアのみ
 * - 3文字以上20文字以下
 */
export const username = (message?: string): ValidationRule => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return (value: string) => ({
    isValid: usernameRegex.test(value),
    message: usernameRegex.test(value)
      ? undefined
      : message || 'ユーザー名は3〜20文字の英数字とアンダースコアのみ使用できます',
  });
};

/**
 * URL形式チェック
 */
export const url = (message = '有効なURLを入力してください'): ValidationRule => {
  return (value: string) => {
    if (!value) return { isValid: true };
    try {
      new URL(value);
      return { isValid: true };
    } catch {
      return { isValid: false, message };
    }
  };
};

/**
 * 正規表現マッチチェック
 */
export const pattern = (regex: RegExp, message: string): ValidationRule => {
  return (value: string) => ({
    isValid: regex.test(value),
    message: regex.test(value) ? undefined : message,
  });
};

/**
 * パスワード一致チェック
 */
export const confirmPassword = (
  password: string,
  message = 'パスワードが一致しません'
): ValidationRule => {
  return (value: string) => ({
    isValid: value === password,
    message: value === password ? undefined : message,
  });
};

/**
 * 複数のバリデーションルールを適用
 */
export const validate = (value: string, rules: ValidationRule[]): ValidationResult => {
  for (const rule of rules) {
    const result = rule(value);
    if (!result.isValid) {
      return result;
    }
  }
  return { isValid: true };
};

/**
 * フォーム全体のバリデーション
 */
export const validateForm = <T extends Record<string, string>>(
  values: T,
  rulesMap: Partial<Record<keyof T, ValidationRule[]>>
): Record<keyof T, string | undefined> => {
  const errors = {} as Record<keyof T, string | undefined>;

  for (const key of Object.keys(rulesMap) as Array<keyof T>) {
    const rules = rulesMap[key];
    if (rules) {
      const result = validate(values[key] || '', rules);
      errors[key] = result.message;
    }
  }

  return errors;
};

/**
 * エラーがあるかチェック
 */
export const hasErrors = (errors: Record<string, string | undefined>): boolean => {
  return Object.values(errors).some((error) => error !== undefined);
};
