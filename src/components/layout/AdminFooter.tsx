export function AdminFooter() {
  return (
    <footer className="flex flex-col gap-2 border-t border-border px-4 py-2 text-xs text-neutral-400 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <p>© 2026 Garden City Naugaon CRM. All rights reserved.</p>
      <div className="flex items-center gap-4">
        <span>v1.0.0</span>
        <span>Privacy Policy</span>
        <span>Terms of Service</span>
      </div>
    </footer>
  );
}
