import type { RelationshipManager, SessionUser } from "@/types";

export const adminUser: SessionUser = {
  id: "admin-1",
  role: "admin",
  name: "Admin User",
  email: "admin@gardencity.in",
  phone: "+91 90909 09990",
  title: "Administrator",
};

export const relationshipManagers: RelationshipManager[] = [
  {
    id: "rm-sandeep",
    name: "Sandeep Singh",
    phone: "+91 98765 43210",
    email: "sandeep.singh@gardencity.in",
    title: "Relationship Manager",
  },
  {
    id: "rm-priya",
    name: "Priya Singh",
    phone: "+91 90909 09990",
    email: "priya.singh@gardencity.in",
    title: "Relationship Manager",
  },
  {
    id: "rm-neha",
    name: "Neha Sharma",
    phone: "+91 98111 22334",
    email: "neha.sharma@gardencity.in",
    title: "Sales Executive",
  },
  {
    id: "rm-ankit",
    name: "Ankit Verma",
    phone: "+91 98222 33445",
    email: "ankit.verma@gardencity.in",
    title: "Document Verifier",
  },
];

export const salesExecutives = ["Neha Sharma", "Sandeep Singh", "Saurabh Agarwal", "Ritika Taneja", "Manish Nair", "Pooja K."];

export const buyerSessionUser: SessionUser = {
  id: "buyer-rahul",
  role: "buyer",
  name: "Rahul Kumar",
  email: "rahul.kumar@email.com",
  phone: "+91 98765 43210",
  title: "Investor",
};
