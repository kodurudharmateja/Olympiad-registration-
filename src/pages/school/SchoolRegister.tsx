import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, School, Eye, EyeOff } from "lucide-react";
import {
  ALL_STATE_NAMES,
  DEFAULT_STATE,
  getDistricts,
  isValidDistrictForState,
} from "@/lib/india-states-districts";

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------

const PERSON_NAME_RE = /^[a-zA-Z][a-zA-Z .'\-]*$/;
const SCHOOL_NAME_RE = /[a-zA-Z]/; // must contain at least one letter
const SCHOOL_NAME_ALLOWED_RE = /^[a-zA-Z0-9 .'\-&()]+$/;
const MOBILE_RE = /^[6-9]\d{9}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PIN_RE = /^[1-9]\d{5}$/;
const ALPHA_RE = /[a-zA-Z]/;

interface FieldErrors {
  name?: string;
  principalName?: string;
  contactPerson?: string;
  mobile?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  district?: string;
  pinCode?: string;
  password?: string;
  confirmPassword?: string;
}

function validateAll(
  form: {
    name: string;
    principalName: string;
    contactPerson: string;
    mobile: string;
    email: string;
    address: string;
    city: string;
    state: string;
    district: string;
    pinCode: string;
    password: string;
    confirmPassword: string;
  },
  touched?: Record<string, boolean>
): FieldErrors {
  const errs: FieldErrors = {};
  const check = (field: string) => !touched || touched[field];

  // School Name
  if (check("name")) {
    const v = form.name.trim();
    if (!v) errs.name = "School name is required.";
    else if (v.length < 3) errs.name = "Minimum 3 characters.";
    else if (v.length > 150) errs.name = "Maximum 150 characters.";
    else if (!SCHOOL_NAME_RE.test(v)) errs.name = "Must contain at least one letter.";
    else if (!SCHOOL_NAME_ALLOWED_RE.test(v))
      errs.name = "Only letters, numbers, spaces, . ' - & () are allowed.";
  }

  // Principal Name
  if (check("principalName")) {
    const v = form.principalName.trim();
    if (!v) errs.principalName = "Principal name is required.";
    else if (v.length < 2) errs.principalName = "Minimum 2 characters.";
    else if (v.length > 100) errs.principalName = "Maximum 100 characters.";
    else if (!ALPHA_RE.test(v)) errs.principalName = "Must contain alphabetic characters.";
    else if (!PERSON_NAME_RE.test(v))
      errs.principalName = "Only letters, spaces, periods, apostrophes and hyphens allowed.";
  }

  // Contact Person
  if (check("contactPerson")) {
    const v = form.contactPerson.trim();
    if (!v) errs.contactPerson = "Contact person is required.";
    else if (v.length < 2) errs.contactPerson = "Minimum 2 characters.";
    else if (v.length > 100) errs.contactPerson = "Maximum 100 characters.";
    else if (!ALPHA_RE.test(v)) errs.contactPerson = "Must contain alphabetic characters.";
    else if (!PERSON_NAME_RE.test(v))
      errs.contactPerson = "Only letters, spaces, periods, apostrophes and hyphens allowed.";
  }

  // Mobile
  if (check("mobile")) {
    const v = form.mobile.trim();
    if (!v) errs.mobile = "Mobile number is required.";
    else if (!/^\d+$/.test(v)) errs.mobile = "Only digits are allowed.";
    else if (v.length !== 10) errs.mobile = "Must be exactly 10 digits.";
    else if (!MOBILE_RE.test(v)) errs.mobile = "Must start with 6, 7, 8 or 9.";
  }

  // Email (optional)
  if (check("email")) {
    const v = form.email.trim();
    if (v && !EMAIL_RE.test(v)) errs.email = "Enter a valid email address.";
  }

  // Address
  if (check("address")) {
    const v = form.address.trim();
    if (!v) errs.address = "Address is required.";
    else if (v.length < 5) errs.address = "Minimum 5 characters.";
    else if (v.length > 300) errs.address = "Maximum 300 characters.";
  }

  // City
  if (check("city")) {
    const v = form.city.trim();
    if (!v) errs.city = "City is required.";
    else if (v.length < 2) errs.city = "Minimum 2 characters.";
    else if (v.length > 100) errs.city = "Maximum 100 characters.";
    else if (!ALPHA_RE.test(v)) errs.city = "Must contain alphabetic characters.";
  }

  // State
  if (check("state")) {
    if (!form.state) errs.state = "State is required.";
    else if (!ALL_STATE_NAMES.includes(form.state)) errs.state = "Select a valid state.";
  }

  // District
  if (check("district")) {
    if (!form.district) errs.district = "District is required.";
    else if (form.state && !isValidDistrictForState(form.state, form.district))
      errs.district = "Select a valid district for the chosen state.";
  }

  // PIN Code
  if (check("pinCode")) {
    const v = form.pinCode.trim();
    if (!v) errs.pinCode = "PIN code is required.";
    else if (!/^\d+$/.test(v)) errs.pinCode = "Only digits are allowed.";
    else if (!PIN_RE.test(v))
      errs.pinCode = "Must be 6 digits and cannot start with 0.";
  }

  // Password
  if (check("password")) {
    const v = form.password;
    if (!v) errs.password = "Password is required.";
    else if (v.length < 8) errs.password = "Minimum 8 characters.";
    else if (!/[A-Z]/.test(v)) errs.password = "Must contain at least one uppercase letter.";
    else if (!/[a-z]/.test(v)) errs.password = "Must contain at least one lowercase letter.";
    else if (!/[0-9]/.test(v)) errs.password = "Must contain at least one number.";
  }

  // Confirm Password
  if (check("confirmPassword")) {
    if (!form.confirmPassword) errs.confirmPassword = "Please confirm your password.";
    else if (form.confirmPassword !== form.password) errs.confirmPassword = "Passwords do not match.";
  }

  return errs;
}

// ---------------------------------------------------------------------------
// Shared select style — visually matches the Input component
// ---------------------------------------------------------------------------
const SELECT_CLASS =
  "border-[#D9D4CC] h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none appearance-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50";

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function SchoolRegister() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    principalName: "",
    contactPerson: "",
    mobile: "",
    email: "",
    address: "",
    city: "",
    state: DEFAULT_STATE,
    district: "",
    pinCode: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Available districts for the currently selected state
  const [availableDistricts, setAvailableDistricts] = useState<string[]>(
    getDistricts(DEFAULT_STATE)
  );

  // When state changes, reload districts and clear district
  useEffect(() => {
    const districts = getDistricts(form.state);
    setAvailableDistricts(districts);
    setForm((prev) => ({ ...prev, district: "" }));
  }, [form.state]);

  // Re-validate touched fields whenever form changes
  useEffect(() => {
    if (Object.keys(touched).length > 0) {
      setFieldErrors(validateAll(form, touched));
    }
  }, [form, touched]);

  const registerMutation = trpc.school.register.useMutation({
    onSuccess: () => {
      navigate("/school/login");
    },
    onError: (err) => {
      setError(err.message);
      setIsSubmitting(false);
    },
  });

  const markTouched = (field: string) =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleMobileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Restrict to digits only, max 10
    const v = e.target.value.replace(/\D/g, "").slice(0, 10);
    update("mobile", v);
  };

  const handlePinInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Restrict to digits only, max 6
    const v = e.target.value.replace(/\D/g, "").slice(0, 6);
    update("pinCode", v);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Mark all fields as touched to show all errors
    const allFields = Object.keys(form).reduce<Record<string, boolean>>(
      (acc, k) => ({ ...acc, [k]: true }),
      {}
    );
    setTouched(allFields);

    const errs = validateAll(form, allFields);
    setFieldErrors(errs);

    if (Object.keys(errs).length > 0) {
      setError("Please fix the errors above before submitting.");
      return;
    }

    if (isSubmitting || registerMutation.isPending) return;
    setIsSubmitting(true);

    try {
      const { createUserWithEmailAndPassword } = await import("firebase/auth");
      const { auth } = await import("@/lib/firebase");

      // School accounts use a synthesized email from mobile (existing behaviour)
      const synthesizedEmail = `${form.mobile}@school.olympiad.local`;
      const userCred = await createUserWithEmailAndPassword(
        auth,
        synthesizedEmail,
        form.password
      );
      const idToken = await userCred.user.getIdToken();

      // Normalize values before sending
      const { confirmPassword, password, ...rest } = form;
      const normalized = {
        ...rest,
        name: rest.name.trim(),
        principalName: rest.principalName.trim(),
        contactPerson: rest.contactPerson.trim(),
        mobile: rest.mobile.trim(),
        email: rest.email.trim().toLowerCase() || undefined,
        address: rest.address.trim(),
        city: rest.city.trim(),
        pinCode: rest.pinCode.trim(),
      };

      registerMutation.mutate({ ...normalized, idToken });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Registration failed";
      setError(msg);
      setIsSubmitting(false);
    }
  };

  const isPending = isSubmitting || registerMutation.isPending;

  // Helper to render inline field error
  const FieldError = ({ field }: { field: keyof FieldErrors }) =>
    fieldErrors[field] ? (
      <p className="text-xs text-red-600 mt-1">{fieldErrors[field]}</p>
    ) : null;

  return (
    <div className="min-h-screen bg-[#FAFAF8] py-8 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-[#6B6560] hover:text-[#2D2D2D] mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="flex items-center justify-center gap-2 mb-2">
            <img
              src="/logo.png"
              alt="Junior Physics Olympiad"
              className="w-8 h-8 object-contain"
            />
          </div>
          <h1 className="text-xl font-semibold text-[#2D2D2D]">Register Your School</h1>
          <p className="text-sm text-[#6B6560]">Create a school account for bulk registration</p>
        </div>

        <Card className="border-[#E8E4E0] bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-base text-[#2D2D2D] flex items-center gap-2">
              <School className="w-4 h-4 text-[#8B8680]" />
              School Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* School Name */}
              <div className="space-y-2">
                <Label className="text-[#2D2D2D]">School Name *</Label>
                <Input
                  id="school-name"
                  name="schoolName"
                  autoComplete="organization"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  onBlur={() => markTouched("name")}
                  className="border-[#D9D4CC]"
                  aria-invalid={!!fieldErrors.name}
                />
                <FieldError field="name" />
              </div>

              {/* Principal Name + Contact Person */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[#2D2D2D]">Principal Name *</Label>
                  <Input
                    id="principal-name"
                    name="principalName"
                    autoComplete="off"
                    value={form.principalName}
                    onChange={(e) => update("principalName", e.target.value)}
                    onBlur={() => markTouched("principalName")}
                    className="border-[#D9D4CC]"
                    aria-invalid={!!fieldErrors.principalName}
                  />
                  <FieldError field="principalName" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#2D2D2D]">Contact Person *</Label>
                  <Input
                    id="contact-person"
                    name="contactPerson"
                    autoComplete="off"
                    value={form.contactPerson}
                    onChange={(e) => update("contactPerson", e.target.value)}
                    onBlur={() => markTouched("contactPerson")}
                    className="border-[#D9D4CC]"
                    aria-invalid={!!fieldErrors.contactPerson}
                  />
                  <FieldError field="contactPerson" />
                </div>
              </div>

              {/* Mobile + Email */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[#2D2D2D]">Mobile *</Label>
                  <Input
                    id="school-mobile"
                    name="mobile"
                    type="tel"
                    autoComplete="tel"
                    inputMode="numeric"
                    placeholder="10-digit mobile"
                    value={form.mobile}
                    onChange={handleMobileInput}
                    onBlur={() => markTouched("mobile")}
                    className="border-[#D9D4CC]"
                    aria-invalid={!!fieldErrors.mobile}
                  />
                  <FieldError field="mobile" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#2D2D2D]">Email</Label>
                  <Input
                    id="school-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    onBlur={() => markTouched("email")}
                    className="border-[#D9D4CC]"
                    aria-invalid={!!fieldErrors.email}
                  />
                  <FieldError field="email" />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label className="text-[#2D2D2D]">Address *</Label>
                <Input
                  id="school-address"
                  name="address"
                  autoComplete="street-address"
                  value={form.address}
                  onChange={(e) => update("address", e.target.value)}
                  onBlur={() => markTouched("address")}
                  className="border-[#D9D4CC]"
                  aria-invalid={!!fieldErrors.address}
                />
                <FieldError field="address" />
              </div>

              {/* State + District */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[#2D2D2D]">State *</Label>
                  <select
                    id="school-state"
                    name="state"
                    autoComplete="address-level1"
                    value={form.state}
                    onChange={(e) => {
                      update("state", e.target.value);
                      markTouched("state");
                    }}
                    onBlur={() => markTouched("state")}
                    className={SELECT_CLASS}
                    aria-invalid={!!fieldErrors.state}
                  >
                    <option value="">Select state</option>
                    {ALL_STATE_NAMES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <FieldError field="state" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#2D2D2D]">District *</Label>
                  <select
                    id="school-district"
                    name="district"
                    autoComplete="off"
                    value={form.district}
                    onChange={(e) => {
                      update("district", e.target.value);
                      markTouched("district");
                    }}
                    onBlur={() => markTouched("district")}
                    className={SELECT_CLASS}
                    aria-invalid={!!fieldErrors.district}
                  >
                    <option value="">Select district</option>
                    {availableDistricts.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                  <FieldError field="district" />
                </div>
              </div>

              {/* City + PIN Code */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[#2D2D2D]">City *</Label>
                  <Input
                    id="school-city"
                    name="city"
                    autoComplete="address-level2"
                    value={form.city}
                    onChange={(e) => update("city", e.target.value)}
                    onBlur={() => markTouched("city")}
                    className="border-[#D9D4CC]"
                    aria-invalid={!!fieldErrors.city}
                  />
                  <FieldError field="city" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#2D2D2D]">PIN Code *</Label>
                  <Input
                    id="school-pincode"
                    name="pinCode"
                    type="text"
                    autoComplete="postal-code"
                    inputMode="numeric"
                    placeholder="6-digit PIN"
                    value={form.pinCode}
                    onChange={handlePinInput}
                    onBlur={() => markTouched("pinCode")}
                    className="border-[#D9D4CC]"
                    aria-invalid={!!fieldErrors.pinCode}
                  />
                  <FieldError field="pinCode" />

                </div>
              </div>

              {/* Password + Confirm Password */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[#2D2D2D]">Password *</Label>
                  <div className="relative">
                    <Input
                      id="school-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={form.password}
                      onChange={(e) => update("password", e.target.value)}
                      onBlur={() => markTouched("password")}
                      className="border-[#D9D4CC] pr-10"
                      aria-invalid={!!fieldErrors.password}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9B9590]"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <FieldError field="password" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#2D2D2D]">Confirm Password *</Label>
                  <Input
                    id="school-confirm-password"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    value={form.confirmPassword}
                    onChange={(e) => update("confirmPassword", e.target.value)}
                    onBlur={() => markTouched("confirmPassword")}
                    className="border-[#D9D4CC]"
                    aria-invalid={!!fieldErrors.confirmPassword}
                  />
                  <FieldError field="confirmPassword" />
                </div>
              </div>

              {/* Global error block */}
              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-xs text-red-600">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-[#2D2D2D] hover:bg-[#1D1D1D] text-white h-10"
                disabled={isPending}
              >
                {isPending ? "Registering..." : "Register School"}
              </Button>
            </form>

            <div className="mt-4 pt-4 border-t border-[#E8E4E0] text-center">
              <p className="text-xs text-[#9B9590]">
                Already registered?{" "}
                <Link
                  to="/school/login"
                  className="text-[#8B8680] hover:text-[#2D2D2D] font-medium"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}