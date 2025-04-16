import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Container, Heading } from "../../router";
import { selectUser } from "../../redux/features/authSlice";
import { FaCloudUploadAlt, FaMoneyBillWave, FaHistory } from "react-icons/fa";
import { Loader } from "../../components/common/Loader";

export const BalanceRequest = () => {
  const user = useSelector(selectUser);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [requests, setRequests] = useState([]);
  const [formData, setFormData] = useState({
    amount: "",
    paymentMethod: "bank_transfer",
    transactionId: "",
    notes: "",
  });
  const [showLoader, setShowLoader] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "amount" ? (value === "" ? "" : Number(value)) : value,
    });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (!selectedFile) {
      return;
    }
    
    // Check file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }
    
    // Check file type
    const fileType = selectedFile.type;
    if (!["image/jpeg", "image/jpg", "image/png"].includes(fileType)) {
      toast.error("Only JPEG, JPG and PNG files are allowed");
      return;
    }
    
    setFile(selectedFile);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (formData.amount <= 0) {
      toast.error("Amount must be greater than 0");
      return;
    }
    
    if (!file) {
      toast.error("Please upload proof of payment");
      return;
    }
    
    if (!formData.transactionId.trim()) {
      toast.error("Transaction ID is required");
      return;
    }
    
    try {
      setIsLoading(true);
      setShowLoader(true);
      
      // Log the current URL for debugging
      console.log("Current page URL:", window.location.href);
      
      // Create form data to send
      const requestFormData = new FormData();
      requestFormData.append("amount", formData.amount);
      requestFormData.append("paymentMethod", formData.paymentMethod);
      requestFormData.append("transactionId", formData.transactionId);
      requestFormData.append("notes", formData.notes);
      requestFormData.append("proofImage", file);
      
      // Log the API request URL
      const apiUrl = "http://localhost:5000/api/balance/request";
      console.log("API Request URL:", apiUrl);
      
      // Send request using fetch
      const response = await fetch(apiUrl, {
        method: "POST",
        body: requestFormData,
        credentials: "include",
        headers: {
          "Authorization": `Bearer ${user?.token}`
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setIsCompleted(true);
        toast.success("Balance request submitted successfully");
        // Reset form
        setFormData({
          amount: "",
          paymentMethod: "bank_transfer",
          transactionId: "",
          notes: "",
        });
        setFile(null);
        setPreviewUrl("");
        // Reload requests
        fetchBalanceRequests();
      } else {
        toast.error(data.message || "Failed to submit balance request");
      }
    } catch (error) {
      console.error("Error submitting balance request:", error);
      toast.error("Failed to submit balance request. Please try again.");
    } finally {
      setIsLoading(false);
      // Hide loader after 1.5 seconds if completed
      if (isCompleted) {
        setTimeout(() => {
          setShowLoader(false);
          setIsCompleted(false);
        }, 1500);
      } else {
        setShowLoader(false);
      }
    }
  };

  const fetchBalanceRequests = async () => {
    if (!user) return;
    
    try {
      setIsHistoryLoading(true);
      
      const apiUrl = "http://localhost:5000/api/balance/requests";
      console.log("Fetching balance requests from:", apiUrl);
      
      const response = await fetch(apiUrl, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`
        }
      });
      
      const data = await response.json();
      console.log("Balance requests response:", data);
      
      if (response.ok) {
        // The backend directly returns an array of balance requests, not nested under a 'requests' property
        setRequests(Array.isArray(data) ? data : []);
      } else {
        console.error("Failed to fetch balance requests:", data.message);
      }
    } catch (error) {
      console.error("Error fetching balance requests:", error);
    } finally {
      setIsHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBalanceRequests();
    }
  }, [user]);

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "text-green";
      case "rejected":
        return "text-red-600";
      default:
        return "text-yellow-600";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <Container>
      {showLoader && (
        <Loader 
          message="Submitting your balance request..." 
          isCompleted={isCompleted}
          completedMessage="Balance request submitted successfully!"
        />
      )}
      <div className="py-6">
        <Heading
          title="Balance Request"
          subtitle="Request to add funds to your account balance"
        />

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {/* Request Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <FaMoneyBillWave className="text-green text-xl mr-2" />
              <h2 className="text-xl font-semibold">Request Balance</h2>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
                  Amount ($) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-green"
                  placeholder="Enter amount"
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="paymentMethod">
                  Payment Method <span className="text-red-500">*</span>
                </label>
                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-green"
                  required
                >
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="credit_card">Credit Card</option>
                  <option value="paypal">UPI</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="transactionId">
                  Transaction ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="transactionId"
                  name="transactionId"
                  value={formData.transactionId}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-green"
                  placeholder="Enter transaction ID"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="notes">
                  Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-green"
                  placeholder="Additional information"
                  rows="3"
                ></textarea>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="proofOfPayment">
                  Proof of Payment <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    {!previewUrl ? (
                      <>
                        <FaCloudUploadAlt className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="proofOfPayment"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-green hover:text-green-dark focus-within:outline-none"
                          >
                            <span>Upload a file</span>
                            <input
                              id="proofOfPayment"
                              name="proofOfPayment"
                              type="file"
                              className="sr-only"
                              onChange={handleFileChange}
                              accept="image/jpeg,image/jpg,image/png"
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 5MB</p>
                      </>
                    ) : (
                      <div className="relative">
                        <img
                          src={previewUrl}
                          alt="Proof of payment"
                          className="mx-auto h-32 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setFile(null);
                            setPreviewUrl("");
                          }}
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end">
                <button
                  type="submit"
                  className="bg-green hover:bg-opacity-90 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="inline-block h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Processing...
                    </>
                  ) : (
                    <>Submit Request</>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Request History */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <FaHistory className="text-green text-xl mr-2" />
              <h2 className="text-xl font-semibold">Request History</h2>
            </div>

            {isHistoryLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green"></div>
              </div>
            ) : requests.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <p>No balance requests found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Date
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Amount
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {requests.map((request) => (
                      <tr key={request._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(request.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ${request.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`${getStatusColor(
                              request.status
                            )} text-sm font-medium`}
                          >
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}; 