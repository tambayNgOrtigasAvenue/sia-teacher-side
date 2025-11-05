# Help Support - Frontend Quick Start Guide

Quick reference for implementing the Help Support feature in your React frontend.

---

## 🚀 Quick Start

### 1. Import the Service
```javascript
import HelpSupportService from '../services/HelpSupportService';
```

### 2. Submit a Ticket
```javascript
const handleSubmit = async () => {
  try {
    const result = await HelpSupportService.submitTicket(
      subject,        // "Login Issue"
      description,    // "I cannot login with my credentials"
      priority        // "High" or "Medium" (default)
    );
    
    if (result.success) {
      alert('Ticket submitted successfully!');
      // result.data.ticketId contains the new ticket ID
    }
  } catch (error) {
    alert('Error submitting ticket');
  }
};
```

### 3. Get User's Tickets
```javascript
const [tickets, setTickets] = useState([]);

useEffect(() => {
  const fetchTickets = async () => {
    const response = await HelpSupportService.getMyTickets();
    if (response.success) {
      setTickets(response.data);
    }
  };
  fetchTickets();
}, []);
```

### 4. View Ticket Details
```javascript
const viewTicket = async (ticketId) => {
  const response = await HelpSupportService.getTicketDetails(ticketId);
  if (response.success) {
    console.log(response.data); // Full ticket info
  }
};
```

### 5. Add Message to Ticket
```javascript
const handleReply = async (ticketId, message) => {
  const response = await HelpSupportService.addMessage(ticketId, message);
  if (response.success) {
    alert('Message sent!');
  }
};
```

### 6. Close a Ticket
```javascript
const closeTicket = async (ticketId) => {
  const response = await HelpSupportService.closeTicket(ticketId);
  if (response.success) {
    alert('Ticket closed successfully!');
  }
};
```

---

## 📊 Data Structures

### Ticket Object
```javascript
{
  TicketID: 123,
  Subject: "Login Issue",
  TicketStatus: "Open",           // Open, In Progress, On Hold, Closed
  TicketPriority: "High",         // Low, Medium, High, Urgent
  CreatedAt: "2025-11-05 14:30:00",
  ResolvedAt: null,
  AssignedToName: "Support Admin",
  MessageCount: 3
}
```

### Message Object
```javascript
{
  MessageID: 1,
  Message: "I cannot login with my credentials",
  SenderName: "John Smith",
  SenderUserType: "Teacher",
  SentAt: "2025-11-05 14:30:00",
  IsInternal: false
}
```

### Statistics Object
```javascript
{
  TotalTickets: 10,
  OpenTickets: 2,
  InProgressTickets: 3,
  OnHoldTickets: 1,
  ClosedTickets: 4,
  UrgentTickets: 1,
  HighPriorityTickets: 2
}
```

---

## 🎯 Priority Badge Colors

Use these Tailwind classes for priority badges:

```javascript
const getPriorityColor = (priority) => {
  switch (priority) {
    case 'Urgent':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    case 'High':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
    case 'Medium':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'Low':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};
```

## 📋 Status Badge Colors

```javascript
const getStatusColor = (status) => {
  switch (status) {
    case 'Open':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'In Progress':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
    case 'On Hold':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
    case 'Closed':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};
```

---

## 🎨 Component Examples

