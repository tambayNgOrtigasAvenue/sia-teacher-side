<?php
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../models/HelpSupport.php';

/**
 * HelpSupportController
 * 
 * Handles all business logic for support ticket operations
 */
class HelpSupportController {
    private $conn;
    private $helpSupport;

    public function __construct($db) {
        $this->conn = $db;
        $this->helpSupport = new HelpSupport($db);
    }

    /**
     * Create a new support ticket
     * 
     * @param int $userId
     * @param string $subject
     * @param string $priority
     * @return array Response array with status and data
     */
    public function createTicket($userId, $subject, $priority = 'Medium') {
        try {
            // Validate input
            if (empty($userId) || empty($subject)) {
                return [
                    'success' => false,
                    'message' => 'User ID and subject are required',
                    'error_code' => 'INVALID_INPUT'
                ];
            }

            // Validate priority
            $validPriorities = ['Low', 'Medium', 'High', 'Urgent'];
            if (!in_array($priority, $validPriorities)) {
                $priority = 'Medium';
            }

            // Create ticket
            $this->helpSupport->UserID = $userId;
            $this->helpSupport->Subject = htmlspecialchars(strip_tags($subject));
            $this->helpSupport->TicketPriority = $priority;
            
            $ticketId = $this->helpSupport->createTicket();

            if ($ticketId) {
                return [
                    'success' => true,
                    'message' => 'Support ticket created successfully',
                    'data' => [
                        'ticketId' => $ticketId,
                        'status' => 'Open',
                        'priority' => $priority
                    ]
                ];
            }

            return [
                'success' => false,
                'message' => 'Failed to create support ticket',
                'error_code' => 'CREATE_FAILED'
            ];
        } catch (Exception $e) {
            error_log("Error in createTicket: " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'An error occurred while creating the ticket',
                'error_code' => 'SERVER_ERROR'
            ];
        }
    }

    /**
     * Create ticket with initial message
     * 
     * @param int $userId
     * @param string $subject
     * @param string $message
     * @param string $priority
     * @return array Response array
     */
    public function createTicketWithMessage($userId, $subject, $message, $priority = 'Medium') {
        try {
            // Create the ticket first
            $ticketResult = $this->createTicket($userId, $subject, $priority);

            if (!$ticketResult['success']) {
                return $ticketResult;
            }

            $ticketId = $ticketResult['data']['ticketId'];

            // Add initial message
            if (!empty($message)) {
                $this->helpSupport->TicketID = $ticketId;
                $this->helpSupport->SenderUserID = $userId;
                $this->helpSupport->Message = htmlspecialchars(strip_tags($message));
                $this->helpSupport->IsInternal = 0;
                
                $messageId = $this->helpSupport->addMessage();

                if (!$messageId) {
                    error_log("Warning: Ticket created but initial message failed for ticket $ticketId");
                }
            }

            return [
                'success' => true,
                'message' => 'Support ticket created successfully',
                'data' => [
                    'ticketId' => $ticketId,
                    'status' => 'Open',
                    'priority' => $priority
                ]
            ];
        } catch (Exception $e) {
            error_log("Error in createTicketWithMessage: " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'An error occurred while creating the ticket',
                'error_code' => 'SERVER_ERROR'
            ];
        }
    }

    /**
     * Get all tickets for a specific user
     * 
     * @param int $userId
     * @return array Response array
     */
    public function getUserTickets($userId) {
        try {
            if (empty($userId)) {
                return [
                    'success' => false,
                    'message' => 'User ID is required',
                    'error_code' => 'INVALID_INPUT'
                ];
            }

            $stmt = $this->helpSupport->getTicketsByUserID($userId);

            if ($stmt === false) {
                return [
                    'success' => false,
                    'message' => 'Failed to fetch tickets',
                    'error_code' => 'FETCH_FAILED'
                ];
            }

            $tickets = $stmt->fetchAll(PDO::FETCH_ASSOC);

            return [
                'success' => true,
                'message' => 'Tickets retrieved successfully',
                'data' => $tickets,
                'count' => count($tickets)
            ];
        } catch (Exception $e) {
            error_log("Error in getUserTickets: " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'An error occurred while fetching tickets',
                'error_code' => 'SERVER_ERROR'
            ];
        }
    }

