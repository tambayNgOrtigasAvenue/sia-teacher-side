import React from 'react';
import Button from './Button'; // Import the base button

/**
 * --- My Classes Buttons (Left Group) ---
 */

export function PendingButton({ onClick }) {
  return (
    <Button type="pending" onClick={onClick}>
      Pending
    </Button>
  );
}

export function CreateScheduleButton({ onClick }) {
  return (
    <Button variant="secondary" onClick={onClick}>
      Create Schedule
    </Button>
  );
}

export function ViewClassDetailsButton({ onClick }) {
  return (
    <Button onClick={onClick}>
      View Class Details
    </Button>
  );
}

/**
 * --- My Classes Buttons (Right Group) ---
 */

export function ViewClassGradeButton({ onClick }) {
  return (
    <Button onClick={onClick}>
      View Class Grade
    </Button>
  );
}

export function ViewAttendanceButton({ onClick }) {
  return (
    <Button onClick={onClick}>
      View Attendance
    </Button>
  );
}

export function AttendanceReportButton({ onClick }) {
  return (
    <Button onClick={onClick}>
      Attendance Report
    </Button>
  );
}

export function SendEmailButton({ onClick }) {
  return (
    <Button icon="email" onClick={onClick}>
      Send via Email
    </Button>
  );
}

export function PrintReportCardButton({ onClick }) {
  return (
    <Button icon="print" onClick={onClick}>
      Print Report Card
    </Button>
  );
}

