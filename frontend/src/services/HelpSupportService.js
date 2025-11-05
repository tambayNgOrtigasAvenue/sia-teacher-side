import axios from 'axios';

const API_BASE_URL = 'http://localhost:5173/api/support';

// Configure axios to send cookies with requests
axios.defaults.withCredentials = true;

/**
 * Help Support Service
 * 
 * Service layer for all help/support ticket operations
 */
const HelpSupportService = {
  /**
   * Submit a new support ticket
   * 
   * @param {string} subject - Ticket subject/title
   * @param {string} message - Initial message describing the issue
   * @param {string} priority - Priority level: Low, Medium, High, Urgent
   * @returns {Promise} Response with ticket data
   */
  submitTicket: async (subject, message, priority = 'Medium') => {
    try {
      const response = await axios.post(`${API_BASE_URL}/submit-ticket.php`, {
        subject,
        message,
        priority
      });
      return response.data;
    } catch (error) {
      console.error('Error submitting ticket:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * Get all tickets for the logged-in user
   * 
   * @returns {Promise} Array of tickets
   */
  getMyTickets: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/get-my-tickets.php`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tickets:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * Get details of a specific ticket
   * 
   * @param {number} ticketId - Ticket ID
   * @returns {Promise} Ticket details
   */
  getTicketDetails: async (ticketId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/get-ticket-details.php`, {
        params: { ticketId }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching ticket details:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * Get all messages for a ticket
   * 
   * @param {number} ticketId - Ticket ID
   * @returns {Promise} Array of messages
   */
  getTicketMessages: async (ticketId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/get-ticket-messages.php`, {
        params: { ticketId }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching ticket messages:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * Add a message to a ticket
   * 
   * @param {number} ticketId - Ticket ID
   * @param {string} message - Message content
   * @returns {Promise} Response with message ID
   */
  addMessage: async (ticketId, message) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/add-message.php`, {
        ticketId,
        message
      });
      return response.data;
    } catch (error) {
      console.error('Error adding message:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * Update ticket status
   * 
   * @param {number} ticketId - Ticket ID
   * @param {string} status - New status: Open, In Progress, On Hold, Closed
   * @returns {Promise} Response with updated status
   */
  updateTicketStatus: async (ticketId, status) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/update-ticket-status.php`, {
        ticketId,
        status
      });
      return response.data;
    } catch (error) {
      console.error('Error updating ticket status:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * Close a ticket
   * 
   * @param {number} ticketId - Ticket ID
   * @returns {Promise} Response
   */
  closeTicket: async (ticketId) => {
    return HelpSupportService.updateTicketStatus(ticketId, 'Closed');
  },

  /**
   * Reopen a closed ticket
   * 
   * @param {number} ticketId - Ticket ID
   * @returns {Promise} Response
   */
  reopenTicket: async (ticketId) => {
    return HelpSupportService.updateTicketStatus(ticketId, 'Open');
  },

  /**
   * Get ticket statistics for the user
   * 
   * @returns {Promise} Statistics object
   */
  getTicketStats: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/get-ticket-stats.php`);
      return response.data;
    } catch (error) {
      console.error('Error fetching ticket stats:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * Search tickets by keyword
   * 
   * @param {string} keyword - Search term
   * @returns {Promise} Array of matching tickets
   */
  searchTickets: async (keyword) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/search-tickets.php`, {
        params: { keyword }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching tickets:', error);
      throw error.response?.data || error;
    }
  }
};

export default HelpSupportService;

/**
 * Usage Examples:
 * 
 * // Submit a new ticket
 * const result = await HelpSupportService.submitTicket(
 *   'Login Issue',
 *   'I cannot login with my credentials',
 *   'High'
 * );
 * 
 * // Get all my tickets
 * const tickets = await HelpSupportService.getMyTickets();
 * 
 * // Get ticket details
 * const ticket = await HelpSupportService.getTicketDetails(123);
 * 
 * // Add a message to a ticket
 * await HelpSupportService.addMessage(123, 'Still having the same issue');
 * 
 * // Get messages for a ticket
 * const messages = await HelpSupportService.getTicketMessages(123);
 * 
 * // Close a ticket
 * await HelpSupportService.closeTicket(123);
 * 
 * // Get statistics
 * const stats = await HelpSupportService.getTicketStats();
 * 
 * // Search tickets
 * const results = await HelpSupportService.searchTickets('login');
 */