    /**
     * Get single ticket details
     * 
     * @param int $ticketId
     * @param int $userId User requesting the ticket
     * @return array Response array
     */
    public function getTicketDetails($ticketId, $userId) {
        try {
            if (empty($ticketId)) {
                return [
                    'success' => false,
                    'message' => 'Ticket ID is required',
                    'error_code' => 'INVALID_INPUT'
                ];
            }

            $ticket = $this->helpSupport->getTicketByID($ticketId);

            if (!$ticket) {
                return [
                    'success' => false,
                    'message' => 'Ticket not found',
                    'error_code' => 'NOT_FOUND'
                ];
            }

            // Check if user has permission to view this ticket
            if ($ticket['UserID'] != $userId) {
                return [
                    'success' => false,
                    'message' => 'You do not have permission to view this ticket',
                    'error_code' => 'UNAUTHORIZED'
                ];
            }

            return [
                'success' => true,
                'message' => 'Ticket details retrieved successfully',
                'data' => $ticket
            ];
        } catch (Exception $e) {
            error_log("Error in getTicketDetails: " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'An error occurred while fetching ticket details',
                'error_code' => 'SERVER_ERROR'
            ];
        }
    }

    /**
     * Add message to a ticket
     * 
     * @param int $ticketId
     * @param int $userId
     * @param string $message
     * @return array Response array
     */
    public function addTicketMessage($ticketId, $userId, $message) {
        try {
            if (empty($ticketId) || empty($userId) || empty($message)) {
                return [
                    'success' => false,
                    'message' => 'Ticket ID, user ID, and message are required',
                    'error_code' => 'INVALID_INPUT'
                ];
            }

            // Verify ticket exists and user has access
            $ticket = $this->helpSupport->getTicketByID($ticketId);
            if (!$ticket || $ticket['UserID'] != $userId) {
                return [
                    'success' => false,
                    'message' => 'Ticket not found or access denied',
                    'error_code' => 'UNAUTHORIZED'
                ];
            }

            // Check if ticket is closed
            if ($ticket['TicketStatus'] === 'Closed') {
                return [
                    'success' => false,
                    'message' => 'Cannot add message to a closed ticket',
                    'error_code' => 'TICKET_CLOSED'
                ];
            }

            // Add message
            $this->helpSupport->TicketID = $ticketId;
            $this->helpSupport->SenderUserID = $userId;
            $this->helpSupport->Message = htmlspecialchars(strip_tags($message));
            $this->helpSupport->IsInternal = 0;
            
            $messageId = $this->helpSupport->addMessage();

            if ($messageId) {
                return [
                    'success' => true,
                    'message' => 'Message added successfully',
                    'data' => [
                        'messageId' => $messageId
                    ]
                ];
            }

            return [
                'success' => false,
                'message' => 'Failed to add message',
                'error_code' => 'ADD_FAILED'
            ];
        } catch (Exception $e) {
            error_log("Error in addTicketMessage: " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'An error occurred while adding the message',
                'error_code' => 'SERVER_ERROR'
            ];
        }
    }

