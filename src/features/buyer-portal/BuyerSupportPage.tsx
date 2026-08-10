import { useState } from "react";
import { Clock, Headset, Mail, MessageCircle, Phone, Send } from "lucide-react";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { Input, Select, Textarea } from "@/components/common/Field";
import { relationshipManagers } from "@/data/users";
import { useToast } from "@/app/toast";
import { useCurrentBuyer } from "./useCurrentBuyer";

const contactButton = "h-8 flex-1 rounded-md px-2 text-[11px]";

export default function BuyerSupportPage() {
  const { buyer } = useCurrentBuyer();
  const { toast } = useToast();
  const rm = relationshipManagers.find((manager) => manager.id === buyer.assignedRmId)!;
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  function sendMessage() {
    if (!subject || !message.trim()) {
      toast({ variant: "error", title: "Please select a subject and enter your message" });
      return;
    }
    toast({ variant: "success", title: "Message sent", description: "Our support team will contact you shortly." });
    setSubject("");
    setMessage("");
  }

  return (
    <div className="mx-auto flex w-full max-w-[1080px] flex-col gap-4">
      <header>
        <h1 className="text-xl font-bold uppercase tracking-tight text-neutral-900">Quick Contact</h1>
        <p className="mt-1 text-sm font-semibold text-brand-700">Our Team is Here to Help You</p>
        <p className="mt-1 text-xs text-neutral-500">For any queries or assistance, reach out to your Relationship Manager or our support team.</p>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card className="flex min-h-[282px] flex-col p-5">
          <h2 className="text-sm font-semibold text-neutral-900">Relationship Manager</h2>
          <div className="flex flex-1 items-center gap-5 py-5">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-brand-50 text-2xl font-bold text-brand-700">SS</div>
            <div className="min-w-0">
              <p className="text-base font-semibold text-brand-700">{rm.name}</p>
              <p className="mb-4 text-xs text-neutral-500">{rm.title}</p>
              <a href={`tel:${rm.phone.replace(/\s/g, "")}`} className="mb-2 flex items-center gap-2 text-xs text-neutral-700"><Phone size={14} /> {rm.phone}</a>
              <a href={`https://wa.me/${rm.phone.replace(/\D/g, "")}`} className="mb-2 flex items-center gap-2 text-xs text-neutral-700"><MessageCircle size={14} className="text-brand-700" /> Chat on WhatsApp</a>
              <a href={`mailto:${rm.email}`} className="flex items-center gap-2 text-xs text-neutral-700"><Mail size={14} /> {rm.email}</a>
            </div>
          </div>
          <div className="flex gap-2 border-t border-border pt-3">
            <Button variant="outline" size="sm" className={contactButton} onClick={() => window.location.href = `tel:${rm.phone.replace(/\s/g, "")}`}><Phone size={13} /> Call</Button>
            <Button variant="outline" size="sm" className={contactButton} onClick={() => window.open(`https://wa.me/${rm.phone.replace(/\D/g, "")}`, "_blank")}><MessageCircle size={13} /> WhatsApp</Button>
            <Button variant="outline" size="sm" className={contactButton} onClick={() => window.location.href = `mailto:${rm.email}`}><Mail size={13} /> Email Us</Button>
          </div>
        </Card>

        <Card className="flex min-h-[282px] flex-col p-5">
          <h2 className="text-sm font-semibold text-neutral-900">Customer Support</h2>
          <div className="flex flex-1 items-center gap-7 py-5">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-neutral-50 text-neutral-800"><Headset size={62} strokeWidth={1.6} /></div>
            <div className="space-y-3 text-xs text-neutral-700">
              <a href="tel:+9118001234567" className="flex items-center gap-2"><Phone size={14} /> +91 1800 123 4567</a>
              <a href="mailto:support@gardencity.com" className="flex items-center gap-2"><Mail size={14} /> support@gardencity.com</a>
              <p className="flex items-center gap-2"><Clock size={14} /> Mon – Sat (10 AM – 7 PM)</p>
            </div>
          </div>
          <div className="flex gap-2 border-t border-border pt-3">
            <Button variant="outline" size="sm" className={contactButton} onClick={() => window.location.href = "tel:+9118001234567"}><Phone size={13} /> Call</Button>
            <Button variant="outline" size="sm" className={contactButton} onClick={() => window.open("https://wa.me/9118001234567", "_blank")}><MessageCircle size={13} /> WhatsApp</Button>
            <Button variant="outline" size="sm" className={contactButton} onClick={() => window.location.href = "mailto:support@gardencity.com"}><Mail size={13} /> Email Us</Button>
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <h2 className="text-sm font-semibold text-brand-700">Send us a Message</h2>
        <p className="mt-1 text-xs text-neutral-500">Have a question or need help? Drop us a message and we'll get back to you soon.</p>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Input label="Your Name" value={buyer.name} readOnly className="h-9 text-xs" />
          <Input label="Your Email" value={buyer.email} readOnly className="h-9 text-xs" />
          <Input label="Your Phone (Optional)" value={buyer.phone} readOnly className="h-9 text-xs" />
          <Select label="Subject" value={subject} onChange={(event) => setSubject(event.target.value)} className="h-9 text-xs">
            <option value="">Select a subject</option>
            <option>Payment Query</option>
            <option>Documentation</option>
            <option>Registration</option>
            <option>Site Visit</option>
            <option>General Support</option>
          </Select>
          <div className="sm:col-span-2">
            <Textarea label="Your Message" value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Type your message here..." rows={4} className="min-h-[96px] text-xs" />
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between gap-4">
          <Button size="sm" onClick={sendMessage}><Send size={14} /> Send Message</Button>
          <p className="hidden text-[10px] text-neutral-400 sm:block">Your information is secure and confidential.</p>
        </div>
      </Card>
    </div>
  );
}
