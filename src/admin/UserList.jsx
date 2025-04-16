import { NavLink } from "react-router-dom";
import { Title, ProfileCard, DateFormatter } from "../router";
import { TiEyeOutline } from "react-icons/ti";
import { useRedirectLoggedOutUser } from "../hooks/useRedirectLoggedOutUser";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAllUser, deleteUser } from "../redux/features/authSlice";
import { FaTimes, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

export const UserList = () => {
    useRedirectLoggedOutUser("/login");
    const { users, isLoading } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;
    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
  
    useEffect(() => {
      dispatch(getAllUser());
    }, [dispatch]);

    // Calculate pagination values
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(users.length / usersPerPage);

    // Handle page change
    const handlePageChange = (pageNumber) => {
      setCurrentPage(pageNumber);
    };

    // Handle modal
    const openModal = (user) => {
      setSelectedUser(user);
      setShowModal(true);
    };

    const closeModal = () => {
      setSelectedUser(null);
      setShowModal(false);
    };

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString() + " " + date.toLocaleTimeString();
    };

    const handleDeleteClick = (user) => {
        setUserToDelete(user);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await dispatch(deleteUser(userToDelete._id)).unwrap();
            setShowDeleteModal(false);
            setUserToDelete(null);
        } catch (error) {
            toast.error(error.message || "Failed to delete user");
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
        setUserToDelete(null);
    };

    return (
    <section className="shadow-s1 p-8 rounded-lg">
      <div className="flex justify-between">
        <Title level={5} className="font-normal">
          User Lists
        </Title>
      </div>
      <hr className="my-5" />
      <div className="relative overflow-x-auto rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              <th scope="col" className="px-6 py-5">
                S.N
              </th>
              <th scope="col" className="px-6 py-5">
                Username
              </th>
              <th scope="col" className="px-6 py-5">
                Email
              </th>
              <th scope="col" className="px-6 py-5">
                Role
              </th>
              <th scope="col" className="px-6 py-5">
                Photo
              </th>
              <th scope="col" className="px-6 py-3">
                Date
              </th>
              <th scope="col" className="px-6 py-3 flex justify-end">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
          {currentUsers.map((user, index) => (
            <tr className="bg-white border-b hover:bg-gray-50" key={index}>
              <td className="px-6 py-4">{indexOfFirstUser + index + 1}</td>
              <td className="px-6 py-4 capitalize">{user?.name}</td>
              <td className="px-6 py-4">{user?.email}</td>
              <td className="px-6 py-4 capitalize">{user?.role}</td>
              <td className="px-6 py-4">
                <ProfileCard>
                  <img src={user?.photo} alt={user?.name} />
                </ProfileCard>
              </td>
              <td className="px-6 py-4">
                <DateFormatter date={user?.createdAt} />
              </td>
              <td className="py-4 flex justify-end px-8">
                <button 
                  onClick={() => openModal(user)}
                  className="font-medium text-indigo-500 hover:text-indigo-700"
                >
                  <TiEyeOutline size={25} />
                </button>
                <button
                  onClick={() => handleDeleteClick(user)}
                  className="text-red-600 hover:text-red-900 ml-4"
                >
                  <FaTrash size={20} />
                </button>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md ${
              currentPage === 1
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-green text-white hover:bg-opacity-90"
            }`}
          >
            Previous
          </button>
          
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`px-4 py-2 rounded-md ${
                currentPage === index + 1
                  ? "bg-green text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-md ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-green text-white hover:bg-opacity-90"
            }`}
          >
            Next
          </button>
        </div>
      )}

      {/* User Details Modal */}
      {showModal && selectedUser && (
        <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        User Details
                      </h3>
                      <button
                        onClick={closeModal}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <FaTimes size={20} />
                      </button>
                    </div>

                    {/* Profile Photo Section */}
                    <div className="flex justify-center mb-6">
                      <div className="relative">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-green">
                          <img 
                            src={selectedUser.photo} 
                            alt={selectedUser.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Basic Information */}
                    <div className="mt-2 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="font-medium capitalize">{selectedUser.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Full Name</p>
                        <p className="font-medium capitalize">{selectedUser.fullName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{selectedUser.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Contact Number</p>
                        <p className="font-medium">{selectedUser.contactNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Role</p>
                        <p className="font-medium capitalize">{selectedUser.role}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <p className="font-medium capitalize">{selectedUser.status || "Active"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Date of Birth</p>
                        <p className="font-medium">{formatDate(selectedUser.dateOfBirth)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email Verified</p>
                        <p className="font-medium">{selectedUser.isVerified ? "Yes" : "No"}</p>
                      </div>
                    </div>

                    {/* Address Information */}
                    <div className="mt-6">
                      <h4 className="text-md font-medium text-gray-900 mb-3">Address Information</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Street Address</p>
                          <p className="font-medium">{selectedUser.streetAddress}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">City</p>
                          <p className="font-medium capitalize">{selectedUser.city}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">State</p>
                          <p className="font-medium capitalize">{selectedUser.state}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Postal Code</p>
                          <p className="font-medium">{selectedUser.postalCode}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Country</p>
                          <p className="font-medium capitalize">{selectedUser.country}</p>
                        </div>
                      </div>
                    </div>

                    {/* Financial Information */}
                    <div className="mt-6">
                      <h4 className="text-md font-medium text-gray-900 mb-3">Financial Information</h4>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Balance</p>
                          <p className="font-medium">${selectedUser.balance?.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Commission Balance</p>
                          <p className="font-medium">${selectedUser.commissionBalance?.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Pending Balance</p>
                          <p className="font-medium">${selectedUser.pendingBalance?.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Account Information */}
                    <div className="mt-6">
                      <h4 className="text-md font-medium text-gray-900 mb-3">Account Information</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Joined Date</p>
                          <p className="font-medium">{formatDate(selectedUser.createdAt)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Last Updated</p>
                          <p className="font-medium">{formatDate(selectedUser.updatedAt)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && userToDelete && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Confirm Delete</h3>
              <button
                onClick={handleDeleteCancel}
                className="text-gray-400 hover:text-gray-500"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-4">
              <p className="text-gray-600">
                Are you sure you want to delete user <span className="font-semibold">{userToDelete.name}</span>? This action cannot be undone.
              </p>
              <div className="mt-4 flex justify-end space-x-3">
                <button
                  onClick={handleDeleteCancel}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