    /**
     * Get all messages for a ticket
     * 
     * @param int $ticketId
     * @param int $userId User requesting the messages
     * @return array Response array
     */
    public function getTicketMessages($ticketId, $userId) {
        try {
            if (empty($ticketId)) {
                return [
                    'success' => false,
                    'message' => 'Ticket ID is required',
                    'error_code' => 'INVALID_INPUT'
                ];
            }

            // Verify user has access to this ticket
            $ticket = $this->helpSupport->getTicketByID($ticketId);
            if (!$ticket || $ticket['UserID'] != $userId) {
                return [
                    'success' => false,
                    'message' => 'Ticket not found or access denied',
                    'error_code' => 'UNAUTHORIZED'
                ];
            }

            // Get messages (exclude internal messages for regular users)
            $stmt = $this->helpSupport->getTicketMessages($ticketId, false);

            if ($stmt === false) {
                return [
                    'success' => false,
                    'message' => 'Failed to fetch messages',
                    'error_code' => 'FETCH_FAILED'
                ];
            }

            $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);

            return [
                'success' => true,
                'message' => 'Messages retrieved successfully',
                'data' => $messages,
                'count' => count($messages)
            ];
        } catch (Exception $e) {
            error_log("Error in getTicketMessages: " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'An error occurred while fetching messages',
                'error_code' => 'SERVER_ERROR'
            ];
        }
    }

    /**
     * Update ticket status
     * 
     * @param int $ticketId
     * @param int $userId
     * @param string $status
     * @return array Response array
     */
    public function updateTicketStatus($ticketId, $userId, $status) {
        try {
            if (empty($ticketId) || empty($status)) {
                return [
                    'success' => false,
                    'message' => 'Ticket ID and status are required',
                    'error_code' => 'INVALID_INPUT'
                ];
            }

            // Validate status
            $validStatuses = ['Open', 'In Progress', 'On Hold', 'Closed'];
            if (!in_array($status, $validStatuses)) {
                return [
                    'success' => false,
                    'message' => 'Invalid status. Valid values: Open, In Progress, On Hold, Closed',
                    'error_code' => 'INVALID_STATUS'
                ];
            }

            // Verify user has access
            $ticket = $this->helpSupport->getTicketByID($ticketId);
            if (!$ticket || $ticket['UserID'] != $userId) {
                return [
                    'success' => false,
                    'message' => 'Ticket not found or access denied',
                    'error_code' => 'UNAUTHORIZED'
                ];
            }

            $result = $this->helpSupport->updateTicketStatus($ticketId, $status);

            if ($result) {
                return [
                    'success' => true,
                    'message' => 'Ticket status updated successfully',
                    'data' => [
                        'ticketId' => $ticketId,
                        'status' => $status
                    ]
                ];
            }

            return [
                'success' => false,
                'message' => 'Failed to update ticket status',
                'error_code' => 'UPDATE_FAILED'
            ];
        } catch (Exception $e) {
            error_log("Error in updateTicketStatus: " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'An error occurred while updating the ticket status',
                'error_code' => 'SERVER_ERROR'
            ];
        }
    }

    /**
     * Get ticket statistics for user dashboard
     * 
     * @param int $userId
     * @return array Response array
     */
    public function getUserTicketStats($userId) {
        try {
            if (empty($userId)) {
                return [
                    'success' => false,
                    'message' => 'User ID is required',
                    'error_code' => 'INVALID_INPUT'
                ];
            }

            $stats = $this->helpSupport->getTicketStats($userId);

            if ($stats === false) {
                return [
                    'success' => false,
                    'message' => 'Failed to fetch ticket statistics',
                    'error_code' => 'FETCH_FAILED'
                ];
            }

            return [
                'success' => true,
                'message' => 'Ticket statistics retrieved successfully',
                'data' => $stats
            ];
        } catch (Exception $e) {
            error_log("Error in getUserTicketStats: " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'An error occurred while fetching ticket statistics',
                'error_code' => 'SERVER_ERROR'
            ];
        }
    }

    /**
     * Search user's tickets
     * 
     * @param string $keyword
     * @param int $userId
     * @return array Response array
     */
    public function searchUserTickets($keyword, $userId) {
        try {
            if (empty($keyword)) {
                return [
                    'success' => false,
                    'message' => 'Search keyword is required',
                    'error_code' => 'INVALID_INPUT'
                ];
            }

            $stmt = $this->helpSupport->searchTickets($keyword, $userId);

            if ($stmt === false) {
                return [
                    'success' => false,
                    'message' => 'Search failed',
                    'error_code' => 'SEARCH_FAILED'
                ];
            }

            $tickets = $stmt->fetchAll(PDO::FETCH_ASSOC);

            return [
                'success' => true,
                'message' => 'Search completed successfully',
                'data' => $tickets,
                'count' => count($tickets)
            ];
        } catch (Exception $e) {
            error_log("Error in searchUserTickets: " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'An error occurred during search',
                'error_code' => 'SERVER_ERROR'
            ];
        }
    }
}