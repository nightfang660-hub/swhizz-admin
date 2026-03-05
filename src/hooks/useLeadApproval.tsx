// Shared lead-to-student approval state

// Simple shared state between Leads and Students pages using a global store pattern
// Since we don't have zustand, we use a module-level event system

interface ApprovedStudent {
  name: string;
  email: string;
  appliedCourse: string;
  approvedDate: string;
}

type Listener = (students: ApprovedStudent[]) => void;

let approvedStudents: ApprovedStudent[] = [];
const listeners = new Set<Listener>();

function notify() {
  listeners.forEach((l) => l([...approvedStudents]));
}

export function useLeadApproval() {
  const approveStudent = (student: ApprovedStudent) => {
    // Avoid duplicates
    if (!approvedStudents.find((s) => s.email === student.email)) {
      approvedStudents = [...approvedStudents, student];
      notify();
    }
  };

  const getApprovedStudents = () => [...approvedStudents];

  const subscribe = (listener: Listener) => {
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  };

  return { approveStudent, getApprovedStudents, subscribe };
}
