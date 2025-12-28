import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Send, CheckCircle, Clock, AlertCircle, XCircle, RefreshCw } from 'lucide-react';
import { API_ENDPOINTS } from '../../config/api';

/**
 * SubmitGradesModal Component
 * 
 * Modal for submitting grades to registrar for review.
 * Shows submission status for each quarter and allows submission
 * when all students have complete grades for that quarter.
 * 
 * @param {boolean} isOpen - Whether the modal is open
 * @param {function} onClose - Callback to close the modal
 * @param {object} classData - Class/section data
 */
export default function SubmitGradesModal({ isOpen, onClose, classData }) {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [statusData, setStatusData] = useState(null);
  const [selectedQuarter, setSelectedQuarter] = useState(null);
  const [teacherNotes, setTeacherNotes] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  // Fetch submission status when modal opens
  useEffect(() => {
    if (isOpen && classData?.id) {
      fetchSubmissionStatus();
    }
  }, [isOpen, classData]);

  const fetchSubmissionStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(
        `${API_ENDPOINTS.GET_SUBMISSION_STATUS}?sectionId=${classData.id}`,
        { withCredentials: true }
      );
      
      if (response.data.success) {
        setStatusData(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch submission status');
      }
    } catch (err) {
      console.error('Error fetching submission status:', err);
      setError('Error loading submission status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitGrades = async () => {
    if (!selectedQuarter) return;
    
    try {
      setSubmitting(true);
      setError(null);
      
      const response = await axios.post(
        API_ENDPOINTS.SUBMIT_GRADES_TO_REGISTRAR,
        {
          sectionId: classData.id,
          quarter: selectedQuarter,
          notes: teacherNotes
        },
        { withCredentials: true }
      );
      
      if (response.data.success) {
        // Refresh status
        await fetchSubmissionStatus();
        setShowConfirm(false);
        setSelectedQuarter(null);
        setTeacherNotes('');
        alert(response.data.message);
      } else {
        setError(response.data.message || 'Failed to submit grades');
      }
    } catch (err) {
      console.error('Error submitting grades:', err);
      setError(err.response?.data?.message || 'Error submitting grades. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'Submitted':
      case 'Resubmitted':
        return <Clock className="w-5 h-5 text-amber-500" />;
      case 'Rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      'Approved': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      'Submitted': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
      'Resubmitted': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      'Rejected': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      'Draft': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status] || styles['Draft']}`}>
        {status}
      </span>
    );
  };

  const getQuarterLabel = (key) => {
    const labels = {
      'q1': '1st Quarter',
      'q2': '2nd Quarter',
      'q3': '3rd Quarter',
      'q4': '4th Quarter'
    };
    return labels[key] || key;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-amber-300 dark:bg-amber-600 px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Submit Grades to Registrar
            </h2>
            <p className="text-sm text-gray-700 dark:text-gray-200 mt-1">
              {classData?.grade} - {classData?.section}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-400"></div>
              <span className="ml-3 text-gray-600 dark:text-gray-400">Loading submission status...</span>
            </div>
          ) : error ? (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-700 dark:text-red-400">{error}</p>
              <button
                onClick={fetchSubmissionStatus}
                className="mt-2 text-sm text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
              >
                <RefreshCw className="w-4 h-4" /> Try again
              </button>
            </div>
          ) : showConfirm ? (
            // Confirmation view
            <div className="space-y-4">
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <h3 className="font-semibold text-amber-800 dark:text-amber-400 mb-2">
                  Confirm Submission
                </h3>
                <p className="text-amber-700 dark:text-amber-300 text-sm">
                  You are about to submit <strong>{getQuarterLabel(selectedQuarter)}</strong> grades 
                  for <strong>{statusData?.totalStudents} students</strong> to the registrar for review.
                </p>
                <p className="text-amber-600 dark:text-amber-400 text-xs mt-2">
                  Once submitted, grades cannot be modified until reviewed by the registrar.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notes for Registrar (Optional)
                </label>
                <textarea
                  value={teacherNotes}
                  onChange={(e) => setTeacherNotes(e.target.value)}
                  placeholder="Add any notes or comments about this submission..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowConfirm(false);
                    setSelectedQuarter(null);
                    setTeacherNotes('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 
                           text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 
                           dark:hover:bg-gray-700 transition-colors"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitGrades}
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-amber-400 hover:bg-amber-500 text-gray-900 
                           rounded-lg font-medium transition-colors flex items-center justify-center gap-2
                           disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit Grades
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            // Status view
            <div className="space-y-4">
              {/* Summary */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Students: <span className="font-semibold text-gray-900 dark:text-white">{statusData?.totalStudents || 0}</span>
                </p>
              </div>

              {/* Quarter Status List */}
              <div className="space-y-3">
                {statusData?.quarters && Object.entries(statusData.quarters).map(([key, quarter]) => (
                  <div 
                    key={key}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(quarter.submissionStatus)}
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {getQuarterLabel(key)}
                        </span>
                      </div>
                      {getStatusBadge(quarter.submissionStatus)}
                    </div>

                    <div className="ml-8 space-y-2">
                      {/* Progress */}
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Grade Completion:</span>
                        <span className={`font-medium ${quarter.isComplete ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>
                          {quarter.studentsWithGrades}/{quarter.totalStudents} students
                        </span>
                        {quarter.isComplete && (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                      </div>

                      {/* Submitted info */}
                      {quarter.submittedDate && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Submitted: {new Date(quarter.submittedDate).toLocaleString()}
                          {quarter.submittedBy && ` by ${quarter.submittedBy}`}
                        </p>
                      )}

                      {/* Registrar notes */}
                      {quarter.registrarNotes && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded p-2 mt-2">
                          <p className="text-xs font-medium text-blue-800 dark:text-blue-400">Registrar Notes:</p>
                          <p className="text-xs text-blue-700 dark:text-blue-300">{quarter.registrarNotes}</p>
                        </div>
                      )}

                      {/* Submit button */}
                      {quarter.canSubmit && (
                        <button
                          onClick={() => {
                            setSelectedQuarter(key);
                            setShowConfirm(true);
                          }}
                          className="mt-2 px-4 py-2 bg-amber-400 hover:bg-amber-500 text-gray-900 
                                   rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                        >
                          <Send className="w-4 h-4" />
                          Submit to Registrar
                        </button>
                      )}

                      {/* Pending message */}
                      {(quarter.submissionStatus === 'Submitted' || quarter.submissionStatus === 'Resubmitted') && (
                        <p className="text-xs text-amber-600 dark:text-amber-400 italic">
                          Awaiting registrar review...
                        </p>
                      )}

                      {/* Rejected - can resubmit */}
                      {quarter.submissionStatus === 'Rejected' && quarter.isComplete && (
                        <button
                          onClick={() => {
                            setSelectedQuarter(key);
                            setShowConfirm(true);
                          }}
                          className="mt-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white 
                                   rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                        >
                          <RefreshCw className="w-4 h-4" />
                          Resubmit Grades
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Info note */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-4">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Note:</strong> You can only submit grades when all students have complete grades for that quarter.
                  Once submitted, the registrar will review and approve the grades.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
