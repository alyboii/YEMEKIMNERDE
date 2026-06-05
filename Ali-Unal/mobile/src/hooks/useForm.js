// ─────────────────────────────────────────────
// useForm Hook — Form State & Real-Time Validasyon
// Tüm formlar için yeniden kullanılabilir
// ─────────────────────────────────────────────

import { useState, useCallback, useRef } from 'react';

/**
 * Generic form yönetim hook'u.
 * Her form alanı için state, error ve touched durumlarını yönetir.
 * Real-time validasyon desteği sunar.
 *
 * @param {object} initialValues  - Form başlangıç değerleri { email: '', sifre: '' }
 * @param {object} validationRules - Her alan için validasyon fonksiyonu { email: (v) => error|null }
 *
 * Kullanım:
 *   const { values, errors, touched, handleChange, handleBlur, validateAll, resetForm, isValid } =
 *     useForm({ email: '', sifre: '' }, loginValidationRules);
 */
const useForm = (initialValues = {}, validationRules = {}) => {
  // ─── State Tanımları ───
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validasyon kurallarını ref'te tut (re-render önleme)
  const rulesRef = useRef(validationRules);
  rulesRef.current = validationRules;

  // ─── Tek Alan Validasyonu ───
  const validateField = useCallback((name, value) => {
    const rule = rulesRef.current[name];
    if (!rule) return null;

    const error = rule(value);
    return error;
  }, []);

  // ─── Alan Değişikliği (onChange) ───
  // Real-time validasyon: değer değiştiğinde anında doğrula
  const handleChange = useCallback((name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));

    // Sadece daha önce dokunulmuş alanları valide et (UX: ilk yazarken hata gösterme)
    setTouched((prevTouched) => {
      if (prevTouched[name]) {
        const error = validateField(name, value);
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: error,
        }));
      }
      return prevTouched;
    });
  }, [validateField]);

  // ─── Alan Focus Kaybı (onBlur) ───
  // İlk dokunuşta validasyon başlat
  const handleBlur = useCallback((name) => {
    setTouched((prev) => ({ ...prev, [name]: true }));

    const error = validateField(name, values[name]);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  }, [validateField, values]);

  // ─── Tüm Alanları Doğrula ───
  // Form gönderilmeden önce çağrılır
  const validateAll = useCallback(() => {
    const newErrors = {};
    const newTouched = {};
    let hasError = false;

    Object.keys(rulesRef.current).forEach((name) => {
      newTouched[name] = true;
      const error = validateField(name, values[name]);
      if (error) {
        newErrors[name] = error;
        hasError = true;
      }
    });

    setErrors(newErrors);
    setTouched(newTouched);

    return !hasError;
  }, [validateField, values]);

  // ─── Form Geçerliliği ───
  // Tüm touched alanların error'suz olup olmadığını kontrol eder
  const isValid = useCallback(() => {
    const touchedFields = Object.keys(touched).filter((key) => touched[key]);
    if (touchedFields.length === 0) return false;

    return touchedFields.every((key) => !errors[key]);
  }, [touched, errors]);

  // ─── Formu Sıfırla ───
  const resetForm = useCallback((newValues) => {
    setValues(newValues || initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  // ─── Belirli Bir Alanın Değerini Set Et ───
  const setFieldValue = useCallback((name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  // ─── Belirli Bir Alana Hata Set Et ───
  const setFieldError = useCallback((name, error) => {
    setErrors((prev) => ({ ...prev, [name]: error }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  }, []);

  // ─── Form Submit Wrapper ───
  const handleSubmit = useCallback(async (onSubmit) => {
    const isFormValid = validateAll();
    if (!isFormValid) return false;

    setIsSubmitting(true);
    try {
      await onSubmit(values);
      return true;
    } catch (error) {
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [validateAll, values]);

  return {
    // State
    values,
    errors,
    touched,
    isSubmitting,

    // Handlers
    handleChange,
    handleBlur,
    handleSubmit,

    // Validasyon
    validateAll,
    validateField,
    isValid,

    // Yardımcı
    resetForm,
    setFieldValue,
    setFieldError,
    setIsSubmitting,

    // Kolaylık: belirli bir alanın hatalı olup olmadığını kontrol et
    hasError: (name) => touched[name] && errors[name],
    getError: (name) => (touched[name] ? errors[name] : null),
  };
};

export default useForm;
