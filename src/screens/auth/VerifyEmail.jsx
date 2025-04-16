import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Caption, Container, Loader, PrimaryButton, Title } from "../../router";
import { commonClassNameOfInput } from "../../components/common/Design";
import { toast } from 'react-toastify';
import axios from "axios";

export const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("Attempting verification with:", { email: formData.email, token });
      const response = await axios.post(`/api/users/verify-email/${token}`, formData);
      console.log("Verification response:", response.data);
      
      if (response.data.success) {
        toast.success("Email verified successfully!");
        navigate("/login");
      }
    } catch (error) {
      console.error("Verification error:", error.response?.data || error);
      const errorMessage = error.response?.data?.message || "Verification failed";
      toast.error(errorMessage);
      
      // Show more specific error messages
      if (errorMessage.includes("expired")) {
        toast.error("Verification link has expired. Please request a new one.");
      } else if (errorMessage.includes("Email does not match")) {
        toast.error("The email you entered doesn't match the one used for registration.");
      } else if (errorMessage.includes("Invalid password")) {
        toast.error("Incorrect password. Please try again.");
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="verify-email pt-16 relative">
      <div className="bg-green w-96 h-96 rounded-full opacity-20 blur-3xl absolute top-2/3"></div>
      <div className="bg-[#241C37] pt-8 h-[40vh] relative content">
        <Container>
          <div>
            <Title level={3} className="text-white">
              Verify Your Email
            </Title>
            <div className="flex items-center gap-3">
              <Title level={5} className="text-green font-normal text-xl">
                Home
              </Title>
              <Title level={5} className="text-white font-normal text-xl">
                /
              </Title>
              <Title level={5} className="text-white font-normal text-xl">
                Verify Email
              </Title>
            </div>
          </div>
        </Container>
      </div>
      <form onSubmit={handleVerify} className="bg-white shadow-s3 w-1/3 m-auto my-16 p-8 rounded-xl">
        <div className="text-center">
          <Title level={5}>Verify Your Email</Title>
          <p className="mt-2 text-lg">
            Please enter your email and password to verify your account
          </p>
        </div>
        <div className="py-5">
          <Caption className="mb-2">Email *</Caption>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={commonClassNameOfInput}
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="py-5">
          <Caption className="mb-2">Password *</Caption>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className={commonClassNameOfInput}
            placeholder="Enter your password"
            required
          />
        </div>
        <PrimaryButton className="w-full rounded-none my-5" disabled={isLoading}>
          {isLoading ? "Verifying..." : "VERIFY EMAIL"}
        </PrimaryButton>
      </form>
      <div className="bg-green w-96 h-96 rounded-full opacity-20 blur-3xl absolute bottom-96 right-0"></div>
    </section>
  );
}; 