### Ticket List Item
```jsx
function TicketListItem({ ticket, onClick }) {
  return (
    <div 
      onClick={() => onClick(ticket.TicketID)}
      className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow cursor-pointer hover:shadow-md transition"
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg">{ticket.Subject}</h3>
        <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(ticket.TicketPriority)}`}>
          {ticket.TicketPriority}
        </span>
      </div>
      
      <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
        <span className={`px-2 py-1 rounded ${getStatusColor(ticket.TicketStatus)}`}>
          {ticket.TicketStatus}
        </span>
        <span>{ticket.MessageCount} messages</span>
      </div>
      
      <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
        Created: {new Date(ticket.CreatedAt).toLocaleDateString()}
      </p>
    </div>
  );
}
```

### Ticket Submission Form
```jsx
function TicketSubmissionForm({ onSuccess }) {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await HelpSupportService.submitTicket(
        subject,
        message,
        priority
      );
      
      if (response.success) {
        alert('Ticket submitted successfully!');
        setSubject('');
        setMessage('');
        setPriority('Medium');
        onSuccess?.();
      }
    } catch (error) {
      alert('Error submitting ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Subject *</label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Brief description of your issue"
          className="w-full px-3 py-2 border rounded-lg"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Provide more details about your issue..."
          rows={4}
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Priority</label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Urgent">Urgent</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-amber-300 hover:bg-amber-400 text-gray-900 font-bold py-2 px-4 rounded-2xl"
      >
        {loading ? 'Submitting...' : 'Submit Ticket'}
      </button>
    </form>
  );
}
```

### Message Thread
```jsx
function MessageThread({ ticketId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    loadMessages();
  }, [ticketId]);

  const loadMessages = async () => {
    const response = await HelpSupportService.getTicketMessages(ticketId);
    if (response.success) {
      setMessages(response.data);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const response = await HelpSupportService.addMessage(ticketId, newMessage);
    if (response.success) {
      setNewMessage('');
      loadMessages();
    }
  };

  return (
    <div className="space-y-4">
      {/* Messages */}
      <div className="space-y-3">
        {messages.map((msg) => (
          <div 
            key={msg.MessageID}
            className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold">{msg.SenderName}</span>
              <span className="text-xs text-gray-500">
                {new Date(msg.SentAt).toLocaleString()}
              </span>
            </div>
            <p className="text-gray-700 dark:text-gray-300">{msg.Message}</p>
          </div>
        ))}
      </div>

      {/* Reply Form */}
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your reply..."
          className="flex-1 px-3 py-2 border rounded-lg"
          required
        />
        <button
          type="submit"
          className="bg-amber-300 hover:bg-amber-400 text-gray-900 font-bold py-2 px-4 rounded-2xl"
        >
          Send
        </button>
      </form>
    </div>
  );
}
```

### Statistics Dashboard
```jsx
function TicketStatistics() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      const response = await HelpSupportService.getTicketStats();
      if (response.success) {
        setStats(response.data);
      }
    };
    loadStats();
  }, []);

  if (!stats) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard label="Total Tickets" value={stats.TotalTickets} />
      <StatCard label="Open" value={stats.OpenTickets} color="blue" />
      <StatCard label="In Progress" value={stats.InProgressTickets} color="amber" />
      <StatCard label="Closed" value={stats.ClosedTickets} color="gray" />
    </div>
  );
}

function StatCard({ label, value, color = 'gray' }) {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
      <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
    </div>
  );
}
```

---

## 🔍 Search Implementation
```jsx
function SearchTickets() {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    const response = await HelpSupportService.searchTickets(keyword);
    if (response.success) {
      setResults(response.data);
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch} className="mb-4">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search tickets..."
          className="px-3 py-2 border rounded-lg"
        />
        <button type="submit" className="ml-2 px-4 py-2 bg-amber-300 rounded-2xl">
          Search
        </button>
      </form>
      
      {results.map(ticket => (
        <TicketListItem key={ticket.TicketID} ticket={ticket} />
      ))}
    </div>
  );
}
```

---

## ⚠️ Error Handling
```javascript
const handleApiCall = async () => {
  try {
    const response = await HelpSupportService.someMethod();
    if (response.success) {
      // Handle success
    } else {
      // Handle API error
      console.error(response.message);
      alert(response.message);
    }
  } catch (error) {
    // Handle network/server error
    if (error.error_code === 'UNAUTHORIZED') {
      // Redirect to login
      navigate('/login');
    } else {
      alert('An error occurred. Please try again.');
    }
  }
};
```

---

## 📝 Notes

- All API calls require active session (user must be logged in)
- Priority values: `Low`, `Medium`, `High`, `Urgent`
- Status values: `Open`, `In Progress`, `On Hold`, `Closed`
- Users can only access their own tickets
- Messages are automatically sorted by date (oldest first)
- Closed tickets can be reopened by changing status to "Open"

---

Ready to integrate! 🎉
