import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Container, Heading } from "../../router";
import { selectUser } from "../../redux/features/authSlice";
import { FaCheck, FaTimes, FaEye, FaFilter } from "react-icons/fa";

export const AdminBalanceRequests = () => {
  const user = useSelector(selectUser);
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterStatus, setFilterStatus] = useState("pending");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [processingId, setProcessingId] = useState(null);

  const fetchRequests = async (page = 1, status = filterStatus) => {
    try {
      setIsLoading(true);
      
      const response = await fetch(
        `http://localhost:5000/api/balance/admin/requests?page=${page}&limit=10&status=${status}`,
        {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user?.token}`
          }
        }
      );
      
      const data = await response.json();
      
      if (response.ok) {
        setRequests(data.balanceRequests || []);
        setTotalPages(data.totalPages || 1);
        setCurrentPage(data.currentPage || 1);
      } else {
        toast.error(data.message || "Failed to fetch balance requests");
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast.error("Failed to fetch balance requests");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === "admin") {
      fetchRequests();
    }
  }, [user]);

  const handleFilterChange = (status) => {
    setFilterStatus(status);
    fetchRequests(1, status);
  };

  const handlePageChange = (page) => {
    fetchRequests(page);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return <span className="px-2 py-1 bg-green text-green-800 rounded-full text-xs font-medium">Approved</span>;
      case "rejected":
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">Rejected</span>;
      default:
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">Pending</span>;
    }
  };

  const getPaymentMethod = (method) => {
    switch (method) {
      case "credit_card":
        return "Credit Card";
      case "bank_transfer":
        return "Bank Transfer";
      case "paypal":
        return "UPI";
      default:
        return "Other";
    }
  };

  const viewDetails = (request) => {
    setSelectedRequest(request);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedRequest(null);
    setAdminNotes("");
  };

  const processRequest = async (requestId, status) => {
    if (status === "rejected" && !adminNotes.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    
    try {
      setProcessingId(requestId);
      
      const response = await fetch(
        `http://localhost:5000/api/balance/admin/requests/${requestId}`,
        {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user?.token}`
          },
          body: JSON.stringify({
            status,
            adminNotes
          })
        }
      );
      
      const data = await response.json();
      
      if (response.ok) {
        toast.success(`Request ${status === "approved" ? "approved" : "rejected"} successfully`);
        fetchRequests();
        closeModal();
      } else {
        toast.error(data.message || "Failed to process request");
      }
    } catch (error) {
      console.error("Error processing request:", error);
      toast.error("Failed to process request");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <Container>
      <div className="py-6">
        <Heading
          title="Balance Requests Management"
          subtitle="Review and manage user balance funding requests"
        />
        
        <div className="mt-6 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b flex flex-wrap items-center justify-between">
            <div className="flex items-center mb-2 sm:mb-0">
              <FaFilter className="text-gray-500 mr-2" />
              <span className="text-sm font-medium text-gray-700 mr-2">Filter:</span>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleFilterChange("pending")}
                  className={`px-3 py-1 text-sm rounded-md ${
                    filterStatus === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => handleFilterChange("approved")}
                  className={`px-3 py-1 text-sm rounded-md ${
                    filterStatus === "approved"
                      ? "bg-green  text-green-800"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  Approved
                </button>
                <button
                  onClick={() => handleFilterChange("rejected")}
                  className={`px-3 py-1 text-sm rounded-md ${
                    filterStatus === "rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  Rejected
                </button>
                <button
                  onClick={() => handleFilterChange("all")}
                  className={`px-3 py-1 text-sm rounded-md ${
                    filterStatus === "all"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  All
                </button>
              </div>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green"></div>
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No {filterStatus !== "all" ? filterStatus : ""} balance requests found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment Method
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {requests.map((request) => (
                      <tr key={request._id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                              <img
                                src={request.user?.photo || "https://i.ibb.co/4pDNDk1/avatar.png"}
                                alt={request.user?.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">{request.user?.name}</div>
                              <div className="text-xs text-gray-500">{request.user?.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(request.createdAt)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ${request.amount?.toFixed(2)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {getPaymentMethod(request.paymentMethod)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {getStatusBadge(request.status)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button
                            onClick={() => viewDetails(request)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            <FaEye className="inline mr-1" /> View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {totalPages > 1 && (
                <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="flex-1 flex justify-center">
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                            currentPage === 1
                              ? "text-gray-300 cursor-not-allowed"
                              : "text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          Previous
                        </button>
                        
                        {[...Array(totalPages)].map((_, index) => (
                          <button
                            key={index + 1}
                            onClick={() => handlePageChange(index + 1)}
                            className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                              currentPage === index + 1
                                ? "z-10 bg-green-50 border-green-500 text-green-600"
                                : "text-gray-500 hover:bg-gray-50"
                            }`}
                          >
                            {index + 1}
                          </button>
                        ))}
                        
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                            currentPage === totalPages
                              ? "text-gray-300 cursor-not-allowed"
                              : "text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          Next
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      
      {/* Modal for request details */}
      {modalOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
              onClick={closeModal}
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      Balance Request Details
                    </h3>
                    
                    <div className="mt-2 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">User</p>
                        <p className="font-medium">{selectedRequest.user?.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Amount</p>
                        <p className="font-medium">${selectedRequest.amount?.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Payment Method</p>
                        <p className="font-medium">{getPaymentMethod(selectedRequest.paymentMethod)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Transaction ID</p>
                        <p className="font-medium">{selectedRequest.transactionId}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="font-medium">{formatDate(selectedRequest.createdAt)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <p className="font-medium">{getStatusBadge(selectedRequest.status)}</p>
                      </div>
                    </div>
                    
                    {selectedRequest.notes && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-500">User Notes</p>
                        <p className="text-sm bg-gray-50 p-2 rounded">{selectedRequest.notes}</p>
                      </div>
                    )}
                    
                    {selectedRequest.proofOfPayment?.filePath && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-500 mb-1">Proof of Payment</p>
                        <div className="bg-gray-100 rounded-md overflow-hidden flex justify-center items-center">
                          <a href={selectedRequest.proofOfPayment.filePath} target="_blank" rel="noopener noreferrer" className="flex justify-center">
                            <img 
                              src={selectedRequest.proofOfPayment.filePath} 
                              alt="Proof of payment" 
                              className="max-h-48 object-contain"
                            />
                          </a>
                        </div>
                      </div>
                    )}
                    
                    {selectedRequest.status === "pending" && (
                      <div className="mt-4">
                        <label htmlFor="adminNotes" className="block text-sm font-medium text-gray-700 mb-1">
                          Admin Notes {selectedRequest.status === "rejected" && <span className="text-red-500">*</span>}
                        </label>
                        <textarea
                          id="adminNotes"
                          name="adminNotes"
                          rows="3"
                          className="shadow-sm focus:ring-green focus:border-green block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                          placeholder="Add notes (required for rejection)"
                          value={adminNotes}
                          onChange={(e) => setAdminNotes(e.target.value)}
                        ></textarea>
                      </div>
                    )}
                    
                    {selectedRequest.adminNotes && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-500">Admin Notes</p>
                        <p className="text-sm bg-gray-50 p-2 rounded">{selectedRequest.adminNotes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                {selectedRequest.status === "pending" ? (
                  <>
                    <button
                      type="button"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green text-base font-medium text-white hover:bg-opacity-90 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={() => processRequest(selectedRequest._id, "approved")}
                      disabled={processingId === selectedRequest._id}
                    >
                      {processingId === selectedRequest._id ? (
                        <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                      ) : (
                        <FaCheck className="mr-1" />
                      )}
                      Approve
                    </button>
                    <button
                      type="button"
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={() => processRequest(selectedRequest._id, "rejected")}
                      disabled={processingId === selectedRequest._id}
                    >
                      {processingId === selectedRequest._id ? (
                        <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                      ) : (
                        <FaTimes className="mr-1" />
                      )}
                      Reject
                    </button>
                  </>
                ) : null}
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}; 