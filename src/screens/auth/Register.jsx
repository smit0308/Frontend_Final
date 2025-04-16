import { FaFacebook, FaGoogle } from "react-icons/fa";
import { Caption, Container, CustomNavLink, Loader, PrimaryButton, Title } from "../../router";
import { commonClassNameOfInput } from "../../components/common/Design";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { register, RESET } from "../../redux/features/authSlice";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const initialState = {
  name: "",
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  contactNumber: "",
  streetAddress: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
  dateOfBirth: "",
  photo: null
};

export const Register = () => {
  const dipatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialState);
  const [previewImage, setPreviewImage] = useState(null);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const {
    name, 
    fullName, 
    email, 
    password, 
    confirmPassword, 
    contactNumber, 
    streetAddress,
    city,
    state,
    postalCode,
    country,
    dateOfBirth, 
    photo
  } = formData;
  const {isLoading, isSuccess, isLoggedIn, message, isError}  = useSelector(state => state.auth);

  const handleInputChange = (e) =>{
    const {name, value} = e.target;
    setFormData({...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error("Please upload an image file");
        return;
      }

      setFormData({...formData, photo: file});
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();

    // Debug log to check all field values
    console.log("Form Data:", {
      name,
      fullName,
      email,
      password,
      confirmPassword,
      contactNumber,
      streetAddress,
      city,
      state,
      postalCode,
      country,
      dateOfBirth
    });

    // Check each field individually
    const requiredFields = {
      name: "Username",
      fullName: "Full Name",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm Password",
      contactNumber: "Contact Number",
      streetAddress: "Street Address",
      city: "City",
      state: "State",
      postalCode: "Postal Code",
      country: "Country",
      dateOfBirth: "Date of Birth"
    };

    // Check for empty fields and show specific error
    for (const [field, fieldName] of Object.entries(requiredFields)) {
      if (!formData[field] || formData[field].trim() === "") {
        return toast.error(`${fieldName} is required!`);
      }
    }

    // Validate password length
    if (password.length < 8) {
      return toast.error("Password must be at least 8 characters");
    }

    // Validate password match
    if (password !== confirmPassword) {
      return toast.error("Password doesn't match!");
    }

    // Validate contact number
    if (!/^[0-9]{10}$/.test(contactNumber)) {
      return toast.error("Please enter a valid 10-digit contact number");
    }

    // Validate postal code
    if (!/^[0-9]{6}$/.test(postalCode)) {
      return toast.error("Please enter a valid 6-digit postal code");
    }

    // If all validations pass, create FormData and submit
    const formDataToSubmit = new FormData();
    formDataToSubmit.append("name", name.trim());
    formDataToSubmit.append("fullName", fullName.trim());
    formDataToSubmit.append("email", email.trim());
    formDataToSubmit.append("password", password);
    formDataToSubmit.append("contactNumber", contactNumber.trim());
    formDataToSubmit.append("streetAddress", streetAddress.trim());
    formDataToSubmit.append("city", city.trim());
    formDataToSubmit.append("state", state.trim());
    formDataToSubmit.append("postalCode", postalCode.trim());
    formDataToSubmit.append("country", country.trim());
    formDataToSubmit.append("dateOfBirth", dateOfBirth);

    if (photo) {
      formDataToSubmit.append("photo", photo);
    }

    // Debug log before submission
    console.log("Submitting registration...");
    dipatch(register(formDataToSubmit));
  };

  useEffect(() => {
    if (isSuccess && isLoggedIn) {
      setRegistrationComplete(true);
      setTimeout(() => {
        // toast.success("Registration Successful! Please check your email to verify your account.");
        navigate("/");
      }, 1500);
    }
    if (isError) {
      toast.error(message || "Registration Failed");
    }

    return () => {
      dipatch(RESET());
    }
  }, [dipatch, isLoggedIn, isSuccess, isError, message, navigate]);

  return (
    <>
      {(isLoading || registrationComplete) && (
        <Loader 
          message="Creating your account and sending verification email..." 
          isCompleted={registrationComplete}
          completedMessage="Registration Complete! Redirecting..."
        />
      )}
      <section className="regsiter pt-16 relative">
        <div className="bg-green w-96 h-96 rounded-full opacity-20 blur-3xl absolute top-2/3"></div>
        <div className="bg-[#241C37] pt-8 h-[40vh] relative content">
          <Container>
            <div>
              <Title level={3} className="text-white">
                Sign Up
              </Title>
              <div className="flex items-center gap-3">
                <Title level={5} className="text-green font-normal text-xl">
                  Home
                </Title>
                <Title level={5} className="text-white font-normal text-xl">
                  /
                </Title>
                <Title level={5} className="text-white font-normal text-xl">
                  Sign Up
                </Title>
              </div>
            </div>
          </Container>
        </div>
        <form onSubmit={handleRegister} className="bg-white shadow-s3 w-1/3 m-auto my-16 p-8 rounded-xl">
          <div className="text-center">
            <Title level={5}>Sign Up</Title>
            <p className="mt-2 text-lg">
              Do you already have an account? <CustomNavLink href="/login">Log In Here</CustomNavLink>
            </p>
          </div>

          {/* Profile Picture Upload */}
          <div className="text-center mb-6">
            <div className="relative inline-block">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 mx-auto mb-4">
                {previewImage ? (
                  <img 
                    src={previewImage} 
                    alt="Profile Preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img 
                    src="https://cdn-icons-png.flaticon.com/512/2202/2202112.png" 
                    alt="Default Profile" 
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <label 
                htmlFor="photo-upload" 
                className="absolute bottom-0 right-0 bg-green text-white p-2 rounded-full cursor-pointer hover:bg-green-600 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </label>
              <input
                type="file"
                id="photo-upload"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
            <p className="text-sm text-gray-500">Click the camera icon to upload your profile picture</p>
          </div>

          <div className="py-5">
            <Caption className="mb-2">Username *</Caption>
            <input type="text" name="name" value={name} onChange={handleInputChange} className={commonClassNameOfInput} placeholder="Username" required />
          </div>
          <div className="py-5">
            <Caption className="mb-2">Full Name *</Caption>
            <input type="text" name="fullName" value={fullName} onChange={handleInputChange} className={commonClassNameOfInput} placeholder="Full Name" required />
          </div>
          <div className="py-5">
            <Caption className="mb-2">Enter Your Email *</Caption>
            <input type="email" name="email" value={email} onChange={handleInputChange} className={commonClassNameOfInput} placeholder="Enter Your Email" required />
          </div>
          <div className="py-5">
            <Caption className="mb-2">Contact Number *</Caption>
            <input type="tel" name="contactNumber" value={contactNumber} onChange={handleInputChange} className={commonClassNameOfInput} placeholder="10-digit contact number" required />
          </div>

          {/* Address Section */}
          <div className="py-5">
            <Caption className="mb-2">Street Address *</Caption>
            <input 
              type="text" 
              name="streetAddress" 
              value={streetAddress} 
              onChange={handleInputChange} 
              className={commonClassNameOfInput} 
              placeholder="House number, building name, street name" 
              required 
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Caption className="mb-2">City *</Caption>
              <input 
                type="text" 
                name="city" 
                value={city} 
                onChange={handleInputChange} 
                className={commonClassNameOfInput} 
                placeholder="City" 
                required 
              />
            </div>
            <div>
              <Caption className="mb-2">State *</Caption>
              <input 
                type="text" 
                name="state" 
                value={state} 
                onChange={handleInputChange} 
                className={commonClassNameOfInput} 
                placeholder="State" 
                required 
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <Caption className="mb-2">Postal Code *</Caption>
              <input 
                type="text" 
                name="postalCode" 
                value={postalCode} 
                onChange={handleInputChange} 
                className={commonClassNameOfInput} 
                placeholder="6-digit postal code" 
                required 
              />
            </div>
            <div>
              <Caption className="mb-2">Country *</Caption>
              <input 
                type="text" 
                name="country" 
                value={country} 
                onChange={handleInputChange} 
                className={commonClassNameOfInput} 
                placeholder="Country" 
                required 
              />
            </div>
          </div>

          <div className="py-5">
            <Caption className="mb-2">Date of Birth *</Caption>
            <input type="date" name="dateOfBirth" value={dateOfBirth} onChange={handleInputChange} className={commonClassNameOfInput} required />
          </div>
          <div>
            <Caption className="mb-2">Password *</Caption>
            <input type="password" name="password" value={password} onChange={handleInputChange} className={commonClassNameOfInput} placeholder="Enter Your Password" required />
          </div>
          <br />
          <div>
            <Caption className="mb-2 block">Confirm Password *</Caption>
            <input type="password" name="confirmPassword" value={confirmPassword} onChange={handleInputChange} className={commonClassNameOfInput} placeholder="Confirm password" />
          </div>
          <div className="flex items-center gap-2 py-4">
            <input type="checkbox" />
            <Caption>I agree to the Terms & Policy</Caption>
          </div>
          <PrimaryButton className="w-full rounded-none my-5 ">CREATE ACCOUNT</PrimaryButton>
          <div className="text-center border py-4 rounded-lg mt-4">
            <Title>OR SIGNUP WITH</Title>
            <div className="flex items-center justify-center gap-5 mt-5">
              <button className="flex items-center gap-2 bg-red-500 text-white p-3 px-5 rounded-sm">
                <FaGoogle />
                <p className="text-sm">SIGNUP WHIT GOOGLE</p>
              </button>
              <button className="flex items-center gap-2 bg-indigo-500 text-white p-3 px-5 rounded-sm">
                <FaFacebook />
                <p className="text-sm">SIGNUP WHIT FACEBOOK</p>
              </button>
            </div>
          </div>
          <p className="text-center mt-5">
            By clicking the signup button, you create a Cobiro account, and you agree to Cobiros <span className="text-green underline">Terms & Conditions</span> &
            <span className="text-green underline"> Privacy Policy </span> .
          </p>
        </form>
        <div className="bg-green w-96 h-96 rounded-full opacity-20 blur-3xl absolute bottom-96 right-0"></div>
      </section>
    </>
  );
};
