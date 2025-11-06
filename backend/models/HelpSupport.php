<?php

class HelpSupport {
    private $conn;
    private $table_tickets = "supportticket";
    private $table_messages = "ticketmessage";
    private $table_users = "user";
    private $table_profiles = "profile";

    public $TicketID;
    public $UserID;
    public $Subject;
    public $TicketStatus;
    public $TicketPriority;
    public $CreatedAt;
    public $ResolvedAt;
    public $AssignedToUserID;
    public $ResolvedByUserID;

    public $MessageID;
    public $Message;
    public $SenderUserID;
    public $AttachmentFileID;
    public $SentAt;
    public $IsInternal;

    public function __construct($db) {
        $this->conn = $db;
    }

    /**
     * Create a new support ticket
     * 
     * @return int|false Returns ticket ID on success, false on failure
     */
    public function createTicket() {
        try {
            $query = "INSERT INTO " . $this->table_tickets . "
                     (UserID, Subject, TicketStatus, TicketPriority, CreatedAt)
                     VALUES (:userID, :subject, :status, :priority, NOW())";
            
            $stmt = $this->conn->prepare($query);
            
            
            $status = $this->TicketStatus ?? 'Open';
            $priority = $this->TicketPriority ?? 'Medium';
            
            
            $stmt->bindParam(':userID', $this->UserID);
            $stmt->bindParam(':subject', $this->Subject);
            $stmt->bindParam(':status', $status);
            $stmt->bindParam(':priority', $priority);
            
            if ($stmt->execute()) {
                $this->TicketID = $this->conn->lastInsertId();
                return $this->TicketID;
            }
            
            return false;
        } catch (PDOException $e) {
            error_log("Error creating ticket: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Get all tickets (admin view)
     * 
     * @return PDOStatement|false
     */
    public function getAllTickets() {
        try {
            $query = "SELECT 
                        st.TicketID,
                        st.UserID,
                        st.Subject,
                        st.TicketStatus,
                        st.TicketPriority,
                        st.CreatedAt,
                        st.ResolvedAt,
                        st.AssignedToUserID,
                        st.ResolvedByUserID,
                        CONCAT(p.FirstName, ' ', p.LastName) as UserFullName,
                        u.EmailAddress as UserEmail,
                        CONCAT(ap.FirstName, ' ', ap.LastName) as AssignedToName,
                        CONCAT(rp.FirstName, ' ', rp.LastName) as ResolvedByName
                      FROM " . $this->table_tickets . " st
                      INNER JOIN " . $this->table_users . " u ON st.UserID = u.UserID
                      INNER JOIN " . $this->table_profiles . " p ON u.UserID = p.UserID
                      LEFT JOIN " . $this->table_users . " au ON st.AssignedToUserID = au.UserID
                      LEFT JOIN " . $this->table_profiles . " ap ON au.UserID = ap.UserID
                      LEFT JOIN " . $this->table_users . " ru ON st.ResolvedByUserID = ru.UserID
                      LEFT JOIN " . $this->table_profiles . " rp ON ru.UserID = rp.UserID
                      ORDER BY 
                        CASE st.TicketPriority
                            WHEN 'Urgent' THEN 1
                            WHEN 'High' THEN 2
                            WHEN 'Medium' THEN 3
                            WHEN 'Low' THEN 4
                        END,
                        st.CreatedAt DESC";
            
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            return $stmt;
        } catch (PDOException $e) {
            error_log("Error fetching all tickets: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Get tickets by user ID (for specific user)
     * 
     * @param int $userID
     * @return PDOStatement|false
     */
    public function getTicketsByUserID($userID) {
        try {
            $query = "SELECT 
                        st.TicketID,
                        st.Subject,
                        st.TicketStatus,
                        st.TicketPriority,
                        st.CreatedAt,
                        st.ResolvedAt,
                        CONCAT(ap.FirstName, ' ', ap.LastName) as AssignedToName,
                        (SELECT COUNT(*) FROM " . $this->table_messages . " 
                         WHERE TicketID = st.TicketID) as MessageCount
                      FROM " . $this->table_tickets . " st
                      LEFT JOIN " . $this->table_users . " au ON st.AssignedToUserID = au.UserID
                      LEFT JOIN " . $this->table_profiles . " ap ON au.UserID = ap.UserID
                      WHERE st.UserID = :userID
                      ORDER BY st.CreatedAt DESC";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':userID', $userID);
            $stmt->execute();
            return $stmt;
        } catch (PDOException $e) {
            error_log("Error fetching user tickets: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Get a single ticket by ID with full details
     * 
     * @param int $ticketID
     * @return array|false
     */
    public function getTicketByID($ticketID) {
        try {
            $query = "SELECT 
                        st.*,
                        CONCAT(p.FirstName, ' ', p.LastName) as UserFullName,
                        u.EmailAddress as UserEmail,
                        p.ProfilePictureURL as UserProfilePicture,
                        CONCAT(ap.FirstName, ' ', ap.LastName) as AssignedToName,
                        CONCAT(rp.FirstName, ' ', rp.LastName) as ResolvedByName
                      FROM " . $this->table_tickets . " st
                      INNER JOIN " . $this->table_users . " u ON st.UserID = u.UserID
                      INNER JOIN " . $this->table_profiles . " p ON u.UserID = p.UserID
                      LEFT JOIN " . $this->table_users . " au ON st.AssignedToUserID = au.UserID
                      LEFT JOIN " . $this->table_profiles . " ap ON au.UserID = ap.UserID
                      LEFT JOIN " . $this->table_users . " ru ON st.ResolvedByUserID = ru.UserID
                      LEFT JOIN " . $this->table_profiles . " rp ON ru.UserID = rp.UserID
                      WHERE st.TicketID = :ticketID";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':ticketID', $ticketID);
            $stmt->execute();
            
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error fetching ticket: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Update ticket status
     * 
     * @param int $ticketID
     * @param string $status
     * @return bool
     */
    public function updateTicketStatus($ticketID, $status) {
        try {
            $query = "UPDATE " . $this->table_tickets . "
                     SET TicketStatus = :status
                     WHERE TicketID = :ticketID";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':status', $status);
            $stmt->bindParam(':ticketID', $ticketID);
            
            return $stmt->execute();
        } catch (PDOException $e) {
            error_log("Error updating ticket status: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Update ticket priority
     * 
     * @param int $ticketID
     * @param string $priority
     * @return bool
     */
    public function updateTicketPriority($ticketID, $priority) {
        try {
            $query = "UPDATE " . $this->table_tickets . "
                     SET TicketPriority = :priority
                     WHERE TicketID = :ticketID";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':priority', $priority);
            $stmt->bindParam(':ticketID', $ticketID);
            
            return $stmt->execute();
        } catch (PDOException $e) {
            error_log("Error updating ticket priority: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Assign ticket to a user
     * 
     * @param int $ticketID
     * @param int $assignedToUserID
     * @return bool
     */
    public function assignTicket($ticketID, $assignedToUserID) {
        try {
            $query = "UPDATE " . $this->table_tickets . "
                     SET AssignedToUserID = :assignedToUserID,
                         TicketStatus = 'In Progress'
                     WHERE TicketID = :ticketID";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':assignedToUserID', $assignedToUserID);
            $stmt->bindParam(':ticketID', $ticketID);
            
            return $stmt->execute();
        } catch (PDOException $e) {
            error_log("Error assigning ticket: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Close/Resolve a ticket
     * 
     * @param int $ticketID
     * @param int $resolvedByUserID
     * @return bool
     */
    public function resolveTicket($ticketID, $resolvedByUserID) {
        try {
            $query = "UPDATE " . $this->table_tickets . "
                     SET TicketStatus = 'Closed',
                         ResolvedAt = NOW(),
                         ResolvedByUserID = :resolvedByUserID
                     WHERE TicketID = :ticketID";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':resolvedByUserID', $resolvedByUserID);
            $stmt->bindParam(':ticketID', $ticketID);
            
            return $stmt->execute();
        } catch (PDOException $e) {
            error_log("Error resolving ticket: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Add a message to a ticket
     * 
     * @return int|false Returns message ID on success, false on failure
     */
    public function addMessage() {
        try {
            $query = "INSERT INTO " . $this->table_messages . "
                     (TicketID, SenderUserID, Message, AttachmentFileID, SentAt, IsInternal)
                     VALUES (:ticketID, :senderUserID, :message, :attachmentFileID, NOW(), :isInternal)";
            
            $stmt = $this->conn->prepare($query);
            
            // Set defaults
            $isInternal = $this->IsInternal ?? 0;
            $attachmentFileID = $this->AttachmentFileID ?? null;
            
            // Bind parameters
            $stmt->bindParam(':ticketID', $this->TicketID);
            $stmt->bindParam(':senderUserID', $this->SenderUserID);
            $stmt->bindParam(':message', $this->Message);
            $stmt->bindParam(':attachmentFileID', $attachmentFileID);
            $stmt->bindParam(':isInternal', $isInternal);
            
            if ($stmt->execute()) {
                $this->MessageID = $this->conn->lastInsertId();
                return $this->MessageID;
            }
            
            return false;
        } catch (PDOException $e) {
            error_log("Error adding message: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Get all messages for a ticket
     * 
     * @param int $ticketID
     * @param bool $includeInternal Include internal messages (admin only)
     * @return PDOStatement|false
     */
    public function getTicketMessages($ticketID, $includeInternal = false) {
        try {
            $internalCondition = $includeInternal ? "" : "AND tm.IsInternal = 0";
            
            $query = "SELECT 
                        tm.MessageID,
                        tm.TicketID,
                        tm.SenderUserID,
                        tm.Message,
                        tm.AttachmentFileID,
                        tm.SentAt,
                        tm.IsInternal,
                        CONCAT(p.FirstName, ' ', p.LastName) as SenderName,
                        p.ProfilePictureURL as SenderProfilePicture,
                        u.UserType as SenderUserType,
                        sf.OriginalFileName,
                        sf.FilePath
                      FROM " . $this->table_messages . " tm
                      INNER JOIN " . $this->table_users . " u ON tm.SenderUserID = u.UserID
                      INNER JOIN " . $this->table_profiles . " p ON u.UserID = p.UserID
                      LEFT JOIN securefile sf ON tm.AttachmentFileID = sf.FileID
                      WHERE tm.TicketID = :ticketID
                      $internalCondition
                      ORDER BY tm.SentAt ASC";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':ticketID', $ticketID);
            $stmt->execute();
            return $stmt;
        } catch (PDOException $e) {
            error_log("Error fetching ticket messages: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Get ticket statistics for dashboard
     * 
     * @param int|null $userID If provided, stats for specific user, otherwise all tickets
     * @return array|false
     */
    public function getTicketStats($userID = null) {
        try {
            $userCondition = $userID ? "WHERE UserID = :userID" : "";
            
            $query = "SELECT 
                        COUNT(*) as TotalTickets,
                        SUM(CASE WHEN TicketStatus = 'Open' THEN 1 ELSE 0 END) as OpenTickets,
                        SUM(CASE WHEN TicketStatus = 'In Progress' THEN 1 ELSE 0 END) as InProgressTickets,
                        SUM(CASE WHEN TicketStatus = 'On Hold' THEN 1 ELSE 0 END) as OnHoldTickets,
                        SUM(CASE WHEN TicketStatus = 'Closed' THEN 1 ELSE 0 END) as ClosedTickets,
                        SUM(CASE WHEN TicketPriority = 'Urgent' THEN 1 ELSE 0 END) as UrgentTickets,
                        SUM(CASE WHEN TicketPriority = 'High' THEN 1 ELSE 0 END) as HighPriorityTickets
                      FROM " . $this->table_tickets . "
                      $userCondition";
            
            $stmt = $this->conn->prepare($query);
            
            if ($userID) {
                $stmt->bindParam(':userID', $userID);
            }
            
            $stmt->execute();
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error fetching ticket stats: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Search tickets by keyword
     * 
     * @param string $keyword
     * @param int|null $userID Filter by user
     * @return PDOStatement|false
     */
    public function searchTickets($keyword, $userID = null) {
        try {
            $userCondition = $userID ? "AND st.UserID = :userID" : "";
            
            $query = "SELECT 
                        st.TicketID,
                        st.Subject,
                        st.TicketStatus,
                        st.TicketPriority,
                        st.CreatedAt,
                        CONCAT(p.FirstName, ' ', p.LastName) as UserFullName
                      FROM " . $this->table_tickets . " st
                      INNER JOIN " . $this->table_users . " u ON st.UserID = u.UserID
                      INNER JOIN " . $this->table_profiles . " p ON u.UserID = p.UserID
                      WHERE st.Subject LIKE :keyword
                      $userCondition
                      ORDER BY st.CreatedAt DESC";
            
            $stmt = $this->conn->prepare($query);
            $searchTerm = "%{$keyword}%";
            $stmt->bindParam(':keyword', $searchTerm);
            
            if ($userID) {
                $stmt->bindParam(':userID', $userID);
            }
            
            $stmt->execute();
            return $stmt;
        } catch (PDOException $e) {
            error_log("Error searching tickets: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Delete a ticket (soft delete by closing)
     * 
     * @param int $ticketID
     * @return bool
     */
    public function deleteTicket($ticketID) {
        try {
            // Instead of hard delete, we close the ticket
            return $this->updateTicketStatus($ticketID, 'Closed');
        } catch (Exception $e) {
            error_log("Error deleting ticket: " . $e->getMessage());
            return false;
        }
    }
}