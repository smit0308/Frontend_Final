import React, { useEffect, useState } from "react";
import { Caption, Title } from "../../router";
import { commonClassNameOfInput, PrimaryButton } from "../../components/common/Design";
import { useRedirectLoggedOutUser } from "../../hooks/useRedirectLoggedOutUser";
import { useDispatch, useSelector } from "react-redux";
import { getuserProfile, updateUser } from "../../redux/features/authSlice";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { FaWallet } from "react-icons/fa";

export const UserProfile = () => {
  useRedirectLoggedOutUser("/login");
  const { user, isLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    fullName: "",
    email: "",
    contactNumber: "",
    streetAddress: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    dateOfBirth: "",
  });

  useEffect(() => {
    dispatch(getuserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        fullName: user.fullName || "",
        email: user.email || "",
        contactNumber: user.contactNumber || "",
        streetAddress: user.streetAddress || "",
        city: user.city || "",
        state: user.state || "",
        postalCode: user.postalCode || "",
        country: user.country || "",
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : "",
      });
      setImagePreview(user.photo);
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
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

      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const submitData = new FormData();
      // Only append fields that have changed
      Object.keys(formData).forEach(key => {
        if (formData[key] !== user[key] && formData[key] !== "") {
          submitData.append(key, formData[key]);
        }
      });
      
      if (profileImage) {
        submitData.append("photo", profileImage);
      }

      await dispatch(updateUser(submitData));
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <>
      <section className="shadow-s1 p-8 rounded-lg">
        <div className="profile flex items-center gap-8 mb-8">
          <div className="relative">
            <img 
              src={imagePreview || user?.photo} 
              alt={user?.name} 
              className="w-24 h-24 rounded-full object-cover border-4 border-green"
            />
            <label htmlFor="photo" className="absolute bottom-0 right-0 bg-green text-white p-2 rounded-full cursor-pointer hover:bg-opacity-90">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </label>
          </div>
          <div>
            <Title level={5} className="capitalize">
              {user?.name}
            </Title>
            <Caption>{user?.email}</Caption>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="file"
            id="photo"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Caption className="mb-2">Username *</Caption>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={commonClassNameOfInput}
                placeholder="Username"
                required
              />
            </div>

            <div>
              <Caption className="mb-2">Full Name *</Caption>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className={commonClassNameOfInput}
                placeholder="Full Name"
                required
              />
            </div>

            <div>
              <Caption className="mb-2">Email *</Caption>
              <input
                type="email"
                name="email"
                value={formData.email}
                className={commonClassNameOfInput}
                placeholder="Email"
                disabled
              />
            </div>

            <div>
              <Caption className="mb-2">Contact Number *</Caption>
              <input
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleInputChange}
                className={commonClassNameOfInput}
                placeholder="10-digit contact number"
                required
              />
            </div>

            <div>
              <Caption className="mb-2">Street Address *</Caption>
              <input
                type="text"
                name="streetAddress"
                value={formData.streetAddress}
                onChange={handleInputChange}
                className={commonClassNameOfInput}
                placeholder="House number, building name, street name"
                required
              />
            </div>

            <div>
              <Caption className="mb-2">City *</Caption>
              <input
                type="text"
                name="city"
                value={formData.city}
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
                value={formData.state}
                onChange={handleInputChange}
                className={commonClassNameOfInput}
                placeholder="State"
                required
              />
            </div>

            <div>
              <Caption className="mb-2">Postal Code *</Caption>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
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
                value={formData.country}
                onChange={handleInputChange}
                className={commonClassNameOfInput}
                placeholder="Country"
                required
              />
            </div>

            <div>
              <Caption className="mb-2">Date of Birth *</Caption>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                className={commonClassNameOfInput}
                required
              />
            </div>
          </div>

          <div className="mt-8">
            <PrimaryButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Profile"}
            </PrimaryButton>
          </div>
        </form>

        <div className="mt-8">
          <Link
            to="/account/balance"
            className="flex items-center gap-2 px-4 py-2 text-gray-700 rounded-md hover:bg-green hover:text-white transition duration-300"
          >
            <FaWallet />
            <span>Account Balance</span>
          </Link>
        </div>
      </section>
    </>
  );
};
